import { merge, List } from 'immutable'

export const movingStatuses = {
    ON_WAY: 'ON_WAY',
    STOPED: 'STOPED'
}

const moveAction = (to) => {
    switch (to) {
        case 'up':
            return {
                direction: 'row',
                mergeValue: -1
            }
        case 'down':
            return {
                direction: 'row',
                mergeValue: 1
            }
        case 'left':
            return {
                direction: 'col',
                mergeValue: -1
            }
        case 'right':
            return {
                direction: 'col',
                mergeValue: 1
            }
        default: throw new Error('Invalid move Action!');
    }
}

const canMoveToFrom = (to, currentPosition, mapSize) => {
    const { direction, mergeValue } = moveAction(to);
    const newValueInDirection = currentPosition[direction] + mergeValue;
    if (newValueInDirection < 0 || newValueInDirection >= mapSize) {
        return false;
    }
    return true;
}

export const movePosition = (to, position) => {
    const { direction, mergeValue } = moveAction(to);
    const newPosition = {
        ...position,
        [direction]: position[direction] + mergeValue
    }
    return newPosition;
}

export const canMove = (to, state) => {
    const finalPosition = getFinalPosition(state);

    const playerCanMove = canMoveToFrom(to, finalPosition, state.map.size);
    if (!playerCanMove) {
        return false;
    }
    return true;
}

export const getFinalPosition = (state) => {
    const roadWay = state.roadWay;
    const currentTo = state.currentTo;
    const playerPosition = { row: state.player.get('row'), col: state.player.get('col') };

    let finalPosition = null;
    if (!currentTo) {
        finalPosition = playerPosition;
    } else if (!roadWay.size) {
        finalPosition = currentTo;
    } else {
        finalPosition = roadWay.last();
    }

    return finalPosition;
}

export const getMovingStatus = (state) => {
    if (state.currentTo) {
        return movingStatuses.ON_WAY;
    }
    return movingStatuses.STOPED;
}

export const moveFinalPosition = (to, state) => {
    const finalPosition = getFinalPosition(state);
    const newPosition = movePosition(to, finalPosition);
    return newPosition;
}

export const updatePlayerStatus = (state) => {
    const player = state.player;
    const map = state.map;
    const roadWay = state.roadWay;
    const currentTo = state.currentTo;

    const playerNew = merge(player, currentTo);
    const mapNew = map.map((row, index) => {
        let newRow = row;
        if (player.get('row') === index) {
            newRow = newRow.setIn([player.get('col')], null);
        }
        if (playerNew.get('row') === index) {
            newRow = newRow.setIn([playerNew.get('col')], playerNew);
        }
        return newRow;
    });

    let newCurrentTo = null;
    let newRoadWay = List();

    if (roadWay.size) {
        newCurrentTo = roadWay.get(0);
        newRoadWay = roadWay.shift();
    }
    return { player: playerNew, map: mapNew, roadWay: newRoadWay, currentTo: newCurrentTo };
}