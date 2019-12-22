import React, { Componet } from 'react';

import Player from '../../../components/Player/Player';
import Segment from '../../../components/Segment/Segment';
import classes from './Map.module.css';

const Map = (props) => {
    const classNames = [classes.Map];
    if (props.error) {
        classNames.push(classes.Error)
    }


    const segmentStyles = {
        width: (parseInt(props.style.width) / props.segmentsCountOnRow) + 'px',
        height: (parseInt(props.style.height) / props.segmentsCountOnRow) + 'px',
    }

    const playerSizeStyles = {
        width: (parseInt(segmentStyles.width) * 100 / 100) + 'px',
        height: (parseInt(segmentStyles.height) * 100 / 100) + 'px',
    }

    return (
        <div tabIndex={0} onKeyUp={props.onMove} style={props.style} className={classes.Map}>
            {props.map.map((row, rowIndex) => row.map((col, colIndex) => {
                if (!col) {
                    return <Segment style={segmentStyles} key={rowIndex + '' + colIndex} />
                }
                return (
                    <Segment style={segmentStyles} key={rowIndex + '' + colIndex}>
                        <Player style={props.playerStyles ? { ...props.playerStyles, ...playerSizeStyles } : playerSizeStyles} name={props.player.name} />
                    </Segment>
                )
            })).reduce((segmentsArray, row) => segmentsArray.concat(row))}
        </div>
    )
}

export default Map;