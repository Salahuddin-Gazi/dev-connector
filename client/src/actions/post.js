import axios from "axios";
import { ADD_COMMENT, ADD_POST, DELETE_COMMENT, DELETE_POST, GET_POST, GET_POSTS, POST_ERROR, UPDATE_LIKES } from "./types";
import { setAlert } from "./alert";

// Get All Posts
export const getPosts = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/posts`);
    dispatch({
      type: GET_POSTS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get a post by ID
export const getPost = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/posts/${id}`);
    dispatch({
      type: GET_POST,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create a post
export const addPost = (formData) => async (dispatch) => {
  try {
    // axios header set
    const api = axios.create({
      headers: {
        "Content-type": "application/json",
      },
    });
    const { data } = await api.post(`/api/posts`, formData);
    dispatch({
      type: ADD_POST,
      payload: data,
    });
    dispatch(setAlert("Post Created...", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete a post
export const deletePost = (id) => async (dispatch) => {
  try {
    const {
      data: { msg },
    } = await axios.delete(`/api/posts/${id}`);
    dispatch({
      type: DELETE_POST,
      payload: id,
    });
    dispatch(setAlert(msg, "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add like
export const addLike = (id) => async (dispatch) => {
  try {
    const { data } = await axios.put(`/api/posts/like/${id}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: data },
    });
  } catch (err) {
    dispatch(setAlert(err.response.data.msg, "danger"));
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Remove like
export const removeLike = (id) => async (dispatch) => {
  try {
    const { data } = await axios.put(`/api/posts/unlike/${id}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: data },
    });
  } catch (err) {
    dispatch(setAlert(err.response.data.msg, "danger"));
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add Comment To Single Post
export const addComment = (postId, formData) => async (dispatch) => {
  try {
    // axios header set
    const api = axios.create({
      headers: {
        "Content-type": "application/json",
      },
    });
    const { data } = await api.post(`/api/posts/comment/${postId}`, formData);
    dispatch({
      type: ADD_COMMENT,
      payload: data,
    });
    dispatch(setAlert("Comment Added Success...", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete Comment To Single Post
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    const {
      data: { msg },
    } = await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
    dispatch({
      type: DELETE_COMMENT,
      payload: commentId,
    });
    dispatch(setAlert(msg, "danger"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
