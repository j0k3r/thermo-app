import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { format, render, cancel, register } from 'timeago.js';
import fr from 'timeago.js/lib/lang/fr'

class TimeAgo extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // to be able to have french translation with "timeago"
    register('fr', fr);

    this.createTimer();
  }

  createTimer = () => {
    this.setState({
      timer: setTimeout(() => {
        this.update();
      }, this.props.interval)
    });
  };

  componentWillUnmount() {
    clearTimeout(this.state.timer);
  }

  update = () => {
    // force component to re-render
    this.forceUpdate();
    this.createTimer();
  };

  render() {
    const { datetime, locale, style } = this.props;

    return (
      <Text style={style}>
        {format(datetime, locale)}
      </Text>
    );
  }
};

TimeAgo.propTypes = {
  datetime: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.number
  ]).isRequired,
  locale: PropTypes.string,
  interval: PropTypes.number,
  style: PropTypes.object,
};

TimeAgo.defaultProps = {
  interval: 60000,
  locale: 'fr'
};

export default TimeAgo;
