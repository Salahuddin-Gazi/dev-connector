import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Dashboard from "../dashboard/Dashboard";
import CreateProfile from "../profile-forms/CreateProfile";
import Alert from "../layout/alert";
import EditProfile from "../profile-forms/EditProfile";
import AddEducation from "../profile-forms/AddEducation";
import AddExperience from "../profile-forms/AddExperience";
import Profiles from "../profiles/Profiles";
import Profile from "../profile/Profile";
import Posts from "../posts/Posts";
import Post from "../post/Post";
import NotFound from "../layout/NotFound";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => (
  <section className="container">
    <Alert />
    <Routes>
      <Route strict path="login" element={<Login />} />
      <Route strict path="register" element={<Register />} />
      <Route strict path="profiles" element={<Profiles />} />
      <Route strict path="profile/:id" element={<Profile />} />
      <Route
        strict
        path="dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        strict
        path="create-profile"
        element={
          <PrivateRoute>
            <CreateProfile />
          </PrivateRoute>
        }
      />
      <Route
        strict
        path="edit-profile"
        element={
          <PrivateRoute>
            <EditProfile />
          </PrivateRoute>
        }
      />
      <Route
        strict
        path="add-education"
        element={
          <PrivateRoute>
            <AddEducation />
          </PrivateRoute>
        }
      />
      <Route
        strict
        path="add-experience"
        element={
          <PrivateRoute>
            <AddExperience />
          </PrivateRoute>
        }
      />
      <Route
        strict
        path="posts"
        element={
          <PrivateRoute>
            <Posts />
          </PrivateRoute>
        }
      />
      <Route
        strict
        path="post/:id"
        element={
          <PrivateRoute>
            <Post />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </section>
);

export default AppRoutes;
