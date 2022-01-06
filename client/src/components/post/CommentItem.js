import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinner from "../layout/Spinner";
import Moment from "react-moment";

// redux
import { connect } from "react-redux";
import { deleteComment } from "../../actions/post";

const CommentItem = ({ postId, comment: { _id, text, name, date, user }, auth, profile: { profiles, loading }, deleteComment }) => {
  return !loading ? (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
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
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">
          Commented on <Moment format="DD/MM/YYYY">{date}</Moment>
        </p>
        {!auth.loading && user === auth.user._id && (
          <button type="button" className="btn btn-danger" onClick={(e) => deleteComment(postId, _id)}>
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  ) : (
    <Spinner />
  );
};

CommentItem.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
