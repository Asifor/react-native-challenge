import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  StyleSheet,
  Text,
  Dimensions,
  BackHandler
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import ExpoDraw from "expo-draw";
import { getCurrentLocation } from "../functions";
import { storage, db } from "../functions/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore/lite";
import * as Location from "expo-location";
import { Header, IconButton } from "../components";
import ColorPicker, { HueSlider } from "reanimated-color-picker";

const { width, height } = Dimensions.get("screen");

const ImageEditScreen = ({ route, navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displaySlider, setDisplaySlider] = useState(false);
  const [color, setColor] = useState("lightgreen");
  const [message, setMessage] = useState("Loading");
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        alert(errorMsg);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      // Ensure location is not null before setting it in the state
      if (location) {
        setLocation(location);
      }
    })();
  }, []);
 
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef();
  const drawRef = useRef();
  if (status === null) {
    requestPermission();
  }

  const handleClear = (clear) => {
    drawRef.current._clear = clear;
  };
  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        format: "jpg",
        result: "tmpfile",
        quality: 0.5,
      });
      setLoading(true);
      setMessage("fetching current location data");
      const location = await getCurrentLocation();
      if (location) {
        setMessage("Fetched location data");
        const storageRef = ref(
          storage,
          "images/" + new Date().getTime() + ".jpg"
        );
        const response = await fetch(localUri);
        const blob = await response.blob();

        setMessage("Uploading image to server");
        await uploadBytes(storageRef, blob);
        const { latitude, longitude } = location;
        const downloadURL = await getDownloadURL(storageRef);
        setMessage("image uploaded to server");
        const image = {
          filename: new Date().getTime() + ".jpg",
          date: new Date().toISOString(),
          latitude,
          longitude,
          publicUrl: downloadURL,
        };

        const docRef = await addDoc(collection(db, "images"), image);
        console.log("Document written with ID: ", docRef.id);
        console.log("Uploaded and URL:", downloadURL);

        setMessage("done");
        navigation.replace("ImageList");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onSelectColor = (color) => {
    setColor(color.hex);
  };
  return (
    <View collapsable={false} ref={imageRef} style={{ flex: 1 }}>
      <ImageBackground
        style={{ flex: 1 }}
        source={{
          uri: route.params.backgroundURI,
        }}
      >
        {/* <View style={styles.header}></View> */}
        <Header backAllowed={false}>
          {/* <IconButton name={"undo"} /> */}
          <IconButton
            onPress={() => setDisplaySlider(!displaySlider)}
            name={"pencil"}
          />
          <IconButton onPress={async () => onSaveImageAsync()} name={"check"} />
        </Header>
        <ExpoDraw
          ref={drawRef}
          strokes={[]}
          containerStyle={{ backgroundColor: "rgba(0,0,0,0.01)" }}
          rewind={(undo) => {
            this._undo = undo;
          }}
          clear={(clear) => {
            this._clear = clear;
          }}
          color={color}
          strokeWidth={4}
          enabled={true}
          onChangeStrokes={(strokes) =>
            console.log("----------------------------------------")
          }
        />
        <View style={{ ...styles.modal, display: loading ? "flex" : "none" }}>
          <ActivityIndicator color={"#fff"} size={"large"} />
          <Text style={styles.text}>{message}</Text>
        </View>
        {displaySlider && (
          <ColorPicker
            style={{ width: "100%", marginBottom: 30, marginHorizontal: 10 }}
            value={color}
            onComplete={onSelectColor}
          >
            <HueSlider sliderThickness={10} />
          </ColorPicker>
        )}
      </ImageBackground>
    </View>
  );
};

export default ImageEditScreen;

const styles = StyleSheet.create({
  header: {
    zIndex: 1000,
    backgroundColor: "transparent",
    width: "100%",
    height: 60,
    marginTop: 30,
  },
  text: {
    color: "#fff",
    fontSize: 20,
    textTransform: "capitalize",
    marginTop: 10,
    textAlign:'center'
  },
  modal: {
    width: 200,
    height: 200,
    backgroundColor: "#0003",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    position:'absolute',
    top:height / 2 - 100,
    left:width/ 2 - 100,
  },
});
