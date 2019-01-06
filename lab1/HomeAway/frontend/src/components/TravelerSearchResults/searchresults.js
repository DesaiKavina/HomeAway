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
import 'bootstrap/dist/js/bootstrap.min.js';

class searchresults extends Component
{
    constructor(props){
        super(props);

        this.state={
            setUsername : sessionStorage.getItem('SessionUsername'),
            information : [], 
            imageinfo : [],
            imageView : '',
            encodedImage : [],
            image_number : [],
            flag : false
        }

        this.handleLogout = this.handleLogout.bind(this);
        this.BookProperty = this.BookProperty.bind(this);
    }

    componentDidMount(){

        axios.defaults.withCredentials = true;
        axios.get('http://localhost:3001/searchresults')
                .then((response) => {
                    // console.log(response.data);
                    // console.log(response.data[0].propertyName);
                    // console.log(response.data[0].propertyDescription);
                    this.setState({
                        information : response.data
                    })
                    let no_of_images = [];
                    setTimeout(() => {
                        for(let i=0;i<response.data.length;i++)
                        {
                            // var imageobj = this.state.information[i].imageFiles;
                            // console.log("imageobj in component did mount");
                            // console.log(imageobj);

                            var imagestr = this.state.information[i].imageFiles;
                            // console.log("imagestr in component did mount");
                            // console.log(imagestr);

                            // var imagestr = imageobj.imageFiles;
                            // console.log("imagestr in component did mount");
                            // console.log(imagestr);

                            var imagearr = imagestr.split(',');
                            // console.log("imagearr in component did mount");
                            // console.log(imagearr);
                            no_of_images.push(imagearr.length);
                            var imagePreview = [];
                            for(let y=0;y<imagearr.length;y++)
                            {
                                imagePreview.push('data:image/jpg;base64, ' + imagearr[y])
                            }
                            // console.log("Image preview in component did mount");
                            // console.log(imagePreview);
                            this.setState({
                                encodedImage : this.state.encodedImage.concat(imagePreview)
                            })
                            this.setState({
                                image_number : no_of_images
                            })
                            console.log("State of encodedImage in component did mount");
                            console.log(this.state.encodedImage);
                        }
                    }, 100);
                })
        }

    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
        sessionStorage.removeItem('SessionEmail');
        sessionStorage.removeItem('SessionUsername');
    }

    BookProperty = (e) => {
        // console.log(e);
        console.log("Book button pressed for "+e);
        const data = {
            bookpropertyname : e
        }

        axios.defaults.withCredentials = true;
            axios.post('http://localhost:3001/searchresult/bookpropertyname',data)
                .then(response => {
                    console.log("Status Code : ",response.status);
                    if(response.status === 200){
                        this.setState({
                            flag : true,
                        })
                        alert("Congrats, you have booked this property !!!");
                    }
                    else{
                        this.setState({
                            flag : false
                        })
                    }
                })
                .catch(err =>{
                    alert("Cannot book property due to some error");
                });
    }

    render(){
        require('./searchresults.css');

        let redirectvar = null;
        if( cookie.load('cookieT')!="traveler"){
            redirectvar = <Redirect to= "/homepage"/>
        }

        if(cookie.load('cookieT')=="traveler" && this.state.flag==true){
            redirectvar = <Redirect to= "/homepage"/>
        }

        let displayImage = null;
        let view = null;
        let displayImage1 = null;
        if(this.state.information.length>0)
        {
            var itr = -1;
            view = this.state.information.map(property => {
                itr++;

                // displayImage1 = this.state.encodedImage.map(image => {
                //     return(
                //         <img src={image} height="200" width="300"/>
                //     )
                // })

                console.log("Value of itr : "+itr);
                    var num_of_images = this.state.image_number[itr];
                    if(itr==0)
                    {
                        
                        displayImage = (
                            <div>
                                {/* <img src = {this.state.encodedImage[0]} height="200" width="300"/> &nbsp;&nbsp;
                                <img src = {this.state.encodedImage[1]} height="200" width="300"/> &nbsp;&nbsp;
                                <img src = {this.state.encodedImage[2]} height="200" width="300"/> &nbsp;&nbsp; */}

                                <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                                    <div class="carousel-inner">
                                        <div class="carousel-item active">
                                            <img src = {this.state.encodedImage[0]} height="300" width="420"/>
                                        </div>
                                        <div class="carousel-item">
                                            <img src = {this.state.encodedImage[1]} height="300" width="420"/>
                                        </div>
                                        <div class="carousel-item">
                                            <img src = {this.state.encodedImage[2]} height="300" width="420"/>
                                        </div>
                                    </div>
                                    <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Previous</span>
                                    </a>
                                    <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Next</span>
                                    </a>
                                </div>

                            </div>
                        )
                    }
                    else if(itr==1)
                    {
                        displayImage = (
                            <div>
                                {/* <img src = {this.state.encodedImage[3]} height="200" width="300"/> &nbsp;&nbsp;
                                <img src = {this.state.encodedImage[4]} height="200" width="300"/> &nbsp;&nbsp;
                                <img src = {this.state.encodedImage[5]} height="200" width="300"/> &nbsp;&nbsp; */}
                            
                                <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                                    <div class="carousel-inner">
                                        <div class="carousel-item active">
                                            <img src = {this.state.encodedImage[3]} height="300" width="420"/>
                                        </div>
                                        <div class="carousel-item">
                                            <img src = {this.state.encodedImage[4]} height="300" width="420"/>
                                        </div>
                                        <div class="carousel-item">
                                            <img src = {this.state.encodedImage[5]} height="300" width="420"/>
                                        </div>
                                    </div>
                                    <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Previous</span>
                                    </a>
                                    <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Next</span>
                                    </a>
                                </div>

                            </div>
                        )
                    }
                    else if(itr==2)
                    {
                        displayImage = (
                            <div>
                                {/* <img src = {this.state.encodedImage[6]} height="200" width="300"/> &nbsp;&nbsp;
                                <img src = {this.state.encodedImage[7]} height="200" width="300"/> &nbsp;&nbsp;
                                <img src = {this.state.encodedImage[8]} height="200" width="300"/> &nbsp;&nbsp; */}
                            
                                <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                                    <div class="carousel-inner">
                                        <div class="carousel-item active">
                                            <img src = {this.state.encodedImage[6]} height="300" width="420"/>
                                        </div>
                                        <div class="carousel-item">
                                            <img src = {this.state.encodedImage[7]} height="300" width="420"/>
                                        </div>
                                        <div class="carousel-item">
                                            <img src = {this.state.encodedImage[8]} height="300" width="420"/>
                                        </div>
                                    </div>
                                    <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Previous</span>
                                    </a>
                                    <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="sr-only">Next</span>
                                    </a>
                                </div>
                    
                            </div>
                        )
                    }
                
                return(
                    <div>
                    <div class="property_detials">
                        <div class="row">
                            <div class="col-md-5">
                                {displayImage}
                                {/* {displayImage1} */}
                            </div>
                            <div class="col-md-7 right-side">
                                <h3>{property.propertyName}</h3><br></br>
                                <p class="info">{property.address}, {property.city}, {property.state}, {property.zipcode}, {property.country}</p>
                                <p class="info">{property.propertyType} - Bedrooms : {property.bedrooms}, Bathrooms : {property.bathrooms}, Accomodates : {property.accomodates}</p>
                                <p class="info">{property.propertyDescription}</p>
                                <p class="price">$ {property.pricePerNight} per night</p>
                                <button class="btn btn-primary book-button" onClick = {() => {this.BookProperty(property.propertyName)}} name="BookButton" value={property.propertyName}>
                                    <span>Book</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    </div>
                )
            })
        }
        else
        {
            view = (
                    <div class="property_detials">
                        <h3>No matches found !</h3>
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

                                    <li class="items"><button class="btn listPropBtn"> List your property </button></li>

                                    <li class="items"><img src="//csvcus.homeaway.com/rsrcs/cdn-logos/2.10.6/bce/moniker/homeaway_us/birdhouse-bceheader.svg"/></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>

                <div id="mainbody">
                    <div class="container main-content">
                        <br></br>
                        {view}
                    </div>     
                </div>

            </div>
        )
    }
}

export default searchresults;