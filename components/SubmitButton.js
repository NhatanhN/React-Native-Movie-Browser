/**
 * A simple button component with some styling. Accepts style prop for styling the
 * surroundings of the text, an onPress prop which receives a function to invoke on press,
 * and a buttonText prop that displays a text label for the button
 */

import { useRef } from 'react';
import { Easing, Animated, Pressable, Text, StyleSheet } from 'react-native';
import { COLORS } from '../stylesheets/base';

function SubmitButton({ style, onPress, buttonText }) {
  const colorAnim = useRef(new Animated.Value(0)).current;
  const backgroundColor = style
    ? style.backgroundColor ?? COLORS.themeLight.c2
    : COLORS.themeLight.c2;

  function focus() {
    Animated.timing(colorAnim, {
      toValue: 1,
      duration: 30,
      easing: Easing.linear(Easing.ease),
      useNativeDriver: false,
    }).start();
  }

  function unfocus() {
    Animated.timing(colorAnim, {
      toValue: 0,
      duration: 320,
      easing: Easing.linear(Easing.ease),
      useNativeDriver: false,
    }).start();
  }

  return (
    <Pressable
      style={[styles.button, style]}
      onPressIn={focus}
      onPressOut={unfocus}
      onPress={onPress}>
      <Animated.View
        style={{
          padding: 7,
          backgroundColor: colorAnim.interpolate({
            inputRange: [0, 5],
            outputRange: [backgroundColor, 'black'],
          }),
        }}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 4,
    margin: 7,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default SubmitButton;
