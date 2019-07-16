// @flow

import React, { Component } from 'react'
import { applyMiddleware, createStore } from 'redux'

import Navigation from './scenes/Navigation'
import { Provider } from 'react-redux'
import { rootReducer } from './reducers'
import thunk from 'redux-thunk'

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)


export default class App extends Component<{},{}> {
  render () {
    return <Provider store={createStoreWithMiddleware(rootReducer)}>
    <Navigation />
  </Provider>
  }
}

