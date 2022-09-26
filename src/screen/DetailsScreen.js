import React from 'react'
import PropTypes from 'prop-types'
import ViewThermo from '../thermo/ViewThermo'

function DetailsScreen({ route }) {
  return <ViewThermo data={route.params} />
}

DetailsScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      theme: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default DetailsScreen
