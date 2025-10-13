const express = require("express");
const AWS = require("aws-sdk");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Configure AWS SDK
require("dotenv").config();

AWS.config.update({
  region: process.env.AWS_REGION || "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();
const BUCKET_NAME = "awsccritdemo";

// Multer setup
const upload = multer({ storage: multer.memoryStorage() });

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    console.log("No file received in request");
    return res.status(400).send("No file uploaded");
  }

  console.log(
    "Uploading file:",
    req.file.originalname,
    "Size:",
    req.file.size,
    "bytes"
  );

  const params = {
    Bucket: BUCKET_NAME,
    Key: req.file.originalname,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error("Upload error:", err);
      console.error("Error details:", JSON.stringify(err, null, 2));
      return res.status(500).json({
        error: "Upload failed",
        message: err.message,
        code: err.code,
      });
    }
    console.log("File uploaded successfully:", data.Key);
    console.log("File location:", data.Location);
    res.send("File uploaded successfully!");
  });
});

// List files endpoint
app.get("/files", (req, res) => {
  console.log("Fetching files from bucket:", BUCKET_NAME);

  s3.listObjectsV2({ Bucket: BUCKET_NAME }, (err, data) => {
    if (err) {
      console.error("List files error:", err);
      console.error("Error details:", JSON.stringify(err, null, 2));
      return res.status(500).json({
        error: "Error listing files",
        message: err.message,
        code: err.code,
      });
    }

    console.log("Files found:", data.Contents ? data.Contents.length : 0);

    if (!data.Contents || data.Contents.length === 0) {
      return res.json([]);
    }

    const files = data.Contents.map((obj) => ({
      name: obj.Key,
      url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${obj.Key}`,
    }));

    res.json(files);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
