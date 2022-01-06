import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

// redux
import { connect } from "react-redux";
import { deleteEducation } from "../../actions/profile";

const Education = ({ education, deleteEducation }) => {
  if (education.length > 0) {
    const educations = education.map((exp) => (
      <tr key={exp._id}>
        <td>{exp.school}</td>
        <td className="hide-sm">{exp.degree}</td>
        <td>
          <Moment format="DD/MM/YYYY">{exp.from}</Moment> - {exp.to === null ? " Now" : <Moment format="DD/MM/YYYY">{exp.to}</Moment>}
        </td>
        <td>
          <button className="btn btn-danger" onClick={() => deleteEducation(exp._id)}>
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <Fragment>
        <h2 className="my-2">Education Credentials</h2>
        <table className="table">
          <thead>
            <tr>
              <th>School</th>
              <th className="hide-sm">Degree</th>
              <th className="hide-sm">Years</th>
              <th />
            </tr>
          </thead>
          <tbody>{educations}</tbody>
        </table>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <h2 className="my-2">Add Education To Show</h2>
      </Fragment>
    );
  }
};

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired,
};

export default connect(null, { deleteEducation })(Education);
