import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Moment from "react-moment";

// redux
import { connect } from "react-redux";
import { addLike, removeLike, deletePost } from "../../actions/post";
// import { getProfileById } from "../../actions/profile";

const PostItem = ({ post: { _id, user, name, text, date, likes, comments }, auth, profiles, addLike, removeLike, deletePost, showActions }) => {
  return (
    <div className="posts">
      <div className="post bg-white p-1 my-1">
        <div>
          <Link to={`/profile/${user}`}>
            <h4>{name}</h4>
            {profiles && profiles.filter((profile) => profile.user._id === user).length > 0 ? (
              profiles.filter((profile) => profile.user._id === user)[0].avatar ? (
                <img
                  src={profiles.filter((profile) => profile.user._id === user)[0].avatar}
                  alt={name}
                  style={{ height: "50px", width: "50px", borderRadius: "50%" }}
                />
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </Link>
        </div>
        <div>
          <p className="my-1">{text}</p>
          <p className="post-date">
            Posted on <Moment format="DD/MM/YYYY">{date}</Moment>
          </p>
          {showActions && (
            <Fragment>
              <button type="button" className="btn btn-light" onClick={(e) => addLike(_id)}>
                <i className="fas fa-thumbs-up"></i> {likes.length > 0 && <span>{likes.length}</span>}
              </button>
              <button type="button" className="btn btn-light" onClick={(e) => removeLike(_id)}>
                <i className="fas fa-thumbs-down"></i>
              </button>
              <Link to={`/post/${_id}`} className="btn btn-primary">
                Discussion {comments.length > 0 && <span className="comment-count">{comments.length}</span>}
              </Link>
              {auth.isAuthenticated && auth.user._id === user && (
                <Fragment>
                  <button type="button" className="btn btn-danger" onClick={(e) => deletePost(_id)}>
                    <i className="fas fa-times"></i>
                  </button>
                </Fragment>
              )}
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  profiles: PropTypes.array.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

PostItem.defaultProps = {
  showActions: true,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profiles: state.profile.profiles,
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(PostItem);
