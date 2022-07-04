// @flow

import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'

import { rootReducer } from './reducers'
import Navigation from './scenes/Navigation'

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

export default class App extends Component<{}, {}> {
  render() {
    return (
      <Provider store={createStoreWithMiddleware(rootReducer)}>
        <Navigation />
      </Provider>
    )
  }
}
