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

class photos extends Component
{
    constructor(props){
        super(props);
        this.state = {
            saveflag : false,
            backflag : false,
            selectedFile : [],
            no_of_images : '',
            filenames : []
        }

        this.SaveButton = this.SaveButton.bind(this);
        this.BackButton = this.BackButton.bind(this);
        this.fileChangeHandler = this.fileChangeHandler.bind(this);
    }

    SaveButton = (e) => {

        console.log("After pressing SAVE button")

        console.log("this.state.selectedFile");
        console.log(this.state.selectedFile);

        let formData = new FormData();

        console.log("Total image file uploaded : "+this.state.no_of_images);

        for(let i=0;i<this.state.no_of_images;i++){
            formData.append('selectedFile', this.state.selectedFile[i]);
            formData.append('fileName', this.state.filenames[i]);
        }

        console.log(formData);

        var token = localStorage.getItem('OwnerToken');
        var emailO = sessionStorage.getItem('SessionEmail');

        e.preventDefault();
        axios.defaults.withCredentials = true;
        axios.post(`${ROOT_URL}/listproperty/photos`, formData, {headers: {Authorization : token}})
          .then((result) => {
                console.log("Inside the first photos route");
                console.log("Result : "+result);
                axios.post(`${ROOT_URL}/listproperty/photos/`+this.state.filenames)
                    .then(response => {
                        console.log("Inside the second photos route");
                        // console.log("Response obtained is : ")
                        // console.log(response.data);
                        localStorage.setItem('imagefiles',response.data);
                        console.log("Checking local storage")
                        console.log(localStorage.getItem('imagefiles'))
                });
          });

        this.setState({
            saveflag : true
        })
    }

    BackButton = (e) => {
        this.setState({
            backflag : true
        })
    }

    fileChangeHandler(e){

        console.log("Event target files : \n");
        console.log(e.target.files);
        this.setState({
            no_of_images : e.target.files.length
        })

        const leng = e.target.files.length
        console.log("No of images : "+leng);

        // console.log("Printing the file names : ")
        let filenames = []
        for(let j=0;j<leng;j++)
        {
            filenames.push(e.target.files[j].name)
            // console.log(e.target.files[j].name);
        }

        this.setState({
            filenames
        })

        setTimeout(() => {
            console.log("this.state.filenames : ")
            console.log(this.state.filenames);
        }, 200);

        let selectedFile =[]
        for(let i=0;i<leng;i++)
        {
            console.log("i : "+i);
            console.log(e.target.files[i]);
            selectedFile.push(e.target.files[i])
        }
        
        this.setState({
            selectedFile
        })

        // setTimeout(() => {
        //     console.log("this.state.selectedFile : ")
        //     console.log(this.state.selectedFile);
        // }, 200);

    } 

    render(){
        require('./photos.css');
        let redirectvar = null;
        if(this.state.saveflag){
            redirectvar = <Redirect to= "/listproperty/price"/>
        }
        if(this.state.backflag){
            redirectvar = <Redirect to= "/listproperty/details"/>
        }
        if(localStorage.getItem('cookieO')!="owner")
        {
            redirectvar = <Redirect to= "/homepage"/>
        }
        return(
            <div>
                {redirectvar}
                <div id="mainbody" class="row">

                    <SideNavbar/>

                    <div class="col-md-8 rightsidecontent">
                        <div class="container">
                            <div class="formbody">
                                <br/>
                                <h3 class="heading4">Add photos of your property</h3><hr/>
                                <p class="text">
                                    Showcase your property’s best features (no pets or people, please).
                                </p>
                                <div class="text-center photouploadbox">
                                    <form>
                                    <label class="file-upload-button">
                                        Select photos to upload
                                        <input type="file" id="filename" name="selectedFile" onChange = {this.fileChangeHandler} multiple/><br/>
                                    </label>
                                    </form>
                                </div>
                                <center>    
                                    <button class="btn btn-primary save-button" onClick={this.BackButton}>
                                        <span>Back</span>
                                    </button>
                                    <button class="btn btn-primary save-button" onClick={this.SaveButton}>
                                        <span>Continue</span>
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

export default photos;