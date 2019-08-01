import React, { Component } from 'react';
import ky from 'ky'
import { AbortController, AbortSignal } from "abort-controller/dist/abort-controller"

class BaseThermo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetchedAtLeastOnce: false,
      loading: false,
      refreshing: false,
      data: [],
      error: null,
    };

    // used to abort request in case of leaving the component before the request has finish
    this.controller = new AbortController();
  }

  async componentDidMount() {
    await this._fetchInitialData();
  }

  async componentWillUnmount() {
    this.controller.abort();
  }

  _fetchData = async () => {
    const { signal } = this.controller;

    return ky.get(
      this.url,
      {
        timeout: 5000,
        signal,
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
        fetchedAtLeastOnce: true,
      });
    } catch (error) {
      this.setState({
        error,
        loading: false
      });
    }
  };

  _onRefresh = async () => {
    this.setState({refreshing: true});

    try {
      const res = await this._fetchData();

      this.setState({
        data: res,
        error: null,
        refreshing: false,
        fetchedAtLeastOnce: true,
      });
    } catch (error) {
      this.setState({
        error,
        refreshing: false
      });
    }
  }
}

export default BaseThermo;
