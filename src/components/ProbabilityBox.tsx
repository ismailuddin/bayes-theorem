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
    xLabel: string,
    yLabel: string
}

export interface State {
    data: Array<Datum>
}

export default class ProbabilityBox extends Component<Props, State> {
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
                xLabel: 'P(A)',
                yLabel: 'P(B|A)'
            },
            {
                x0: 0,
                x: 0,
                y: 0,
                colour: '',
                xLabel: 'P(¬A)',
                yLabel: 'P(B|¬A)'
            }
        ]
    }

    constructor(props: Props) {
        super(props);
        this.margin = {
			top: 35,
			right: 35,
			bottom: 35,
			left: 35
		};
        this.canvas = React.createRef();
		this.width = 600 - this.margin.left - this.margin.right;
        this.height = 600 - this.margin.bottom - this.margin.top;
        this.svg = null;
        this.xScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, this.width]);

        this.yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, this.height]);
    }


    componentDidMount() {
        this.setState({
            data: [
                {   x0: 0,
                    x: this.props.eventA,
                    y: this.props.eventBA,
                    colour: '#ff8e3c',
                    xLabel: 'P(A)',
                    yLabel: 'P(B|A)'
                },
                {
                    x0: this.props.eventA,
                    x: (1 - this.props.eventA),
                    y: this.props.eventBNotA,
                    colour: '#d9376e',
                    xLabel: 'P(¬A)',
                    yLabel: 'P(B|¬A)'
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
                        xLabel: 'P(A)',
                        yLabel: 'P(B|A)'
                    },
                    {
                        x0: this.props.eventA,
                        x: (1 - this.props.eventA),
                        y: this.props.eventBNotA,
                        colour: '#d9376e',
                        xLabel: 'P(¬A)',
                        yLabel: 'P(B|¬A)'
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
            .attr("viewBox", `0, 0, ${this.width + this.margin.left + this.margin.right}, ${this.height + this.margin.top + this.margin.bottom}`)
            .append('g')
            .attr(
                'transform',
                'translate(' + [ this.margin.left, this.margin.top] + ')'
            );

        const transition = d3.transition()
            .ease(d3.easeBounceOut)
            .duration(1500);

        // Draw background
        this.svg.append('rect')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('fill', '#fefefe')

        // Draw Y-axis labels
        this.svg.selectAll('.yLabel')
            .data(this.state.data)
            .enter()
            .append('text')
            .attr('class', 'yLabel')
            .attr('transform', 'rotate(-90)')
            .attr('x', (d: Datum) => -1 * this.yScale(1 - d.y) - 80)
            .attr('y', (d: Datum, i: number) => -1 * this.margin.left / 2 + ( i * (this.width + this.margin.left + 10)))
            .text((d: Datum) => d.yLabel);

        // Draw X-axis labels
        this.svg.selectAll('.xLabel')
            .data(this.state.data)
            .enter()
            .append('text')
            .attr("y", this.height + 25)
            .attr('class', 'xLabel')
            .attr("x", (d: Datum) => this.xScale(d.x0) + 10)
            .text((d: Datum) => d.xLabel);
        
        this.svg.selectAll('.fixedBar')
            .data(this.state.data)
            .enter().append('rect')
            .attr('class', 'fixedBar')
            .attr('y', (d: Datum) => this.yScale(1 - d.y))
            .attr('height', (d: Datum) => this.height - this.yScale(1 - d.y))
            .transition(transition)
            .attr('width', (d: Datum) => this.xScale(d.x))
            .attr('x', (d: Datum) => this.xScale(d.x0))
            .attr('fill', (d: Datum) => d.colour)
            .attr('opacity', 0.5);
        
        this.svg.selectAll('.bar')
            .data(this.state.data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('y', (d: Datum) => this.yScale(1 - d.y))
            .attr('height', (d: Datum) => this.height - this.yScale(1 - d.y))
            .transition(transition)
            .attr('width', (d: Datum) => this.xScale(d.x))
            .attr('x', (d: Datum) => this.xScale(d.x0))
            .attr('fill', (d: Datum) => d.colour);
    }

    updateChart = () => {
        const transition: any = d3.transition()
            .ease(d3.easeBounceOut)
            .duration(1500);
    
        const bars = this.svg.selectAll('.bar')
            .data(this.state.data);

        const fixedBars = this.svg.selectAll('.fixedBar')
            .data(this.state.data);

        const xLabels = this.svg.selectAll('.xLabel')
            .data(this.state.data);

        const yLabels = this.svg.selectAll('.yLabel')
            .data(this.state.data);

        bars.exit().remove();
        fixedBars.exit().remove();
        xLabels.exit().remove();
        yLabels.exit().remove();

        bars
            .transition(transition)
            .attr('x', (d: Datum) => this.xScale(d.x0))
            .attr('y', (d: Datum) => this.yScale(1 - d.y))
            .attr('width', (d: Datum) => this.xScale(d.x))
            .attr('height', (d: Datum) => this.height - this.yScale(1 - d.y));
            
        fixedBars
            .transition(transition)
            .attr('x', (d: Datum) => this.xScale(d.x0))
            .attr('width', (d: Datum) => this.xScale(d.x))
            .attr('fill', (d: Datum) => d.colour);

        xLabels
            .transition(transition)
            .attr("x", (d: Datum) => this.xScale(d.x0) + 10);

        yLabels
            .transition(transition)
            .attr('x', (d: Datum) => -1 * this.yScale(1 - d.y) - 80);

    }

    render() {
        return (
            <div>
                <div className="probabilityChart" ref={this.canvas}></div>
            </div>
        )
    }
}
