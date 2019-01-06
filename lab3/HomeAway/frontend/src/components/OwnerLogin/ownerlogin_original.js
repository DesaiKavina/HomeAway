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
import {loginQuery} from '../../queries/queries'
import {withApollo} from 'react-apollo'

// import './ownerlogin.css';


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

        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);

    }

    emailChangeHandler = (e) => {
        this.setState({
            email : e.target.value
        })
    }

    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
    }

    submitLogin = (e) => {
        var headers = new Headers();
        e.preventDefault();
        if(this.state.email==""){
            alert("Email address field cannot be empty");
            if(this.state.password=="")
                alert("The password field cannot be empty");
        }
        else if(this.state.password==""){
            alert("The password field cannot be empty");
        }
        else{

            this.props.client.query({
                query : loginQuery,
                variables : {
                    email : this.state.email,
                    password : this.state.password
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

            // const data = {
            //     email : this.state.email,
            //     password : this.state.password
            // }

            // axios.defaults.withCredentials = true;

            // axios.post('http://localhost:3001/ownerlogin',data)
            //     .then(response => {
            //         console.log("Status Code : ",response.status);
            //         if(response.status === 200){
            //             this.setState({
            //                 flag : true,
            //             })
            //         }
            //         else{
            //             this.setState({
            //                 flag : false
            //             })
            //         }
            //     })
            //     .catch(err =>{
            //         alert("Invalid credentials !!");
            //     });
        }
    }

    render(){

        let redirectvar = null;
        if(localStorage.getItem('cookieO') && this.state.flag==true){
            redirectvar = <Redirect to= "/listproperty/welcome"/>
        }
        require('./ownerlogin.css');
        return(
            <div>
                {redirectvar}
                <Commonnavbar/>

                <div id="loginpagebody">
                    <div class="row">

                        <div class="col-md-6 col-sm-6 hidden-xs personyzeContent">
                            {/* <a id="personyzeContent"></a> */}
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
                                        <div class="panel-body">
                                            <div class="form-group">
                                                <input onChange={this.emailChangeHandler} id="loginemail" name="loginemail" class="form-control" placeholder="Email address" type="email"size="20" autocomplete="on" autofocus/>  
                                            </div>
                                            <div class="form-group">
                                                <input  onChange={this.passwordChangeHandler} id="password" name="password" class="form-control" placeholder="Password" type="password" size="20" autocomplete="off"/>
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

// export default ownerlogin;

export default withApollo(ownerlogin)