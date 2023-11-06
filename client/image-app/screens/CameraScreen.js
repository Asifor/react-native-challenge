import React, { useState, useEffect, useRef } from "react";
import { Camera } from "expo-camera";
import FontAwesome from "@expo/vector-icons/Ionicons";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import { getCurrentLocation } from "../functions";
import { storage } from "../functions/firebase";

const CameraScreen = ({ navigation }) => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      const location = await getCurrentLocation();
      setLocation(location);
    })();
  }, []);

  // Your existing code to take a picture
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync({
          quality: 0.5,
        });
        setLoading(true);
        navigation.navigate("ImageEdit", {
          backgroundURI: uri,
        });
      } catch (error) {
        console.error("Error taking and uploading the picture:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.row}>
          <ActivityIndicator color={"#333"} size={"small"} />
          <Text style={styles.text}>Please wait</Text>
        </View>
      ) : (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={Camera.Constants.Type.back}
        >
          <View style={{ ...styles.row, justifyContent: "space-between" }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.replace("ImageList")}
            >
              <FontAwesome name="image" size={25} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <FontAwesome name="camera" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </Camera>
      )}
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
    width: 75,
    height: 75,
    borderRadius: 100,
    padding: 5,
    backgroundColor: "#7776",
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    width: "80%",
    justifyContent: "center",
  },
  text: {
    color: "#333",
    marginLeft: 10,
  },
});
