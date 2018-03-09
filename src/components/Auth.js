import { connect } from 'react-redux';
import { getUsername, showLogin } from '../redux/session';
export default connect(
  state => ({
    username: getUsername(state.session)
  }),
  {
    onLogin: showLogin
  }
)(function Auth(props) {
  return props.username
    ? props.renderLoggedIn(props.username, props.onLogin)
    : props.renderLoggedOut(props.onLogin);
});
