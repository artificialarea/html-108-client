import React from 'react';
import { Route, Switch } from 'react-router-dom';
import config from './config';

import './App.css';

import Nav from './components/Nav/Nav';
import Intro from './components/Intro/Intro';
import Dashboard from './components/Dashboard/Dashboard';
import ViewTrack from './components/ViewTrack/ViewTrack';
import AddTrack from './components/AddTrack/AddTrack';
import EditTrack from './components/EditTrack/EditTrack';
import DrumMachine from './components/DrumMachine/DrumMachine';
import Footer from './components/Footer/Footer';
import NotFound from './components/NotFound/NotFound';
import ApiContext from './ApiContext';
// import Login from './components/Login/Login';
// import Registration from './components/Registration/Registration';
// import EditTitle from './components/EditTitle/EditTitle';

// console.log('process.env: ', process.env) // [f4] Re: Vercel `.env.local` issues

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            authUser: [     // static placeholder at this phase
                {
                    id: 1,
                    username: 'admin_react',
                }
            ],
            users: [],                     
            tracks: [],              
            error: null,
        }
    }

    componentDidMount() {

        const fetchOptions = {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${config.API_KEY}`
            },
        }

        Promise.all([
            fetch(`${config.API_ENDPOINT}/api/users`, fetchOptions),
            fetch(`${config.API_ENDPOINT}/api/tracks`, fetchOptions),
        ])
            .then(([usersRes, tracksRes]) => {
                if (!usersRes.ok)
                    return usersRes.json().then(e => Promise.reject(e))
                if (!tracksRes.ok)
                    return tracksRes.json().then(e => Promise.reject(e))

                return Promise.all([
                    usersRes.json(),
                    tracksRes.json(),
                ])
            })
            .then(([users, tracks]) => {
                this.setState({ users, tracks })
            })
            .catch(err => {
                console.error({ err })
            })
    }

    handleTempoChange = (changeEvent) => {
        const { tracks, new_track } = this.state;
        const trackId = changeEvent.target.name;

        if (trackId === '0' ) {
            const updateNewtrack = [...new_track];
            updateNewtrack.find(track => track.id == trackId).tempo = changeEvent.target.value;
        } else {
            const newtracks = [...tracks];
            newtracks.find(track => track.id == trackId).tempo = changeEvent.target.value;
        }

        this.setState({
            // [f1]
        })
    }

    handlePrivacyChange = (changeEvent) => {
        const { tracks } = this.state;
        const trackId = changeEvent.target.name;  
        const newPrivacyBool = changeEvent.target.value === 'public' ? true : false;

        const newtracks = [...tracks];
        newtracks.find(track => track.id == trackId).visible = newPrivacyBool;

        this.setState({
            // [f1]
            // tracks: newtracks
        })
    }

    handleDeleteTrack = (trackId) => {
        const { tracks } = this.state;
        // [f3] + [f1]
        const newtracks = [...tracks]
        const index = newtracks.findIndex(track => track.id === trackId)
        if (index > -1) {
            newtracks.splice(index, 1);
        }

        this.setState({
            tracks: newtracks
        })
    }

    handleResetTrack = (trackId) => {
        const { reset_track } = this.state;

        // TODO: enable this functionality for saved tracks as well. Intially tried but failed.
        // ALSO NOTE: Fails to reset new_track if Reset Track invoked again after initial reset =/
        if (trackId === 0 ) {
            this.setState({
                // [f1]
                new_track: [...reset_track]
            })
        }
    }

    renderNavRoutes () {
        return (
            <>
                <Route 
                    path='/'
                    component={Nav}
                />
            </>
        )
    }

    renderFooterRoutes () {
        return (
            <>
                <Route 
                    path='/'
                    component={Footer}    
                />
            </>
        )
    }

    renderMainRoutes () {
        const { authUser, users, tracks } = this.state;
        // console.log('state:', this.state)

        return (
            <Switch>
                <Route exact path='/' component={Intro} />

                <Route 
                    path='/dashboard' 
                    render={() => 
                        <Dashboard 
                            who={'public'}
                            users={users}
                            tracks={tracks}
                        />
                    } 
                />
                
                <Route 
                    path='/add-track' 
                    render={(props) => 
                        <AddTrack 
                            authUser={authUser}
                        />
                    }
                />

                <Route 
                    path='/tracks/:trackId'
                    component={ViewTrack}    
                />

                {/* <Route 
                    path='/tracks/:trackId' 
                    component={(props) => {
                        // console.log('props.match: ', props.match)
                        const trackViaParams = tracks.find(track => track.id == props.match.params.trackId)
                        
                        return <ViewTrack 
                                    authUser={authUser}
                                    users={users}
                                    // tracks={tracks}
                                    track={trackViaParams}
                                />
                    }}
                /> */}

                <Route 
                    path='/edit/:trackId' 
                    component={(props) => {
                        // console.log('props.match: ', props.match)
                        const trackViaParams = tracks.find(track => track.id == props.match.params.trackId)
                        
                        return <EditTrack 
                                    authUser={authUser}
                                    users={users}
                                    // tracks={tracks}
                                    track={trackViaParams}
                                />
                    }}
                />
                
                {/* <Route 
                    path='/tracks/:trackId' 
                    component={(props) => {
                        // console.log('props.match: ', props.match)
                        const trackViaParams = tracks.find(track => track.id == props.match.params.trackId)
                        return <DrumMachine 
                                    track={trackViaParams}  
                                    userId={1}    // this will be dynamic once login auth set up
                                    users={users}
                                    onChange={this.handleTempoChange}
                                    onClick={this.handleBeatChange}
                                    onClickReset={this.handleResetTrack}
                                />
                    }}
                /> */}

                  {/* <Route 
                    exact 
                    path='/track' 
                    render={() => 
                        <DrumMachine 
                            track={new_track[0]}
                            onChange={this.handleTempoChange}
                            onClick={this.handleBeatChange}
                            onClickReset={this.handleResetTrack}
                            onClickSubmitNewTrack={this.handleSubmitNewTrack}
                            titleChange={this.handleTitleChange}
                        />
                    }   
                /> */}

                <Route component={NotFound} />
            </Switch>
        )
    }

    render() {
        const value = {
            authUser: this.state.authUser,
            users: this.state.users,
            tracks: this.state.tracks,
            addTrack: this.handleAddTrackReprise,
            deleteTrack: this.handleDeleteTrackReprise,
            updateTrack: this.handleUpdateTrackReprise,
        }
        return (
            <ApiContext.Provider value={value}>
                <div className="App">
                    {this.renderNavRoutes()}

                    <main className="App__main">
                        {this.renderMainRoutes()}
                    </main>
                    
                    {this.renderFooterRoutes()}
                </div>
            </ApiContext.Provider>
        );
    }
}
