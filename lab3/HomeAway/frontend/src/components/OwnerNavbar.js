import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js'
import 'jquery/dist/jquery.min.js'
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/js/bootstrap.js';

class OwnerNavbar extends Component 
{
    constructor(props){
        super(props);
    }

    handleLogout = () => {
        // cookie.remove('cookieO', { path: '/' })
        localStorage.clear();
        sessionStorage.clear();
        // localStorage.removeItem('country');
        // localStorage.removeItem('address');
        // localStorage.removeItem('city');
        // localStorage.removeItem('state');
        // localStorage.removeItem('zipcode');
        // localStorage.removeItem('propertyname');
        // localStorage.removeItem('propertydesc');
        // localStorage.removeItem('propertytype');
        // localStorage.removeItem('bedrooms');
        // localStorage.removeItem('bathrooms');
        // localStorage.removeItem('accomodates');
        // localStorage.removeItem('availableStart');
        // localStorage.removeItem('availableEnd');
        // localStorage.removeItem('pricePerNight');

    }

    render(){
        require('./OwnerNavbar.css');
        return(
            <div>
                <div id="navbardiv">
                <nav class="navbar navbar-default navbar-expand-sm" id="nav">
                        <div class="container-fluid">
                            <div class="navbar-header">
                                    <a href="/listproperty/welcome" class="navbar-brand">
                                        <p class="heading1">HomeAway</p>
                                    </a>
                            </div>

                            <div>
                                <ul class="nav navbar-nav navbar-right" id="ulist">

                                    <li class="dropdown items">
                                        <a href="#" class="dropdown-toggle mainlinks1" data-toggle="dropdown"> My Account <span class="caret"></span></a>
                                        <ul class="dropdown-menu dropdown-menu-right mymenu">
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="#" role="menu">Account Settings</a></li>
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="/listproperty/ownerdashboard" role="menu">Property Details</a></li>
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="/listproperty/OwnerInbox" role="menu">Inbox</a></li>
                                            {/* <li class="listitems"><a class="dropdown-item menulinks1" href="#" role="menu">Logout</a></li> */}
                                            <li class="listitems"><Link to="/homepage" onClick = {this.handleLogout} class="dropdown-item menulinks1" role="menu">Logout</Link></li>
                                        </ul>
                                    </li>

                                    <li class="items"><img src="//csvcus.homeaway.com/rsrcs/cdn-logos/2.10.6/bce/moniker/homeaway_us/birdhouse-bceheader.svg"/></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        )
    }
}

export default OwnerNavbar;