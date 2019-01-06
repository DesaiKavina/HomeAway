import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import axios from 'axios';
import 'jquery/dist/jquery.js'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/js/bootstrap.js';

class travelerprofile extends Component 
{
    constructor(props){
        super(props);
        this.state={
            flag : false,
            setUsername : sessionStorage.getItem('SessionUsername'),
            fileupload : "https://odis.homeaway.com/mda01/7f257b13-2434-404e-b967-285a6b7eca02.2.2",
            userFlag : '',
            firstname : "",
            lastname : "",
            aboutme : "",
            city : "",
            country : "",
            company : "",
            school : "",
            hometown : "",
            languages : "",
            gender : "",
            contact : "",
            setEmail : "",
            ImageFile : '',
            ImageView : "https://odis.homeaway.com/mda01/7f257b13-2434-404e-b967-285a6b7eca02.2.2",
            selectedFile : ''
        }
        
        this.fileChangeHandler = this.fileChangeHandler.bind(this)
        this.handleLogout = this.handleLogout.bind(this);
        this.ChangeHandler = this.ChangeHandler.bind(this);
        this.SaveChanges = this.SaveChanges.bind(this)
    }

    componentDidMount(){
        
        axios.defaults.withCredentials = true;
        axios.get('http://localhost:3001/travelerprofile')
                .then((response) => {
                    this.setState({
                        firstname: response.data[0].firstname,
                        lastname: response.data[0].lastname,
                        aboutme: response.data[0].aboutme,
                        city: response.data[0].city,
                        company: response.data[0].company,
                        country: response.data[0].country,
                        school : response.data[0].school,
                        hometown : response.data[0].hometown,
                        languages : response.data[0].languages,
                        gender : response.data[0].gender,
                        contact : response.data[0].phoneno,
                        setEmail : response.data[0].email
                    })
                    console.log(response.data[0].firstname);
                    console.log(response.data[0].lastname);
                    console.log(response.data[0].email);
                    console.log(response.data[0].profileImage);
                    if(response.data[0].profileImage!=null){
                        let imagePreview = 'data:image/jpg;base64, ' + response.data[0].profileImage;
                        this.setState({
                            ImageView: imagePreview
                        })
                    }   
            });
    }

    fileChangeHandler(e){

        this.setState({
            selectedFile: e.target.files[0]
          })

        e.preventDefault();

        setTimeout(() => {
            console.log("Printing the selected file state");
            console.log(this.state.selectedFile);
            let formData = new FormData();
            formData.append('selectedFile', this.state.selectedFile);

            axios.defaults.withCredentials = true;
            axios.post('http://localhost:3001/travelerprofile/imageupload',formData)
            .then((result) => {
            });
        }, 200);

    }

    handleLogout = () => {
        cookie.remove('cookieT', { path: '/' })
        sessionStorage.removeItem('SessionEmail');
        sessionStorage.removeItem('SessionUsername');
    }

    ChangeHandler(e) {
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    SaveChanges = (e) => {
        var headers = new Headers();
        e.preventDefault();

        const data = {
            firstname : this.state.firstname,
            lastname : this.state.lastname,
            aboutme : this.state.aboutme,
            city : this.state.city,
            country : this.state.country,
            company : this.state.company,
            school : this.state.school,
            hometown : this.state.hometown,
            languages : this.state.languages,
            gender : this.state.gender,
            contact : this.state.contact,
            setEmail : this.state.setEmail
        }   

        axios.defaults.withCredentials = true;

        axios.post('http://localhost:3001/travelerprofile',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.setState({
                        flag : true,
                    })
                    alert(response.data);
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

    render(){
        require('./travelerprofile.css');
        let redirectvar = null;
        if( cookie.load('cookieT')!="traveler" ){
            redirectvar = <Redirect to= "/homepage"/>
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
                                    <li class="items"><a href="#" class="nav-item mainlink1"> TripBoards </a></li>

                                    <li class="dropdown items">
                                        <a href="#" class="dropdown-toggle mainlink1" data-toggle="dropdown"> {this.state.setUsername} <span class="caret"></span></a>
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
                                        <a href="#" class="dropdown-toggle mainlink1" data-toggle="dropdown"> Help <span class="caret"></span></a>
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

                                    <li class="items"><button class="btn listPropBtn"> List your property </button></li>

                                    <li class="items"><img src="//csvcus.homeaway.com/rsrcs/cdn-logos/2.10.6/bce/moniker/homeaway_us/birdhouse-bceheader.svg"/></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
                
                <div class="mainbody">
                    <br/>
                    <div id="profilepicheader" class="text-center">
                        {/* <img src={this.state.fileupload} class="imgCircle" alt="ProfilePicture" width="100" height="100" circle/> */}
                        <img src={this.state.ImageView} class="imgCircle" alt="ProfilePicture" width="100" height="100" circle/>
                        <br/>
                        {/* <button type="button" class="btn btn-default">
                            Upload image
                        </button> */}
                        {/* <input type="file" onChange={this.fileChangeHandler}/> */}
                        <div>
                            <form>
                            <label class="file-upload-button">
                                Upload picture
                                <input type="file" id="profileImage" name="ImageFile" onChange={this.fileChangeHandler}/><br/>
                            </label>
                            </form>
                        </div>

                        {/* <br/> */}
                        <h3>{this.state.setUsername}</h3>
                    </div>

                    <div class="text-center profileinfo">
                        <div class="text-center infoform">
                            <div class="form-group">
                                <input onChange = {this.ChangeHandler} id="firstname" name="firstname" class="form-control" type="text" size="20" placeholder="First name" defaultValue={this.state.firstname}/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.ChangeHandler} id="lastname" name="lastname" class="form-control" type="text" size="20" placeholder="Last name" defaultValue={this.state.lastname}/>
                            </div>
                            <div class="form-group">
                                <textarea onChange = {this.ChangeHandler} class="form-control" rows="3" cols="50" name="aboutme" id="aboutme" placeholder="About me" value={this.state.aboutme}/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.ChangeHandler} id="city" name="city" class="form-control" type="text" size="20" placeholder="City" defaultValue={this.state.city}/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.ChangeHandler} id="country" name="country" class="form-control" type="text" size="20" placeholder="Country"  defaultValue={this.state.country}/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.ChangeHandler} id="company" name="company" class="form-control" type="text" size="20" placeholder="Company" defaultValue={this.state.company}/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.ChangeHandler} id="school" name="school" class="form-control" type="text" size="20" placeholder="School" defaultValue={this.state.school}/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.ChangeHandler} id="hometown" name="hometown" class="form-control" type="text" size="20" placeholder="Hometown" defaultValue={this.state.hometown}/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.ChangeHandler} id="languages" name="languages" class="form-control" type="text" size="30" placeholder="Languages" defaultValue={this.state.languages}/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.ChangeHandler} id="gender" name="gender" class="form-control" type="text" size="15" placeholder="Gender" defaultValue={this.state.gender}/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.ChangeHandler} id="contact" name="contact" class="form-control" type="tel" size="13" placeholder="Contact no." defaultValue={this.state.contact}/>
                            </div>
                        </div>
                        <br></br>
                        <button onClick = {this.SaveChanges} class="btn btn-primary mybutton" type="submit">Save changes</button>
                    </div>

                </div>

            </div>
        )
    }
}

export default travelerprofile