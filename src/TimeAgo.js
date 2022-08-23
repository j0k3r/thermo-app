import React, { Component } from 'react'
import { Text } from 'react-native'
import PropTypes from 'prop-types'
import { format, register } from 'timeago.js'
import fr from 'timeago.js/lib/lang/fr'

class TimeAgo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      timer: null,
    }
  }

  componentDidMount() {
    // to be able to have french translation with "timeago"
    register('fr', fr)

    this.createTimer()
  }

  componentWillUnmount() {
    const { timer } = this.state

    clearTimeout(timer)
  }

  createTimer() {
    const { interval } = this.props

    this.setState({
      timer: setTimeout(() => {
        this.update()
      }, interval),
    })
  }

  update() {
    // force component to re-render
    this.forceUpdate()
    this.createTimer()
  }

  render() {
    const { datetime, locale, style } = this.props

    return (
      <Text style={style}>{format(datetime, locale)}</Text>
    )
  }
}

TimeAgo.propTypes = {
  datetime: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date), PropTypes.number])
    .isRequired,
  locale: PropTypes.string,
  interval: PropTypes.number,
  style: PropTypes.shape({
    color: PropTypes.string,
    fontWeight: PropTypes.string,
    marginTop: PropTypes.number,
    marginLeft: PropTypes.number,
    fontSize: PropTypes.number,
  }),
}

TimeAgo.defaultProps = {
  interval: 60000,
  locale: 'fr',
  style: {},
}

export default TimeAgo
