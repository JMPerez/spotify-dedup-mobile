import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  progressContainer: {
    borderColor: '#AB89D3',
    borderRadius: 20,
    borderWidth: 4,
    height: 32
  },
  header: {
    fontSize: 20,
    paddingBottom: 5,
    textAlign: 'center',
    color: '#333'
  }
});

const progressStyles = progressValue => ({
  backgroundColor: '#AB89D3',
  borderRadius: 20,
  height: 16,
  margin: 4,
  width: `${progressValue}%`
});

class Progress extends React.Component {
  render() {
    return (
      <View style={styles.progressContainer}>
        <View style={progressStyles(this.props.value)}>
          <Text>{this.props.value}</Text>
        </View>
      </View>
    );
  }
}

export default class ProgressScreen extends React.Component {
  state = { progress: 50 };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Finding duplicates...</Text>
        <Progress value={this.state.progress} />
      </View>
    );
  }
}
