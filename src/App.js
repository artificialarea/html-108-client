import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';

import Nav from './components/Nav/Nav';
import Intro from './components/Intro/Intro';
import Dashboard from './components/Dashboard/Dashboard';
import DrumMachine from './components/DrumMachine/DrumMachine';
import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';
import EditTitle from './components/EditTitle/EditTitle';
import Footer from './components/Footer/Footer';
import NotFound from './components/NotFound/NotFound'
import { faObjectGroup } from '@fortawesome/free-solid-svg-icons';


export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [
                {
                    id: 1,
                    username: "Sarah",
                    // presumably won't store this sensitive data client-side?
                    // (even for the signed-in user?)
                    // password: "aaAA11!!",        
                    // email: "sarah@hotmail.com"
                },
                {
                    id: 2,
                    username: "Dolfmeister",
                },
            ],
            compositions: [],
           
            public: true, // string instead of boolean (for now)
            error: null,
            new_composition: [
                {
                    id: '',
                    user_id: '',
                    title: '',
                    date_modified: '',
                    public: true,
                    tempo: 120,
                    sequence_length: 16,
                    mp3: '',
                    audio_sequence: [ 'hihat', 'clap', 'trap', 'bass'],     // TODO: Add to db
                    step_sequence: [
                        [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                        [1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
                        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                        [0,1,0,1,0,0,0,0,1,0,1,0,0,0,0,0],
                    ],
                },
            ],
            // pre_compositions: [ // guide-only
                // {
                //     id: 1,
                //     user_id: 1,
                //     title: "Krautrock",
                //     date_modified: "",
                //     public: true,
                //     tempo: 80,
                //     sequence_length: 16,
                //     mp3: "http://path-of-the-audio-preview.mp3",
                //     step_sequence: {
                //         hihat: [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                //         clap: [1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
                //         trap: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                //         bass: [0,1,0,1,0,0,0,0,1,0,1,0,0,0,0,0],
                //     },
                // },
            // ],
        }
        
    }

    setPublicity(publicity) {  // public is a reserve word... may need to purge everywhere
        this.setState({
            publicity
        });
    }

    componentDidMount() {
        // fetch compositions.public = true automatically in anticipation of visiting /dashboard route
        // HOWEVER LIFECYCLE ISSUE
        // fails to execute in time if enter site via particular track route URL, so tracks are undefined
        // e.g. http://http://localhost:3000/track/3

        const baseUrl = 'http://localhost:8000/faux-tracks';
        const params = [];
        if (this.state.public) {
            params.push(`public=${this.state.public}`);
        }
        const query = params.join('&');
        const url = `${baseUrl}?${query}`
        console.log('fetch(url): ', url)
        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                return res.json();
            })
            .then(data => {
                this.setState({
                    compositions: data,
                    error: null
                });
            })
            .catch(err => {
                this.setState({
                    error: 'Houston, we have a problem.'
                });
            })
    }

    handleBeatChange = (changeEvent) => {
        const { compositions } = this.state;
        // probably a less hacky way to do this, but...
        // Extract target tag id information from string into array
        // "trackId instrumentKey beatIndex beatBoolean" e.g. "2 hihat 5 0" // => ['2','hihat', 5, 0]
        const targets = changeEvent.target.id.split(' ');
        const trackId = targets[0];
        const instrumentKey = targets[1];
        const beatIndex = targets[2];
        let beatBoolean = targets[3]; 

        beatBoolean == 1        // fails if strict equality (===)
            ? beatBoolean = 0
            : beatBoolean = 1;

        // [f1]
        const newCompositions = [...compositions];
        newCompositions.find(track => track.id == trackId).step_sequence[instrumentKey][beatIndex] = beatBoolean;

        this.setState({
            // [f1]
            // compositions: newCompositions
        })
    }

    handleTempoChange = (changeEvent) => {
        const { compositions } = this.state;
        const trackId = changeEvent.target.name;

        const newCompositions = [...compositions];
        newCompositions.find(track => track.id == trackId).tempo = changeEvent.target.value;

        this.setState({
            // [f1]
            // compositions: newCompositions
        })
    }

    handlePrivacyChange = (changeEvent) => {
        const { compositions } = this.state;
        const trackId = changeEvent.target.name;  
        const newPrivacyBool = changeEvent.target.value === 'public' ? true : false;

        const newCompositions = [...compositions];
        newCompositions.find(track => track.id == trackId).public = newPrivacyBool;

        this.setState({
            // [f1]
            // compositions: newCompositions
        })
    }

    handleDeleteTrack = (trackId) => {
        const { compositions } = this.state;
        // [f3] + [f1]
        const newCompositions = [...compositions]
        const index = newCompositions.findIndex(track => track.id === trackId)
        if (index > -1) {
            newCompositions.splice(index, 1);
        }

        this.setState({
            compositions: newCompositions
        })
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
        const { users, compositions } = this.state;
        console.log(compositions)

        return (
            <Switch>
                <Route exact path='/' component={Intro} />
                <Route path='/login' component={Login} />
                <Route path='/register' component={Registration} />
                <Route path='/profile' component={Registration} />
                <Route path='/edit-title' component={EditTitle} />

                <Route 
                    path='/dashboard' 
                    render={() => 
                        <Dashboard 
                            who={'public'}
                            users={users}
                            tracks={compositions}
                        />
                    } 
                />
                <Route 
                    path='/my-dashboard'
                    render={() => 
                        <Dashboard 
                            who={'private'} 
                            userId={1}    // this will be dynamic once login auth set up
                            users={users}
                            tracks={compositions}
                            onChange={this.handlePrivacyChange}
                            onClickDelete={this.handleDeleteTrack}
                        />
                    }  
                />

                <Route 
                    exact 
                    path='/track' 
                    render={() => 
                        <DrumMachine 
                            track={compositions[0]}
                            onChange={this.handleTempoChange}
                            onClick={this.handleBeatChange}
                        />
                    }   
                />
                <Route 
                    path='/track/:trackId' 
                    component={(props) => {
                        console.log('props.match: ', props.match)
                        const trackViaParams = compositions.find(track => track.id == props.match.params.trackId)
                        return <DrumMachine 
                                    track={trackViaParams}  
                                    userId={1}    // this will be dynamic once login auth set up
                                    users={users}
                                    onChange={this.handleTempoChange}
                                    onClick={this.handleBeatChange}
                                />
                    }}
                />

                <Route component={NotFound} />
            </Switch>
        )
    }

    render() {
        
        return (
            <div className="App">
                {this.renderNavRoutes()}

                <main className="App__main">
                    {this.renderMainRoutes()}
                </main>
                
                {this.renderFooterRoutes()}
            </div>
        );
    }
}
