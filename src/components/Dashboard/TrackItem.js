import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import ErrorBoundary from '../../ErrorBoundary';
import UserControls from './UserControls';
import styles from './TrackItem.module.css';

export default function TrackItem (props) {
    const { track, user, who } = props;

    return (
        // <Link to={`/tracks/${track.id}`} className={styles.link}>    // bypassing ViewTrack view
        <Link to={`/tracks/${track.id}`} className={styles.link}>
        <li className={styles.root}>
            <h2>{track.title}</h2>
            {/* { who !== 'private' 
                ? <p className="public-user">by {user}</p> 
                : null } */}
            {/* <p><span className={styles.date}>{format(Date.parse(track.date_modified), 'yyyy MMM do / p')}</span></p> */}
            <ErrorBoundary>
                <p>
                    <span className={styles.date}>{format(Date.parse(track.date_modified), 'yyyy MMM do')}</span>
                    <span className={styles.time}>{format(Date.parse(track.date_modified), 'p')}</span>
                    {/* <span className={styles.date}>{format(track.date_modified, 'yyyy MMM do')}</span>
                    <span className={styles.time}>{format(track.date_modified, 'p')}</span> */}
                </p>
            </ErrorBoundary>
            
            { who === 'private' && 
                <UserControls 
                    track={track}
                    onChange={e => props.onChange(e)}
                    // onClickDelete={props.onClickDelete}
                    onClickDelete={(trackId) => props.onClickDelete(trackId)}
                />
            }
            
            {/* <Link to={`/tracks/${track.id}`}>See Drum Machine Configuration</Link> */}

            {/* <button>Listen to Audio Sample</button> // revisit once dealing with sound */}
            
        </li>
        </Link>
    )
}

TrackItem.defaultProps = {
    track: {
        date_modified: '2029-01-22T16:28:32.615Z',
    },
    
}