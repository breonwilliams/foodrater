export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Welcome: undefined;
  Camera: undefined;
  Loading: undefined;
  Results: undefined;
  Progress: undefined;
  // Add more screens as we create them
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}