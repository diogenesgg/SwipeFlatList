/* eslint-disable no-console */
import React from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, PanResponder, TouchableHighlight } from 'react-native';

var screenWidth = Dimensions.get('window').width;

export default class ListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.gestureDelay = -5;
    this.scrollViewEnabled = true;

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => false,
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (e, gestureState) =>  Math.abs(gestureState.dx) > 4,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 5) {
          let newX = gestureState.dx + this.gestureDelay;
          position.setValue({x: newX, y: 0});
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < 60) {
          Animated.timing(this.state.position, {
            toValue: {x: 0, y: 0},
            duration: 150,
          }).start(() => {
          });
        } else {
          Animated.timing(this.state.position, {
            toValue: {x: screenWidth/3, y: 0},
            duration: 300,
          }).start(() => {
            //this.props.success(this.props.text);
          });
        }
      },
    });

    this.panResponder = panResponder;
    this.state = {position, open: false};
  }

  setScrollViewEnabled(enabled) {
    if (this.scrollViewEnabled !== enabled) {
      this.props.setScrollEnabled(enabled);
      this.scrollViewEnabled = enabled;
    }
  }

  onDeletePressed = () => {
    console.warn('onDeletePressed')
  }

  render() {
    return (
      <View style={styles.listItem}>
        <View style={styles.hiddenCell}>
        <TouchableHighlight onPress={this.onDeletePressed}><Text style={styles.hiddenCellText}>DELETE</Text></TouchableHighlight>
        </View>
        <Animated.View style={[this.state.position.getLayout()]} {...this.panResponder.panHandlers}>
          <View style={styles.visibleCell}>
            <Text>
              {this.props.text}
            </Text>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    height: 80,
    justifyContent: 'center',
    flex: 1
  },
  hiddenCell: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  hiddenCellText: {
    margin: 16,
    color: '#757575',
  },
  visibleCell: {
    height: 80,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
