import React from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

function IconButton({name, onPress}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <FontAwesome name={name} size={25} color={'#fff'}/>
    </TouchableOpacity>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  container:{
    padding:10,
  }
})
