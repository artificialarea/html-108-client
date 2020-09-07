import React from 'react';
import UserControls from '../UserControls/UserControls';

export default function TrackItem (props) {

    return (
        <li className="composition track-item" key={props.id}>
            <h2>{props.track.title}</h2>
            { props.who !== 'private' 
                ? <p className="public-user">by {props.user}</p> 
                : null }
            <p>3 Sept 2020</p>
            
            { props.who === 'private' && 
                <UserControls />
            }
            
            <button>Listen to Audio Sample</button> <button>See Drum Machine Configuration</button>
        </li>
    )
}