import React from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import IconButton from "./IconButton";

function Header({children, backAllowed = true}) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {backAllowed && <IconButton name={'arrow-left'} />}
      <View style={styles.panel}>
        {children}
      </View>
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  container: {
    zIndex:1000,
    // backgroundColor:'transparent',
    width:'100%',
    marginTop:30,
    paddingVertical:10,
    paddingHorizontal:25,
    flexDirection:'row',
    alignItems:'center'
  },
  panel:{
    alignItems:'flex-end',
    justifyContent:'flex-end',
    flex:1,
    flexDirection:'row'
  }
});
