import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FileBase64 from "react-file-base64";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";
import { createProfile } from "../../actions/profile";
import { setAlert } from "../../actions/alert";

const CreateProfile = ({ createProfile, setAlert }) => {
  const [formData, setFormData] = useState({
    avatar: "",
    company: "",
    website: "",
    location: "",
    status: "",
    skills: "",
    githubusername: "",
    bio: "",
    twitter: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    instagram: "",
  });

  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  const { avatar, company, website, location, status, skills, githubusername, bio, twitter, facebook, linkedin, youtube, instagram } = formData;

  // image state
  const [image, toggleImage] = useState({
    poster: false,
  });
  const { poster } = image;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createProfile(formData, navigate);
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Create Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Let's get some information to make your profile stand out
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        {/*  */}
        {/* Update Avatar */}
        <div className="form-group col-md-8 pb-3 input-group-lg">
          <div className="card card-body my-2" style={{ overflow: "hidden" }}>
            <div>
              {avatar ? (
                <Fragment>
                  <label className="text-muted d-block">Avatar</label>
                  <img
                    src={avatar}
                    alt="Prev."
                    style={{ maxHeight: "150px", maxWidth: "150px", display: "block", border: "10px", padding: "2px", margin: "5px" }}
                  />
                </Fragment>
              ) : (
                <Fragment>
                  <label className="text-muted d-block">Add Avatar</label>
                </Fragment>
              )}
              {!poster && (
                <button
                  className="btn btn-dark mt-1"
                  style={{ maxHeight: "150px", maxWidth: "150px", display: "block", border: "10px" }}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleImage({ ...image, poster: !image.poster });
                  }}
                >
                  Update
                </button>
              )}
            </div>
            {poster ? (
              <div id="img" className="form-control quantityBtn d-block mt-1">
                <small className="d-block text-primary mb-1">Not more than 5MB</small>
                <div className="d-block">
                  <FileBase64
                    name="avatarImage"
                    type="image"
                    multiple={false}
                    onDone={(file) => {
                      if (file.type.slice(0, 5) === "image") {
                        setFormData({ ...formData, avatar: file.base64 });
                        toggleImage({ ...image, poster: !image.poster });
                      } else {
                        setFormData({ ...formData, avatar: "" });
                        setAlert("Select Only Image", "danger");
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        {/*  */}

        <div className="form-group">
          <select name="status" value={status} onChange={(e) => onChange(e)}>
            <option value="0">* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Asstt. Manager">Asstt. Manager</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text">Give us an idea of where you are at in your career</small>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Company" name="company" value={company} onChange={(e) => onChange(e)} />
          <small className="form-text">Could be your own company or one you work for</small>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Website" name="website" value={website} onChange={(e) => onChange(e)} />
          <small className="form-text">Could be your own or a company website, example https://www.example.com</small>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Location" name="location" value={location} onChange={(e) => onChange(e)} />
          <small className="form-text">City & state suggested (eg. Boston, MA)</small>
        </div>
        <div className="form-group">
          <input type="text" placeholder="* Skills" name="skills" value={skills} onChange={(e) => onChange(e)} />
          <small className="form-text">Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)</small>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Github Username" name="githubusername" value={githubusername} onChange={(e) => onChange(e)} />
          <small className="form-text">If you want your latest repos and a Github link, include your username</small>
        </div>
        <div className="form-group">
          <textarea placeholder="A short bio of yourself" name="bio" value={bio} onChange={(e) => onChange(e)}></textarea>
          <small className="form-text">Tell us a little about yourself</small>
        </div>

        <div className="my-2">
          <button type="button" className="btn btn-light" onClick={() => toggleSocialInputs(!displaySocialInputs)}>
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>
        {displaySocialInputs && (
          <Fragment>
            <div className="form-group social-input">
              <i className="fab fa-twitter fa-2x"></i>
              <input type="text" placeholder="Twitter URL" name="twitter" value={twitter} onChange={(e) => onChange(e)} />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-facebook fa-2x"></i>
              <input type="text" placeholder="Facebook URL" name="facebook" value={facebook} onChange={(e) => onChange(e)} />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-youtube fa-2x"></i>
              <input type="text" placeholder="YouTube URL" name="youtube" value={youtube} onChange={(e) => onChange(e)} />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-linkedin fa-2x"></i>
              <input type="text" placeholder="Linkedin URL" name="linkedin" value={linkedin} onChange={(e) => onChange(e)} />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-instagram fa-2x"></i>
              <input type="text" placeholder="Instagram URL" name="instagram" value={instagram} onChange={(e) => onChange(e)} />
            </div>
          </Fragment>
        )}
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default connect(null, { createProfile, setAlert })(CreateProfile);
