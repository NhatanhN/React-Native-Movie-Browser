/*
 * Implements a movie detail screen, which displays to the user information about a movie
 * according to display options the user has specified in the settings screen. It receives
 * the title and imdbID of a movie by having it passed in as paramaters through navigation.
 *
 * It fetches the details for the movie associated with the imdbID and displays it, along
 * with a back button at the bottom to go to the previous screen.
 */

import { useContext, useEffect, useState } from 'react';
import { Text, View, Button, ScrollView, Image } from 'react-native';

import { fetchMovieData } from '../../movieApi';
import SettingsContext from '../../appContexts/SettingsContext';
import styles from '../../stylesheets/base';

function MovieDetailScreen({ route, navigation }) {
  const settingsCtx = useContext(SettingsContext);

  const { id, poster } = route.params;

  enabledDisplayOptions = [];
  for (const option in settingsCtx.displayOptions) {
    if (settingsCtx.displayOptions[option]) enabledDisplayOptions.push(option);
  }

  // Fetch the movie details from OMdb
  const [movieDetails, setMovieDetails] = useState({});
  useEffect(() => {
    (async () => setMovieDetails(await fetchMovieData(id)))();
  }, [id]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imgContainer}>
        <Image
          style={{ ...styles.addBorderToImg, width: 300, height: 450 }}
          source={{
            uri: poster,
          }}
        />
      </View>
      {enabledDisplayOptions.map((option) => {
        return (
          <View key={option} style={styles.section}>
            <Text style={styles.header}>{option}</Text>
            <Text style={styles.text}>{movieDetails[option]}</Text>
          </View>
        );
      })}
      <Button title="go back" onPress={navigation.goBack} />
      {/* spacing */}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

export default MovieDetailScreen;
