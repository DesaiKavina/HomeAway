import React, { Component } from 'react';
import { Provider } from "react-redux";
import promise from "redux-promise";
import { createStore, applyMiddleware, compose } from "redux";
import {autoRehydrate, persistStore} from "redux-persist";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import './App.css';
import Main from './components/Main';
// import {BrowserRouter} from 'react-router-dom';

import RootReducer from "./reducers";


const composePlugin = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
export const store = createStore(RootReducer, composePlugin(applyMiddleware(promise)));

// export const store = compose (
//   composePlugin(applyMiddleware(promise)),
//   autoRehydrate()
// )(createStore)(RootReducer)

// persistStore(store);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <Switch>
              <Main/>
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
