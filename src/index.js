import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router/AppRouter';
import './style/style.scss'
import { createStore } from 'redux'
import { Provider } from 'react-redux';

let initialState = {
  signUpCollapsed: true
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SIGNUP":
      return {
        ...state,
        signUpCollapsed: action.payload
      };
    default:
      return state;
  }
}

const store = createStore(reducer);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </React.StrictMode>
);