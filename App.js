import React from 'react';
import HomeScreen from './src/components/HomeScreen';
import LibraryScreen from './src/components/LibraryScreen';
import EmmaScreen from './src/components/EmmaScreen';
import AboutScreen from './src/components/AboutScreen';
import ProgressScreen from './src/components/ProgressScreen';
import SpotifyApiContext from './src/components/SpotifyApiContext';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import apiMiddleware from './src/redux/apiMiddleware';
import { playlistsReducer } from './src/redux/playlists';
import { sessionReducer } from './src/redux/session';
import { createContext } from 'react';
import Api from './src/api/api';
import { StackNavigator } from 'react-navigation';
import thunk from 'redux-thunk';

const App = StackNavigator({
  Home: { screen: HomeScreen },
  Emma: { screen: EmmaScreen },
  Library: { screen: LibraryScreen },
  Progress: { screen: ProgressScreen },
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
