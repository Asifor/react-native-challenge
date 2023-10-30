import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import * as FileSystem from "expo-file-system";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { ImageManipulator } from "expo-image-manipulator";
import { uploadImages, getCurrentLocation } from "../functions";

const { width, height } = Dimensions.get("screen");
const style = `.m-signature-pad {box-shadow: none; border: none; } 
              .m-signature-pad--body {border: none;}
              .m-signature-pad--footer {display: none; margin: 0px;}
              body,html {
              width: ${width}px; height: ${height}px;}`;
const ImageEditScreen = ({ route, navigation, text }) => {
  const ref = useRef();
  const [data, setData] = useState("");
  const [location, setLocation] = useState(null)

  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef();
  if (status === null) {
    requestPermission();
  }
  useEffect(() => {
    (async () => {
      const location = await getCurrentLocation();
      setLocation(location)
    })();
  }, []);
  React.useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={async () => onSaveImageAsync()}>
          <FontAwesome name="check" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  // Called after ref.current.readSignature() reads a non-empty base64 string

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 0.5,
      });
      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert("Saved!");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleOK = async (signature) => {
    const path = FileSystem.cacheDirectory + "sign.png";
    FileSystem.writeAsStringAsync(
      path,
      signature.replace("data:image/png;base64,", ""),
      { encoding: FileSystem.EncodingType.Base64 }
    )
      .then(() => FileSystem.getInfoAsync(path))
      .then((data) => {
        console.log(data);
        MediaLibrary.saveToLibraryAsync(data.uri);
        uploadImages(route.params.imageUri, data.uri, new Date().toUTCString(), location.latitude, location.longitude)
      })
      .then(alert("saved"))
      .catch(console.error);
  };

  const combineImages = async (image1, image2) => {
    // const image1 = require('./path/to/transparent_image1.png');
    // const image2 = require('./path/to/transparent_image2.png');

    const manipulatorResult1 = await ImageManipulator.manipulateAsync(image1, [
      { resize: { width: 300, height: 300 } },
    ]);
    const manipulatorResult2 = await ImageManipulator.manipulateAsync(image2, [
      { resize: { width: 300, height: 300 } },
    ]);

    const overlayConfig = {
      overlay: { uri: manipulatorResult2.uri },
    };

    const overlappedResult = await ImageManipulator.manipulateAsync(
      [manipulatorResult1.uri],
      [overlayConfig]
    );
    return overlappedResult;
    // setOverlappedImage(overlappedResult.uri);
  };

  // Called after ref.current.readSignature() reads an empty string
  const handleEmpty = () => {
    console.log("Empty");
  };

  // Called after ref.current.clearSignature()
  const handleClear = () => {
    console.log("clear success!");
  };

  // Called after end of stroke
  const handleEnd = () => {
    ref.current.readSignature();
  };

  // Called after ref.current.getData()
  const handleData = (data) => {
    console.log(data);
    setData(data);
  };
  console.log(route.params);
  return (
    <View style={styles.container} ref={imageRef} collapsable={false}>
      <SignatureScreen
        ref={ref}
        onEnd={handleEnd}
        onOK={handleOK}
        onEmpty={handleEmpty}
        onClear={handleClear}
        onGetData={handleData}
        autoClear={false}
        descriptionText={text}
        bgSrc={route.params.imageUri}
        bgWidth={width}
        bgHeight={height}
        webStyle={style}
      />
      <View style={styles.hidden}></View>
    </View>
  );
};

export default ImageEditScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hidden: {
    display: "none",
    flex: 1,
    width,
    height,
  },
});
