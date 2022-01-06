import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";
import { getGithubRepos } from "../../actions/profile";

const ProfileGithub = ({ username, repos, getGithubRepos }) => {
  useEffect(() => {
    if (username !== null && username !== "") return getGithubRepos(username);
  }, [getGithubRepos, username]);
  return (
    <Fragment>
      {repos === null ? (
        <h4>No repos found</h4>
      ) : (
        repos.map((repo) => (
          <div className="repo bg-white p-1 my-1" key={repo.id}>
            <div>
              <h4>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>
              </h4>
              {repo.description !== null && <p>{repo.description}</p>}
            </div>
            <div>
              <ul>
                <li className="badge badge-primary">Stars: {repo.stargazers_count}</li>
                <li className="badge badge-dark">Watchers: {repo.watchers_count}</li>
                <li className="badge badge-light">Forks: {repo.forks_count}</li>
              </ul>
            </div>
          </div>
        ))
      )}
    </Fragment>
  );
};

ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired,
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  repos: state.profile.repos,
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
