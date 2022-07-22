import React from 'react'
import PropTypes from 'prop-types'
import { SafeAreaView, ScrollView } from 'react-native'
import ViewThermo from '../thermo/ViewThermo'

function DetailsScreen({ route }) {
  return (
    // https://github.com/facebook/react-native/issues/19658#issuecomment-423814249
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ backgroundColor: route.params.theme === 'light' ? '#fff' : '#3d3d3d' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ViewThermo params={route.params} />
      </SafeAreaView>
    </ScrollView>
  )
}

DetailsScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      theme: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default DetailsScreen
