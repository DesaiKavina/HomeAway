import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Redirect } from 'react-router';
import { createStore, applyMiddleware, compose } from "redux";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js'
import 'jquery/dist/jquery.min.js'
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/js/bootstrap.js';
import Commonnavbar from '../Commonnavbar';
import Homepage from '../HomePage/Homepage';
import { travelerLoginRequest } from "../../actions";
import reducers from '../../reducers/index';
// const store = createStore(reducers);

class travelerlogin extends Component {
    constructor(props){

        super(props);

        this.state = {
            name : ""
        }

    }

        // this.state = {
        //     email : "",
        //     password : "",
        //     flag : false,
        //     username : ''
        // }

    //     this.emailChangeHandler = this.emailChangeHandler.bind(this);
    //     this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    //     this.submitLogin = this.submitLogin.bind(this);
    // }

    renderFieldemail(field) {
        const { meta: { touched, error } } = field;
        const className = `form-group ${touched && error ? "has-danger" : ""}`;

        return (

            <div class="form-group">
                <input id="email" name="email" class="form-control" placeholder="Email address" type="email" size="20" autocomplete="on" autofocus {...field.input} />
                <div className="text-danger">
                    {touched ? error : ""}
                </div>
            </div>
        );
    }

    renderFieldpassword(field) {
        const { meta: { touched, error } } = field;
        const className = `form-group ${touched && error ? "has-danger" : ""}`;

        return (

            <div class="form-group">
                <input id="password" name="password" class="form-control" placeholder="Password" type="password" size="20" autocomplete="off" {...field.input} />
                <div className="text-danger">
                    {touched ? error : ""}
                </div>
            </div>
        );
    }

    onSubmit(values) {
        console.log("Values : " + JSON.stringify(values));
        this.props.travelerLoginRequest(values, (response) => {

            console.log("Status Code : ", response.status);
            if (response.status) 
            {
                if (response.status === 200) 
                {
                    console.log("Response.data : " + JSON.stringify(response.data));
                    var username = response.data.firstname;
                    console.log("The set username : " + username);
                    sessionStorage.setItem('SessionEmail', response.data.email);
                    sessionStorage.setItem('SessionUsername', username);
                    console.log("\nPrinting the token : "+response.data.token);
                    localStorage.setItem('TravelerToken', response.data.token);
                    localStorage.setItem('cookieT','traveler');
                    this.props.history.push("/homepage");

                }
                else
                 {
                    alert("Invalid login credentials");
                }
            }
            else
            {
                alert("Invalid login credentials");
            }
        });
    }

    // emailChangeHandler = (e) => {
    //     this.setState({
    //         email : e.target.value
    //     })
    // }

    // passwordChangeHandler = (e) => {
    //     this.setState({
    //         password : e.target.value
    //     })
    // }

    // submitLogin = (e) => {
    //     var headers = new Headers();
    //     e.preventDefault();
    //     if(this.state.email==""){
    //         alert("Email address field cannot be empty");
    //         if(this.state.password=="")
    //             alert("The password field cannot be empty");
    //     }
    //     else if(this.state.password==""){
    //         alert("The password field cannot be empty");
    //     }
    //     else{
    //         const data = {
    //             email : this.state.email,
    //             password : this.state.password
    //         }

    //         //axios.defaults.withCredentials = true;

    //         axios.post('http://localhost:3001/travelerlogin',data, {withCredentials:true})
    //             .then(response => {
    //                 console.log("Status Code : ",response.status);
    //                 if(response.status === 200){
    //                     console.log("Response.data : "+response.data);
    //                     this.setState({
    //                         flag : true,
    //                         username : response.data
    //                     })
    //                     sessionStorage.setItem('SessionEmail', this.state.email);
    //                     sessionStorage.setItem('SessionUsername', this.state.username);
    //                 }
    //                 else{
    //                     this.setState({
    //                         flag : false
    //                     })
    //                 }
    //             })
    //             .catch(err =>{
    //                 alert("Invalid credentials !!");
    //             });
    //     }
    // }

    render() {
        require('./travelerlogin.css');
        let redirectvar = null;
        if ((localStorage.getItem('cookieT')=="traveler") && this.state.flag == true) {
            redirectvar = <Redirect to="/homepage" />
        }
        const { handleSubmit } = this.props;
        return (
            <div>
                {redirectvar}

                <Commonnavbar />

                <div id="loginpagebody">
                    <div class="row">

                        <div class="text-center col-md-12 loginheading">
                            <h1 class="hidden-xs">Log in to HomeAway</h1>
                        </div>

                        <div class="text-center col-md-12">
                            <span>Need an account? </span>
                            <a href="http://localhost:3000/travelersignup"> Sign Up</a>
                        </div>
                        <br />

                        <div id="formContainer" class="col-md-12 col-md-offset-8 col-sm-6 col-sm-offset-8"><br />
                            <div class="login-wrapper panel panel-dashboard">
                                <div class="login-form">
                                    <div class="formbodydiv">
                                        <div class="panel-heading">
                                            <p class="panel-title">Account login</p><hr />
                                        </div>
                                        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                                            <div class="panel-body">
                                                <div class="form-group">
                                                    {/* <input onChange = {this.emailChangeHandler} id="loginemail" name="loginemail" class="form-control" placeholder="Email address" type="email" size="20" autocomplete="on" autofocus/>   */}
                                                    <Field
                                                        name="email"
                                                        component={this.renderFieldemail}
                                                    />
                                                </div>
                                                <div class="form-group">
                                                    {/* <input onChange = {this.passwordChangeHandler} id="password" name="password" class="form-control" placeholder="Password" type="password" size="20" autocomplete="off"/> */}
                                                    <Field
                                                        name="password"
                                                        component={this.renderFieldpassword}
                                                    />
                                                </div>
                                                <div class="form-group">
                                                    <a href="#">Forgot password?</a>
                                                </div>
                                                <div class="from-group">
                                                    <input onClick={this.submitLogin} type="submit" class="btn btn-primary" value="Log In" id="form-submit" tabindex="4" />
                                                </div><br />
                                                <div>
                                                    <input id="rememberMe" name="rememberMe" tabindex="3" checked="true" type="checkbox" value="true" />
                                                    <input type="hidden" name="_rememberMe" value="on" />
                                                    Keep me signed in
                                                </div>
                                            </div>
                                        </form>
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

function validate(values) {

    const errors = {};

    if (!values.email) {
        errors.email = "Enter the email ID";
    }
    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!re.test(values.email))
        errors.email = "Not a valid email address";
    if (!values.password) {
        errors.password = "Enter the password";
    }
    return errors;
}

// export default travelerlogin;


export default reduxForm({
    validate,
    form: "TravelerLoginForm"
})(connect(null, { travelerLoginRequest })(travelerlogin));