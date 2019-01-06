import _ from "lodash";

import { TRAVELER_SIGNUP } from "../actions";
import { OWNER_SIGNUP } from "../actions"; 

export default function(state = {}, action) {
    switch (action.type) {
  
      case TRAVELER_SIGNUP:
        return {
          ...state,
          TravelerAccountSuccess : action.payload.data
        }
      case OWNER_SIGNUP:
        return {
          ...state,
          OwnerAccountSuccess : action.payload.data
        }
      default:
        return state;
    }
  }