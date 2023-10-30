import React, { useRef, useEffect } from "react";
import { Image, ImageBackground, TouchableOpacity, View } from "react-native";
import { captureRef,  } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import FontAwesome from "@expo/vector-icons/FontAwesome";

function PaintScreen({ route, navigation }) {
  const imageRef = useRef();
  useEffect(() => {
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
  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        quality: 0.3,
      });
      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert("Saved!");
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <View ref={imageRef} style={{ flex: 1 }}>
      <ImageBackground
      ref={imageRef}
        style={{ flex: 1 }}
        source={{ uri: route.params.background }}
      >
        <Image ref={imageRef} style={{ flex: 1 }} source={{ uri: route.params.overlay }} />
      </ImageBackground>
    </View>
  );
}

export default PaintScreen;
