import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import calculatormain from './calculatormain/calculatormain';

class Main extends Component{
    render(){
        return(
            <div>
                <Route path="/" component={calculatormain}/>
            </div>
        )
    }
}

export default Main;