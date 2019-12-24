import React, { Component } from 'react';
import './sass/main.scss';
import ProbabilityBox from './components/ProbabilityBox';
import VisualEquation from './components/VisualEquation';
import PropTypes from 'prop-types'
const MathJax =  require( 'react-mathjax2');

export default class App extends Component {
    static propTypes = {
        prop: PropTypes
    }

    state = {
        eventA: 0.5,
        eventNotA: 0.5,
        eventB: 0.5,
        eventBA: 1,
        eventBNotA: 1
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
        if (Number(event.target.value) > 1 || Number(event.target.value) < 0) {
            return;
        }
        if (key === "eventA") {
            this.setState({
                eventNotA: (1 - Number(event.target.value)).toFixed(2)
            });
        }
        this.setState({
            [key]: Number(event.target.value)
        });
    }

    render() {
        const bayesTheorem = `P(A|B) = \\frac{ P(A)\\times P(B|A)}{P(B)}`;
        // const pB = `P(B) = P(A) \\times P(B|A) + P(¬A) \\times P(B|¬A)`;
        const pAB = this.state.eventA * this.state.eventBA / ((this.state.eventA * this.state.eventBA)+(this.state.eventNotA * this.state.eventBNotA));
        return (
            <div>
                <div className="App">
                    <header className="App-header">
                        <div className="logo">
                            Bayes' theorem
                        </div>
                    </header>
                    <section>
                        <p>
                            Inspired by 3Blue1Brown's video on  <b>Bayes' Theorem</b>, this website provides an interactive way to visualise and understand Baye's Theorem.
                        </p>
                        <hr/>
                        <p>
                            <b>Baye's Theorem</b> allows us to calculate the probability of an event (A) happening (or a hypothesis being true), given another event (B) having occurred (or some new provided evidence).
                        </p>
                        <MathJax.Context input='tex'>
                            <div style={{fontSize: '1.6em'}}>
                                <MathJax.Node>
                                    {bayesTheorem}
                                </MathJax.Node>
                            </div>
                        </MathJax.Context>
                    </section>
                    <section className="white">

                        <h1 className="heading">Step 1</h1>
                        <p>
                            The probabilities can be visualised as areas of a square. The first probability we know of is of <span className="eventA">event A</span> taking place (or the <span className="eventA">hypothesis</span> being true) <b>without</b> event B taking place (or being provided the new evidence).
                        </p>
                        <p>
                            Try adjusting the probability of <span className="eventA">event A</span> below to visualise the area change in the probability box.
                        </p>
                        <div className="row">
                            <div className="column _50">
                                <label htmlFor="fp">P(A)</label>
                                <input
                                    type="number" name="event_a" id="event_a" value={this.state.eventA}
                                    onChange={(e) => this.handleChange(e, 'eventA')}
                                    />
                            </div>
                            <div className="column _50">
                                <label htmlFor="fp">P(¬A)</label>
                                <input
                                    type="number" name="event_not_a" id="event_not_a" value={this.state.eventNotA}
                                    disabled
                                    />
                            </div>
                        </div>
                        <h1 className="heading">Step 2</h1>
                        <p>
                            We now provide information to update our probabilities, that being the probability of <span className="eventB">event B</span> occuring, given <span className="eventA">event A</span> has taken place; as well as the probability of <span className="eventB">event B</span> occurring, given <span className="eventA">event A</span> <b>did not</b> take place.
                        </p>
                        <p>
                            <span className="eventB">Event B</span> is sometimes referred to as the evidence, thus P(B|A) can be read as the probability of the evidence occuring given the hypothesis is true, whilst P(B|¬A) is the probability of the evidence occuring given the hypothesis is not true.
                        </p>
                        <div className="row">
                            <div className="column _50">
                                <label htmlFor="fp">P(B|A)</label>
                                <input
                                    type="number" name="event_b_a" id="event_b_a" value={this.state.eventBA}
                                    onChange={(e) => this.handleChange(e, 'eventBA')}
                                    />
                            </div>
                            <div className="column _50">
                                <label htmlFor="fp">P(B|¬A)</label>
                                <input
                                    type="number" name="event_b_not_a" id="event_b_not_a" value={this.state.eventBNotA}
                                    onChange={(e) => this.handleChange(e, 'eventBNotA')}
                                    />
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="row">
                            <div className="column">
                                <ProbabilityBox
                                    eventA={this.state.eventA}
                                    eventB={this.state.eventB}
                                    eventBA={this.state.eventBA}
                                    eventBNotA={this.state.eventBNotA}

                                />

                            </div>
                        </div>
                    </section>
                    <section>
                        <h1 className="heading">Step 3</h1>
                        <p>
                            Using the evidence provided (i.e. <span className="eventB">event B</span>), we can calculate the new probabilities of our hypothesis being true. These are simply the area of the shaded boxes, which are calculated by multiplying the dimensions of the boxes, which happen to be probabilities.
                        </p>
                        <p>
                            The equation is shown below in graphical form, which illustrates the concept that the P(A|B) is equal to the ratio of the <span className="eventA">orange</span> box to combined the probabilities.
                        </p>
                        <div className="row">
                            <div className="column">
                                <VisualEquation
                                    eventA={this.state.eventA}
                                    eventB={this.state.eventB}
                                    eventBA={this.state.eventBA}
                                    eventBNotA={this.state.eventBNotA}

                                />
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="row">
                            <div className="column">
                                <h1 className="heading">Step 4</h1>
                                <p>
                                    The value of P(A|B) is thus {this.state.eventA} * {this.state.eventBA} / (({this.state.eventA} * { this.state.eventBA})+({this.state.eventNotA} * {this.state.eventBNotA})) = {(pAB * 100).toFixed(2)} %
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}