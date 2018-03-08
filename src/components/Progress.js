import React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  progressContainer: {
    borderColor: '#ab89d3',
    borderRadius: 20,
    borderWidth: 4,
    height: 32
  }
});

const innerProgressStyles = progressValue => ({
  backgroundColor: '#ab89d3',
  borderRadius: 20,
  borderWidth: 4,
  borderColor: '#fff',
  height: 24,
  width: `${Math.max(6, progressValue)}%`
});

export default (props) =>(
  <View style={styles.progressContainer}>
    <View style={innerProgressStyles(props.value)} />
  </View>
);
