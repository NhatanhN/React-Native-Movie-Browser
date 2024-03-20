/**
 * Implements the tab navigator for the main movie application. It has tabs for
 * the movie search screens, the settings screen, and the profile screens.
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
  MaterialIcons,
} from '@expo/vector-icons';

import MovieSearchScreen from './MovieSearchScreen';
import MovieDetailScreen from './MovieDetailScreen';
import SettingsScreen from './SettingsScreen';
import ProfileScreen from './ProfileScreen';
import InfoScreen from './InfoScreen';
import LoginScreen from '../LoginRoute/LoginScreen';
import NewAccountScreen from '../LoginRoute/NewAccountScreen';
import { COLORS } from '../../stylesheets/base';
import styles from '../../stylesheets/base';

const TabNav = createBottomTabNavigator();
const StackNav = createStackNavigator();

function MovieStack() {
  return (
    <StackNav.Navigator>
      <StackNav.Screen
        name="Search"
        component={MovieSearchScreen}
        options={{ headerShown: false }}
      />
      <StackNav.Screen
        name="Detail"
        component={MovieDetailScreen}
        options={{ headerShown: false }}
      />
    </StackNav.Navigator>
  );
}

function ProfileStack() {
  return (
    <StackNav.Navigator>
      <StackNav.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <StackNav.Screen
        name="Detail"
        component={MovieDetailScreen}
        options={{ headerShown: false }}
      />
      <StackNav.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <StackNav.Screen
        name="Create a new account"
        component={NewAccountScreen}
        options={{
          headerShown: false,
        }}
      />
    </StackNav.Navigator>
  );
}

function MovieNav() {
  return (
    <TabNav.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: { backgroundColor: COLORS.themeLight.c3 },
        headerStyle: { backgroundColor: COLORS.themeLight.c3 },
        headerTitleStyle: styles.h,
      }}>
      <TabNav.Screen
        name="Movies"
        component={MovieStack}
        options={{
          headerShown: true,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={`movie${focused ? '' : '-outline'}`}
              size={24}
            />
          ),
          tabBarShowLabel: false,
          tabBarAccesibilityLabel: 'Movies',
        }}
      />

      <TabNav.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name={`settings${focused ? '' : '-outline'}`} size={24} />
          ),
          tabBarShowLabel: false,
          tabBarAccesibilityLabel: 'Settings',
        }}
      />

      <TabNav.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome5 name={`user${focused ? '-alt' : ''}`} size={24} />
          ),
          tabBarShowLabel: false,
          tabBarAccesibilityLabel: 'Profile',
        }}
      />

      <TabNav.Screen
        name="Info"
        component={InfoScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name={`info${focused ? '' : '-outline'}`}
              size={24}
            />
          ),
          tabBarShowLabel: false,
          tabBarAccesibilityLabel: 'About the app',
        }}
      />
    </TabNav.Navigator>
  );
}

export default MovieNav;
