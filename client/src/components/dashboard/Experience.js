import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

// redux
import { connect } from "react-redux";
import { deleteExperience } from "../../actions/profile";

const Experience = ({ experience, deleteExperience }) => {
  if (experience.length > 0) {
    const experiences = experience.map((exp) => (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td className="hide-sm">{exp.title}</td>
        <td>
          <Moment format="DD/MM/YYYY">{exp.from}</Moment> - {exp.to === null ? " Now" : <Moment format="DD/MM/YYYY">{exp.to}</Moment>}
        </td>
        <td>
          <button className="btn btn-danger" onClick={() => deleteExperience(exp._id)}>
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <Fragment>
        <h2 className="my-2">Experience Credentials</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th className="hide-sm">Title</th>
              <th className="hide-sm">Years</th>
              <th />
            </tr>
          </thead>
          <tbody>{experiences}</tbody>
        </table>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <h2 className="my-2">Add Some Experience To Show</h2>
      </Fragment>
    );
  }
};

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired,
};

export default connect(null, { deleteExperience })(Experience);
