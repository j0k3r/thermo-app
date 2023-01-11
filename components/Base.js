import { Component } from 'react'
import ky from 'ky'
import { AbortController } from 'abort-controller/dist/abort-controller'
import * as config from '../config'

/* eslint-disable react/no-unused-state */
// TODO: find a better way to make parent / children component
class Base extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fetchedAtLeastOnce: false,
      loading: false,
      refreshing: false,
      data: [],
      error: null,
    }

    // used to abort request in case of leaving the component before the request has finish
    this.controller = new AbortController()

    // to ensure we can call this.setState safely
    this.onRefresh = this.onRefresh.bind(this)
  }

  async componentDidMount() {
    await this.fetchInitialData()
  }

  async componentWillUnmount() {
    this.controller.abort()
  }

  async onRefresh() {
    this.setState({ refreshing: true })

    try {
      const res = await this.fetchData()

      this.setState({
        data: res,
        error: null,
        refreshing: false,
        fetchedAtLeastOnce: true,
      })
    } catch (error) {
      this.setState({
        error,
        refreshing: false,
      })
    }
  }

  async fetchData() {
    const { signal } = this.controller

    return ky
      .get(`${config.API_URL}${this.api_path}`, {
        timeout: 10000,
        signal,
      })
      .json()
  }

  async fetchInitialData() {
    this.setState({ loading: true })

    try {
      const res = await this.fetchData()

      this.setState({
        data: res,
        error: null,
        loading: false,
        fetchedAtLeastOnce: true,
      })
    } catch (error) {
      this.setState({
        error,
        loading: false,
      })
    }
  }
}

export default Base
