/**
 * Implements a movie browser application, where the user can search for a movie
 * and will receive information about that movie taken from the OMdb API. A user
 * can favorite or watch list a movie, as well as select what details of a movie
 * they want to see.
 *
 */

import { useState, useEffect } from 'react';
import { Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { getMovieListFromID } from './database/databaseApi';
import SettingsContext from './appContexts/SettingsContext';
import MovieNav from './screens/MovieRoute/MovieNav';

export default function App() {
  const [userID, setUserID] = useState(-1); // -1 is the default user id if not logged on
  const [displayOptions, setDisplayOptions] = useState({
    Title: true,
    Released: true,
    Director: true,
    Runtime: true,
    Plot: true,
  });

  // Declares the state that stores the movies that are in the user's different lists
  const [favorites, setFavorites] = useState([]);
  const [watchLater, setWatchLater] = useState([]);

  // Fetches the list of movies that the user has favorited and watch listed
  useEffect(() => {
    getMovieListFromID(userID).then((list) => {
      const newFavorites = [];
      const newWatchLater = [];
      for (const movie of list) {
        if (movie.inFavorites == 1)
          newFavorites.push(JSON.parse(movie.movieData));
        if (movie.inWatchLater == 1)
          newWatchLater.push(JSON.parse(movie.movieData));
      }

      setFavorites(newFavorites);
      setWatchLater(newWatchLater);
    });
  }, [userID]);

  // expo-sqlite dependency doesn't work on web
  if (Platform.OS == 'web') {
    return (
      <Text style={{ margin: 13, fontSize: 26 }}>
        Project not supported on web. You can run this by clicking on the
        "Android" or "iOS" buttons above.
      </Text>
    );
  }

  return (
    <NavigationContainer>
      <SettingsContext.Provider
        value={{
          userID: userID,
          setUserID: setUserID,
          displayOptions: displayOptions,
          setDisplayOptions: setDisplayOptions,
          favorites: favorites,
          setFavorites: setFavorites,
          watchLater: watchLater,
          setWatchLater: setWatchLater,
        }}>
        <MovieNav />
      </SettingsContext.Provider>
    </NavigationContainer>
  );
}
