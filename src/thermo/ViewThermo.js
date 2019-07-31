import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import ky from 'ky'
import format from 'date-fns/format'
import DropdownAlert from 'react-native-dropdownalert';
import TimeAgo from '../TimeAgo'

class ViewThermo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      refreshing: false,
      data: {},
      error: null,
    };

    this.url = 'http://192.168.42.26:4730/thermo/__MAC__/detail'
  }

  async componentDidMount() {
    await this._fetchInitialData();
  }

  _fetchData = async () => {
    return ky.get(
      this.url.replace('__MAC__', this.props.navigation.getParam('mac')),
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
      });
    } catch (error) {
      this.setState({
        error,
        loading: false
      });

      this.dropDownAlertRef.alertWithType('error', 'Error', 'Network issue');
    }
  };

  render() {
    const { navigation } = this.props

    const {
      max = null,
      max_date = null,
      min = null,
      min_date = null,
      color = navigation.getParam('color'),
      last_update = navigation.getParam('last_update'),
      last_battery = navigation.getParam('last_battery'),
      last_temperature = navigation.getParam('last_temperature'),
    } = this.state.data;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 35,
      },
      bigDate: {
        marginTop: 58,
        fontSize: 16,
        fontWeight: '100'
      },
      bigCircle: {
        backgroundColor: color,
        borderRadius: 110,
        height: 220,
        width: 220,
        alignItems: 'center'
      },
      bigTemperature: {
        fontSize: 72,
        fontWeight: '100'
      },
      row30: {
        flexDirection: "row",
        marginTop: 30
      },
      row50: {
        flexDirection: "row",
        marginTop: 50
      },
      minMaxDate: {
        marginTop: 3,
        fontWeight: '100'
      },
      minMaxTemperature: {
        fontSize: 35,
        fontWeight: '200'
      },
      column: {
        flex: 1,
        alignItems: 'center'
      }
    });

    return (
      <View style={ styles.container }>
        {/* Display big current temperature */}
        <View style={ styles.bigCircle }>
          <TimeAgo style={ styles.bigDate } datetime={last_update || (new Date())} />
          <Text style={ styles.bigTemperature }>
            {last_temperature.toFixed(1)}°C
          </Text>
        </View>

        {/* Display min & max temperature */}
        <View style={ styles.row30 }>
          <View style={ styles.column }>
            <Text>minimale</Text>
            <Text style={ styles.minMaxTemperature }>
              {min && min.toFixed(1)}°C
            </Text>
            <Text style={ styles.minMaxDate }>{min_date && format(min_date, 'DD/MM/YY HH:mm')}</Text>
          </View>
          <View style={ styles.column }>
            <Text>maximale</Text>
            <Text style={ styles.minMaxTemperature }>
              {min && max.toFixed(1)}°C
            </Text>
            <Text style={ styles.minMaxDate }>{max_date && format(max_date, 'DD/MM/YY HH:mm')}</Text>
          </View>
        </View>

        {/* 24h stats */}
        <View style={ styles.row50 }>
          <View style={ styles.column }>
            <Text>dernières 24h</Text>
          </View>
          <View style={ styles.column }>
            <Text>
              <Text>moyenne : </Text>
              <Text style={{ fontWeight: 'bold' }}>{max && max.toFixed(1)}°C</Text>
            </Text>
          </View>
        </View>

        {/* 30 days stats */}
        <View style={ styles.row30 }>
          <View style={ styles.column }>
            <Text>30 derniers jours</Text>
          </View>
          <View style={ styles.column }>
            <Text>
              <Text>moyenne : </Text>
              <Text style={{ fontWeight: 'bold' }}>{max && max.toFixed(1)}°C</Text>
            </Text>
          </View>
        </View>

        {/* 12 months stats */}
        <View style={ styles.row30 }>
          <View style={ styles.column }>
            <Text>12 derniers mois</Text>
          </View>
          <View style={ styles.column }>
            <Text>
              <Text>moyenne : </Text>
              <Text style={{ fontWeight: 'bold' }}>{max && max.toFixed(1)}°C</Text>
            </Text>
          </View>
        </View>

        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
      </View>
    );
  }
}

export default withNavigation(ViewThermo);
