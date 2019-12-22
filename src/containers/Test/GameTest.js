import React, { Component } from 'react';

import { Spring, config } from 'react-spring/renderprops';

import { fromJS, List } from 'immutable';

import Player from '../../components/Player/Player'
import classes from './GameTest.module.css';

class GameTest extends Component {
    state = {
        player: {
            top: 0,
            left: 0
        },
        store: [{ top: 200, left: 200 }, { top: 300, left: 300 }, { top: 700, left: 700 }],
        moveTo: { top: 100, left: 100 }
    }

    render() {

        const from = {
            top: this.state.player.top + 'px',
            left: this.state.player.left + 'px'
        }

        let to = { ...from };
        if (this.state.moveTo) {
            to = {
                top: this.state.moveTo.top + 'px',
                left: this.state.moveTo.left + 'px'
            }
        }
        console.log('state updated!');
        console.log({...this.state.player})
        console.log(to)

        return (
            <Spring
                from={from}
                to={to}
                onRest={(props) => {
                    console.log('onRest')
                    if (!this.state.moveTo) {
                        return console.log('Stoped!');
                    }

                    if (to.top === props.top && to.left === props.left) {
                        console.log('finished')
                        console.log({ ...this.state.player })
                        if (this.state.store.length) {
                            const newPlayer = {
                                ...this.state.player,
                                top: parseInt(to.top),
                                left: parseInt(to.left)
                            }
                            const newStore = [...this.state.store];
                            const newMoveTo = newStore.shift();
                            console.log('new state');
                            console.log(newPlayer, newStore, newMoveTo);
                            return this.setState({
                                ...this.state,
                                player: newPlayer,
                                store: newStore,
                                moveTo: newMoveTo
                            })
                        }
                        const newPlayer = {
                            ...this.state.player,
                            top: parseInt(to.top),
                            left: parseInt(to.left)
                        }
                        const newMoveTo = null
                        return this.setState({
                            ...this.state,
                            player: newPlayer,
                            moveTo: newMoveTo
                        })
                    }

                }}
                onFrame={(props) => {
                    console.log('onFrame')
                }} >
                {(props) => {
                    console.log(' styles')
                    console.log(props)
                    return (
                        <Player style={props} name={'Andy'} />
                    )
                }}
            </Spring>
        )
    }
}

export default GameTest;