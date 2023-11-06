import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CameraScreen from "./screens/CameraScreen";
import ImageListScreen from "./screens/ImageListScreen";
import ImageEditScreen from "./screens/ImageEditScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Camera">
        <Stack.Screen name="ImageList" component={ImageListScreen} />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Camera"
          component={CameraScreen}
        />
        <Stack.Screen
          name="ImageEdit"
          options={{
            headerShown: false,
          }}
          component={ImageEditScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
