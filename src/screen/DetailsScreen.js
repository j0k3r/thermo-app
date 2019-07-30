import React, { Component } from 'react';
import { View, Text } from 'react-native';

class DetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <Text>
          <Text style={{ color: 'black', fontWeight: '200', fontSize: 28 }}>Thermo </Text>
          <Text style={{ color: 'black', fontWeight: '400', fontSize: 28 }}>{navigation.getParam('label')}</Text>
        </Text>,
      headerStyle: {
        backgroundColor: navigation.getParam('headerColor'),
      },
      headerTitleStyle: {
        fontSize: 20
      }
    };
  };

  render() {
    const { navigation } = this.props;

    const mac = navigation.getParam('mac');
    const label = navigation.getParam('label');

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Thermo {label}</Text>
      </View>
    );
  }
}

export default DetailsScreen;
