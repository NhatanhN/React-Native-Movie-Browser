/**
 * Implements a profile screen where a user can see there favorited movies,
 * watch listed movies, log out, or delete their account.
 */

import { useContext, useState, useRef } from 'react';
import { Easing, Animated, View, Text, Pressable, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import SubmitButton from '../../components/SubmitButton';
import SettingsContext from '../../appContexts/SettingsContext';
import SearchResult from '../../components/SearchResults';
import { deleteAccount } from '../../database/databaseApi';
import styles from '../../stylesheets/base';

function animateHelper(target) {
  function focus() {
    Animated.timing(target, {
      toValue: 1,
      duration: 30,
      easing: Easing.linear(Easing.ease),
      useNativeDriver: false,
    }).start();
  }

  function unfocus() {
    Animated.timing(target, {
      toValue: 0,
      duration: 320,
      easing: Easing.linear(Easing.ease),
      useNativeDriver: false,
    }).start();
  }

  return [focus, unfocus];
}

function ProfileScreen({ navigation }) {
  const settingsCtx = useContext(SettingsContext);

  const favColor = useRef(new Animated.Value(0)).current;
  const watchLaterColor = useRef(new Animated.Value(0)).current;
  const [focusFav, unfocusFav] = animateHelper(favColor);
  const [focusWatchLater, unfocusWatchLater] = animateHelper(watchLaterColor);

  const [isFavExpanded, setIsFavExpanded] = useState(true);
  const [isWatchListExpanded, setIsWatchListExpanded] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  /**
   * Deletes the account from the data base and sets the userID state to
   * -1, redirecting the user back to the login screen
   */
  function onDeleteAccount() {
    deleteAccount(settingsCtx.userID);
    settingsCtx.setUserID(-1);
    navigation.setOptions({ title: 'Profile' });
    setIsModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.expand}>
        <View style={styles.expand}>
          <Pressable
            onPressIn={focusFav}
            onPressOut={unfocusFav}
            onPress={() => setIsFavExpanded(!isFavExpanded)}>
            <Animated.View
              style={[
                styles.listButtons,
                {
                  backgroundColor: favColor.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, .1)'],
                  }),
                },
              ]}>
              {isFavExpanded ? (
                <AntDesign name="minus" size={30} color="black" />
              ) : (
                <AntDesign name="plus" size={30} color="black" />
              )}
              <Text style={styles.heading}>Favorited Movies</Text>
            </Animated.View>
          </Pressable>

          {isFavExpanded && (
            <SearchResult
              movies={settingsCtx.favorites}
              navigate={navigation.navigate}
            />
          )}
        </View>

        <View style={styles.expand}>
          <Pressable
            onPressIn={focusWatchLater}
            onPressOut={unfocusWatchLater}
            onPress={() => setIsWatchListExpanded(!isWatchListExpanded)}>
            <Animated.View
              style={[
                styles.listButtons,
                {
                  backgroundColor: watchLaterColor.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, .1)'],
                  }),
                },
              ]}>
              {isWatchListExpanded ? (
                <AntDesign name="minus" size={30} color="black" />
              ) : (
                <AntDesign name="plus" size={30} color="black" />
              )}
              <Text style={styles.heading}>Movie Watchlist</Text>
            </Animated.View>
          </Pressable>

          {isWatchListExpanded && (
            <SearchResult
              movies={settingsCtx.watchLater}
              navigate={navigation.navigate}
            />
          )}
        </View>
      </View>

      {settingsCtx.userID != -1 ? (
        <View>
          <Text
            style={styles.deleteAccText}
            onPress={() => setIsModalVisible(!isModalVisible)}>
            Delete your account by pressing here
          </Text>
          <SubmitButton buttonText={'Log out'} onPress={()=>settingsCtx.setUserID(-1)} />
        </View>
      ) : (
        <SubmitButton
          buttonText={'Log in'}
          onPress={() => {
            navigation.navigate('Login');
          }}
        />
      )}

      <Modal
        transparent
        visible={isModalVisible}
        animationType={'fade'}
        onRequestClose={() => setIsModalVisible(!isModalVisible)}>
        <View style={styles.modalContainer}>
          <View style={styles.popup}>
            <Text style={styles.popupHeader}>Confirm Account Deletion</Text>
            <SubmitButton 
              buttonText={'Yes, delete this account'}
              onPress={onDeleteAccount}
            />
            <SubmitButton
              buttonText={'Return to profile page'}
              onPress={() => setIsModalVisible(!isModalVisible)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ProfileScreen;
