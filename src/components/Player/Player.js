import React from 'react';

import classes from './Player.module.css';

const Player = (props) => {
    return (
        <div style={props.style} className={classes.Player}>
            {props.name}
        </div>
    )
}
export default Player;