import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';

class calculatormain extends Component
{
    constructor(props)
    {
        super(props);
        this.state ={
            txt : '',
            decimalFlag : true
        }

        this.KeyPress = this.KeyPress.bind(this)
        this.AnsButton = this.AnsButton.bind(this);
        this.ClearButton = this.ClearButton.bind(this);
        this.InputOperator = this.InputOperator.bind(this);
    }

    textfieldChangeHandler = (e) => {
        this.setState({
            txt : this.state.txt + e.target.value
        })
    }

    ClearButton(){
        this.setState({
            txt: ''
        })
    }

    InputOperator(o){
        var currstr = this.state.txt;
        var operators = ['+','-','*','/'];
        var lastele = "";

        if(currstr!="")
        {
            lastele = currstr[(currstr.length - 1)]
        }

        if(currstr=="" && o=='-')
        {
            this.setState({
                txt: this.state.txt + o
            })
        }
        else if(currstr!="" && operators.indexOf(lastele)==-1)
        {
            this.setState({
                txt: this.state.txt + o,
                decimalFlag: true
            })
        }
    }

    KeyPress(e){
        var validascii = [48,49,50,51,52,53,54,55,56,57];
        var currstr = this.state.txt;

        e = e || window.event;
        var c = e.keyCode || e.which;
        var s = String.fromCharCode(c);

        //for backspace key press
        if(c==8){
            this.setState({
                txt: currstr.substring(0,currstr.length - 1)
            })
        }

        //for decimal point
        if(c==190)
            {
                if(this.state.decimalFlag)
                {
                    this.setState({
                        txt : this.state.txt + '.',
                        decimalFlag : false
                    })
                }
            }

        if(validascii.indexOf(c) != -1)
        {
            this.setState({
                txt: this.state.txt + s
            })
        }

    }

    AnsButton = (e) => {
        var flag=false;
        var operators = ['+','-','*','/'];
        var currstr = this.state.txt
        var lastele = currstr[currstr.length - 1];
        if(operators.indexOf(lastele)!=-1 || currstr.length<3)
            alert("Invalid expression");
        for(let i=0;i<currstr.length;i++)
        {
            if(operators.indexOf(currstr[i])!=-1)
                flag=true;
        }
        if(flag==false)
            alert("Invalid expression");
        var headers = new Headers();
        e.preventDefault();
        const data = {
            txt : this.state.txt
        }

        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/calculatormain',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log(response);
                    this.setState({
                        txt: response.data
                    })
                    console.log("The answer is : "+this.state.txt);
                }else{
                    console.log("Error");
                }
            });
    }

    render(){
        return(
            <div>   
                <div class="container">
                    <div class="main">
                        <div class = "inputtext">
                            <input onKeyDown = {this.KeyPress} type="text" value={this.state.txt} placeholder="0 " autofocus/>
                        </div>
                        <div class = "buttons">
                            <button onClick = {() => this.InputOperator('+')} class="btn btn-primary">+</button> 
                            <button onClick = {() => this.InputOperator('-')} class="btn btn-primary">-</button> 
                            <button onClick = {() => this.InputOperator('*')} class="btn btn-primary">*</button>
                            <button onClick = {() => this.InputOperator('/')} class="btn btn-primary">/</button>
                        </div>
                        <div class = "buttons">
                            <button onClick = {this.AnsButton} class="btn btn-secondary"><b>Answer</b></button>
                            <button onClick = {this.ClearButton} class="btn btn-secondary"><b>Clear</b></button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default calculatormain;