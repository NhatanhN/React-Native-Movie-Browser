/**
 * Implements a login screen. Logging in is done by finding the userID associated
 * with some login credentials and triggering a rerender in the App.js component
 * by setting the userID state with the userID found
 */

import { useState, useContext } from 'react';
import { View, Text } from 'react-native';

import { getUserID } from '../../database/databaseApi';
import SettingsContext from '../../appContexts/SettingsContext';
import SubmitButton from '../../components/SubmitButton';
import CustomTextInput from '../../components/CustomTextInput';
import styles from '../../stylesheets/base';

function LoginScreen({ navigation }) {
  const settingsCtx = useContext(SettingsContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  /**
   * Finds the userID associated with the username and password, setting the
   * userID if found, and setting an appropriate status message if not
   */
  async function onLogin() {
    try {
      const id = await getUserID(username, password);
      if (id == -1) {
        setStatusMsg('No account found associated with credentials');
        return;
      }
      settingsCtx.setUserID(id);
      navigation.pop();
    } catch (err) {
      setStatusMsg(err.Message);
    }
  }

  /**
   * Navigates to the new account screen
   */
  function onCreateAccount() {
    navigation.navigate('Create a new account');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <View style={styles.form}>
        <CustomTextInput
          value={username}
          onChangeText={setUsername}
          placeholder={'Username'}
        />
        <CustomTextInput
          value={password}
          onChangeText={setPassword}
          placeholder={'Password'}
          secureTextEntry
        />
        <SubmitButton
          style={styles.button}
          onPress={onLogin}
          buttonText={'Login'}
        />
        {statusMsg != '' && <Text style={styles.statusMsg}>{statusMsg}</Text>}
      </View>

      <Text style={[styles.secondaryText, styles.italics]}>
        Create a user account by clicking{' '}
        <Text
          style={{ ...styles.link, color: 'firebrick' }}
          onPress={onCreateAccount}>
          here
        </Text>
      </Text>
    </View>
  );
}

export default LoginScreen;
