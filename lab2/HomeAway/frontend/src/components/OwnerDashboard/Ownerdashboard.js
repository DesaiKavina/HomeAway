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
import {ROOT_URL} from '../Root_url';
const fs = require('fs');


class Ownerdashboard extends Component
{
    constructor(props){
        super(props);
        this.state = {
            information : [], 
            imageinfo : [],
            imageView : '',
            encodedImage : [],
            image_number : [],
            owner_token : '',
            setEmail : ''
        }
    }

    componentDidMount(){

        var token = localStorage.getItem('OwnerToken');
        var emailO = sessionStorage.getItem('SessionEmail');
        this.setState({
            owner_token : token,
            setEmail : emailO
        })

        axios.defaults.withCredentials = true;
        
        axios.get(`${ROOT_URL}/listproperty/ownerdashboard/data/`+emailO, {headers: {Authorization : token}})
                .then((response) => {
                    console.log("Inside get request for general info");
                    console.log("************************* Printing the property details data ***********************")
                    console.log(response.data);
                    console.log("Response data length in data information: "+response.data.length);
                    this.setState({
                        information : response.data
                    })

                    setTimeout(() => {
                        console.log("Printing the property details data");
                        console.log("Length of data : "+this.state.information.length);
                        // for(let i=0;i<this.state.information.length;i++)
                        //     console.log(this.state.information[i]);
                    }, 200);

                    axios.defaults.withCredentials = true;
                    
                    axios.get(`${ROOT_URL}/listproperty/ownerdashboard/image/`+this.state.setEmail, {headers: {Authorization : this.state.owner_token}})
                        .then((response) => {
                            console.log("Inside the GET method for images");
                            console.log("Printing data obtained for property images : ");
                            console.log(response.data);
                            console.log("Response data length : "+response.data.length);
                            this.setState({
                                imageinfo : response.data
                            })

                            let no_of_images = [];
                            let displayImage = null;
                            setTimeout(() => {
                                for(let x=0;x<response.data.length;x++){
                                    // console.log(x);
                                    if(this.state.imageinfo[x]!="0")
                                    {
                                        console.log("Inside component did mount if");
                                        var imageobj = this.state.imageinfo[x];
                                        // console.log("imageobj in component did mount");
                                        // console.log(imageobj);
                                        var imagestr = imageobj.imageFiles;
                                        // console.log("imagestr in component did mount");
                                        // console.log(imagestr);
                                        var imagearr = imagestr.split(',');
                                        // console.log("imagearr in component did mount");
                                        // console.log(imagearr);
                                        no_of_images.push(imagearr.length);
                                        var imagePreview = [];
                                        // for(let y=0;y<imagearr.length;y++)
                                        // {
                                        //     imagearr[y] = 'data:image/jpg;base64, ' + imagearr[y];
                                        // }
                                        for(let y=0;y<imagearr.length;y++)
                                        {
                                            imagePreview.push('data:image/jpg;base64, ' + imagearr[y])
                                        }
                                        // imagePreview.push(imagearr);
                                        // console.log("Image preview in component did mount");
                                        // console.log(imagePreview);
                                        this.setState({
                                            encodedImage : this.state.encodedImage.concat(imagePreview)
                                        })
                                        this.setState({
                                            image_number : no_of_images
                                        })
                                        // displayImage = imagePreview.map(image => {
                                        //     return(
                                        //     <div>
                                        //         {/* <p>{image}</p> */}
                                        //         <img src={image} height="150" width="250"/>&nbsp;
                                        //     </div>
                                        //     )
                                        // })    
                                    }
                                }
                                console.log("State of encodedImage in component did mount");
                                console.log(this.state.encodedImage);
                                console.log("State of Image number in component did mount");
                                console.log(this.state.image_number);

                            }, 100);

                        }) 
            });
    }

