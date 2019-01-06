import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import { Field, reduxForm } from "redux-form";
import axios from 'axios';
import { connect } from "react-redux";
import {Redirect} from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js'
import 'jquery/dist/jquery.min.js'
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/js/bootstrap.js';
// import './travelersignup.css';
import Commonnavbar from '../Commonnavbar';
import { travelerSignupRequest } from "../../actions";

class travelersignup extends Component 
{
    constructor(props){

        super(props);
        this.state = {
            traveleremail : "",
            travelerpassword : "",
            flag : false,
            firstname : "",
            lastname : ""
        }

        // this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
        // this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this);
        // this.traveleremailChangeHandler = this.traveleremailChangeHandler.bind(this);
        // this.travelerpasswdChangeHandler = this.travelerpasswdChangeHandler.bind(this);

        // this.submitLogin = this.submitLogin.bind(this);
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

    renderFieldfirstname(field) {
        const { meta: { touched, error } } = field;
        const className = `form-group ${touched && error ? "has-danger" : ""}`;

        return (
            <div class="form-group">
                <input id="firstname" name="firstname" class="form-control input-lg" tabindex="1" placeholder="First Name" type="text" size="20" autocomplete="on" {...field.input}/>
                <div className="text-danger">
                    {touched ? error : ""}
                </div>
            </div>
        );
    }

    renderFieldlastname(field) {
        const { meta: { touched, error } } = field;
        const className = `form-group ${touched && error ? "has-danger" : ""}`;

        return (
            <div class="form-group">
                <input id="lastname" name="lastname" class="form-control input-lg" tabindex="2" placeholder="Last Name" type="text" size="20" autocomplete="on" {...field.input}/>
                <div className="text-danger">
                    {touched ? error : ""}
                </div>
            </div>
        );
    }

    onSubmit(values) {
        console.log("Values : " + JSON.stringify(values));
        this.props.travelerSignupRequest(values, (response) => {

            console.log("Status Code : ", response.status);
            if (response.status) 
            {
                if (response.status === 200) 
                {
                    console.log("Response.data : " + response.data);
                    this.setState({
                        flag: true
                    })
                    alert("Traveler added successfully");
                    // this.props.history.push("/homepage");
                }
                else
                 {
                    alert("Error, did not receive 200 response status");
                }
            }
            else
            {
                alert("Error inserting data in the database, improper data or duplicate values");
            }

        });
    }

    // firstnameChangeHandler = (e) => {
    //     this.setState({
    //         firstname : e.target.value
    //     })
    // }

    // lastnameChangeHandler = (e) => {
    //     this.setState({
    //         lastname : e.target.value
    //     })
    // }

    // traveleremailChangeHandler = (e) => {
    //     this.setState({
    //         traveleremail : e.target.value
    //     })
    // }

    // travelerpasswdChangeHandler = (e) => {
    //     this.setState({
    //         travelerpassword : e.target.value
    //     })
    // }

    // submitLogin = (e) => {
    //     var headers = new Headers();
    //     e.preventDefault();
    //     if(this.state.firstname == "" || this.state.lastname == "" || this.state.traveleremail == "" || this.state.travelerpassword == "")
    //         alert("None of the fields can be empty");
    //     else{
    //         const data = {
    //             firstname : this.state.firstname,
    //             lastname : this.state.lastname,
    //             email : this.state.traveleremail,
    //             password : this.state.travelerpassword
    //         }

    //         axios.defaults.withCredentials = true;

    //         axios.post('http://localhost:3001/travelersignup',data)
    //             .then(response => {
    //                 console.log("Status Code : ",response.status);
    //                 if(response.status === 200){
    //                     alert("Traveler account created successfully !!");
    //                     this.setState({
    //                         flag : true,
    //                     })
    //                 }
    //                 else{
    //                     this.setState({
    //                         flag : false
    //                     })
    //                 }
    //             })
    //             .catch(err =>{
    //                 alert("Invalid input data !!");
    //             });
    //     }
    // }

    render(){
        require('./travelersignup.css');
        let redirectvar = null;
        if(localStorage.getItem('cookieT')=="traveler"){
            redirectvar = <Redirect to= "/homepage"/>
        }
        if(this.state.flag==true)
            redirectvar = <Redirect to= "/homepage"/>
        const { handleSubmit } = this.props;
        return(
            <div>
                {redirectvar}
                <Commonnavbar/>

                <div id="loginpagebody">
                    <div class="row">

                        <div class = "text-center col-md-12 loginheading">
                            <h1 class="hidden-xs">Sign up for HomeAway as a traveler</h1>
                        </div>

                        <div class="text-center col-md-12">
                            <span>Already have an account? </span>
                            <a href="http://localhost:3000/travelerlogin"> Login in</a>
                        </div>
                        <br/>

                        <div id="formContainer" class="col-md-12 col-md-offset-8 col-sm-6 col-sm-offset-8"><br/>
                            <div class="login-wrapper panel panel-dashboard">
                                <div class="login-form">
                                    <div class="formbodydiv1">
                                    <br/>
                                        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                                            <div class="panel-body">
                                                <div class="form-group clearfix row">
                                                    <div class="col-md-6">
                                                        {/* <input onChange = {this.firstnameChangeHandler} id="firstName" name="firstName" class="form-control input-lg" tabindex="1" placeholder="First Name" type="text" size="20" autocomplete="on"/>     */}
                                                        <Field
                                                            name="firstname"
                                                            component={this.renderFieldfirstname}
                                                        />
                                                    </div>
                                                    <div class="col-md-6">
                                                        {/* <input onChange = {this.lastnameChangeHandler} id="lastName" name="lastName" class="form-control input-lg" tabindex="2" placeholder="Last Name" type="text" size="20" autocomplete="on"/> */}
                                                        <Field
                                                            name="lastname"
                                                            component={this.renderFieldlastname}
                                                        />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    {/* <input onChange = {this.traveleremailChangeHandler} id="signupemail" name="signupemail" class="form-control" placeholder="Email address" type="email" size="20" autocomplete="on"/>   */}
                                                    <Field
                                                        name="email"
                                                        component={this.renderFieldemail}
                                                    />
                                                </div>
                                                <div class="form-group">
                                                    {/* <input onChange = {this.travelerpasswdChangeHandler} id="password" name="password" class="form-control" placeholder="Password" type="password" size="20" autocomplete="off"/> */}
                                                    <Field
                                                        name="password"
                                                        component={this.renderFieldpassword}
                                                    />
                                                </div>
                                                <div class="form-group">
                                                    <a href="#">Forgot password?</a>
                                                </div>
                                                <div class="from-group">
                                                    <input onClick = {this.submitLogin} type="submit" class="btn btn-primary" value="Sign Me Up" id="form-submit" tabindex="4"/>
                                                </div><br/>
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
    if (!values.firstname) {
        errors.firstname = "Enter the firstname";
    }
    if (!values.lastname) {
        errors.lastname = "Enter the lastname";
    }
    return errors;
}

export default reduxForm({
    validate,
    form: "TravelerLoginForm"
})(connect(null, { travelerSignupRequest })(travelersignup));

// export default travelersignup;