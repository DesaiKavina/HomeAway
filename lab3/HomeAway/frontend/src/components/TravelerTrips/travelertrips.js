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
import {ROOT_URL} from '../Root_url';
import {graphql, compose} from 'react-apollo'
import {travelerTripsQuery} from '../../queries/queries'
import {withApollo} from 'react-apollo'
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
            traveler_token : '',
            setEmail : ''
        }

        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount(){

        // var token = localStorage.getItem('TravelerToken');
        var emailT = localStorage.getItem('setEmailId');

        console.log("The set email id here is  : "+emailT)
        this.setState({
            // traveler_token : token,
            setEmail : emailT
        })

        this.props.client.query({
            query : travelerTripsQuery,
            variables : {
                email : emailT,
            }
        }).then(response => {
            console.log("\nThe response obtained after success in getting traveler trips details : ");
            console.log(JSON.stringify(response.data.travelerTrips.bookedPropertyDetails));
            this.setState({
                information : response.data.travelerTrips.bookedPropertyDetails
            })
        }).catch(error => {
            console.log("Some error occured : \n"+error);
            alert("Error in fetching traveler trips details");
        })

        // axios.defaults.withCredentials = true;
        
        // axios.get(`${ROOT_URL}/travelertrips/`+emailT, {headers: {Authorization : token}})
        //         .then((response) => {
        //             console.log("Printing the response data : ");
        //             console.log(response.data);
        //             this.setState({
        //                 information: response.data
        //             })
        //         })
        }

    handleLogout = () => {
        // cookie.remove('cookieT', { path: '/' })
        sessionStorage.removeItem('SessionEmail');
        sessionStorage.removeItem('SessionUsername');
        sessionStorage.clear();
        localStorage.clear();
        // window.location.reload();
    }

    render(){
        require('./travelertrips.css');
        let redirectvar = null;
        if(localStorage.getItem('cookieT')!="traveler"){
            redirectvar = <Redirect to= "/homepage"/>
        }

        let view = null;
        if(this.state.information.length>0){
            view = this.state.information.map(property => {
                return(
                    <div>
                    <div class="property_detials">
                        <h3>{property.pName}</h3>
                        <p>{property.pAddress}, {property.pCity}, {property.pState}, {property.pZipcode}, {property.pCountry}</p>
                        <p>{property.pType} - Bedrooms : {property.pBedrooms}, Bathrooms : {property.pBathrooms}</p>
                        <p>You booked this property from <b>{property.blockStartDate}</b> to <b>{property.blockEndDate}</b></p>
                        <p>You requested a booking for {property.guests} guests</p>
                        <p>You paid $ <b>{property.pPricePerNight}</b> per night </p>
                        <p>Property owner : {property.pOwner}</p>
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
                                <a href="/homepage" class="navbar-brand">
                                    <p class="heading1">HomeAway</p>
                                </a>
                        </div>

                        <div>
                            <ul class="nav navbar-nav navbar-right" id="ulist">
                                <li class="items"><a href="#" class="nav-item mainlinks1"> TripBoards </a></li>

                                <li class="dropdown items">
                                    <a href="#" class="dropdown-toggle mainlinks1" data-toggle="dropdown"> {localStorage.getItem('setFirstname')} <span class="caret"></span></a>
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
                    <h2 class="header1">My trips</h2><hr></hr>
                        <br></br>
                        {view}
                    </div>     
                </div>
        </div>
        )
    }
}

export default withApollo(travelertrips);