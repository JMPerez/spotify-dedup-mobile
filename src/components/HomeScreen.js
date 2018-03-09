import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import Auth from './Auth';

// see article on medium https://blog.benestudio.co/build-your-own-spotify-app-in-react-native-ca3714b1cab8
// repo https://github.com/benestudio/react-native-ws-2018-feb
// changeset https://github.com/benestudio/react-native-ws-2018-feb/commits/master

class HomeScreen extends React.Component {
  static state = { redirectData: '' };
  static navigationOptions = {
    title: 'Spotify Dedup'
  };

  _navigateForward = () => {
    const { navigate } = this.props.navigation;
    navigate('Library');
  };

  render() {
    const { navigate } = this.props.navigation;
    const { isLoggedIn, username } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <Text style={styles.header}>Spotify Playlists Deduplicator</Text>
          <Text>Remove duplicated tracks from your playlists.</Text>
          <Auth
            renderLoggedOut={login => (
              <TouchableHighlight
                onPress={() => {
                  login().then(() => this._navigateForward());
                }}
                underlayColor="#fff"
              >
                <View style={styles.mainButton}>
                  <Text style={styles.mainButtonText}>Log in with Spotify</Text>
                </View>
              </TouchableHighlight>
            )}
            renderLoggedIn={(username, login) => (
              <View>
                <TouchableHighlight
                  onPress={this._navigateForward}
                  underlayColor="#fff"
                >
                  <View style={styles.mainButton}>
                    <Text style={styles.mainButtonText}>Find duplicates</Text>
                  </View>
                </TouchableHighlight>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#666',
                    textAlign: 'center',
                    paddingBottom: 5
                  }}
                >
                  Logged in as {username}.
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontSize: 12, color: '#666' }}>
                    Not you?{' '}
                    <Text
                      style={{ color: '#428bca' }}
                      onPress={() =>
                        login(true).then(() => this._navigateForward())
                      }
                    >
                      Log in as a different user.
                    </Text>
                  </Text>
                </View>
              </View>
            )}
          />
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

export default HomeScreen;
