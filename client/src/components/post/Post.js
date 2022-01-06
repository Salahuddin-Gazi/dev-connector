import React, { Fragment, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import PostItem from "../posts/PostItem";
import Spinner from "../layout/Spinner";
import PropTypes from "prop-types";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

// redux
import { connect } from "react-redux";
import { getPost } from "../../actions/post";

const Post = ({ post: { post, loading }, getPost }) => {
  const { id } = useParams();
  useEffect(() => {
    getPost(id);
  }, [getPost, id]);
  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to="/posts" className="btn btn-light">
        Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      <div className="comments">
        {post.comments.length > 0 && post.comments.map((comment) => <CommentItem key={comment._id} comment={comment} postId={post._id} />)}
      </div>
    </Fragment>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  getPost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
