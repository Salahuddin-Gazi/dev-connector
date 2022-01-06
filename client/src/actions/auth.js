import axios from "axios";
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, CLEAR_PROFILE } from "./types";
import { setAlert } from "./alert";
import { setAuthToken } from "../utils/setAuthToken";

// load a user
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const { data } = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const body = JSON.stringify({ name, email, password });
    const api = axios.create({
      headers: {
        "Content-type": "application/json",
      },
    });
    try {
      const { data } = await api.post("/api/users", body);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: data,
      });
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

// Login User
export const login = (email, password) => async (dispatch) => {
  const body = JSON.stringify({ email, password });
  const api = axios.create({
    headers: {
      "Content-type": "application/json",
    },
  });
  try {
    const { data } = await api.post("/api/auth", body);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: LOGIN_FAILURE,
    });
  }
};

// Logout user / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
  dispatch({
    type: CLEAR_PROFILE,
  });
};
