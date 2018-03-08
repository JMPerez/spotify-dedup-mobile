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
import DuplicatedListItem from './DuplicatedListItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10
  },
  coverArt: {
    width: 50,
    height: 50,
    marginRight: 10
  },
  header: {
    fontSize: 20,
    paddingBottom: 5,
    textAlign: 'center',
    color: '#333'
  }
});

class LibraryScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      headerTitle: 'Processing Library',
      headerRight: (
        <Button onPress={() => navigation.goBack()} title="Cancel" color="#fff" />
      ),
    }
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
            <View style={{ height: 80, paddingTop: 5 }}>
              <Text style={{ textAlign: 'center' }}>
                Getting the list of your playlists
              </Text>
            </View>
            <Text
              style={{ textAlign: 'center', color: '#ef5350', fontSize: 12 }}
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
            <View style={{ height: 80, paddingTop: 5 }}>
              {this.props.processingPlaylist && (
                <Text style={{ textAlign: 'center' }}>
                  {this.props.processingPlaylist.name}
                </Text>
              )}
            </View>
            <Text
              style={{ textAlign: 'center', color: '#ef5350', fontSize: 12 }}
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
              <Text style={{textAlign: 'center'}}>
                There are no duplicates in your library. Congrats!
              </Text>
            ) : (
              <View>
                <View style={{marginBottom: 20}}>
                  <Text style={{textAlign: 'center'}}>
                    Found duplicates in{' '}
                    {this.props.playlistsWithDuplicates.length}{' '}
                    {this.props.playlistsWithDuplicates.length > 1
                      ? 'playlists'
                      : 'playlist'}
                  </Text>
                </View>
                <ScrollView>
                  <FlatList
                    data={this.props.playlistsWithDuplicates}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item }) => {
                      const imageUrl = item.images && item.images.length ? item.images[item.images.length - 1].url : null;
                      return <DuplicatedListItem
                        imageUrl={imageUrl}
                        title={item.name}
                        subtitle={`${item.duplicates.length} ${item.duplicates.length > 1 ? 'Duplicates' : 'Duplicate'}`}
                        duplicates={item.duplicates}
                        duplicatesClick={() => this.props.removeDuplicates(item)} />;
                    }}
                  />
                </ScrollView>
              </View>
            )}
            <View style={{marginTop: 40}}>
              <Text
                style={{ color: '#428bca', textAlign: 'center' }}
                onPress={() => this.props.navigation.goBack()}
              >
                Go Back
              </Text>
            </View>
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
