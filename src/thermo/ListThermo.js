import React from 'react';
import { View, Text, FlatList, ActivityIndicator, Button } from 'react-native';
import { ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import ky from 'ky'
import DropdownAlert from 'react-native-dropdownalert';
import TimeAgo from '../TimeAgo'
import BaseThermo from './BaseThermo'

class ListThermo extends BaseThermo {
  constructor(props) {
    super(props);

    this.url = 'http://192.168.42.26:4730/thermo/list'
  }

  render() {
    if (this.state.loading || (this.state.data.length === 0 && this.state.error === null)) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }

    if (this.state.error && false === this.state.fetchedAtLeastOnce) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Error while trying to retrieve data</Text>
          <Button
            title="Retry"
            onPress={this._fetchInitialData}
          />
          <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.data}
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
          renderItem={({ item }) => (
            <ListItem
              title={
                <Text>
                  <Text style={{ color: 'black', fontWeight: '200', fontSize: 35 }}>Thermo </Text>
                  <Text style={{ color: 'black', fontWeight: '400', fontSize: 35 }}>{item.label}</Text>
                </Text>
              }
              subtitle={
                <TimeAgo style={{ color: 'black', marginLeft: 5, fontSize: 15, fontWeight: '100' }} datetime={item.last_update} />
              }
              containerStyle={{ backgroundColor: item.color }}
              onPress={() => {
                this.props.navigation.navigate('Details', {
                  mac: item.mac,
                  label: item.label,
                  color: item.color,
                  last_update: item.last_update,
                  last_battery: item.last_battery,
                  last_temperature: item.last_temperature,
                });
              }}
              leftElement={
                <View style={{ backgroundColor: '#fff', borderRadius: 35, height: 70, width: 70 }}>
                  <Text style={{ color: 'black', fontSize: 25, fontWeight: '300', marginTop: 21, marginLeft: 12 }}>
                    {Math.round(item.last_temperature)}°C
                  </Text>
                </View>
              }
            />
          )}
          keyExtractor={item => item.mac}
        />
        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
      </View>
    );
  }
}

export default withNavigation(ListThermo);
