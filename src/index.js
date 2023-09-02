import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router/AppRouter';
import './style/style.scss'
import { createStore } from 'redux'
import { Provider } from 'react-redux';

let initialState = {
  signUpCollapsed: true,
  startPost: false,
  commentsSec: false,
  postIdForComment: '',
  toHomePost: false,
  refreshPosts: false,
  startJobPost: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SIGNUP":
      return {
        ...state,
        signUpCollapsed: action.payload
      };
    case "SET_START_POST":
      return {
        ...state,
        startPost: action.payload
      };
    case "SET_COMMENTS":
      return {
        ...state,
        commentsSec: action.payload,
        postIdForComment: action.postIdForComment
      };
    case "SET_BACK_COLOR":
      return {
        ...state,
        toHomePost: action.payload
      };
    case "SET_REFRESH":
      return {
        ...state,
        refreshPosts: action.payload
      };

    // job posting
    case "SET_JOB_POST":
      return {
        ...state,
        startJobPost: action.payload
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