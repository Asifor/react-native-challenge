import axios from "axios";
import { serverUrl } from "../config";
import * as Location from "expo-location"; // Import Expo's location module

import * as FileSystem from "expo-file-system";
import {getDocs, collection} from 'firebase/firestore/lite'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "./firebase";

const uploadImageData = async (fileUri) => {
  const storageRef = ref(storage, "images/" + new Date().getTime() + ".png");
  const metadata = {
    contentType: "image/jpeg", // Specify the content type as 'image/png'
  };
  try {
    const response = await uploadBytes(storageRef, fileUri, metadata);

    // Get the download URL of the uploaded image
    const downloadURL = await getDownloadURL(storageRef);
    console.log("Uploaded and URL:", downloadURL);

  } catch (error) {
    console.error("Error uploading image to Firebase Storage:", error);
  }
};


const getImages = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "images"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
    const images = [];

    querySnapshot.forEach((doc) => {
      images.push(doc.data());
    });

    return images;
  } catch (err) {
    console.log(err);
  }
};

// Function to get the device's location
const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.error("Location permission denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    return location.coords;
  } catch (error) {
    console.error("Error getting location:", error);
    return null;
  }
};

const uploadImages = async (image1, image2, latitude, longitude, date) => {
  const formData = new FormData();
  // Append image data to the FormData
  formData.append("images", {
    uri: image1, // Replace with your image1 URI
    name: "image1.jpg",
    type: "image/jpeg", // Adjust the content type as needed
  });

  // Add additional data to the FormData
  formData.append("date", null);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);
  const body = formData;

  try {
    console.log(formData);
    const response = await axios.post(`${serverUrl}uploads`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data) {
      console.log("Images uploaded and information saved.");
    }
  } catch (error) {
    console.error("Error uploading images:", error.code);
  }
};

const sendImageToAPI = null;
export {
  sendImageToAPI,
  getCurrentLocation,
  getImages,
  uploadImages,
};
