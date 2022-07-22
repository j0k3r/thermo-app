import React from 'react'
import PropTypes from 'prop-types'
import { SafeAreaView } from 'react-native'
import ListThermo from '../thermo/ListThermo'

function HomeScreen({ route }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: route.params.theme === 'light' ? '#fff' : '#3d3d3d' }}>
      <ListThermo params={route.params} />
    </SafeAreaView>
  )
}

HomeScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      theme: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default HomeScreen
