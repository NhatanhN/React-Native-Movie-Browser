/**
 * A simple text input with some styling. Accepts style, value, onChangeText,
 * placeholder, and secureTextEntry props like the built-in TextInput component
 * does.
 */

import { TextInput, StyleSheet } from 'react-native';

function CustomTextInput({
  style,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
}) {
  return (
    <TextInput
      style={[styles.textInput, value == '' && styles.italics, style]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={'#555555'}
      secureTextEntry={secureTextEntry}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 4,
    padding: 7,
    paddingLeft: 15,
    margin: 7,
    fontSize: 20,
    backgroundColor: "ghostwhite"
  },
  italics: {
    fontStyle: 'italic',
  },
});

export default CustomTextInput;
