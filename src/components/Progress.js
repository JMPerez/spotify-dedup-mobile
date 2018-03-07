import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  progressContainer: {
    borderColor: '#AB89D3',
    borderRadius: 20,
    borderWidth: 4,
    height: 32
  }
});

const progressStyles = progressValue => ({
  backgroundColor: '#AB89D3',
  borderRadius: 20,
  height: 16,
  margin: 4,
  width: `${progressValue}%`
});

export default class Progress extends React.Component {
  render() {
    return (
      <View style={styles.progressContainer}>
        <View style={progressStyles(this.props.value)} />
      </View>
    );
  }
}
