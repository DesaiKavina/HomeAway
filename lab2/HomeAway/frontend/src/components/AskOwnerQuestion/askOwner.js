import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import { connect } from "react-redux";
import axios from 'axios';
import 'jquery/dist/jquery.js'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/js/bootstrap.js';
import {ROOT_URL} from '../Root_url';

class askOwner extends Component 
{
    constructor(props){
        super(props);
        this.state={
            setUsername : sessionStorage.getItem('SessionUsername'),
            setPropertyname : localStorage.getItem('AskQuestionProperty'),
            goBackflag : false,
            question : '',
            email : ''
        }

        this.handleLogout = this.handleLogout.bind(this);
        this.ChangeHandler = this.ChangeHandler.bind(this);
        this.AskQuestion = this.AskQuestion.bind(this);
    }

    handleLogout = () => {
        cookie.remove('cookieT', { path: '/' })
        sessionStorage.removeItem('SessionEmail');
        sessionStorage.removeItem('SessionUsername');
        localStorage.clear();
        sessionStorage.clear();
    }

    ChangeHandler(e) {
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    AskQuestion() {
        // console.log(e);
        console.log("Ask question button pressed");

        var token = localStorage.getItem('TravelerToken');
        var emailT = sessionStorage.getItem('SessionEmail');
        var setPropertyName = localStorage.getItem('AskQuestionPropertyName');
        var askQuestionToOwner = localStorage.getItem('AskQuestionPropertyOwner');

        const data = {
            askedBy : emailT,
            TravelerQuestion : this.state.question,
            PropertyName : setPropertyName, 
            propertyOwner : askQuestionToOwner
        }

        axios.defaults.withCredentials = true;
        axios.post(`${ROOT_URL}/searchresult/askOwnerQuestion/`+emailT,data, {headers: {Authorization : token}})
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.setState({
                        goBackflag : true,
                    })
                    alert("Your question has been posted to the owner!");
                }
                else{
                    this.setState({
                        goBackflag : false
                    })
                    alert("Sorry, your question could not be posted to the owner");
                }
            })
            .catch(err =>{
                alert("Cannot ask question to the owner due to some error");
            });
    }


    render(){

        require('./askOwner.css');
        let redirectvar = null;
        if( localStorage.getItem('cookieT')!="traveler" ){
            redirectvar = <Redirect to= "/homepage"/>
        }
        if( (localStorage.getItem('cookieT')=="traveler") && this.state.goBackflag){
            redirectvar = <Redirect to= "/homepage"/>
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
                                    <li class="items"><a href="#" class="nav-item mainlink1"> TripBoards </a></li>

                                    <li class="dropdown items">
                                        <a href="#" class="dropdown-toggle mainlink1" data-toggle="dropdown"> {this.state.setUsername} <span class="caret"></span></a>
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
                                        <a href="#" class="dropdown-toggle mainlink1" data-toggle="dropdown"> Help <span class="caret"></span></a>
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

                                    <li class="items"><button class="btn listPropBtn"> List your property </button></li>

                                    <li class="items"><img src="//csvcus.homeaway.com/rsrcs/cdn-logos/2.10.6/bce/moniker/homeaway_us/birdhouse-bceheader.svg"/></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
                
                <div class="mainbody">
                    <br/>

                    <div class="text-center askquestioninfo">
                        <div class="text-center infoform"> 
                            <h3>Ask a question to the owner</h3>
                        </div>
                        {/* <br></br>
                        <div class="form-group mygroup">
                            <input onChange = {this.ChangeHandler} id="email" name="email" class="form-control" type="text" size="20" placeholder="Enter your email id here"/>
                        </div> */}
                        <br></br>
                        <div class="form-group mygroup">
                            <textarea onChange = {this.ChangeHandler} class="form-control" rows="4" cols="40" name="question" id="question" placeholder="Enter your question here"/>
                        </div>
                        <br></br>
                        <button onClick = {this.AskQuestion} class="btn btn-primary myaskbutton" type="submit">Ask Question</button>
                    </div>

                </div>

            </div>
        )
    }
}

export default askOwner