import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraScreen from './screens/CameraScreen';
import ImageListScreen from './screens/ImageListScreen';
import ImageEditScreen from './screens/ImageEditScreen';
import PaintScreen from './screens/PaintScreen';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ImageList">
        <Stack.Screen name="ImageList" component={ImageListScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Preview" options={{
          headerRight:()=>(<TouchableOpacity onPress={()=>console.log()}>
            <FontAwesome name="check" size={24} color="black" />
          </TouchableOpacity>),
        }} component={PaintScreen} />
        <Stack.Screen name="ImageEdit" options={{
          headerRight:()=>(<TouchableOpacity onPress={()=>console.log()}>
            <FontAwesome name="check" size={24} color="black" />
          </TouchableOpacity>),
        }} component={ImageEditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
