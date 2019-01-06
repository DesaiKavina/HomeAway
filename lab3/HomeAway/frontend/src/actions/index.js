import axios from "axios";
import cookie from 'react-cookies';

export const TRAVELER_LOGIN = "traveler_login";
export const OWNER_LOGIN = "owner_login";
export const TRAVELER_SIGNUP = "traveler_signup";
export const OWNER_SIGNUP = "owner_signup";

const ROOT_URL = "http://localhost:3001";

// import {ROOT_URL} from '';

export function travelerLoginRequest(values, callback) {
    const request = axios.post(`${ROOT_URL}/travelerlogin`, values, {withCredentials:true})
    .then((response) => {
        callback(response);
        return response
      },(err)=>{
        callback(err);
        return err
      });  
    return {
        type: TRAVELER_LOGIN,
        payload: request
    };
}

export function travelerSignupRequest(values, callback) {
    const request = axios.post(`${ROOT_URL}/travelersignup`, values, {withCredentials:true})
    .then((response) => {
        callback(response);
        return response
      },(err)=>{
        callback(err);
        return err
      });  
    return {
        type: TRAVELER_SIGNUP,
        payload: request
    };
}

export function ownerLoginRequest(values, callback) {
    const request = axios.post(`${ROOT_URL}/ownerlogin`, values, {withCredentials:true})
    .then((response) => {
        callback(response);
        return response
      },(err)=>{
        callback(err);
        return err
      });  
    return {
        type: OWNER_LOGIN,
        payload: request
    };
}

export function ownerSignupRequest(values, callback) {
    const request = axios.post(`${ROOT_URL}/ownersignup`, values, {withCredentials:true})
    .then((response) => {
        callback(response);
        return response
      },(err)=>{
        callback(err);
        return err
      });  
    return {
        type: OWNER_SIGNUP,
        payload: request
    };
}