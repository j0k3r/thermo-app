import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import ky from 'ky'
import DropdownAlert from 'react-native-dropdownalert';
import TimeAgo from './TimeAgo'

class ListThermo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetchedAtLeastOnce: false,
      loading: false,
      refreshing: false,
      data: [],
      error: null,
    };

    this.url = 'http://192.168.42.26:4730/thermo/list'
  }

  async componentDidMount() {
    await this._fetchInitialData();
  }

  _fetchData = async () => {
    return ky.get(
      this.url,
      {
        timeout: 5000,
      }
    ).json();
  }

  _fetchInitialData = async () => {
    this.setState({ loading: true });

    try {
      const res = await this._fetchData();

      this.setState({
        data: res,
        error: null,
        loading: false,
        fetchedAtLeastOnce: true,
      });
    } catch (error) {
      this.setState({
        error,
        loading: false
      });

      this.dropDownAlertRef.alertWithType('error', 'Error', 'Network issue');
    }
  };

  _onRefresh = async () => {
    this.setState({refreshing: true});

    try {
      const res = await this._fetchData();

      this.setState({
        data: res,
        error: null,
        refreshing: false,
        fetchedAtLeastOnce: true,
      });
    } catch (error) {
      this.setState({
        error,
        refreshing: false
      });

      this.dropDownAlertRef.alertWithType('error', 'Error', 'Network issue');
    }
  }

  render() {
    if (this.state.loading) {
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
                  headerColor: item.color,
                  battery: item.battery,
                });
              }}
              leftElement={
                <View style={{ backgroundColor: '#fff', borderRadius: 35, height: 70, width: 70 }}>
                  <Text style={{ color: 'black', fontSize: 25, fontWeight: '300', marginTop: 21, marginLeft: 12 }}>
                    {Math.round(item.last_temperature/100)}°C
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
