const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const {getDownloadURL, uploadBytesResumable, uploadBytes} = require('firebase/storage')
const {storageBucket, ref} = require('./firebase')
const { readFileSync } = require("node:fs")
const Jimp = require('jimp');

app.use(cors());

const port = process.env.PORT || 3000;
const MONGO_DB_URL = process.env.MONGO_DB_URL || 'mongodb+srv://username:password@nextauthcluster.olownbb.mongodb.net/server?retryWrites=true&w=majority'
// Multer configuration for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Store uploaded files in the 'uploads' directory
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname); // Rename files to avoid conflicts
//   },
// });

const upload = multer({ storage: multer.memoryStorage() });

// Body parser setup
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(
  MONGO_DB_URL,
  { useNewUrlParser: true }
);

// Define a Mongoose model for image documents
const Image = mongoose.model("Image", {
  filename: String,
  date: String,
  latitude: String,
  longitude: String,
  publicUrl: String,
});

// API endpoint for uploading images
app.post("/upload", upload.single("image"), async (req, res) => {
  const file = req.file;
  const { date, latitude, longitude, publicUrl } = req.body; // You can send additional data with the request
  if (!file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  const filename = "images/" + new Date().toISOString() + " - " + file.originalname
  const storageRef = ref(storageBucket, filename)
  const metadata = {
    contentType: file.mimetype
  }
  await uploadBytes(storageRef,file.buffer,metadata)
  // await uploadBytesResumable(storageRef, readFileSync(file.path), metadata);
  // Save image information to the MongoDB database
  const uri = await getDownloadURL(storageRef)
  const image = new Image({
    filename: file.filename,
    date: date || new Date().toISOString(),
    latitude: latitude || 0,
    longitude: longitude || 0,
    publicUrl:  uri,
  });

  try {
    await image.save();
    return res.json({ message: "Image uploaded and information saved.", uri });
  } catch (err) {
    return res.status(500).json({ error: "Error saving image information." });
  }
});

app.post("/getUri", upload.single("image"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  const filename = "temp/" + new Date().toISOString() + " - " + file.originalname
  const storageRef = ref(storageBucket, filename)
  const metadata = {
    contentType: file.mimetype
  }

  try {
    await uploadBytes(storageRef,file.buffer,metadata)
    const uri = await getDownloadURL(storageRef)
    return res.json({ message: "Image uploaded and information saved.", uri });
  } catch (err) {
    return res.status(500).json({ error: "Error saving image information." });
  }
});

app.post('/uploads', upload.array('images', 2), async (req, res) => {
  const files = req.files;
  const { date, latitude, longitude } = req.body; // Additional data

  if (!files || files.length < 2) {
    return res.status(400).json({ error: 'Please upload at least two images.' });
  }

  try {
    const mergedImageBuffer = await mergeImages(files[0].buffer, files[1].buffer, 0, 0);

    const filename = 'images/' + new Date().toISOString() + ' - screenshot.jpg';
    const storageRef = ref(storageBucket, filename);

    const metadata = {
      contentType: 'image/jpeg', // Adjust the content type as needed
    };

    await uploadBytes(storageRef, mergedImageBuffer, metadata);
    const uri = await getDownloadURL(storageRef);

    const image = new Image({
      filename,
      date: date || new Date().toISOString(),
      latitude: latitude || 0,
      longitude: longitude || 0,
      publicUrl: uri,
    });

    await image.save();

    return res.json({ message: 'Merged image uploaded and information saved.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error saving merged image information.' });
  }
});

// API endpoint to retrieve image information
app.get("/images", async (req, res) => {
  try {
    const images = await Image.find({});
    return res.json(images);
  } catch (err) {
    return res.status(500).json({ error: "Error retrieving images." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const mergeImages = async (file1, file2, x, y) => {
  try {
    // Load the images using Jimp
    const image1 = await Jimp.read(file1);
    const image2 = await Jimp.read(file2);

    // Perform image manipulation
    image1.composite(image2, x, y); // Merge image2 onto image1 at the specified position (x, y)

    // Get the merged image as a Buffer
    const mergedImageBuffer = await image1.getBufferAsync(Jimp.MIME_JPEG);

    return mergedImageBuffer;
  } catch (error) {
    console.error('Error merging images:', error);
    throw error;
  }
};