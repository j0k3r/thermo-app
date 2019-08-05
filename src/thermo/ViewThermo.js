import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import ky from 'ky'
import { AbortController, AbortSignal } from "abort-controller/dist/abort-controller"
import format from 'date-fns/format'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel, VictoryTooltip, VictoryLine } from 'victory-native';
import TimeAgo from '../TimeAgo'
import BaseThermo from './BaseThermo'

class ViewThermo extends BaseThermo {
  constructor(props) {
    super(props);

    this.state = {
      fetchedAtLeastOnce: false,
      loading: false,
      refreshing: false,
      data: {
        max: null,
        max_date: null,
        min: null,
        min_date: null,
        last_24h: [],
        mean__24h: null,
        last_30d: [],
        mean__30d: null,
        last_52w: [],
        mean__52w: null,
      },
      error: null,
    };
  }

  async componentDidMount() {
    this.url = `http://192.168.42.26:4730/thermo/${this.props.navigation.getParam('mac')}/detail`

    await this._fetchInitialData();
  }

  calculateMinDomain(data) {
    const reduced = data.reduce((prev, current) => (parseFloat(prev.value) < parseFloat(current.value)) ? prev : current, [{value: 0}])

    return reduced.value - 10
  }

  render() {
    // https://github.com/indiespirit/react-native-chart-kit#responsive-charts
    const screenWidth = Dimensions.get('window').width

    const { navigation } = this.props

    const color = navigation.getParam('color')
    const last_update = navigation.getParam('last_update')
    const last_battery = navigation.getParam('last_battery')
    const last_temperature = navigation.getParam('last_temperature')

    const {
      max,
      max_date: maxDate,
      min,
      min_date: minDate,
      last_24h: last24h,
      mean_24h: mean24h,
      last_30d: last30d,
      mean_30d: mean30d,
      last_52w: last52w,
      mean_52w: mean52w,
    } = this.state.data;

    const line24h = last24h.map((item) => ({ time: item.time, value: parseFloat(mean24h) }))
    const line30d = last30d.map((item) => ({ time: item.time, value: parseFloat(mean30d) }))
    const line52w = last52w.map((item) => ({ time: item.time, value: parseFloat(mean52w) }))

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
            <Text style={ styles.minMaxDate }>{minDate && format(minDate, 'DD/MM/YY HH:mm')}</Text>
          </View>
          <View style={ styles.column }>
            <Text>maximale</Text>
            <Text style={ styles.minMaxTemperature }>
              {min && max.toFixed(1)}°C
            </Text>
            <Text style={ styles.minMaxDate }>{maxDate && format(maxDate, 'DD/MM/YY HH:mm')}</Text>
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
              <Text style={{ fontWeight: 'bold' }}>{mean24h}°C</Text>
            </Text>
          </View>
        </View>

        <View pointerEvents="none">
          { last24h.length > 0 && (
            <VictoryChart
              height={200}
              width={screenWidth}
              minDomain={{ y: this.calculateMinDomain(last24h) }}
              domainPadding={{ x: 10 }}
            >
              <VictoryAxis dependentAxis fixLabelOverlap />
              <VictoryAxis
                fixLabelOverlap
                tickFormat={(t) => t.toString().substring(0, 2)}
              />
              <VictoryBar
                style={{
                  data: { fill: color },
                  labels: { fill: "white" }
                }}
                alignment="middle"
                barRatio={0.8}
                data={last24h}
                x="time"
                y="value"
                labelComponent={<VictoryTooltip/>}
              />
              <VictoryLine
                style={{
                  data: {
                    opacity: 0.3,
                    stroke: '#252525',
                    strokeWidth: 1,
                  }
                }}
                standalone={false}
                data={line24h}
                x="time"
                y="value"
              />
            </VictoryChart>
          )}
        </View>

        {/* 30 days stats */}
        <View style={ styles.row30 }>
          <View style={ styles.column }>
            <Text>30 derniers jours</Text>
          </View>
          <View style={ styles.column }>
            <Text>
              <Text>moyenne : </Text>
              <Text style={{ fontWeight: 'bold' }}>{mean30d}°C</Text>
            </Text>
          </View>
        </View>

        <View pointerEvents="none">
          { last30d.length > 0 && (
            <VictoryChart
              height={200}
              width={screenWidth}
              minDomain={{ y: this.calculateMinDomain(last30d) }}
              domainPadding={{ x: 10 }}
            >
              <VictoryAxis dependentAxis fixLabelOverlap />
              <VictoryAxis fixLabelOverlap />
              <VictoryBar
                style={{
                  data: { fill: color },
                  labels: { fill: "white" }
                }}
                alignment="middle"
                barRatio={0.9}
                data={last30d}
                x="time"
                y="value"
              />
              <VictoryLine
                style={{
                  data: {
                    opacity: 0.3,
                    stroke: '#252525',
                    strokeWidth: 1,
                  }
                }}
                standalone={false}
                data={line30d}
                x="time"
                y="value"
              />
            </VictoryChart>
          )}
        </View>

        {/* 12 months stats */}
        <View style={ styles.row30 }>
          <View style={ styles.column }>
            <Text>12 derniers mois</Text>
          </View>
          <View style={ styles.column }>
            <Text>
              <Text>moyenne : </Text>
              <Text style={{ fontWeight: 'bold' }}>{mean52w}°C</Text>
            </Text>
          </View>
        </View>

        <View pointerEvents="none">
          { last52w.length > 0 && (
            <VictoryChart
              height={200}
              width={screenWidth}
              minDomain={{ y: this.calculateMinDomain(last52w) }}
              domainPadding={{ x: 10 }}
            >
              <VictoryBar
                style={{
                  data: { fill: color },
                  labels: { fill: "white" }
                }}
                alignment="middle"
                barRatio={1.1}
                data={last52w}
                x="time"
                y="value"
              />
              <VictoryLine
                style={{
                  data: {
                    opacity: 0.3,
                    stroke: '#252525',
                    strokeWidth: 1,
                  }
                }}
                standalone={false}
                data={line52w}
                x="time"
                y="value"
              />
            </VictoryChart>
          )}
        </View>
      </View>
    );
  }
}

export default withNavigation(ViewThermo);
