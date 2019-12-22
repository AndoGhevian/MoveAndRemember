import React from 'react';

import classes from './Segment.module.css';

const Segment = (props) => {
    return (
        <div style={props.style} className={classes.Segment}>
            {props.children}
        </div>
    )
}

export default Segment;