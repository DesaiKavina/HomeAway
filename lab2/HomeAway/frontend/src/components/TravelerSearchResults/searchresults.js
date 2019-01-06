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
import {ROOT_URL} from '../Root_url';

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
            flag : false,
            traveler_token : '',
            setEmail : '',
            askquestionflag : false,
            no_of_pages : '',
            max_limit : '',
            skip_records : '',
        }

        this.handleLogout = this.handleLogout.bind(this);
        this.BookProperty = this.BookProperty.bind(this);
        this.AskQuestion = this.AskQuestion.bind(this);
    }

    componentDidMount(){

        var token = localStorage.getItem('TravelerToken');
        var emailT = sessionStorage.getItem('SessionEmail');
        this.setState({
            traveler_token : token,
            setEmail : emailT
        })

        axios.defaults.withCredentials = true;
        axios.get(`${ROOT_URL}/searchresults`, {headers: {Authorization : token}})
                .then((response) => {
                    console.log("Printing the response obtained from the backend .....................");
                    console.log(response.data);
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

                            var imagestr = this.state.information[i].pImageFiles;
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
        // cookie.remove('cookieT', { path: '/' })
        sessionStorage.removeItem('SessionEmail');
        sessionStorage.removeItem('SessionUsername');
        sessionStorage.clear();
        localStorage.clear();
    }

    BookProperty = (e) => {
        // console.log(e);
        console.log("Book button pressed for "+e);
        const data = {
            bookpropertyname : e
        }

        axios.defaults.withCredentials = true;
        
            axios.post(`${ROOT_URL}/searchresult/bookpropertyname/`+this.state.setEmail,data, {headers: {Authorization : this.state.traveler_token}})
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

    AskQuestion = (e1,e2) => {
        // console.log(e);
        console.log("Ask Question button pressed for "+e1);
        console.log("This poperty owner is : "+e2);
        localStorage.setItem('AskQuestionPropertyName', e1);
        localStorage.setItem('AskQuestionPropertyOwner', e2);
        this.setState({
            askquestionflag : true
        })
    }

    render(){
        require('./searchresults.css');

        let redirectvar = null;
        if(localStorage.getItem('cookieT')!="traveler"){
            redirectvar = <Redirect to= "/homepage"/>
        }

        if((localStorage.getItem('cookieT')=="traveler") && this.state.flag==true){
            redirectvar = <Redirect to= "/homepage"/>
        }

        if((localStorage.getItem('cookieT')=="traveler") && this.state.askquestionflag==true){
            redirectvar = <Redirect to= "/askQuestion"/>
        }


        let displayImage = null;
        let view = null;
        let displayImage1 = null;
        if(this.state.information.length>0)
        {
            var itr = -1;
            var myCount = 0;
            view = this.state.information.map(property => {
                itr++;

                // displayImage1 = this.state.encodedImage.map(image => {
                //     return(
                //         <img src={image} height="200" width="300"/>
                //     )
                // })

                displayImage = (
                    <div>
                        {/* <img src = {this.state.encodedImage[0]} height="200" width="300"/> &nbsp;&nbsp;
                        <img src = {this.state.encodedImage[1]} height="200" width="300"/> &nbsp;&nbsp;
                        <img src = {this.state.encodedImage[2]} height="200" width="300"/> &nbsp;&nbsp; */}

                        <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <img src = {this.state.encodedImage[myCount]} height="300" width="420"/>
                                </div>
                                <div class="carousel-item">
                                    <img src = {this.state.encodedImage[myCount+1]} height="300" width="420"/>
                                </div>
                                <div class="carousel-item">
                                    <img src = {this.state.encodedImage[myCount+2]} height="300" width="420"/>
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

                myCount = myCount + 3;

                    var num_of_images = this.state.image_number[itr];
                    // if(itr==0)
                    // {
                        
                    //     displayImage = (
                    //         <div>
                    //             {/* <img src = {this.state.encodedImage[0]} height="200" width="300"/> &nbsp;&nbsp;
                    //             <img src = {this.state.encodedImage[1]} height="200" width="300"/> &nbsp;&nbsp;
                    //             <img src = {this.state.encodedImage[2]} height="200" width="300"/> &nbsp;&nbsp; */}

                    //             <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                    //                 <div class="carousel-inner">
                    //                     <div class="carousel-item active">
                    //                         <img src = {this.state.encodedImage[0]} height="300" width="420"/>
                    //                     </div>
                    //                     <div class="carousel-item">
                    //                         <img src = {this.state.encodedImage[1]} height="300" width="420"/>
                    //                     </div>
                    //                     <div class="carousel-item">
                    //                         <img src = {this.state.encodedImage[2]} height="300" width="420"/>
                    //                     </div>
                    //                 </div>
                    //                 <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                    //                     <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    //                     <span class="sr-only">Previous</span>
                    //                 </a>
                    //                 <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                    //                     <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    //                     <span class="sr-only">Next</span>
                    //                 </a>
                    //             </div>

                    //         </div>
                    //     )
                    // }
                    // else if(itr==1)
                    // {
                    //     displayImage = (
                    //         <div>
                    //             {/* <img src = {this.state.encodedImage[3]} height="200" width="300"/> &nbsp;&nbsp;
                    //             <img src = {this.state.encodedImage[4]} height="200" width="300"/> &nbsp;&nbsp;
                    //             <img src = {this.state.encodedImage[5]} height="200" width="300"/> &nbsp;&nbsp; */}
                            
                    //             <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                    //                 <div class="carousel-inner">
                    //                     <div class="carousel-item active">
                    //                         <img src = {this.state.encodedImage[3]} height="300" width="420"/>
                    //                     </div>
                    //                     <div class="carousel-item">
                    //                         <img src = {this.state.encodedImage[4]} height="300" width="420"/>
                    //                     </div>
                    //                     <div class="carousel-item">
                    //                         <img src = {this.state.encodedImage[5]} height="300" width="420"/>
                    //                     </div>
                    //                 </div>
                    //                 <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                    //                     <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    //                     <span class="sr-only">Previous</span>
                    //                 </a>
                    //                 <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                    //                     <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    //                     <span class="sr-only">Next</span>
                    //                 </a>
                    //             </div>

                    //         </div>
                    //     )
                    // }
                    // else if(itr==2)
                    // {
                    //     displayImage = (
                    //         <div>
                    //             {/* <img src = {this.state.encodedImage[6]} height="200" width="300"/> &nbsp;&nbsp;
                    //             <img src = {this.state.encodedImage[7]} height="200" width="300"/> &nbsp;&nbsp;
                    //             <img src = {this.state.encodedImage[8]} height="200" width="300"/> &nbsp;&nbsp; */}
                            
                    //             <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                    //                 <div class="carousel-inner">
                    //                     <div class="carousel-item active">
                    //                         <img src = {this.state.encodedImage[6]} height="300" width="420"/>
                    //                     </div>
                    //                     <div class="carousel-item">
                    //                         <img src = {this.state.encodedImage[7]} height="300" width="420"/>
                    //                     </div>
                    //                     <div class="carousel-item">
                    //                         <img src = {this.state.encodedImage[8]} height="300" width="420"/>
                    //                     </div>
                    //                 </div>
                    //                 <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                    //                     <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    //                     <span class="sr-only">Previous</span>
                    //                 </a>
                    //                 <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                    //                     <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    //                     <span class="sr-only">Next</span>
                    //                 </a>
                    //             </div>
                    
                    //         </div>
                    //     )
                    // }
                
                return(
                    <div>
                    <div class="property_detials">
                        <div class="row">
                            <div class="col-md-5">
                                {displayImage}
                                {/* {displayImage1} */}
                            </div>
                            <div class="col-md-7 right-side">
                                <h3>{property.pName}</h3><br></br>
                                <p class="info">{property.pAddress}, {property.pCity}, {property.pState}, {property.pZipcode}, {property.pCountry}</p>
                                <p class="info">{property.pType} - Bedrooms : {property.pBedrooms}, Bathrooms : {property.pBathrooms}, Accomodates : {property.pAccomodates}</p>
                                <p class="info">{property.pDescription}</p>
                                <p class="price">$ {property.pPricePerNight} per night</p>
                                <p class="info">This property is posted by : {property.pOwner}</p>
                                <button class="btn btn-primary book-button" onClick = {() => {this.BookProperty(property.pName)}} name="BookButton" value={property.propertyName}>
                                    <span>Book</span>
                                </button>
                                <button class="btn btn-primary askquestion-button" onClick = {() => {this.AskQuestion(property.pName, property.pOwner)}} name="QuestionButton" value={property.propertyName}>
                                    <span>Ask Owner a question</span>
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
                                    <a href="/homepage" class="navbar-brand">
                                        <p class="heading1">HomeAway</p>
                                    </a>
                            </div>

                            <div>
                                <ul class="nav navbar-nav navbar-right" id="ulist">
                                    <li class="items"><a href="#" class="nav-item mainlinks1"> TripBoards </a></li>

                                    <li class="dropdown items">
                                        <a href="#" class="dropdown-toggle mainlinks1" data-toggle="dropdown"> {this.state.setUsername} <span class="caret"></span></a>
                                        <ul class="dropdown-menu dropdown-menu-right mymenu">
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="/travelerInbox" role="menu">Inbox</a></li>
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="/travelertrips" role="menu">My trips</a></li>
                                            <li class="listitems"><a class="dropdown-item menulinks1" href="/travelerprofile" role="menu">My profile</a></li>
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
                        {/* <div class="form-group">
                            <input onChange = {this.ChangeHandler} id="searchquery" name="firstname" class="form-control" type="text" size="20" placeholder="First name" defaultValue={this.state.firstname}/>
                        </div> */}
                        <br></br>
                        {view}
                    </div>     
                </div>

            </div>
        )
    }
}

export default searchresults;