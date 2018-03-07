import React from 'react';
import {
  FlatList,
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  Button,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import { connect } from 'react-redux';
import {
  fetchPlaylists,
  findDuplicates,
  removeDuplicates,
  STATES,
  getProgress,
  getPlaylistsWithDuplicates
} from '../redux/playlists';
import Progress from './Progress';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10
  },
  listItem: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row'
  },
  coverArt: {
    width: 50,
    height: 50,
    marginRight: 10
  },
  body: {
    flex: 1
  },
  bodyHeader: {
    fontWeight: 'bold'
  },
  header: {
    fontSize: 20,
    paddingBottom: 5,
    textAlign: 'center',
    color: '#333'
  }
});

class LibraryScreen extends React.Component {
  static navigationOptions = {
    title: 'Processing your Library'
  };
  componentDidMount() {
    this.props.fetchPlaylists();
  }
  render() {
    switch (this.props.libraryState) {
      case STATES.LOADING:
        return (
          <View style={styles.container}>
            <Text style={styles.header}>Fetching playlists...</Text>
            <Progress value={0} />
            <View style={{ height: 50, paddingTop: 5 }}>
              <Text style={{ textAlign: 'center' }}>
                Getting the list of your playlists
              </Text>
            </View>
            <Text
              style={{ textAlign: 'center' }}
              onPress={() => this.props.navigation.goBack()}
            >
              Cancel
            </Text>
          </View>
        );
      case STATES.FINDING_DUPLICATES:
        return (
          <View style={styles.container}>
            <Text style={styles.header}>Finding duplicates...</Text>
            <Progress value={this.props.progress} />
            <View style={{ height: 50, paddingTop: 5 }}>
              {this.props.processingPlaylist && (
                <Text style={{ textAlign: 'center' }}>
                  {this.props.processingPlaylist.name}
                </Text>
              )}
            </View>
            <Text
              style={{ textAlign: 'center' }}
              onPress={() => this.props.navigation.goBack()}
            >
              Cancel
            </Text>
          </View>
        );
      case STATES.DONE:
        return (
          <View style={styles.container}>
            <Text style={styles.header}>Done finding duplicates!</Text>
            {this.props.playlistsWithDuplicates.length === 0 ? (
              <Text>
                Spotify Dedup couldn't find any duplicate track in your library.
                Congrats!
              </Text>
            ) : (
              <View>
                <Text>
                  Spotify Dedup found{' '}
                  {this.props.playlistsWithDuplicates.length}{' '}
                  {this.props.playlistsWithDuplicates.length > 1
                    ? 'playlists'
                    : 'playlist'}{' '}
                  with duplicate tracks
                </Text>
                <ScrollView>
                  <FlatList
                    data={this.props.playlistsWithDuplicates}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item }) => (
                      <View style={styles.listItem}>
                        {item.images && item.images.length ? (
                          <Image
                            source={{ uri: item.images[0].url }}
                            style={styles.coverArt}
                          />
                        ) : null}
                        <View style={styles.body}>
                          <Text style={styles.bodyHeader}>{item.name}</Text>
                          <Text>({item.duplicates.length})</Text>
                          <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                              onPress={() => this.props.removeDuplicates(item)}
                            >
                              <View>
                                <Text>Remove Duplicates</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                          {item.duplicates.map((d, i) => (
                            <View>
                              <Text key={i}>
                                {d.track.name} by {d.track.artists[0].name}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  />
                </ScrollView>
              </View>
            )}
            <Text
              style={{ textAlign: 'center' }}
              onPress={() => this.props.navigation.goBack()}
            >
              Done
            </Text>
          </View>
        );
    }
  }
}

const mapStateToProps = state => {
  return {
    loaded: state.playlists.loaded,
    libraryState: state.playlists.libraryState,
    playlists: state.playlists.items || [],
    playlistsWithDuplicates: getPlaylistsWithDuplicates(state),
    progress: getProgress(state),
    processingPlaylist: state.playlists.processing
  };
};

const mapDispatchToProps = dispatch => {
  return {
    removeDuplicates: playlist => {
      dispatch(removeDuplicates(playlist));
    },
    fetchPlaylists: id => {
      dispatch(fetchPlaylists());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LibraryScreen);
