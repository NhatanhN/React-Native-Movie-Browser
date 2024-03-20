/**
 * The SearchResults component, given an array of movie data, renders a
 * ScrolView of Result components for each entry of the movie data array. It can
 * be optionally be given a navigate prop, which receives a react navigation
 * navigator's navigate function.
 *
 * If the prop is passed in, the navigator should have access to the
 * MovieDetailScreen component through a screen whose name is "Detail"
 */

import { useState, useContext, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import SettingsContext from '../appContexts/SettingsContext';
import SubmitButton from './SubmitButton';
import { addMovieToList, removeMovieFromList } from '../database/databaseApi';
import { COLORS } from '../stylesheets/base';
import base from '../stylesheets/base';

function SearchResults({ style, movies, navigate }) {
  // The focused state determines which of the Result components is styled to
  // appear on top of all other components and can have their popup visible
  const [focused, setFocused] = useState(Array(movies.length).fill(false));

  // Sets the focused state, while also guarenteeing that no more than one component
  // is ever focused
  function focusResult(index) {
    const newFocused = Array(movies.length).fill(false);
    if (!focused[index]) newFocused[index] = true;
    setFocused(newFocused);
  }

  // Make sure to clear any popups still active when a new set of data is received
  useEffect(() => {
    setFocused(Array(movies.length).fill(false));
  }, [movies]);

  return (
    <ScrollView style={style}>
      {(() => {
        const jsxArr = [];
        for (let i in movies) {
          jsxArr.push(
            <Result
              key={i}
              data={movies[i]}
              navigate={navigate}
              focused={focused[i]}
              focusResult={() => focusResult(i)}
            />
          );
        }

        return jsxArr;
      })()}
    </ScrollView>
  );
}

/**
 * The Result component displays information about a movie through its data prop.
 * It also allows that particular movie to be added to the user's favorites or
 * watch list.
 */
function Result({ data, navigate, focused, focusResult }) {
  const settingsCtx = useContext(SettingsContext);

  const [inFavorites, setInFavorites] = useState(false);
  const [inWatchLater, setInWatchLater] = useState(false);

  const movieData = {
    Title: data.Title,
    Year: data.Year,
    imdbID: data.imdbID,
    Poster: data.Poster,
  };
  /**
   * Adds this movie to the one of the user's lists. The argument must either be
   * 'inFavorites' or 'inWatchLater'
   */
  function addToList(list) {
    switch (list) {
      case 'inFavorites':
        settingsCtx.setFavorites([movieData, settingsCtx.favorites].flat());
        break;
      case 'inWatchLater':
        settingsCtx.setWatchLater([movieData, settingsCtx.watchLater].flat());
        break;
    }

    addMovieToList(settingsCtx.userID, JSON.stringify(movieData), list);
  }

  /**
   * Removes this movie from one of the user's lists
   */
  function removeFromList(list) {
    switch (list) {
      case 'inFavorites':
        settingsCtx.setFavorites(
          (() => {
            const a = settingsCtx.favorites.filter(
              (e) => JSON.stringify(e) != JSON.stringify(movieData)
            );
            return a;
          })()
        );
        break;
      case 'inWatchLater':
        settingsCtx.setWatchLater(
          settingsCtx.watchLater.filter(
            (e) => JSON.stringify(e) != JSON.stringify(movieData)
          )
        );
        break;
    }

    removeMovieFromList(settingsCtx.userID, JSON.stringify(movieData), list);
  }

  // Check to see if this movie is already in one of the user's lists
  useEffect(() => {
    const isInFavorites = settingsCtx.favorites
      .map((e) => e.imdbID)
      .includes(data.imdbID);
    setInFavorites(isInFavorites ? true : false);

    const isInWatchLater = settingsCtx.watchLater
      .map((e) => e.imdbID)
      .includes(data.imdbID);
    setInWatchLater(isInWatchLater ? true : false);
  }, [settingsCtx, data]);

  return (
    <View style={[styles.container, focused ? styles.focus : {}]}>
      <Pressable
        style={styles.movieDetails}
        onPress={() => {
          if (navigate != undefined) {
            navigate('Detail', {
              id: data.imdbID,
              poster: data.Poster,
            });
          }
        }}>
        <Image
          style={styles.poster}
          source={{
            uri: data.Poster,
          }}
        />
        <View style={styles.movieText}>
          <Text
            style={{ ...styles.text, fontWeight: 'bold', width: 220 }}>
            {data.Title}
          </Text>
          <Text style={styles.text}>{data.Year}</Text>
        </View>
      </Pressable>

      {focused && (
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <SubmitButton
              style={{backgroundColor: inFavorites ? COLORS.themeLight.c5 : null}}
              buttonText={
                (inFavorites ? 'Remove from ' : 'Add to ') + 'favorites'
              }
              onPress={() =>
                (inFavorites ? removeFromList : addToList)('inFavorites')
              }
            />
            <SubmitButton
              style={{backgroundColor: inWatchLater ? COLORS.themeLight.c5 : null}}
              buttonText={
                (inWatchLater ? 'Remove from ' : 'Add to ') + 'watch later'
              }
              onPress={() =>
                (inWatchLater ? removeFromList : addToList)('inWatchLater')
              }
            />
          </View>
        </View>
      )}

      <Pressable style={styles.addToListIcon} onPress={focusResult}>
        <Ionicons name="add-circle-outline" size={36} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  ...base,
  container: {
    borderWidth: 2,
    borderRadius: 5,
    margin: 7,
    marginRight: 10,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.themeLight.c3,
    elevation: 10,
    shadowRadius: 8,
    shadowOpacity: 0.18,
    shadowOffset: {
      width: 5,
      height: 5,
    },
  },
  text: {
    fontSize: 20,
  },
  movieDetails: {
    flex: 5,
    flexDirection: 'row',
  },
  movieText: {
    padding: 4,
  },
  addToListIcon: {
    flex: 1,
    padding: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  focus: {
    zIndex: 1,
  },
  popupContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row-reverse',
    width: '83%',
    left: 0,
  },
  popup: {
    backgroundColor: 'ghostwhite',
    padding: 4,
    minWidth: 260,
    borderWidth: 2,
    borderColor: 'lightgray',
    borderRadius: 5,
    elevation: 10,
    shadowRadius: 8,
    shadowOpacity: 0.18,
    shadowOffset: {
      width: 5,
      height: 5,
    },
  },
  poster: {
    width: 100,
    height: 150,
    borderWidth: 2,
    borderColor: COLORS.themeLight.c1,
    margin: 3,
  },
});

export default SearchResults;
