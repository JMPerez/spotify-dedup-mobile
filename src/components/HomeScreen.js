import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import { Linking } from 'react-native';
import { Constants, WebBrowser } from 'expo';
import qs from 'qs';
import { connect } from 'react-redux';
import { authSuccess, fetchMe } from '../redux/session';
// see article on medium https://blog.benestudio.co/build-your-own-spotify-app-in-react-native-ca3714b1cab8
// repo https://github.com/benestudio/react-native-ws-2018-feb
// changeset https://github.com/benestudio/react-native-ws-2018-feb/commits/master

const deviceWidth = Dimensions.get('window').width;

function toQueryString(obj) {
  var parts = [];
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
    }
  }
  return parts.join('&');
}

class HomeScreen extends React.Component {
  static state = { redirectData: '' };
  static navigationOptions = {
    title: 'Spotify Dedup'
  };

  componentDidMount() {
    Linking.getInitialURL().then(url => {
      this._handleInit(url);
    });
  }
  _handleOpenWithLinking = () => {
    Linking.openURL('https://expo.io');
  };

  _openSpotifyAuth = async showDialog => {
    this._addLinkingListener();
    const redirectUrl = Constants.linkingUri;

    const params = {
      client_id: '04dca0de1c4e4aca88cc615ac23581be',
      redirect_uri:
        redirectUrl.indexOf('#') >= 0
          ? redirectUrl.substr(0, redirectUrl.indexOf('#'))
          : redirectUrl,
      response_type: 'token',
      scope: [
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-modify-private'
      ].join(' ')
    };

    if (showDialog === true) params['show_dialog'] = true;

    const url = `https://accounts.spotify.com/authorize?${toQueryString(
      params
    )}`;

    let result = await WebBrowser.openBrowserAsync(
      //`https://backend-xxswjknyfi.now.sh/?linkingUri=${Constants.linkingUri}`
      url
    );
    this._removeLinkingListener();
    this.setState({ result });
  };

  _navigateForward = () => {
    const { navigate } = this.props.navigation;
    navigate('Library');
  };

  processAccessToken = url => {
    let query = url.replace(Constants.linkingUri, '').replace('#', '');
    let data;
    if (query) {
      data = qs.parse(query);
    } else {
      data = null;
    }
    this.setState({ redirectData: data });
    if (data !== null) {
      const accessToken = data['access_token'];
      if (accessToken) {
        this.props.authSuccess(accessToken);
        this.props.fetchMe();
        this._navigateForward();
      }
    }
  };
  _handleInit = url => {
    this.processAccessToken(url);
  };

  _handleRedirect = ({ url }) => {
    WebBrowser.dismissBrowser();
    this.processAccessToken(url);
  };

  _addLinkingListener = () => {
    Linking.addEventListener('url', this._handleRedirect);
  };

  _removeLinkingListener = () => {
    Linking.removeEventListener('url', this._handleRedirect);
  };
  componentWillUnmount() {
    this._removeLinkingListener();
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <Text style={styles.header}>Spotify Playlists Deduplicator</Text>
          <Text>Remove duplicated tracks from your playlists.</Text>
          {this.props.accessToken ? (
            <View>
              <TouchableHighlight
                onPress={this._navigateForward}
                underlayColor="white"
              >
                <View style={styles.mainButton}>
                  <Text style={styles.mainButtonText}>Find duplicates</Text>
                </View>
              </TouchableHighlight>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 12, color: '#666' }}>
                  Logged in as {this.props.username}.{' '}
                </Text>
                <Text
                  style={{ fontSize: 12, color: '#428bca' }}
                  onPress={() => this._openSpotifyAuth(true)}
                >
                  Log in as a different user.
                </Text>
              </View>
            </View>
          ) : (
            <TouchableHighlight
              onPress={this._openSpotifyAuth}
              underlayColor="white"
            >
              <View style={styles.mainButton}>
                <Text style={styles.mainButtonText}>Log in with Spotify</Text>
              </View>
            </TouchableHighlight>
          )}
        </View>
        <TouchableOpacity onPress={() => navigate('About')}>
          <Text style={{ textAlign: 'center', color: '#428bca', padding: 20 }}>
            About Spotify Deduplicator
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10
  },
  header: {
    fontSize: 25,
    padding: 5
  },
  main: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40
  },
  mainButton: {
    borderRadius: 100,
    margin: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#1db954'
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center'
  }
});

const mapStateToProps = state => {
  return {
    accessToken: state.session.accessToken,
    username: state.session.username,
    loaded: state.playlists.loaded,
    playlists: (state.playlists && state.playlists.items) || []
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authSuccess: accessToken => {
      dispatch(authSuccess(accessToken));
    },
    fetchMe: _ => {
      dispatch(fetchMe());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
