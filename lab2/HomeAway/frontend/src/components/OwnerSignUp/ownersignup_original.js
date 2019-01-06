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
import Commonnavbar from '../Commonnavbar';

class ownersignup extends Component 
{
    constructor(props){
        super(props);

        this.state = {
            owneremail : "",
            ownerpassword : "",
            flag : false,
            firstname : "",
            lastname : ""
        }

        this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
        this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this);
        this.owneremailChangeHandler = this.owneremailChangeHandler.bind(this);
        this.ownerpasswdChangeHandler = this.ownerpasswdChangeHandler.bind(this);

        this.submitLogin = this.submitLogin.bind(this);
    }

    firstnameChangeHandler = (e) => {
        this.setState({
            firstname : e.target.value
        })
    }

    lastnameChangeHandler = (e) => {
        this.setState({
            lastname : e.target.value
        })
    }

    owneremailChangeHandler = (e) => {
        this.setState({
            owneremail : e.target.value
        })
    }

    ownerpasswdChangeHandler = (e) => {
        this.setState({
            ownerpassword : e.target.value
        })
    }

    submitLogin = (e) => {
        var headers = new Headers();
        e.preventDefault();
        if(this.state.firstname == "" || this.state.lastname == "" || this.state.owneremail == "" || this.state.ownerpassword == "")
            alert("None of the fields can be empty");
        else{
            const data = {
                firstname : this.state.firstname,
                lastname : this.state.lastname,
                email : this.state.owneremail,
                password : this.state.ownerpassword
            }

            axios.defaults.withCredentials = true;

            axios.post('http://localhost:3001/ownersignup',data)
                .then(response => {
                    console.log("Status Code : ",response.status);
                    if(response.status === 200){
                        alert("Owner account created successfully !!");
                        this.setState({
                            flag : true,
                        })
                    }
                    else{
                        this.setState({
                            flag : false
                        })
                    }
                })
                .catch(err =>{
                    alert("Invalid input data !!");
                });
        }
    }

    render(){
        
        require('./ownersignup.css');
        let redirectvar = null;
        
        if(cookie.load('cookieO') == "owner"){
            redirectvar = <Redirect to= "/listproperty/welcome"/>
        }
        if(this.state.flag==true)
        redirectvar = <Redirect to= "/homepage"/>
        return(
            <div>
                {redirectvar}
                <Commonnavbar/>

                <div id="loginpagebody">
                    <div class="row">

                        <div class = "text-center col-md-12 loginheading">
                            <h1 class="hidden-xs">Sign up for HomeAway as an owner</h1>
                        </div>

                        <div class="text-center col-md-12">
                            <span>Already have an account? </span>
                            <a href="http://localhost:3000/ownerlogin"> Login in</a>
                        </div>
                        <br/>

                        <div id="formContainer" class="col-md-12 col-md-offset-8 col-sm-6 col-sm-offset-8"><br/>
                            <div class="login-wrapper panel panel-dashboard">
                                <div class="login-form">
                                    <div class="formbodydiv1">
                                    <br/>
                                        <div class="panel-body">
                                            <div class="form-group clearfix row">
                                                <div class="col-md-6">
                                                    <input onChange = {this.firstnameChangeHandler} id="firstName" name="firstName" class="form-control input-lg" tabindex="1" placeholder="First Name" type="text" size="20" autocomplete="on"/>    
                                                </div>
                                                <div class="col-md-6">
                                                    <input onChange = {this.lastnameChangeHandler} id="lastName" name="lastName" class="form-control input-lg" tabindex="2" placeholder="Last Name" type="text" size="20" autocomplete="on"/>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <input onChange = {this.owneremailChangeHandler} id="signupemail" name="signupemail" class="form-control" placeholder="Email address" type="email" size="20" autocomplete="on"/>  
                                            </div>
                                            <div class="form-group">
                                                <input onChange = {this.ownerpasswdChangeHandler} id="password" name="password" class="form-control" placeholder="Password" type="password" size="20" autocomplete="off"/>
                                            </div>
                                            <div class="form-group">
                                                <a href="#">Forgot password?</a>
                                            </div>
                                            <div class="from-group">
                                                <input onClick = {this.submitLogin} type="submit" class="btn btn-primary" value="Sign Me Up" id="form-submit" tabindex="4"/>
                                            </div><br/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}

export default ownersignup;