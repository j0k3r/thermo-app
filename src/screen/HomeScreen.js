import React, { Component } from 'react'
import { SafeAreaView } from 'react-native'
import { ThemeContext } from 'react-navigation'
import ListThermo from '../thermo/ListThermo'

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home',
    headerBackTitle: null,
  };

  render() {
    return (
      <ThemeContext.Consumer>
        {(theme) => (
          <SafeAreaView style={{ flex: 1, backgroundColor: theme === 'light' ? '#fff' : '#3d3d3d' }}>
            <ListThermo />
          </SafeAreaView>
        )}
      </ThemeContext.Consumer>
    )
  }
}

export default HomeScreen
