import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Linking
} from 'react-native';

class AboutScreen extends React.Component {
  static navigationOptions = {
    title: 'About Spotify Deduplicator'
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={{ marginBottom: 30 }}>
          <View style={styles.feature}>
            <Text style={styles.heading}>Find & Remove</Text>
            <Text>
              The tool traverses the playlists in your Spotify library. Once it
              finds duplicates you can remove them per-playlist basis.
            </Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.heading}>Safe</Text>
            <Text>
              No tracks will be deleted except for duplicates, and only in the
              playlists you want to.
            </Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.heading}>Open Source</Text>
            <Text>
              You might want to have a look at the source code on GitHub. This
              mobile app uses the Spotify Web API to manage user's playlists.
            </Text>
            <TouchableOpacity>
              <Text
                style={{ color: '#428bca', paddingTop: 5 }}
                onPress={() =>
                  Linking.openURL('https://jmperezperez.com/spotify-dedup/')
                }
              >
                Check out the code on GitHub
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.feature}>
            <Text style={styles.heading}>Web Version</Text>
            <View>
              <Text>
                Try out Spotify Deduplicator on the web, which has been helping
                users clean up their duplicates since 2014.
              </Text>
              <TouchableOpacity>
                <Text
                  style={{ color: '#428bca', paddingTop: 5 }}
                  onPress={() =>
                    Linking.openURL('https://jmperezperez.com/spotify-dedup/')
                  }
                >
                  Spotify Deduplicator on the web
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity>
          <Text
            style={{ color: '#428bca' }}
            onPress={() => Linking.openURL('https://jmperezperez.com/')}
          >
            Made with ♥ by JMPerez
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  feature: {
    padding: 10
  },
  features: {
    alignItems: 'center'
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 20
  }
});

export default AboutScreen;
