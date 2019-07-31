import React, { Component } from 'react';
import { SafeAreaView, Text } from 'react-native';
import ViewThermo from '../thermo/ViewThermo'

class DetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <Text>
          <Text style={{ color: 'black', fontWeight: '200', fontSize: 28 }}>Thermo </Text>
          <Text style={{ color: 'black', fontWeight: '400', fontSize: 28 }}>{navigation.getParam('label')}</Text>
        </Text>,
      headerStyle: {
        backgroundColor: navigation.getParam('color'),
      },
      headerTitleStyle: {
        fontSize: 20
      }
    };
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ViewThermo />
      </SafeAreaView>
    );
  }
}

export default DetailsScreen;
