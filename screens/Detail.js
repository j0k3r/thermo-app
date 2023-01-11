import React from 'react'
import PropTypes from 'prop-types'
import Chart from '../components/Chart'

function Detail({ route }) {
  return <Chart data={route.params} />
}

Detail.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      theme: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default Detail
