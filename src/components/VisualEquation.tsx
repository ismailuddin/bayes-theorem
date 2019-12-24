import React, { Component } from 'react';
import * as d3 from 'd3';

export interface Props {
    eventA: number,
    eventB: number
    eventBA: number
    eventBNotA: number
}

export interface Datum {
    x0: number,
    x: number,
    y: number,
    colour: string,
    xLabel: string
}

export interface State {
    data: Array<Datum>
}

export default class VisualEquation extends Component<Props, State> {
    private svg: any;
    private canvas: any;
    private width: number;
    private height: number;
    private margin: {
        top: number,
        right: number,
        bottom: number,
        left: number
    };
    private xScale: d3.ScaleLinear<number, number>;
    private yScale: d3.ScaleLinear<number, number>;

    state = {
        data: [
            {   x0: 0,
                x: 0,
                y: 0,
                colour: '',
                xLabel: 'P(A)'
            },
            {
                x0: 0,
                x: 0,
                y: 0,
                colour: '',
                xLabel: 'P(¬A)'
            }
        ]
    }

    constructor(props: Props) {
        super(props);
        this.margin = {
			top: 35,
			right: 35,
			bottom: 35,
			left: 85
		};
        this.canvas = React.createRef();
		this.width = 850 - this.margin.left - this.margin.right;
        this.height = 300 - this.margin.bottom - this.margin.top;
        this.svg = null;
        this.xScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, this.width * 0.75]);

        this.yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, this.height * 0.4]);
    }


    componentDidMount() {
        this.setState({
            data: [
                {   x0: 0,
                    x: this.props.eventA,
                    y: this.props.eventBA,
                    colour: '#ff8e3c',
                    xLabel: 'P(A)'
                },
                {
                    x0: this.props.eventA,
                    x: (1 - this.props.eventA),
                    y: this.props.eventBNotA,
                    colour: '#d9376e',
                    xLabel: 'P(¬A)'
                }
            ]
        }, () => {
            this.buildChart();
        });
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (this.props !== prevProps) {
            this.setState({
                data: [
                    {   x0: 0,
                        x: this.props.eventA,
                        y: this.props.eventBA,
                        colour: '#ff8e3c',
                        xLabel: 'P(A)'
                    },
                    {
                        x0: this.props.eventA,
                        x: (1 - this.props.eventA),
                        y: this.props.eventBNotA,
                        colour: '#d9376e',
                        xLabel: 'P(¬A)'
                    }
                ]
            }, () => {
                this.updateChart();
            });
        }
    }

    buildChart = () => {
        this.svg = d3.select(this.canvas.current)
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr(
                'transform',
                'translate(' + [ this.margin.left, this.margin.top] + ')'
            );

        const transition = d3.transition()
            .ease(d3.easeBounceOut)
            .duration(1500);
        
        this.svg.append('text')
                .attr('x', 0)
                .attr('y', this.height * 0.53)
                .attr('class', 'yLabel')
                .text('P(A|B) = ')
            

        this.svg.selectAll('.numeratorBar')
            .data(this.state.data.slice(0,1))
            .enter().append('rect')
            .attr('class', 'numeratorBar')
            .attr('y', (d: Datum) => this.yScale(1 - d.y))
            .attr('height', (d: Datum) => 0.4 * this.height - this.yScale(1 - d.y))
            .transition(transition)
            .attr('width', (d: Datum) => this.xScale(d.x))
            .attr('x', (d: Datum, i: number) => 175 + i*50 + this.xScale(d.x0))
            .attr('fill', (d: Datum) => d.colour);
        
        this.svg.selectAll('.denomBar')
            .data(this.state.data)
            .enter().append('rect')
            .attr('class', 'denomBar')
            .attr('y', (d: Datum) => this.height * 0.6 + this.yScale(1 - d.y))
            .attr('height', (d: Datum) => 0.4 * this.height - this.yScale(1 - d.y))
            .transition(transition)
            .attr('width', (d: Datum) => this.xScale(d.x))
            .attr('x', (d: Datum, i: number) => 150 + i*50 + this.xScale(d.x0))
            .attr('fill', (d: Datum) => d.colour);

        this.svg.append('rect')
            .attr('x', 100)
            .attr('y', this.height * 0.5)
            .attr('width', this.width)
            .attr('height', 3)
            .attr('fill', '#2a2a2a');
    }

    updateChart = () => {
        const transition: any = d3.transition()
            .ease(d3.easeBounceOut)
            .duration(1500);
    
        const denomBars = d3.selectAll('.denomBar')
            .data(this.state.data);

        const numberatorBar = d3.selectAll('.numeratorBar')
            .data(this.state.data.slice(0, 1));

        numberatorBar.exit().remove();
        numberatorBar.exit().remove();

        denomBars
            .transition(transition)
            .attr('x', (d: Datum, i: number) => 150 + i*50 + this.xScale(d.x0))
            .attr('y', (d: Datum) => this.height * 0.6 + this.yScale(1 - d.y))
            .attr('width', (d: Datum) => this.xScale(d.x))
            .attr('height', (d: Datum) => 0.4 * this.height - this.yScale(1 - d.y));
        
        numberatorBar
            .transition(transition)
            .attr('x', (d: Datum, i: number) => 175 + i*50 + this.xScale(d.x0))
            .attr('y', (d: Datum) => this.yScale(1 - d.y))
            .attr('width', (d: Datum) => this.xScale(d.x))
            .attr('height', (d: Datum) => 0.4 * this.height - this.yScale(1 - d.y));
            

    }

    render() {
        return (
            <div>
                <div className="probabilityChart" ref={this.canvas}></div>
            </div>
        )
    }
}
