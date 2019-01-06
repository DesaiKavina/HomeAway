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

class Details extends Component
{
    constructor(props){
        super(props);
        this.state = {
            saveflag : false,
            backflag : false,
            propertyname : "",
            propertydesc : "",
            propertytype : "",
            bedrooms : "",
            bathrooms : "",
            accomodates : "",
            placename : "Headline",
            placedesc : "Property Description",
            placetype : "Property Type (house, cottage, farmhouse, condo etc.)",
            placebedrooms : "Bedrooms",
            placebathrooms : "Bathrooms",
            placeaccomodates : "Accomodates"
        }

        this.ChangeHandler = this.ChangeHandler.bind(this);
        this.SaveButton = this.SaveButton.bind(this);
        this.BackButton = this.BackButton.bind(this);
    }

    componentDidMount(){
        this.setState({
            propertyname : localStorage.getItem('propertyname'),
            propertydesc : localStorage.getItem('propertydesc'),
            propertytype : localStorage.getItem('propertytype'),
            bedrooms : localStorage.getItem('bedrooms'),
            bathrooms : localStorage.getItem('bathrooms'),
            accomodates : localStorage.getItem('accomodates'),
        })
    }

    ChangeHandler(e) {
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
      }

    SaveButton = (e) => {

        if(this.state.propertyname!="" && this.state.propertydesc!="" && this.state.propertytype!="" && this.state.bathrooms!="" && this.state.bedrooms!="" && this.state.accomodates!="" && this.state.propertyname!=null && this.state.propertydesc!=null && this.state.propertytype!=null && this.state.bathrooms!=null && this.state.bedrooms!=null && this.state.accomodates!=null)
        {
            console.log("______________________ Inside if ___________________")
            localStorage.setItem('propertyname', this.state.propertyname);
            localStorage.setItem('propertydesc', this.state.propertydesc);
            localStorage.setItem('propertytype', this.state.propertytype);
            localStorage.setItem('bedrooms', this.state.bedrooms);
            localStorage.setItem('bathrooms', this.state.bathrooms);
            localStorage.setItem('accomodates', this.state.accomodates);
            this.setState({
                saveflag : true,
            })
        }
        else{
            this.setState({
                saveflag : false,
            })
        }

        // this.setState({
        //     saveflag : true,
        // })
    }

    BackButton = (e) => {
        this.setState({
            backflag : true
        })
    }

    render(){
        require('./details.css');
        let redirectvar = null;
        let errormessage = null;
        // if(this.state.saveflag) 
        // {
        //     if(this.state.propertyname=="" || this.state.propertydesc=="" || this.state.propertytype=="" || this.state.bathrooms=="" || this.state.bedrooms=="" || this.state.accomodates=="" || this.state.propertyname==null || this.state.propertydesc==null || this.state.propertytype==null || this.state.bathrooms==null || this.state.bedrooms==null || this.state.accomodates==null)
        //     {
        //             errormessage = (
        //                 <div class="alert alert-danger">
        //                     None of the field should be empty !!!
        //                 </div>
        //             )
        //     }
        //     else {
        //         redirectvar = <Redirect to= "/listproperty/photos"/>
        //     }
        // }
        // if(this.state.saveflag){
        //     redirectvar = <Redirect to= "/listproperty/photos"/>
        // }
        if(this.state.propertyname=="" || this.state.propertydesc=="" || this.state.propertytype=="" || this.state.bathrooms=="" || this.state.bedrooms=="" || this.state.accomodates=="" || this.state.propertyname==null || this.state.propertydesc==null || this.state.propertytype==null || this.state.bathrooms==null || this.state.bedrooms==null || this.state.accomodates==null)
        {
                errormessage = (
                    <div class="alert alert-danger">
                        None of the field should be empty !!!
                    </div>
                )
        }
        if(this.state.saveflag){
            redirectvar = <Redirect to= "/listproperty/photos"/>
        }
        if(this.state.backflag){
            redirectvar = <Redirect to= "/listproperty/location"/>
        }
        if(localStorage.getItem('cookieO')!="owner"){
            redirectvar = <Redirect to= "/homepage"/>
        }
        return(
            <div>
                {redirectvar}
                <div id="mainbody" class="row">

                    <SideNavbar/>

                    <div class="col-md-8 col-xs-8 rightsidecontent">
                        <div class="container">
                                <div class="formbody">
                                    <br/>
                                    <h5 class="heading4">Describe your property</h5><hr/>
                                    <p class="text">
                                        Start out with a descriptive headline and a detailed summary of your property.
                                    </p>
                                    {errormessage}
                                    <div class="form-group">
                                        <input onChange = {this.ChangeHandler} id="propertyname" name="propertyname" class="form-control" type="text" size="50" placeholder={this.state.placename} defaultValue={localStorage.getItem('propertyname')}/>
                                    </div>
                                    <div class="form-group">
                                        <textarea onChange = {this.ChangeHandler} class="form-control" rows="8" cols="50" name="propertydesc" id="propertydesc" placeholder={this.state.placedesc} defaultValue={localStorage.getItem('propertydesc')}/>
                                    </div>
                                    <div class="form-group">
                                        <input onChange = {this.ChangeHandler} id="propertytype" name="propertytype" class="form-control" type="text" size="50" placeholder={this.state.placetype} defaultValue={localStorage.getItem('propertytype')}/>
                                    </div>
                                    <div class="form-group">
                                        <input onChange = {this.ChangeHandler} id="bedrooms" name="bedrooms" class="form-control" type="number" min="1" max="50" placeholder={this.state.placebedrooms} defaultValue={localStorage.getItem('bedrooms')}/>
                                    </div>
                                    <div class="form-group">
                                        <input onChange = {this.ChangeHandler} id="bathrooms" name="bathrooms" class="form-control" type="number" min="1" max="50" placeholder={this.state.placebathrooms} defaultValue={localStorage.getItem('bathrooms')}/>
                                    </div>
                                    <div class="form-group">
                                        <input onChange = {this.ChangeHandler} id="accomodates" name="accomodates" class="form-control" type="number" min="1" max="100" placeholder={this.state.placeaccomodates} defaultValue={localStorage.getItem('accomodates')}/>
                                    </div>
                                    <br/>
                                    <center>
                                        <button class="btn btn-primary save-button" onClick={this.BackButton}>
                                            <span>Back</span>
                                        </button>
                                        <button class="btn btn-primary save-button" onClick={this.SaveButton}>
                                            <span>Save</span>
                                        </button>
                                    </center>
                                    <br/>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Details;