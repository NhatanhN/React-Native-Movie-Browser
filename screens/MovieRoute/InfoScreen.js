import { View, ScrollView, Text, Image } from 'react-native';
import styles from "../../stylesheets/base"

function InfoScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.p}>
        You can use this app to enter a movie's name to get a list of movies
        with the same or similar names. Tapping on one of the entries will give
        you some information about it.
      </Text>
      <ScrollView style={styles.padding}>
        <View style={styles.addBorderToImg}>
          {/**replace image with: an image of the app in use (?) */}
          <Image source={require('../../assets/search-screen-example.png')} />
        </View>
      </ScrollView>

      <Text style={styles.p}>
        All information and movie images taken from the Open Movie Database.
      </Text>
    </ScrollView>
  );
}

export default InfoScreen;