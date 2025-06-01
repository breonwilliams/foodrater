export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Welcome: undefined;
  MainTabs: undefined;
  Loading: undefined;
  Results: undefined;
  FoodDetails: { foodId?: string } | undefined;
  Settings: undefined;
  HealthGoals: undefined;
  // Add more screens as we create them
};

export type MainTabParamList = {
  Camera: undefined;
  History: undefined;
  Favorites: undefined;
  Progress: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
