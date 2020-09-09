import React from 'react';
import './DrumMachine.css';
import Header from './Header';
import Tempo from './Tempo';
import StepSequencer from './StepSequencer';

export default function DrumMachine (props) {

    return (
        <div className="component drum-machine">
            <Header track={props.track} />
            <Tempo 
                track={props.track} 
                onChange={e => props.onChange(e)}
            />
            <StepSequencer 
                track={props.track} 
                onClick={e => props.onClick(e)}
            />
        </div>
    )
}
