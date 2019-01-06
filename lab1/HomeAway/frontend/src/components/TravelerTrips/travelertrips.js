import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import axios from 'axios';
import {Redirect} from 'react-router';
import 'jquery/dist/jquery.js'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/js/bootstrap.js';
// import '../../App.css';

class travelertrips extends Component 
{
    constructor(props){
        super(props);
        this.state={
            flag : false,
            setUsername : sessionStorage.getItem('SessionUsername'),
            information : [], 
            imageinfo : [],
            imageView : '',
            encodedImage : [],
            image_number : [],
        }

        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount(){

        axios.defaults.withCredentials = true;
        axios.get('http://localhost:3001/travelertrips')
                .then((response) => {
                    console.log("Printing the response data : ");
                    console.log(response.data);
                    this.setState({
                        information: response.data
                    })
                })
        }

    handleLogout = () => {
        cookie.remove('cookieT', { path: '/' })
        sessionStorage.removeItem('SessionEmail');
        sessionStorage.removeItem('SessionUsername');
        // window.location.reload();
    }

    render(){
        require('./travelertrips.css');
        let redirectvar = null;
        if(cookie.load('cookieT')!="traveler"){
            redirectvar = <Redirect to= "/homepage"/>
        }

        let view = null;
        if(this.state.information.length>0){
            view = this.state.information.map(property => {
                return(
                    <div>
                    <div class="property_detials">
                        <h3>{property.propertyName}</h3>
                        <p>{property.address}, {property.city}, {property.state}, {property.zipcode}, {property.country}</p>
                        <p>{property.propertyType} - Bedrooms : {property.bedrooms}, Bathrooms : {property.bathrooms}</p>
                        <p>You booked this property from <b>{property.blockStart}</b> to <b>{property.blockEnd}</b></p>
                        <p>You paid $ <b>{property.pricePerNight}</b> per night </p>
                        <p>Property owner : {property.ownerEmail}</p>
                    </div>
                    <hr></hr>
                    </div>
                )
            })
        }
        else{
            view = (
                <div class="property_detials">
                    <h3>No property booked</h3>
                    <h3>No trips scheduled yet</h3>
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
                                <a href="http://localhost:3000/homepage" class="navbar-brand">
                                    <p class="heading1">HomeAway</p>
                                </a>
                        </div>

                        <div>
                            <ul class="nav navbar-nav navbar-right" id="ulist">
                                <li class="items"><a href="#" class="nav-item mainlinks1"> TripBoards </a></li>

                                <li class="dropdown items">
                                    <a href="#" class="dropdown-toggle mainlinks1" data-toggle="dropdown"> {this.state.setUsername} <span class="caret"></span></a>
                                    <ul class="dropdown-menu dropdown-menu-right mymenu">
                                        <li class="listitems"><a class="dropdown-item menulinks1" href="#" role="menu">Inbox</a></li>
                                        <li class="listitems"><a class="dropdown-item menulinks1" href="http://localhost:3000/travelertrips" role="menu">My trips</a></li>
                                        <li class="listitems"><a class="dropdown-item menulinks1" href="http://localhost:3000/travelerprofile" role="menu">My profile</a></li>
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
                    <h2 class="header1">My trips</h2><hr></hr>
                        <br></br>
                        {view}
                    </div>     
                </div>
        </div>
        )
    }
}

export default travelertrips;