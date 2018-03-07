import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Api from '../api/api';

// see https://reactjs.org/docs/context.html
class SpotifyApiContext extends React.Component {
  state = { api: null };
  api = new Api();
  componentWillReceiveProps(props) {
    this.api.getInstance().setAccessToken(props.accessToken);
    this.setState({ api: this.api });
  }
  getChildContext() {
    return { api: this.state.api };
  }

  render() {
    return this.props.children;
  }
}

SpotifyApiContext.childContextTypes = {
  api: PropTypes.object
};

/* const SpotifyApiContext = createContext();
class SpotifyApiContext extends Component {
  state = {api: null};
  componentWillReceiveProps(props) {
    api.setAccessToken(props.accessToken);
    this.setState({api: api});
  }
  render() {
    return (
      <SpotifyApiContext.Provider value={this.state.api}>
        {this.props.children}
      </SpotifyApiContext.Provider>
    )
  }
} */

const mapStateToProps = state => {
  return {
    accessToken: state.session.accessToken
  };
};

export default connect(mapStateToProps, null)(SpotifyApiContext);