    render(){
        require('./Ownerdashboard.css');

        let redirectvar = null;
        if(localStorage.getItem('cookieO')!="owner"){
            redirectvar = <Redirect to= "/homepage"/>
        }

        let displayImage = null;
        let displayImage1 = null;
        let bookingmessage = null;
        let view = null;
        if(this.state.information.length>0)
        {
            // console.log("Printing the current image info state");
            // console.log(this.state.imageinfo);
            var itr = -1;
            var mycount = 0;
            view = this.state.information.map(property => {
                itr++;
                // displayImage1 = this.state.encodedImage.map(image => image.map(element => {
                // // displayImage1 = this.state.encodedImage.map(image => {
                //     return(
                //         <img src={element} height="200" width="300"/> 
                //     )
                // }))
                // console.log("Value of itr : "+itr);

                let bookedByTravelersDetails = null
                if(property.bookingInfo!=null && property.bookingInfo!=undefined)
                {
                    bookingmessage = property.bookingInfo.map(info => {
                        return(
                            <div>
                                <p class="bookingmessage">This property is booked by traveler : {info.travelerEmail}</p>
                                <p class="bookingmessage">The dates for this booking are : {info.bookedStartDate} to {info.bookedEndDate} </p>
                            </div>
                        )
                    })
                }
                else
                {
                    bookingmessage = (
                        <p class="bookingmessage">This property is not yet booked by anyone</p>
                    )
                }

                displayImage = (
                    <div>
                        <img src = {this.state.encodedImage[mycount]} height="200" width="300"/> &nbsp;&nbsp;
                        <img src = {this.state.encodedImage[mycount+1]} height="200" width="300"/> &nbsp;&nbsp;
                        <img src = {this.state.encodedImage[mycount+2]} height="200" width="300"/> &nbsp;&nbsp;
                    </div>
                )

                mycount = mycount + 3;

                    var num_of_images = this.state.image_number[itr];
                    // if(itr==0)
                    // {
                    //     displayImage = (
                    //         <div>
                    //             <img src = {this.state.encodedImage[0]} height="200" width="300"/> &nbsp;&nbsp;
                    //             <img src = {this.state.encodedImage[1]} height="200" width="300"/> &nbsp;&nbsp;
                    //             <img src = {this.state.encodedImage[2]} height="200" width="300"/> &nbsp;&nbsp;
                    //         </div>
                    //     )
                    // }
                    // else if(itr==1)
                    // {
                    //     displayImage = (
                    //         <div>
                    //             <img src = {this.state.encodedImage[3]} height="200" width="300"/> &nbsp;&nbsp;
                    //             <img src = {this.state.encodedImage[4]} height="200" width="300"/> &nbsp;&nbsp;
                    //             <img src = {this.state.encodedImage[5]} height="200" width="300"/> &nbsp;&nbsp;
                    //         </div>
                    //     )
                    // }
                    // else if(itr==2)
                    // {
                    //     displayImage = (
                    //         <div>
                    //             <img src = {this.state.encodedImage[6]} height="200" width="300"/> &nbsp;&nbsp;
                    //             <img src = {this.state.encodedImage[7]} height="200" width="300"/> &nbsp;&nbsp;
                    //             <img src = {this.state.encodedImage[8]} height="200" width="300"/> &nbsp;&nbsp;
                    //         </div>
                    //     )
                    // }
                    // else if(itr==3)
                    // {
                    //     displayImage = (
                    //         <div>
                    //             <img src = {this.state.encodedImage[9]} height="200" width="300"/> &nbsp;&nbsp;
                    //             <img src = {this.state.encodedImage[10]} height="200" width="300"/> &nbsp;&nbsp;
                    //             <img src = {this.state.encodedImage[11]} height="200" width="300"/> &nbsp;&nbsp;
                    //         </div>
                    //     )
                    // }
                    // else if(itr==4)
                    // {
                    //     displayImage = (
                    //         <div>
                    //             <img src = {this.state.encodedImage[12]} height="200" width="300"/> &nbsp;&nbsp;
                    //             <img src = {this.state.encodedImage[13]} height="200" width="300"/> &nbsp;&nbsp;
                    //             <img src = {this.state.encodedImage[14]} height="200" width="300"/> &nbsp;&nbsp;
                    //         </div>
                    //     )
                    // }

                //     // displayImage = this.state.encodedImage.map(image => {
                //     //     return(
                //     //     <div>
                //     //         <img src={image} height="150" width="250"/>&nbsp;
                //     //     </div>
                //     //     )
                //     // })
                // }

                // console.log("this.state.encodedImage[itr]");
                // console.log(this.state.encodedImage[itr]);
                
                return(
                    <div>
                    <div class="property_detials">
                        <h3>{property.pName}</h3>
                        <p>{property.pAddress}, {property.pCity}, {property.pState}, {property.pZipcode}, {property.pCountry}</p>
                        <p>{property.pType} - Bedrooms : {property.pBedrooms}, Bathrooms : {property.pBathrooms}, Accomodates : {property.pAccomodates}</p>
                        {displayImage}
                        <br></br>
                        {bookingmessage}
                        {/* {displayImage1} */}
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
                        <h3>No property added yet !</h3>
                    </div>
                );
        }

        return(
            <div>
                {redirectvar}
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

export default Ownerdashboard;