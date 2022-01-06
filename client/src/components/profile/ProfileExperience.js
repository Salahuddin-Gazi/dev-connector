import React, { Fragment } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";

const ProfileExperience = ({ experience }) => {
  const { company, title, location, description, from, to } = experience;
  return (
    <div>
      <h3 className="text-dark">{company}</h3>
      <p>{location && <Fragment>{location}</Fragment>}</p>
      <p>
        <Moment format="DD/MM/YYYY">{from}</Moment> - {!to ? " Now" : <Moment format="DD/MM/YYYY">{to}</Moment>}
      </p>
      <p>
        <strong>Position: </strong>
        {title}
      </p>
      <p>
        <strong>Description: </strong>
        {description && <Fragment>{description}</Fragment>}
      </p>
    </div>
  );
};

ProfileExperience.propTypes = {
  experience: PropTypes.object.isRequired,
};

export default ProfileExperience;
