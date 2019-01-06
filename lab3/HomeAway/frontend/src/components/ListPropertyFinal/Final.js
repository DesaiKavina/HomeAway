import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import axioa from 'axios';
import {Redirect} from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js'
import 'jquery/dist/jquery.min.js'
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/js/bootstrap.js';
import SideNavbar from '../SideNavbar';
import Location from '../ListPropertyLocation/Location';

class Final extends Component
{
    constructor(props){
        super(props);
        this.state = {
            submitflag : false,
            backflag : false,
            childsState : null,
            locationPageState : null
        }

        this.getChildState = this.getChildState.bind(this);
    }

    getChildState(childrenName, childrenState){
        // this.setState({childrenName: childrenState}); 
        this.setState({[childrenName]: childrenState});
        console.log(this.state.childsState);
        console.log(this.state.locationPageState);
    }

    render(){
        require('./Final.css');
        return(
            <div>
                <Location getChildState={this.getChildState}/>
            </div>
        )
    }
}

export default Final;