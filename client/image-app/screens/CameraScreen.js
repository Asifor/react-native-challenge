import React, { useState, useEffect, useRef } from "react";
import { Camera } from "expo-camera";
import FontAwesome from "@expo/vector-icons/Ionicons";
import { View, Button, StyleSheet, TouchableOpacity } from "react-native";
import * as FileSystem from "expo-file-system";
import { getImageUri, getCurrentLocation } from "../functions";

const CameraScreen = ({ navigation }) => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [location, setLocation] = useState(null)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      const location = await getCurrentLocation();
      setLocation(location)
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const { uri } = await cameraRef.current.takePictureAsync({quality:.5});

      try {
        if (location) {
          const url = await getImageUri(uri)
          navigation.navigate("ImageEdit", { imageUri:  url});
        }
      } catch (error) {
        console.error("Error getting url:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.back}
      >
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <FontAwesome name="camera" size={40} color="white" />
        </TouchableOpacity>
      </Camera>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 100,
    padding: 5,
    // borderWidth: 5,
    backgroundColor: "#777a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  camera: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
