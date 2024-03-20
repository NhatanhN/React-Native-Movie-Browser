/**
 * Defines the functions to fetch information from the OMdb API: https://www.omdbapi.com/.
 * The functions exported fetchs a list of movies whose title is similar to some given name
 * or fetches detailed information for a particular movie
 */

// The keys of the movie data object that is returned by fetchMovieData
const keys = [
  'Title',
  'Released', // <-- i.e. the release date of the movie
  'Runtime',
  'Genre',
  'Director',
  'Plot',
  'Language',
  'Country',
  'BoxOffice',
  'Poster',
];

//Probably not a good idea to put this here in general
const apiKey = '97a887fa';

/**
 * Returns an array of information of up to ten movies whose title are similar to
 * the input title. Queries that have move than ten results associated with a title
 * can use the page parameter can select a subdivision of those results.
 *
 * The structure of the array elements is: {
 *  Title: [string],
 *  Year: [string],
 *  imdbID: [string],
 *  Type: [string: "movie" | "series" | "episode"],
 *  Poster: [string]
 * }
 */
async function fetchSearchResults(title, page) {
  title = title.trim().replace(/\s/g, '+');
  const rawData = await fetch(
    `https://www.omdbapi.com/?apikey=${apiKey}&s=${title}&page=${page}`
  );

  const json = await rawData.json();

  if (json.Response === 'False') {
    throw new Error(json.Error);
  }

  return json.Search;
}

/**
 * Returns an object that contains specific details about a movie associated with the given
 * id parameter. The returned value's keys are stored in the keys array
 */
async function fetchMovieData(id) {
  const rawData = await fetch(
    `https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`
  );
  const json = await rawData.json();

  if (json.Response === 'False') {
    throw new Error(json.Error);
  }

  const filteredJson = keys.reduce((obj, key) => {
    return { ...obj, [key]: json[key] };
  }, {});

  // Changes the movie's date format from dd/mm/yyyy into mm/dd/yyyy
  const date = filteredJson.Released.split(' ');
  filteredJson.Released = `${date[1]} ${date[0]}, ${date[2]}`;

  return filteredJson;
}

export { keys, fetchSearchResults, fetchMovieData };
