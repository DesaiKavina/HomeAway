import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import axios from 'axios';
import {Redirect} from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js'
import 'jquery/dist/jquery.min.js'
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/js/bootstrap.js';
import SideNavbar from '../SideNavbar';
import {ROOT_URL} from '../Root_url';
const fs = require('fs');

class travelerInbox extends Component
{
    constructor(props){
        super(props);
        this.state = {
            information : [],
            traveler_token : '',
            setEmail : '', 
            reply : '', 
            setUsername : ''
        }

        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount(){

        var token = localStorage.getItem('TravelerToken');
        var emailT = sessionStorage.getItem('SessionEmail');
        var setUsername = sessionStorage.getItem('SessionUsername')
        this.setState({
            traveler_token : token,
            setEmail : emailT,
            setUsername: setUsername
        })

        axios.defaults.withCredentials = true;
        
        axios.get(`${ROOT_URL}/travelerInbox/`+emailT, {headers: {Authorization : token}})
                .then((response) => {
                    console.log("Inside get request for general info of the conversation");
                    console.log("************************* Printing the conversation data ***********************")
                    console.log(response.data);
                    console.log("Response data length in data information: "+response.data.length);
                    this.setState({
                        information : response.data
                    })
            });
    }

    handleLogout = () => {
        cookie.remove('cookieT', { path: '/' })
        sessionStorage.removeItem('SessionEmail');
        sessionStorage.removeItem('SessionUsername');
        localStorage.clear();
        sessionStorage.clear();
        // window.location.reload();
    }

    render(){
        require('./travelerInbox.css');

        let redirectvar = null;
        // if( cookie.load('cookieT')!="traveler" ){
        //     redirectvar = <Redirect to= "/homepage"/>
        // }
        if(localStorage.getItem('cookieT')!="traveler"){
            redirectvar = <Redirect to= "/homepage"/>
        }
     
        let view = null;
        let ansmessage = null;
        let ansby = null;
        if(this.state.information.length>0)
        {
            view = this.state.information.map(message => {

                if(message.OwnerAnswer=="")
                {
                    ansmessage = (
                        <p class="not-answered">The owner has not aswered this question</p>
                    )
                }
                else{
                    ansmessage = (
                        <p>Reply to your question :  {message.OwnerAnswer}</p>
                    )
                }

                if(message.answeredBy!="")
                {
                    ansby = (
                        <p>This question was answered by : {message.answeredBy}</p>
                    )
                }

                
                return(
                    <div>
                    <div class="message_detials">
                        <h4>You asked a question about this property : <b>{message.propertyName}</b></h4>
                        <p><b>Your question was : </b>{message.TravelerQuestion}</p>
                        {ansmessage}
                        {ansby}
                    </div>
                    <hr></hr>
                    </div>
                )
            })
        }
        else
        {
            view = (
                    <div class="message_detials">
                        <h3>No messages !</h3>
                    </div>
                );
        }

        return(
            <div>
                {redirectvar}

                 <div id="navbardiv">
                    <nav class="navbar navbar-default navbar-expand-sm" id="nav">
                    <div class="container-fluid">
                        <div class="navbar-header">
                                <a href="/homepage" class="navbar-brand">
                                    <p class="heading1">HomeAway</p>
                                </a>
                        </div>

                        <div>
                            <ul class="nav navbar-nav navbar-right" id="ulist">
                                <li class="items"><a href="#" class="nav-item mainlinks1"> TripBoards </a></li>

                                <li class="dropdown items">
                                    <a href="#" class="dropdown-toggle mainlinks1" data-toggle="dropdown"> {this.state.setUsername} <span class="caret"></span></a>
                                    <ul class="dropdown-menu dropdown-menu-right mymenu">
                                        <li class="listitems"><a class="dropdown-item menulinks1" href="/travelerInbox" role="menu">Inbox</a></li>
                                        <li class="listitems"><a class="dropdown-item menulinks1" href="/travelertrips" role="menu">My trips</a></li>
                                        <li class="listitems"><a class="dropdown-item menulinks1" href="/travelerprofile" role="menu">My profile</a></li>
                                        <li class="listitems"><a class="dropdown-item menulinks1" href="#" role="menu">Account</a></li>
                                        {/* <li class="listitems"><a class="dropdown-item menulinks1" href="#" role="menu">Logout</a></li> */}
                                        <li class="listitems"><Link to="/homepage" onClick = {this.handleLogout} class="dropdown-item menulinks1" role="menu">Logout</Link></li>
                                    </ul>
                                </li>

                                <li class="dropdown items">
                                    <a href="#" class="dropdown-toggle mainlinks1" data-toggle="dropdown"> Help <span class="caret"></span></a>
                                    <ul class="dropdown-menu dropdown-menu-right mymenu">
                                        <li class="listitems"><a class="dropdown-item menulinks1" href="#">Visit help center</a></li>
                                        <li class="dropdown-item listitems">Travelers</li>
                                        <li class="listitems"><a class="dropdown-item menulinks1" href="#"> How it works </a></li>
                                        <li class="listitems"><a class="dropdown-item menulinks1" href="#"> Security center </a></li>
                                        <li class="dropdown-item listitems">Homeowners</li>
                                        <li class="listitems"><a class="dropdown-item menulinks1" href="#"> How it works </a></li>
                                        <li class="listitems"><a class="dropdown-item menulinks1" href="#"> List your property </a></li>
                                        <li class="listitems"><a class="dropdown-item menulinks1" href="#"> Community </a></li>
                                        <li class="listitems"><a class="dropdown-item menulinks1" href="#"> Discovery Hub </a></li>
                                        <li class="dropdown-item listitems">Property managers</li>
                                        <li class="listitems"><a class="dropdown-item menulinks1" href="#"> List your properties </a></li>
                                    </ul>
                                </li> 

                                <li class="items"><button onClick = {this.ListPropertyButton} class="btn listPropBtn"> List your property </button></li>

                                <li class="items"><img src="//csvcus.homeaway.com/rsrcs/cdn-logos/2.10.6/bce/moniker/homeaway_us/birdhouse-bceheader.svg"/></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                </div>

                <div id="mainbody">
                    <div class="container main-content">
                        <br></br>
                        {view}
                    </div>     
                </div>
            </div>
        )
    }
}

export default travelerInbox;