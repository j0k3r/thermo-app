import React, { Component } from 'react'
import { SafeAreaView, Text, ScrollView } from 'react-native'
import { ThemeContext } from 'react-navigation'
import ViewThermo from '../thermo/ViewThermo'

class DetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle:
  <Text>
    <Text style={{ color: 'black', fontWeight: '200', fontSize: 28 }}>Thermo </Text>
    <Text style={{ color: 'black', fontWeight: '400', fontSize: 28 }}>{navigation.getParam('label')}</Text>
  </Text>,
    headerStyle: {
      backgroundColor: navigation.getParam('color'),
    },
    headerTitleStyle: {
      fontSize: 20,
    },
    // force left arrow to always be black no matter the theme (dark / light)
    headerTintColor: '#000',
  })

  render() {
    return (
      <ThemeContext.Consumer>
        {(theme) => (
          // https://github.com/facebook/react-native/issues/19658#issuecomment-423814249
          <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ backgroundColor: theme === 'light' ? '#fff' : '#3d3d3d' }}>
            <SafeAreaView style={{ flex: 1 }}>
              <ViewThermo />
            </SafeAreaView>
          </ScrollView>
        )}
      </ThemeContext.Consumer>
    )
  }
}

export default DetailsScreen
