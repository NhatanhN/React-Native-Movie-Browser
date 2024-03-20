/*
 * Implements a search screen, where the user can search for a movie and receive the
 * fetched results of the search.
 *
 * User input is taken through a text input component, with the search results for
 * the input being displayed by a SearchResults component.
 */

import { useState } from 'react';
import { Text, View, Button } from 'react-native';

import { fetchSearchResults } from '../../movieApi';
import SearchResults from '../../components/SearchResults';
import CustomTextInput from '../../components/CustomTextInput';
import SubmitButton from '../../components/SubmitButton';
import styles from '../../stylesheets/base';

function MovieSearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [prevSearchQuery, setPrevSearchQuery] = useState('');

  // Stores the results of a search as an array of arrays, where the inner array one page
  // of results from the entire group of search results
  const [fetchedResults, setFetchedResults] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [statusMsg, setStatusMsg] = useState('');

  /**
   * Fetches the search data using the value stored in searchQuery.
   */
  async function search() {
    if (searchQuery == '') {
      setStatusMsg("Please enter a movie's title");
      return;
    }

    try {
      const data = await fetchSearchResults(searchQuery, 1);
      setFetchedResults([data]);
      setPrevSearchQuery(searchQuery);
      setPageNumber(1);
      setStatusMsg('');
    } catch (err) {
      setStatusMsg(err.message);
    }
  }

  /**
   * For search results with many results for a query, appends to fetchedResults
   * with the next group of search results not yet shown.
   *
   * If the next page of results have already been fetched, increments the value
   * in pageNumber
   */
  async function goNextPage() {
    if (prevSearchQuery == '') return;

    if (fetchedResults.length > pageNumber) {
      setStatusMsg('');
      setPageNumber(pageNumber + 1);
      return;
    }

    try {
      const data = await fetchSearchResults(prevSearchQuery, pageNumber + 1);
      fetchedResults.push(data);
      setPageNumber(pageNumber + 1);
      setStatusMsg('');
    } catch (err) {
      console.log(err.message);
      setStatusMsg('You have reached the end of the search results');
    }
  }

  /**
   * Decrements the value of pageNumber, or doing nothing if it's already at the beginning
   * after setting an appropriate status message
   */
  function goPrevPage() {
    if (searchQuery == '') return;

    if (pageNumber == 1) {
      setStatusMsg('You have reached the beginning of the search results');
      return;
    }

    setPageNumber(pageNumber - 1);
  }

  return (
    <View style={styles.container}>
      <View style={styles.displayRow}>
        <CustomTextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={'Search for a movie'}
        />
        <Button title={'Search'} onPress={search} />
      </View>

      {statusMsg != '' && (
        <Text style={{ ...styles.statusMsg, alignSelf: 'center' }}>
          {statusMsg}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <SubmitButton
          style={styles.pageButtons}
          onPress={goPrevPage}
          buttonText={'Previous'}
        />
        <SubmitButton
          style={styles.pageButtons}
          onPress={goNextPage}
          buttonText={'Next'}
        />
      </View>

      {fetchedResults[pageNumber - 1] != null && (
        <SearchResults
          movies={fetchedResults[pageNumber - 1]}
          navigate={navigation.navigate}
        />
      )}
    </View>
  );
}

export default MovieSearchScreen;
