import { openDatabase } from 'expo-sqlite';
import { Platform } from 'react-native';

let db = null
if (Platform.OS != 'web') {
  db = openDatabase('appDatabase.db');
}

export default db;
