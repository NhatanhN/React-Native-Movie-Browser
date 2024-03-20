/**
 * Provides access to the databases for the app. The functions may return an error
 * if any of the .executeSql() or .transaction() methods that they use fail.
 */

import db from './openSQLiteDB.js';

if (db != null) {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
      userID INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password TEXT
      )`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS userMovies (
      userMovieID INTEGER PRIMARY KEY AUTOINCREMENT,
      userID INTEGER,
      movieData TEXT,
      inFavorites INTEGER,
      inWatchLater INTEGER,
      FOREIGN KEY (userID) REFERENCES users (userID)
        ON DELETE CASCADE
      )`
    );
  });
}

/**
 * Creates a new entry into the users table that contains the user's username and password.
 * Returns the userID associated with the given username and password.
 * Throws an error if the username already exists, or if the password and username are shorter
 * than three characters.
 */
async function createNewAccount(username, password) {
  // Check to see if the username and password are longer than 3 characters
  if (username.length < 3 || password.length < 3) {
    throw new Error('Username and password must be at least 3 characters');
  }

  // Checks to see if there already exists an entry in the users table with the given username
  const doesUsernameExist = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT *
        FROM users
        WHERE username = ?`,
        [username],
        (tx, res) => resolve(res.rows.length == 0 ? false : true)
      );
    });
  });

  if (doesUsernameExist) throw new Error('Username already exists');

  // Inserts a new entry into the users table with the given username and password
  const newUserID = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO users (username, password)
        VALUES (?, ?)`,
        [username, password],
        (tx, res) => resolve(res.insertId), // store the userID for the new entry in newUserID
        (tx, err) => reject(err)
      );
    });
  });

  return newUserID;
}

/**
 * Returns the userID from the users table associated with the given username and password.
 * Returns -1 if there is no userID found with the username and password.
 */
async function getUserID(username, password) {
  const userID = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT userID
        FROM users
        WHERE username = ? AND password = ?`,
        [username, password],
        (tx, res) =>
          resolve(res.rows.length == 0 ? -1 : res.rows.item(0).userID), // Resolve with -1 if userID not found
        (tx, err) => reject(err)
      );
    });
  });

  return userID;
}

/**
 * Returns true if there is an account associated with the given username in the
 * database, or false otherwise.
 */
async function doesUserIDExist(username) {
  const doesUserIDExist = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT userID
        FROM users
        WHERE username = ?`,
        [username],
        (tx, res) => resolve(res.rows.length == 0 ? false : true),
        (tx, err) => reject(err)
      );
    });
  });

  return doesUserIDExist;
}

/**
 * Returns an array of arrays, where the inner array's structure looks like:
 * [movieData (text), inFavorites (1 or 0), inWatchLater(1 or 0)], which represents a movie associated
 * with the user, whether it is favorited, and whether it is in the user's watch later list.
 *
 * The movieData entry is a stringified JSON object. It's structure looks like:
 * {
 *  title: [movie title],
 *  year: [year released],
 *  imdbID: [movie imdbID]
 * }
 *
 * Receives as input the user's userID
 */
async function getMovieListFromID(userID) {
  const arr = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT movieData, inFavorites, inWatchLater
        FROM userMovies
        WHERE userID = ?`,
        [userID],
        (tx, res) => resolve(res.rows._array),
        (tx, err) => reject(err)
      );
    });
  });

  return arr;
}

/**
 * Helper function for addMovieToList. If a relation between the userID and the movie
 * does not already exists, create a new entry for them and set their inFavorites and
 * inWatchLater columns to zero (for false)
 */
async function addToUserMoviesIfNotExists(userID, movieData) {
  const addedUser = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * 
        FROM userMovies
        WHERE userID = ? AND movieData = ?`,
        [userID, movieData],
        (tx, res) => {
          if (res.rows.length == 0) {
            tx.executeSql(
              `INSERT INTO userMovies (userID, movieData, inFavorites, inWatchLater)
              VALUES (?, ?, 0, 0)`,
              [userID, movieData],
              (tx, res) => resolve(true)
            );
          } else {
            resolve(false);
          }
        }
      );
    });
  });

  return addedUser;
}

/**
 * Adds or updates to the database an entry between the userID and movie and sets the column
 * associated with the listAttribute parameter to 1 (for true).
 *
 * The movie must be passed in as a stringified JSON object whose structure is: {
 *  Title: [value],
 *  Year: [value],
 *  imdbID: [value]
 * }
 */
async function addMovieToList(userID, movieData, listAttribute) {
  await addToUserMoviesIfNotExists(userID, movieData);
  db.transaction((tx) => {
    const sql = `UPDATE userMovies
      SET # = 1
      WHERE userID = ? AND movieData = ?`.replace('#', listAttribute);

    tx.executeSql(sql, [userID, movieData]);
  });
}

/**
 * Updates to the database an entry between the userID and movie and sets the column
 * associated with the listAttribute parameter to 0 (for false).
 *
 * The movie must be passed in as a stringified JSON object whose structure is: {
 *  Title: [value],
 *  Year: [value],
 *  imdbID: [value]
 * }
 */
function removeMovieFromList(userID, movieData, listAttribute) {
  db.transaction((tx) => {
    const sql = `UPDATE userMovies
      SET # = 0
      WHERE userID = ? AND movieData = ?`.replace('#', listAttribute);

    tx.executeSql(sql, [userID, movieData]);
  });
}

/**
 * Given a userID, deletes every entry associated with that userID from the
 * database
 */
function deleteAccount(userID) {
  db.transaction((tx) => {
    tx.executeSql(
      `DELETE FROM users
      WHERE userID = ?`,
      [userID]
    );
  });
}

export {
  createNewAccount,
  getUserID,
  getMovieListFromID,
  addMovieToList,
  removeMovieFromList,
  deleteAccount,
  doesUserIDExist,
};
