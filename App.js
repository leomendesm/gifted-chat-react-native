import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Main, Login, Signup } from './src'

const SimpleApp = StackNavigator({
  Home: { screen: Login },
  Signup: { screen: Signup },
  Chat: { screen: Main },
});

export default class App extends React.Component {
  render() {
    return <SimpleApp />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});