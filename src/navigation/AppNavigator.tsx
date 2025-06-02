import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { LoadingScreen } from '../screens/main/LoadingScreen';
import { ResultsScreen } from '../screens/main/ResultsScreen';
import { FoodDetailsScreen } from '../screens/main/FoodDetailsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { HealthGoalsScreen } from '../screens/settings/HealthGoalsScreen';
import { ProfileInformationScreen } from '../screens/settings/ProfileInformationScreen';
import { HelpSupportScreen } from '../screens/settings/HelpSupportScreen';
import { ClearCacheScreen } from '../screens/settings/ClearCacheScreen';
import { PrivacyPolicyScreen } from '../screens/settings/PrivacyPolicyScreen';
import { TermsOfServiceScreen } from '../screens/settings/TermsOfServiceScreen';
import { FavoritesScreen } from '../screens/main/FavoritesScreen';
import { MainTabNavigator } from './MainTabNavigator';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="HealthGoals" component={HealthGoalsScreen} />
        <Stack.Screen name="ProfileInformation" component={ProfileInformationScreen} />
        <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
        <Stack.Screen name="ClearCache" component={ClearCacheScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
