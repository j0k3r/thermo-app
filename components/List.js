import React from 'react'
import { ActivityIndicator, Button, FlatList, Text, View, useColorScheme } from 'react-native'
import { ListItem } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import DropdownAlert from 'react-native-dropdownalert'
import TimeAgo from './TimeAgo'
import Base from './Base'

class List extends Base {
  constructor(props) {
    super(props)

    this.api_path = '/thermo/list'
  }

  render() {
    const { theme, navigation } = this.props
    const bgColor = theme === 'light' ? '#fff' : '#3d3d3d'
    const textColor = theme === 'light' ? '#3d3d3d' : '#dedede'

    if (this.state.loading || (this.state.data.length === 0 && this.state.error === null)) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
          }}
        >
          <ActivityIndicator />
        </View>
      )
    }

    if (this.state.error && this.state.fetchedAtLeastOnce === false) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
          }}
        >
          <Text>Error while trying to retrieve data</Text>
          <Button title="Retry" onPress={this.fetchInitialData} />
          <DropdownAlert
            // eslint-disable-next-line no-return-assign
            ref={(ref) => (this.dropDownAlertRef = ref)}
          />
        </View>
      )
    }

    return (
      <View style={{ flex: 1, backgroundColor: bgColor }}>
        <FlatList
          data={this.state.data}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          renderItem={({ item }) => (
            <ListItem
              title={
                <Text>
                  <Text style={{ color: 'black', fontWeight: '200', fontSize: 35 }}>Thermo </Text>
                  <Text style={{ color: 'black', fontWeight: '400', fontSize: 35 }}>
                    {item.label}
                  </Text>
                </Text>
              }
              subtitle={
                <TimeAgo
                  style={{
                    color: 'black',
                    marginLeft: 5,
                    fontSize: 15,
                    fontWeight: '200',
                  }}
                  datetime={item.last_update}
                />
              }
              containerStyle={{ backgroundColor: item.color }}
              onPress={() => {
                navigation.navigate('Detail', {
                  mac: item.mac,
                  label: item.label,
                  color: item.color,
                  last_update: item.last_update,
                  last_battery: item.last_battery,
                  last_temperature: item.last_temperature,
                })
              }}
              leftElement={
                <View
                  style={{
                    backgroundColor: bgColor,
                    borderRadius: 35,
                    height: 70,
                    width: 70,
                  }}
                >
                  <Text
                    style={{
                      color: textColor,
                      fontSize: 25,
                      fontWeight: '300',
                      marginTop: 21,
                      marginLeft: 12,
                    }}
                  >
                    {Math.round(item.last_temperature)}
                    °C
                  </Text>
                </View>
              }
            />
          )}
          keyExtractor={(item) => item.mac}
        />
        <DropdownAlert
          // eslint-disable-next-line no-return-assign
          ref={(ref) => (this.dropDownAlertRef = ref)}
        />
      </View>
    )
  }
}

export default function renderList() {
  const navigation = useNavigation()
  const theme = useColorScheme()

  return <List theme={theme} navigation={navigation} />
}
