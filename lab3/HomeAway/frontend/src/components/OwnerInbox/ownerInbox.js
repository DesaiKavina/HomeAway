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


class ownerInbox extends Component
{
    constructor(props){
        super(props);
        this.state = {
            information : [],
            owner_token : '',
            setEmail : '', 
            reply : '', 
            goBackflag : false
        }
        
        this.ReplyQuestion = this.ReplyQuestion.bind(this);
        this.ChangeHandler = this.ChangeHandler.bind(this);
    }

    componentDidMount(){

        var token = localStorage.getItem('OwnerToken');
        var emailO = sessionStorage.getItem('SessionEmail');
        this.setState({
            owner_token : token,
            setEmail : emailO
        })

        axios.defaults.withCredentials = true;
        
        axios.get(`${ROOT_URL}/ownerInbox/`+emailO, {headers: {Authorization : token}})
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

    ChangeHandler(e) {
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    ReplyQuestion(question, askedby, name){
        console.log("Reply button pressed");
        const data = {
            TravelerQuestion : question,
            askedBy : askedby,
            OwnerAnswer : this.state.reply,
            answeredBy : this.state.setEmail,
            propertyName : name
        }
        // console.log(data);
        axios.defaults.withCredentials = true;
        
        axios.post(`${ROOT_URL}/replyToTraveler/`+this.state.setEmail,data, {headers: {Authorization : this.state.owner_token}})
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.setState({
                        goBackflag : true,
                    })
                    alert("Your reply to the traveler has been successfully posted");
                }
                else{
                    this.setState({
                        goBackflag : false
                    })
                    alert("Sorry, your reply could not be posted to the traveler");
                }
            })
            .catch(err =>{
                alert("Cannot reply to the question due to some error");
            });
    }

    render(){
        require('./ownerInbox.css');

        let redirectvar = null;
        if(localStorage.getItem('cookieO')!="owner"){
            redirectvar = <Redirect to= "/homepage"/>
        }

        let view = null;
        let ansmessage = null;
        if(this.state.information.length>0)
        {
            view = this.state.information.map(message => {

                if(message.OwnerAnswer=="")
                {
                    ansmessage = (
                        <p class="not-answered">You have not answered this question yet</p>
                    )
                }
                else{
                    ansmessage = (
                        <p>You replied : {message.OwnerAnswer}</p>
                    )
                }

                
                return(
                    <div>
                    <div class="message_detials">
                        <h4>This question is pertaining to your property : <b>{message.propertyName}</b></h4>
                        <p><b>Question : </b>{message.TravelerQuestion}</p>
                        <p>This question was asked by the traveler : {message.askedBy}</p>
                        {ansmessage}
                        
                        <div class="form-group mytextarea">
                            <textarea onChange = {this.ChangeHandler} class="form-control" rows="4" cols="20" name="reply" id="reply" placeholder="Enter your reply here"/>
                        </div>
                        
                        {/* <button onClick = {this.AnswerQuestion} class="btn btn-primary myreplybutton" type="submit">Reply to the Question</button> */}

                        <button class="btn btn-primary" onClick = {() => {this.ReplyQuestion(message.TravelerQuestion,message.askedBy,message.propertyName)}} name="ReplyButton" value={message.propertyName}>
                            Reply to the question
                        </button>

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

export default ownerInbox;