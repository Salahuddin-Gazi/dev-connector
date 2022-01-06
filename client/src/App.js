import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import AppRoutes from "./components/routing/AppRoutes";
import { setAuthToken } from "./utils/setAuthToken";
import axios from "axios";
import "./App.css";

// redux
import store from "./store";
import { Provider } from "react-redux";
import { loadUser } from "./actions/auth";
import { getProfiles } from "./actions/profile";

// axios
axios.defaults.baseURL = process.env.baseURL;

// Setting common token for axios x-auth-token
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  // [], means it will run once as the function is loaded.
  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(getProfiles());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Routes>
            <Route index strict path="/" element={<Landing />} />
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
