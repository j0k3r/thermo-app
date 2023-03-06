import React from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLine, VictoryTooltip } from 'victory-native'
import TimeAgo from 'react-timeago'
import frenchStrings from 'react-timeago/lib/language-strings/fr-short'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import Base from './Base'

class Chart extends Base {
  constructor(props) {
    super(props)

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
        mean_24h: null,
        max_24h: null,
        min_24h: null,
        last_30d: [],
        mean_30d: null,
        max_30d: null,
        min_30d: null,
        last_52w: [],
        mean_52w: null,
        max_52w: null,
        min_52w: null,
      },
      error: null,
    }
  }

  async componentDidMount() {
    this.api_path = `/thermo/${this.props.data.mac}/detail`

    await this.fetchInitialData()
  }

  static calculateMinDomain(data) {
    const reduced = data.reduce(
      (prev, current) => (parseFloat(prev.value) < parseFloat(current.value) ? prev : current),
      [{ value: 0 }]
    )

    return reduced.value - 2
  }

  render() {
    // https://github.com/indiespirit/react-native-chart-kit#responsive-charts
    const screenWidth = Dimensions.get('window').width

    const {
      theme,
      data: {
        color,
        last_update: lastUpdate,
        last_temperature: lastTemperature,
        last_battery: lastBattery,
      },
    } = this.props

    const {
      max,
      max_date: maxDate,
      min,
      min_date: minDate,
      last_24h: last24h,
      mean_24h: mean24h,
      max_24h: max24h,
      min_24h: min24h,
      last_30d: last30d,
      mean_30d: mean30d,
      max_30d: max30d,
      min_30d: min30d,
      last_52w: last52w,
      mean_52w: mean52w,
      max_52w: max52w,
      min_52w: min52w,
    } = this.state.data

    const line24h = last24h.map((item) => ({ time: item.time, value: parseFloat(mean24h) }))
    const line30d = last30d.map((item) => ({ time: item.time, value: parseFloat(mean30d) }))
    const line52w = last52w.map((item) => ({ time: item.time, value: parseFloat(mean52w) }))

    // in case the latest value from API is null
    // happend when it's 22h34 and the last value is from 22h13, so API return null for 22h30
    const testingLast24h = [...last24h]
    if (testingLast24h.length > 0 && testingLast24h.pop().value === null) {
      last24h.pop()
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 15,
      },
      bigDate: {
        marginTop: 58,
        fontSize: 16,
        fontWeight: '100',
      },
      bigCircle: {
        backgroundColor: color,
        borderRadius: 110,
        height: 220,
        width: 220,
        alignItems: 'center',
      },
      bigTemperature: {
        fontSize: 72,
        fontWeight: '100',
      },
      row30: {
        flexDirection: 'row',
        marginTop: 30,
      },
      row50: {
        flexDirection: 'row',
        marginTop: 50,
      },
      minMaxDate: {
        marginTop: 3,
        fontWeight: '100',
      },
      minMaxTemperature: {
        fontSize: 35,
        fontWeight: '200',
      },
      column: {
        flex: 1,
        alignItems: 'center',
      },
    })

    const textStyles = {
      dark: '#dedede',
      light: '#3d3d3d',
    }

    const formatter = buildFormatter(frenchStrings)

    return (
      // https://github.com/facebook/react-native/issues/19658#issuecomment-423814249
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ backgroundColor: theme === 'light' ? '#fff' : '#3d3d3d' }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: textStyles[theme] }}>
              Battery:
              {lastBattery}
            </Text>
          </View>
          <View style={styles.container}>
            {/* Display big current temperature */}
            <View style={styles.bigCircle}>
              <TimeAgo
                style={styles.bigDate}
                date={lastUpdate || new Date()}
                formatter={formatter}
                component={Text}
              />
              <Text style={styles.bigTemperature}>
                {lastTemperature.toFixed(1)}
                °C
              </Text>
            </View>

            {/* Display min & max temperature */}
            <View style={styles.row30}>
              <View style={styles.column}>
                <Text style={{ color: textStyles[theme] }}>minimale</Text>
                <Text style={{ color: textStyles[theme], ...styles.minMaxTemperature }}>
                  {min && min.toFixed(1)}
                  °C
                </Text>
                <Text style={{ color: textStyles[theme], ...styles.minMaxDate }}>
                  {minDate && dayjs(minDate).format('DD/MM/YY HH:mm')}
                </Text>
              </View>
              <View style={styles.column}>
                <Text style={{ color: textStyles[theme] }}>maximale</Text>
                <Text style={{ color: textStyles[theme], ...styles.minMaxTemperature }}>
                  {min && max.toFixed(1)}
                  °C
                </Text>
                <Text style={{ color: textStyles[theme], ...styles.minMaxDate }}>
                  {maxDate && dayjs(maxDate).format('DD/MM/YY HH:mm')}
                </Text>
              </View>
            </View>

            {/* 24h stats */}
            <View style={styles.row50}>
              <View style={styles.column}>
                <Text style={{ color: textStyles[theme] }}>dernières 24h</Text>
                <Text>
                  <Text style={{ color: textStyles[theme] }}>moyenne : </Text>
                  <Text style={{ color: textStyles[theme], fontWeight: 'bold' }}>
                    {mean24h}
                    °C
                  </Text>
                </Text>
              </View>
              <View style={styles.column}>
                <Text>
                  <Text style={{ color: textStyles[theme] }}>minimale : </Text>
                  <Text style={{ color: textStyles[theme], fontWeight: 'bold' }}>
                    {min24h}
                    °C
                  </Text>
                </Text>
                <Text>
                  <Text style={{ color: textStyles[theme] }}>maximale : </Text>
                  <Text style={{ color: textStyles[theme], fontWeight: 'bold' }}>
                    {max24h}
                    °C
                  </Text>
                </Text>
              </View>
            </View>

            <View pointerEvents="none">
              {last24h.length > 0 && (
                <VictoryChart
                  height={200}
                  width={screenWidth}
                  minDomain={{ y: Chart.calculateMinDomain(last24h) }}
                  domainPadding={{ x: 10 }}
                >
                  <VictoryAxis
                    dependentAxis
                    fixLabelOverlap
                    style={{ tickLabels: { fill: textStyles[theme] } }}
                  />
                  <VictoryAxis
                    fixLabelOverlap
                    tickFormat={(t) => t.toString().substring(0, 2)}
                    style={{ tickLabels: { fill: textStyles[theme] } }}
                  />
                  <VictoryBar
                    style={{
                      data: { fill: color },
                      labels: { fill: 'white' },
                    }}
                    alignment="middle"
                    barRatio={0.8}
                    data={last24h}
                    x="time"
                    y="value"
                    labelComponent={<VictoryTooltip />}
                  />
                  <VictoryLine
                    style={{
                      data: {
                        opacity: 0.3,
                        stroke: theme === 'light' ? '#252525' : '#fff',
                        strokeWidth: 1,
                      },
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
            <View style={styles.row30}>
              <View style={styles.column}>
                <Text style={{ color: textStyles[theme] }}>30 derniers jours</Text>
                <Text>
                  <Text style={{ color: textStyles[theme] }}>moyenne : </Text>
                  <Text style={{ color: textStyles[theme], fontWeight: 'bold' }}>
                    {mean30d}
                    °C
                  </Text>
                </Text>
              </View>
              <View style={styles.column}>
                <Text>
                  <Text style={{ color: textStyles[theme] }}>minimale : </Text>
                  <Text style={{ color: textStyles[theme], fontWeight: 'bold' }}>
                    {min30d}
                    °C
                  </Text>
                </Text>
                <Text>
                  <Text style={{ color: textStyles[theme] }}>maximale : </Text>
                  <Text style={{ color: textStyles[theme], fontWeight: 'bold' }}>
                    {max30d}
                    °C
                  </Text>
                </Text>
              </View>
            </View>

            <View pointerEvents="none">
              {last30d.length > 0 && (
                <VictoryChart
                  height={200}
                  width={screenWidth}
                  minDomain={{ y: Chart.calculateMinDomain(last30d) }}
                  domainPadding={{ x: 10 }}
                >
                  <VictoryAxis
                    dependentAxis
                    fixLabelOverlap
                    style={{ tickLabels: { fill: textStyles[theme] } }}
                  />
                  <VictoryAxis
                    fixLabelOverlap
                    style={{ tickLabels: { fill: textStyles[theme] } }}
                  />
                  <VictoryBar
                    style={{
                      data: { fill: color },
                      labels: { fill: 'white' },
                      color: theme === 'light' ? '#252525' : '#fff',
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
                        stroke: theme === 'light' ? '#252525' : '#fff',
                        strokeWidth: 1,
                      },
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
            <View style={styles.row30}>
              <View style={styles.column}>
                <Text style={{ color: textStyles[theme] }}>12 derniers mois</Text>
                <Text>
                  <Text style={{ color: textStyles[theme] }}>moyenne : </Text>
                  <Text style={{ color: textStyles[theme], fontWeight: 'bold' }}>
                    {mean52w}
                    °C
                  </Text>
                </Text>
              </View>
              <View style={styles.column}>
                <Text>
                  <Text style={{ color: textStyles[theme] }}>minimale : </Text>
                  <Text style={{ color: textStyles[theme], fontWeight: 'bold' }}>
                    {min52w}
                    °C
                  </Text>
                </Text>
                <Text>
                  <Text style={{ color: textStyles[theme] }}>maximale : </Text>
                  <Text style={{ color: textStyles[theme], fontWeight: 'bold' }}>
                    {max52w}
                    °C
                  </Text>
                </Text>
              </View>
            </View>

            <View pointerEvents="none">
              {last52w.length > 0 && (
                <VictoryChart
                  height={200}
                  width={screenWidth}
                  minDomain={{ y: Chart.calculateMinDomain(last52w) }}
                  domainPadding={{ x: 10 }}
                >
                  <VictoryAxis
                    dependentAxis
                    fixLabelOverlap
                    style={{ tickLabels: { fill: textStyles[theme] } }}
                  />
                  <VictoryAxis
                    fixLabelOverlap
                    style={{ tickLabels: { fill: textStyles[theme] } }}
                  />
                  <VictoryBar
                    style={{
                      data: { fill: color },
                      labels: { fill: 'white' },
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
                        stroke: theme === 'light' ? '#252525' : '#fff',
                        strokeWidth: 1,
                      },
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
        </View>
      </ScrollView>
    )
  }
}

export default function renderChart(props) {
  const navigation = useNavigation()
  const theme = useColorScheme()

  const { data } = props

  return <Chart data={data} theme={theme} navigation={navigation} />
}
