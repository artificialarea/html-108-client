import React from 'react';
import PlayButton from './PlayButton';
import TempoDisplay from './TempoDisplay';
import TempoControl from './TempoControl';



export default function Tempo (props) {
    const { track, editable, tempoChange } = props;
    // console.log(track)
    return (
        <div className="tempo__controls">
            <PlayButton />
            { editable &&
                <>
                    <TempoDisplay 
                        track={track} 
                        tempoChange={e => tempoChange(e)}
                    />
                    <TempoControl 
                        track={track} 
                        tempoChange={e => tempoChange(e)}
                    />
                </>
            }   
        </div>
    )
}
