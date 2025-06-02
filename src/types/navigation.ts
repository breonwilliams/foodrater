export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Welcome: undefined;
  MainTabs: { screen?: keyof MainTabParamList; params?: { from?: string } } | undefined;
  Loading: undefined;
  Results: undefined;
  FoodDetails: { foodId?: string } | undefined;
  Settings: undefined;
  HealthGoals: undefined;
  Favorites: { from?: string } | undefined;
  ProfileInformation: undefined;
  HelpSupport: undefined;
  ClearCache: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  // Add more screens as we create them
};

export type MainTabParamList = {
  Camera: undefined;
  History: undefined;
  HealthGoals: undefined;
  Progress: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
