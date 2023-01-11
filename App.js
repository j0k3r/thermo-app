import React from 'react'
import { useColorScheme } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { enableScreens } from 'react-native-screens'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './screens/Home'
import Detail from './screens/Detail'

enableScreens()

const Stack = createNativeStackNavigator()

export default function App() {
  const theme = useColorScheme()

  return (
    <NavigationContainer>
      <Stack.Navigator
        theme={theme}
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme === 'light' ? '#fff' : '#3d3d3d',
          },
          headerTintColor: theme === 'light' ? '#000' : '#dedede',
          headerTitleStyle: {
            fontWeight: '300',
            fontSize: 30,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'Home',
            headerBackTitle: null,
          }}
          initialParams={{ theme }}
        />
        <Stack.Screen
          name="Detail"
          component={Detail}
          options={({ route }) => ({
            title: route.params.label,
            headerBackTitle: '',
            headerStyle: {
              backgroundColor: route.params.color,
            },
            headerTitleStyle: {
              color: 'black',
              fontWeight: '300',
              fontSize: 30,
            },
            // force left arrow to always be black no matter the theme (dark / light)
            headerTintColor: '#000',
          })}
          initialParams={{ theme }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
