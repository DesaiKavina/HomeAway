import _ from "lodash";
import cookie from 'react-cookies';

import { TRAVELER_LOGIN, OWNER_LOGIN } from "../actions";
// import { OWNER_LOGIN } from "../actions";

export default function(state = {}, action) {
  switch (action.type) {

    case TRAVELER_LOGIN:
      // state = Object.assign({},data);
      // return state;
      // return {
      //   ...state,
      //   TravelerName : action.payload.data
      // }
      return action.payload.data
      // return _.mapKeys(action.payload.data, "email");

    case OWNER_LOGIN:
      var data = {OwnerName : action.payload.data}
      state = Object.assign({}, data);
      return state;
    default:
      return state;

  }
}