import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default class EmmaScreen extends React.Component {
  state = { color: this.getRandomColor() };
  getRandomColor() {
    return (
      '#' +
      Math.random()
        .toString(16)
        .slice(2, 8)
    );
  }
  render() {
    const style = {
      height: '100%',
      width: '100%',
      backgroundColor: this.state.color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };
    return (
      <TouchableOpacity
        style={style}
        onPress={() => this.setState({ color: this.getRandomColor() })}
      >
        <Text style={{ color: '#ffffff', fontSize: 30, fontWeight: 'bold' }}>
          EMMA
        </Text>
      </TouchableOpacity>
    );
  }
}
