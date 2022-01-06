import React, { Fragment } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";

const ProfileEducation = ({ education }) => {
  const { school, degree, fieldofstudy, description, from, to } = education;
  return (
    <div>
      <h3 className="text-dark">{school}</h3>
      <p>{fieldofstudy ? <Fragment>{fieldofstudy}</Fragment> : ""}</p>
      <p>
        <Moment format="DD/MM/YYYY">{from}</Moment> - {!to ? " Now" : <Moment format="DD/MM/YYYY">{to}</Moment>}
      </p>
      <p>
        <strong>Degree: </strong>
        {degree}
      </p>
      <p>
        {description ? (
          <Fragment>
            <strong>Description: </strong>
            {description}
          </Fragment>
        ) : (
          ""
        )}
      </p>
    </div>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired,
};

export default ProfileEducation;
