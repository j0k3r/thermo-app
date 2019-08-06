import React, { Component } from 'react'
import { SafeAreaView } from 'react-native'
import ListThermo from '../thermo/ListThermo'

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home',
    headerBackTitle: null,
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ListThermo />
      </SafeAreaView>
    )
  }
}

export default HomeScreen
