import axios from "axios";
import { serverUrl } from "../config";
import * as Location from "expo-location"; // Import Expo's location module



// const getImages = async()=>{
//   const images = []
//   try {
//     response = await axios.get(`${serverUrl}images`)
//     if (response.status === 200) {
//       images = await response.data;
//       return await images
//     }
//   } catch (error) {
//     console.log(error.code);
//   }

// }

const getImageUri = async (imageUri) => {
  try {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "image.jpg",
    });

    const response = await axios.post(
      `${serverUrl}getUri`,
      formData,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      const data = response.data;
      console.log(data);
      return data.uri
    } else {
      console.error("Error uploading the image.");
    }
  } catch (error) {
    console.error("Error get image uri:", error.code);
  }
};

const getImages = async () => {
  try {
    const response = await axios.get(`${serverUrl}images`);
    // Handle the response data here (in this case, logging it to the console)
    console.log('Images:', response.data);
    return response.data;
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error retrieving images:', error);
    throw error;
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

const uploadImages = async (image1, image2, date, latitude, longitude) => {
  const formData = new FormData();

  // Append image data to the FormData
  formData.append('images', {
    uri: image1.uri, // Replace with your image1 URI
    name: 'image1.jpg',
    type: 'image/jpeg', // Adjust the content type as needed
  });
  formData.append('images', {
    uri: image2.uri, // Replace with your image2 URI
    name: 'image2.jpg',
    type: 'image/jpeg', // Adjust the content type as needed
  });

  // Add additional data to the FormData
  formData.append('date', date);
  formData.append('latitude', latitude);
  formData.append('longitude', longitude);

  try {
    const response = await axios.post(`${serverUrl}uploads`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data) {
      console.log('Images uploaded and information saved.');
    }
  } catch (error) {
    console.error('Error uploading images:', error);
  }
};
const sendImageToAPI = null
export { sendImageToAPI, getCurrentLocation, getImages, uploadImages, getImageUri };
