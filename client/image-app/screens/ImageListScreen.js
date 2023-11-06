import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { getImages } from "../functions";
import FontAwesome from "@expo/vector-icons/Ionicons";

const { width, height } = Dimensions.get("screen");
const ImageListScreen = ({ navigation }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Define an async function to fetch and set the images
    const fetchImages = async () => {
      try {
        const imagesData = await getImages(); // Assuming getImages returns a promise
        setImages(imagesData);
        console.log(imagesData);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    // Call the async function
    fetchImages();
    console.log(images);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatlist}
        data={images}
        horizontal={false}
        // keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            style={{
              marginBottom: 10,
            }}
          >
            <Image
              source={{ uri: item.publicUrl }}
              style={{ width: width * 0.8, height:width * .8, margin:10, borderRadius:15}}
            />
            {/* Display image, information, and map markers */}
            <View style={{ flexDirection: "row", alignItems: "center", margin:10 }}>
              <FontAwesome
                name="calendar"
                color={"#333"}
                size={15}
                style={{ marginRight: 10 }}
              />
              <Text>
                {item.date}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", margin:10 }}>
              <FontAwesome
                name="location"
                color={"red"}
                size={15}
                style={{ marginRight: 10 }}
              />
              <Text>
                {item.latitude}, {item.longitude}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate("Camera")}
        style={styles.button}
      >
        <FontAwesome name="camera" color={"white"} size={50} />
      </TouchableOpacity>
    </View>
  );
};

export default ImageListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  flatlist: {
    alignItems: "center",
    justifyContent:'center',
    zIndex:0,
  },
  button: {
    width: 80,
    height: 80,
    padding: 5,
    backgroundColor: "dodgerblue",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    display: "absolute",
    bottom: height *.05,
    left: width * 0.7,
    zIndex: 990,
  },
});
