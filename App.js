import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { enableScreens } from 'react-native-screens'
import { AppearanceProvider, useColorScheme } from 'react-native-appearance'
import HomeScreen from './src/screen/HomeScreen'
import DetailsScreen from './src/screen/DetailsScreen'

enableScreens()

const stackDefaultNavigationOptions = ({ theme }) => ({
  headerStyle: {
    backgroundColor: theme === 'light' ? '#fff' : '#3d3d3d',
  },
  headerTintColor: theme === 'light' ? '#000' : '#dedede',
  headerTitleStyle: {
    fontWeight: '300',
    fontSize: 30,
  },
})

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: stackDefaultNavigationOptions,
  },
)

const Navigation = createAppContainer(RootStack)

export default () => {
  const theme = useColorScheme()

  return (
    <AppearanceProvider>
      <Navigation theme={theme} />
    </AppearanceProvider>
  )
}
