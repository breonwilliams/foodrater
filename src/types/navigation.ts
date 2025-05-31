export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Welcome: undefined;
  Camera: undefined;
  // Add more screens as we create them
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}