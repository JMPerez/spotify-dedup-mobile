import React from 'react';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { StackNavigator } from 'react-navigation';
import HomeScreen from './src/components/HomeScreen';
import LibraryScreen from './src/components/LibraryScreen';
import EmmaScreen from './src/components/EmmaScreen';
import AboutScreen from './src/components/AboutScreen';
import apiMiddleware from './src/redux/apiMiddleware';
import { playlistsReducer } from './src/redux/playlists';
import { sessionReducer } from './src/redux/session';
import Api from './src/api/api';

const App = StackNavigator({
  Home: { screen: HomeScreen },
  Emma: { screen: EmmaScreen },
  Library: { screen: LibraryScreen },
  About: { screen: AboutScreen }
});

const reducers = combineReducers({
  playlists: playlistsReducer,
  session: sessionReducer
});
const store = createStore(
  reducers,
  {},
  compose(applyMiddleware(thunkMiddleware, apiMiddleware))
);

Api.setStore(store);

export default () => (
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
);
