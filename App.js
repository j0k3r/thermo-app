import { createAppContainer, createStackNavigator } from 'react-navigation';
import { useScreens } from 'react-native-screens';
import HomeScreen from './src/screen/HomeScreen';
import DetailsScreen from './src/screen/DetailsScreen';

useScreens();

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#ECEFF0',
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: '300',
        fontSize: 30,
      },
    },
  }
);

export default createAppContainer(RootStack);
