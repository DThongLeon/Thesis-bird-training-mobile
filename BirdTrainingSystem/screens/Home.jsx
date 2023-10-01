import { View, Text, StyleSheet } from 'react-native'
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const Home = () => {
  return (
    <SafeAreaView>
      <View style={style.appBarWrapper}>
        <View style={style.appBar}>
          <Ionicons name='location' size={24} > </Ionicons>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Home

const style = StyleSheet.create({
  textStyle: {
    fontSize: 25,
    fontFamily: 'Opens-Sans',
    fontWeight: '500'
  },
  appBarWrapper: {
    marginHorizontal: 22,

  },
  appBar: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
})