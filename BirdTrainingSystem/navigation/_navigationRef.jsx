import { View, Text } from 'react-native'
import React from 'react'
import { NavigationActions } from '@react-navigation/native';

let navigator;

export const setNav = (nav) => {
    navigation = nav
}

const navigationRef = (routeName, params) => {
  navigator.dispatch(
    NavigationActions.navigate({
        routeName,
        params
    })
  )
}

export default navigationRef