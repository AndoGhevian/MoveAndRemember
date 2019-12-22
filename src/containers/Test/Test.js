import React, { Component } from 'react';
import { Spring, config } from 'react-spring/renderprops';

import classes from './Test.module.css';

class Test extends Component {
    state = {
        from: {
            left: 0,
            top: 0,
        },
        to: null
    }

    onMoveHandler = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                from: { top: !prevState.to ? prevState.from.top : prevState.to.top, left: !prevState.to ? prevState.from.left : prevState.to.left },
                to: { top: prevState.from.top + 100, left: prevState.from.left + 100 },
            };
        })
    }

    render() {
        const from = {
            top: this.state.from.top + 'px',
            left: this.state.from.left + 'px'
        }
        const to = {
            top: !this.state.to ? this.state.from.top + 'px' : this.state.to.top + 'px',
            left: !this.state.to ? this.state.from.left + 'px' : this.state.to.left + 'px'
        }
        return (
            <div className={classes.TestArea}>
                <button onClick={this.onMoveHandler}>CLick To move</button>
                <Spring
                    from={from}
                    to={to} >
                    {(props) => {
                        return (
                            <div className={classes.Animated} style={props}></div>
                        )
                    }}
                </Spring>
            </div>
        )
    }
}

export default Test;