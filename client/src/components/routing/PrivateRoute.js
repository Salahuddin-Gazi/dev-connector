import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const PrivateRoute = ({ isAuthenticated, loading, children }) => {
  return !isAuthenticated && !loading ? <Navigate to="/login" /> : children;
};

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});

export default connect(mapStateToProps)(PrivateRoute);
