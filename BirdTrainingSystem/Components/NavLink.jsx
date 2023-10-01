import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { createLinkNavigation } from '@react-navigation/native'
import { withNavigation} from '@react-navigation/native'
 
const NavLink = ({navigation , text, routeName}) => {
  return (
    <TouchableOpacity onPress={ () => {
      navigation.navigate(routeName)
    }}>
        <Text style={styles.link}> {text} </Text>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  link: {
    color: blue
  }
})
export default NavLink