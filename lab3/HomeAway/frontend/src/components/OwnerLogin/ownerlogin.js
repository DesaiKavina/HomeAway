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
// import './ownerlogin.css';
import {ownerLoginRequest} from "../../actions";
import reducers from '../../reducers/index';
import {loginQuery} from '../../queries/queries'
import {withApollo} from 'react-apollo'

class ownerlogin extends Component 
{
    constructor(props){
        super(props);
        this.state = {
            email : "",
            password : "",
            flag : false,
            userFlag : ''
        }
    }

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

        this.props.client.query({
            query : loginQuery,
            variables : {
                email : values.email,
                password : values.password
            }
        }).then(response => {
            console.log("\nThe response obtained after success in owner login is : ");
            console.log(JSON.stringify(response.data));
            if(response.data.loginUser.email === null ){
                this.setState({
                    flag: false
                })
                alert('Invalid credentials');
            }
            else{
                console.log("Success in owner login");
                this.setState({
                    flag: true
                })
                alert("Successful login");
                localStorage.setItem('cookieO', "owner");
                localStorage.setItem('setEmailId', response.data.loginUser.email);
                localStorage.setItem('setFirstname', response.data.loginUser.firstname);
                localStorage.setItem('setLastname', response.data.loginUser.lastname);
            }
        }).catch(error => {
            console.log("Some error occured : "+error);
            this.setState({
                flag: false
            })
            alert("Invalid credentials");
        })

        // this.props.ownerLoginRequest(values, (response) => {
        //     console.log("Status Code : ", response.status);
        //     if (response.status) 
        //     {
        //         if (response.status === 200) 
        //         {
        //             console.log("Response.data : " + response.data);
        //             var username = response.data.firstname;
        //             console.log("The set owner's username : " + username);
        //             this.setState({
        //                 flag : true,
        //             })
        //             sessionStorage.setItem('SessionEmail', response.data.email);
        //             sessionStorage.setItem('SessionUsername', username);
        //             localStorage.setItem('OwnerToken', response.data.token);
        //             console.log("Printing the token : \n"+response.data.token);
        //             localStorage.setItem('cookieO', 'owner');
        //             // this.props.history.push("/homepage");
        //         }
        //         else
        //          {
        //             alert("Invalid credentials");
        //         }
        //     }
        //     else
        //     {
        //         alert("Invalid credentials");
        //     }
        // });
    }

    render(){

        let redirectvar = null;
        if(localStorage.getItem('cookieO')=="owner" && this.state.flag==true){
            redirectvar = <Redirect to= "/listproperty/welcome"/>
        }
        require('./ownerlogin.css');
        const { handleSubmit } = this.props;

        return(
            <div>
                {redirectvar}
                <Commonnavbar/>

                <div id="loginpagebody">
                    <div class="row">

                        <div class="col-md-6 col-sm-6 hidden-xs personyzeContent">
                        </div>

                        <div id="formContainer" class="col-md-6"><br/>
                            <div class="login-wrapper panel panel-dashboard">
                                <div class="login-form">
                                    <div class="formbodydiv1">
                                        <div class="panel-heading">
                                            <p class="panel-title">Owner login</p>
                                        </div>
                                        <div>
                                            <span>Need an account? </span>
                                            <a href="http://localhost:3000/ownersignup"> Sign Up</a>
                                        </div><hr/>
                                        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                                            <div class="panel-body">
                                                <div class="form-group">
                                                    {/* <input onChange={this.emailChangeHandler} id="loginemail" name="loginemail" class="form-control" placeholder="Email address" type="email"size="20" autocomplete="on" autofocus/>   */}
                                                    <Field
                                                        name="email"
                                                        component={this.renderFieldemail}
                                                    />
                                                </div>
                                                <div class="form-group">
                                                    {/* <input  onChange={this.passwordChangeHandler} id="password" name="password" class="form-control" placeholder="Password" type="password" size="20" autocomplete="off"/> */}
                                                    <Field
                                                        name="password"
                                                        component={this.renderFieldpassword}
                                                    />
                                                </div>
                                                <div class="form-group">
                                                    <a href="#">Forgot password?</a>
                                                </div>
                                                <div class="from-group">
                                                    <input onClick = {this.submitLogin} type="submit" class="btn btn-primary" value="Log In" id="form-submit" tabindex="4"/>
                                                </div><br/>
                                                <div>
                                                    <input id="rememberMe" name="rememberMe" tabindex="3" checked="true" type="checkbox" value="true"/>
                                                    <input type="hidden" name="_rememberMe" value="on"/>
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

// export default ownerlogin;

// export default reduxForm({
//     validate,
//     form: "OwnerLoginForm"
// })(connect(null, { ownerLoginRequest })(ownerlogin));

export default withApollo(reduxForm({
    validate,
    form: "OwnerLoginForm"
})(connect(null, { ownerLoginRequest })(ownerlogin)));