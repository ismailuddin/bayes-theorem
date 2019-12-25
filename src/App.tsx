import React, { Component } from 'react';
import './sass/main.scss';
import ProbabilityBox from './components/ProbabilityBox';
import VisualEquation from './components/VisualEquation';
const MathJax =  require( 'react-mathjax2');

export default class App extends Component {

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
        const pB = `P(B) = P(A) \\times P(B|A) + P(¬A) \\times P(B|¬A)`;
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
                            Inspired by <a href="https://www.youtube.com/watch?v=HZGCoVF3YvM">3Blue1Brown's video</a> on <b>Bayes' Theorem</b>, this website provides an interactive way to visualise and understand Baye's Theorem.
                        </p>
                        <hr/>
                        <p>
                            <b>Baye's Theorem</b> allows us to calculate the probability of an <span className="eventA">event (A)</span> happening (or a <span className="eventA">hypothesis</span> being true), given another <span className="eventB">event (B)</span> having occurred (or some new provided <span className="eventB">evidence</span> ).
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
                                <small>
                                    The <b>¬</b> symbol in P(¬A) means the probability of A not happening.
                                </small>
                            </div>
                        </div>
                        <ProbabilityBox
                            eventA={this.state.eventA}
                            eventB={this.state.eventB}
                            eventBA={this.state.eventBA}
                            eventBNotA={this.state.eventBNotA}
                        />
                        <p>
                            In the probability box, the x-axis represents the dimension along which the probability of <span className="eventA">event A</span> is expressed.
                        </p>
                        <h1 className="heading">Step 2</h1>
                        <p>
                            Since Bayes' Theorem provides a way to re-calculate our probabilities given some new evidence, we will now provide this new information. This new <span className="eventB">evidence</span> is the probability of <span className="eventB">event B</span> occuring.
                        </p>
                        <p>
                            The probability of <span className="eventB">event B</span> is often broken down by considering the probability of <span className="eventB">event B</span> in the cases <span className="eventA">event A</span> had taken place, along with the probability of <span className="eventB">event B</span> taking place, given <span className="eventNotA">event ¬A</span> occurred (i.e. <span className="eventA">event A</span> did not take place).
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
                        <p>
                            By adjusting the two probabilities, we can see the boxes change height, as the y-axis represents this newly provided probability information (or <span className="eventB">evidence</span>.)
                        </p>
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
                        <p>
                            To use these newly provided probabilities, we must multiply them with our initial probabilities (the probability of <span className="eventA">event A</span> and of <span className="eventNotA">event ¬A</span>). This is in fact simply the area of the two shaded boxes. The combined area of those two boxes is the total probability of <span className="eventB">event B</span> occuring, or the <span className="eventB">evidence</span>.
                        </p>
                        <MathJax.Context input='tex'>
                            <div style={{fontSize: '1.6em'}}>
                                <MathJax.Node>
                                    {pB}
                                </MathJax.Node>
                            </div>
                        </MathJax.Context>
                    </section>
                    <section>
                        <h1 className="heading">Step 3</h1>
                        <p>
                            Using the evidence provided (i.e. <span className="eventB">event B</span>), we can calculate the updated probability of <span className="eventA">event A</span> taking place, given <span className="eventB">event B</span> occurred i.e. P(A|B). This is in fact the ratio of the probabilities of <span className="eventA">event B</span> occuring given <span className="eventA">event A</span> took place, to the total probability of <span className="eventB">event B</span> occuring.
                        </p>
                        <p>
                            This ratio, or the Bayes' Theorem equation, is shown below in a visual form:
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
                                    The value of P(A|B) is thus:
                                </p>
                                <div className="row">
                                    <div className="column _33">
                                        <div className="row">
                                            <div className="column equation equation-numerator">
                                                <p>
                                                    <span className="eventA">{this.state.eventA}</span>  * {this.state.eventBA}

                                                </p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="column equation equation-denominator">
                                                <p>
                                                    <span className="eventB">
                                                        (({this.state.eventA} * { this.state.eventBA})+({this.state.eventNotA} * {this.state.eventBNotA}))
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column _66">
                                        <div className="column equation equation-rhs">
                                            <p>
                                                = {(pAB * 100).toFixed(2)} %
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}