/*
 * Implements a settings screen, where the user has the option to toggle what information
 * they want to be displayed within a movie's detail screen.
 *
 * It sets information of the user's display settings to state using the setDisplayOptions
 * function provided by SettingsContext.
 */

import { useContext } from 'react';
import { Text, View, Switch } from 'react-native';
import { keys } from '../../movieApi';
import SettingsContext from '../../appContexts/SettingsContext';
import styles from '../../stylesheets/base';

function SettingsScreen() {
  const settingsCtx = useContext(SettingsContext);

  /**
   * A function that, given an arguement representing of the the keys of the plain movie
   * data object (or what is returned by fetchMovieData from movieApi.js), returns
   * a function to toggle the boolean value for that key in the displayOptions state
   */
  getToggleFunction = (key) => () => {
    settingsCtx.setDisplayOptions({
      ...settingsCtx.displayOptions,
      [key]: !settingsCtx.displayOptions[key],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.centeredText}>Select options to be displayed</Text>
      {keys.map((option) => {
        if (option == "Poster") return
        return (
          <MovieOptions
            key={option}
            optionType={option}
            toggle={getToggleFunction(option)}
            isEnabled={settingsCtx.displayOptions[option]}
          />
        );
      })}
    </View>
  );
}

/**
 * A component that, given some key for the displayOptions state, renders a switch component to
 * toggle that value for that key within displayOptions
 */
const MovieOptions = ({ optionType, toggle, isEnabled }) => {
  return (
    <View style={styles.displayRow}>
      <Text style={styles.toggleLabel}>{optionType}</Text>
      <Switch
        style={styles.toggle}
        trackColor={{ false: '#767577', true: 'black' }}
        thumbColor={isEnabled ? 'mediumseagreen' : '#aaa'}
        value={isEnabled}
        onValueChange={toggle}
      />
    </View>
  );
};

export default SettingsScreen;