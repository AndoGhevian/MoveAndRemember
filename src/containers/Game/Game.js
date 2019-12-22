import React, { Component } from 'react';

import { Spring, config } from 'react-spring/renderprops';

import { fromJS, List } from 'immutable';
import { movingStatuses, canMove, moveFinalPosition, getMovingStatus, updatePlayerStatus } from './utils/map';

import Map from './Map/Map';
import classes from './Game.module.css';

class Game extends Component {
    state = {
        config: {
            segmentsCountOnRow: 5,
            segmentSize: 50
        },
        map: List(List()),
        player: null,
        roadWay: List(),
        currentTo: null,
        error: false,
    }

    constructor(props) {
        super(props);

        this.state.map = fromJS([...Array(this.state.config.segmentsCountOnRow)].map(_ => [...Array(this.state.config.segmentsCountOnRow)].map(_ => null)));

        const randomRow =  Math.floor(Math.random() * this.state.map.size);
        const randomCol =  Math.floor(Math.random() * this.state.map.size);
        const player = fromJS({
            name: 'Andy',
            row: randomRow,
            col: randomCol
        });
        this.state.player = player;
        this.state.map = this.state.map.setIn([randomRow, randomCol], player);
    }

    componentDidUpdate() {
        console.log('Component Did update!');
    }

    onKeyUpHandler = (event) => {
        switch (event.key) {
            case 'ArrowUp':
                return this.onMoveHandler('up');
            case 'ArrowDown':
                return this.onMoveHandler('down');
            case 'ArrowLeft':
                return this.onMoveHandler('left');
            case 'ArrowRight':
                return this.onMoveHandler('right');
            default: return;
        }
    }

    onArrivedToHandler = () => {
        this.setState((prevState) => {
            const newPlayerStatus = updatePlayerStatus(prevState);
            return { ...prevState, ...newPlayerStatus };
        })
    }

    onMoveHandler = (to) => {
        this.setState((prevState) => {
            const playerCanMove = canMove(to, prevState);
            if (!playerCanMove) {
                return { ...prevState, error: true };
            }

            const newFinalPosition = moveFinalPosition(to, prevState);

            const movingStatus = getMovingStatus(prevState);
            if (movingStatus === movingStatuses.ON_WAY) {
                return { ...prevState, roadWay: prevState.roadWay.push(newFinalPosition), error: false };
            }
            return { ...prevState, currentTo: newFinalPosition, error: false };
        })
    }

    render() {
        const segmentSize = this.state.config.segmentSize;
        const rowsCount = this.state.config.segmentsCountOnRow;
        const mapSize = segmentSize * rowsCount;
        const mapStyles = {
            width: mapSize + 'px',
            height: mapSize + 'px'
        }

        const lastPosition = {
            top: this.state.player.get('row'),
            left: this.state.player.get('col')
        }
        const currentTo = {
            top: this.state.currentTo ? this.state.currentTo.row : lastPosition.top,
            left: this.state.currentTo ? this.state.currentTo.col : lastPosition.left
        }

        const lastPlayerStyles = { top: (lastPosition.top * segmentSize) + 'px', left: (lastPosition.left * segmentSize) + 'px' };
        const currentToPlayerStyles = { top: (currentTo.top * segmentSize) + 'px', left: (currentTo.left * segmentSize) + 'px' }
        return (
            <div className={classes.Game}>
                <Spring
                    from={lastPlayerStyles}
                    to={currentToPlayerStyles}
                    onRest={(styles) => {
                        if (!this.state.currentTo) {
                            return;
                        }
                        if (styles.top === currentToPlayerStyles.top && styles.left === currentToPlayerStyles.left) {
                            this.onArrivedToHandler();
                        }
                    }}>
                    {(props) => {
                        return (<Map
                            onMove={this.onKeyUpHandler}
                            error={this.state.error}
                            style={mapStyles}
                            playerStyles={props}
                            segmentsCountOnRow={this.state.config.segmentsCountOnRow}
                            map={this.state.map.toJS()}
                            player={this.state.player.toJS()} />)
                    }}
                </Spring>
            </div>
        )
    }
}

export default Game;