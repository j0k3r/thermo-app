import React, { Component } from 'react'
import { SafeAreaView, Text, ScrollView } from 'react-native'
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
    headerRight: <Text>{navigation.getParam('last_battery')}</Text>,
  })

  render() {
    return (
      // https://github.com/facebook/react-native/issues/19658#issuecomment-423814249
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <ViewThermo />
        </SafeAreaView>
      </ScrollView>
    )
  }
}

export default DetailsScreen
