/*
 * Implements a create new account screen, where the users provides a username and
 * password to create an account.
 */

import { useState, useContext } from 'react';
import { Text, View } from 'react-native';

import SettingsContext from '../../appContexts/SettingsContext';
import CustomTextInput from '../../components/CustomTextInput';
import SubmitButton from '../../components/SubmitButton';
import { createNewAccount, doesUserIDExist } from '../../database/databaseApi';
import styles from '../../stylesheets/base';
import { COLORS } from '../../stylesheets/base';

function NewAccountScreen({ navigation }) {
  const settingsCtx = useContext(SettingsContext);

  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [usernameStatus, setUsernameStatus] = useState('Enter a username');
  const [pwStatusLength, setPwStatusLength] = useState('Enter a password');
  const [pwStatusMatch, setPwStatusMatch] = useState('');

  async function onUsernameInput(username) {
    setUsername(username);
    if (username.length == 0) {
      setUsernameStatus('Enter a username');
    } else if (username.length < 4) {
      setUsernameStatus('Username should be at least 4 characters long');
    } else if (await doesUserIDExist(username)) {
      setUsernameStatus('Username is already taken');
    } else {
      setUsernameStatus('Username is available');
    }
  }

  function onPassword1Input(password) {
    setPassword1(password);
    if (password.length == 0) {
      setPwStatusLength('Enter a password');
    } else if (password.length < 4 || password1.length < 4) {
      setPwStatusLength('Passwords should be at least 4 characters long');
    } else {
      setPwStatusLength('Passwords are at least 4 characters long');
    }
    if (password != password1) {
      setPwStatusMatch('Passwords do not match');
    } else {
      setPwStatusMatch('Passwords match');
    }
  }

  function onPassword2Input(password) {
    setPassword2(password);
    if (password.length < 4 || password1.length < 4) {
      setPwStatusLength('Passwords should be at least 4 characters long');
    } else {
      setPwStatusLength('Passwords are at least 4 characters long');
    }
    if (password.length == 0) {
      setPwStatusMatch('');
    } else if (password != password1) {
      setPwStatusMatch('Passwords do not match');
    } else {
      setPwStatusMatch('Passwords match');
    }
  }

  /**
   * Creates a new account associated with the username and password. Returns and
   * does nothing if the passwords do not match after setting an appropriate status
   * message.
   */
  async function onCreateAccPress() {
    try {
      //Async call will throw an error if the username and password are less than
      //three characters long
      const newUserID = await createNewAccount(username, password1);
      settingsCtx.setUserID(newUserID);
      navigation.pop(2);
    } catch (e) {
      setUsernameStatus(e.message);
      setPwStatusLength('');
      setPwStatusMatch('');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Account</Text>
      <View style={styles.form}>
        <CustomTextInput
          style={styles.userInputs}
          value={username}
          onChangeText={onUsernameInput}
          placeholder={'Enter username'}
        />
        <CustomTextInput
          style={styles.userInputs}
          value={password1}
          onChangeText={onPassword1Input}
          placeholder={'Enter password'}
          secureTextEntry
        />
        <CustomTextInput
          style={styles.userInputs}
          value={password2}
          onChangeText={onPassword2Input}
          placeholder={'Reenter password'}
          secureTextEntry
        />
        <Text
          style={{
            ...styles.statusMsg,
            color:
              usernameStatus == 'Enter a username'
                ? COLORS.gray
                : usernameStatus == 'Username is available'
                ? COLORS.green
                : COLORS.red,
          }}>
          {usernameStatus}
        </Text>
        <Text
          style={{
            ...styles.statusMsg,
            color:
              pwStatusLength == 'Enter a password'
                ? COLORS.gray
                : pwStatusLength == 'Passwords are at least 4 characters long'
                ? COLORS.green
                : COLORS.red,
          }}>
          {pwStatusLength}
        </Text>
        {pwStatusMatch != '' && (
          <Text
            style={{
              ...styles.statusMsg,
              color:
                pwStatusMatch == 'Passwords match' ? COLORS.green : COLORS.red,
            }}>
            {pwStatusMatch}
          </Text>
        )}
      </View>
      <View style={styles.spacer} />
      <View>
        <SubmitButton
          onPress={onCreateAccPress}
          buttonText={'Create Account'}
        />
      </View>
    </View>
  );
}

export default NewAccountScreen;
