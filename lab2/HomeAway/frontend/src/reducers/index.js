import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import LoginReducer from "./reducer_login";
import SignupReducer from "./reducer_signup";

const rootReducer = combineReducers({
    credentials: LoginReducer,
    signup: SignupReducer,
    form: formReducer
  });
  
export default rootReducer;