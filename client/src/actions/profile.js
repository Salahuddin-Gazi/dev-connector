import axios from "axios";
import { setAlert } from "./alert";
import { ACCOUNT_DELETE, CLEAR_PROFILE, GET_PROFILE, GET_PROFILES, PROFILE_ERROR, UPDATE_PROFILE, GET_REPOS } from "./types";

// Get all Profiles
export const getProfiles = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/profile");
    dispatch({
      type: GET_PROFILES,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get Current Profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/profile/me");
    dispatch({
      type: GET_PROFILE,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get  Profile by ID
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/profile/user/${userId}`);
    dispatch({
      type: GET_PROFILE,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get Github Repos
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/profile/github/${username}`);
    dispatch({
      type: GET_REPOS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create or Update profile
export const createProfile =
  (formData, navigate, edit = false) =>
  async (dispatch) => {
    try {
      const api = axios.create({
        headers: {
          "Content-type": "application/json",
        },
      });

      // const body = JSON.stringify(formData);
      const { data } = await api.post("/api/profile", formData);
      dispatch({
        type: GET_PROFILE,
        payload: data,
      });
      dispatch(getProfiles());
      dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));
      !edit && navigate("/dashboard");
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) return errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

// Create Experience
export const addExperience = (formData, navigate) => async (dispatch) => {
  try {
    const api = axios.create({
      headers: {
        "Content-type": "application/json",
      },
    });

    // const body = JSON.stringify(formData);
    const { data } = await api.put("/api/profile/experience", formData);
    dispatch({
      type: UPDATE_PROFILE,
      payload: data,
    });

    dispatch(setAlert("Experience Added ...", "success"));
    navigate("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) return errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create Education
export const addEducation = (formData, navigate) => async (dispatch) => {
  try {
    const api = axios.create({
      headers: {
        "Content-type": "application/json",
      },
    });

    // const body = JSON.stringify(formData);
    const { data } = await api.put("/api/profile/education", formData);
    dispatch({
      type: UPDATE_PROFILE,
      payload: data,
    });

    dispatch(setAlert("Education Added ...", "success"));
    navigate("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) return errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete Experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const { data } = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: data,
    });
    dispatch(setAlert("Experience Removed ..", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete Education
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const { data } = await axios.delete(`/api/profile/education/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: data,
    });
    dispatch(setAlert("Education Removed ..", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete Account & Profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm("Are you sure? This action can not be UNDONE.")) {
    try {
      await axios.delete("/api/profile");
      dispatch({
        type: CLEAR_PROFILE,
      });
      dispatch({ type: ACCOUNT_DELETE });
      dispatch(setAlert("Your account has been permanently deleted."));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
