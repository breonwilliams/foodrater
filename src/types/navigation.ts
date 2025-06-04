export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Welcome: undefined;
  MainTabs: { screen?: keyof MainTabParamList; params?: { from?: string } } | undefined;
  Loading: undefined;
  Results: undefined;
  FoodDetails: { food: any } | undefined;
  Settings: undefined;
  HealthGoals: undefined;
  Favorites: { from?: string } | undefined;
  ProfileInformation: undefined;
  HelpSupport: undefined;
  ClearCache: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  Notifications: undefined;
  Feed: undefined;
  Profile: { userId?: string; username?: string } | undefined;
  ShareFood: { foodData: any } | undefined;
  // Add more screens as we create them
};

export type MainTabParamList = {
  Camera: undefined;
  Feed: undefined;
  History: undefined;
  Progress: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
