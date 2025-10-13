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
  if (!req.file) return res.status(400).send("No file uploaded");

  const params = {
    Bucket: BUCKET_NAME,
    Key: req.file.originalname,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).send("Upload failed: " + err.message);
    }
    console.log("File uploaded successfully:", data.Key);
    res.send("File uploaded successfully!");
  });
});

// List files endpoint with pre-signed URLs (for private buckets)
app.get("/files", (req, res) => {
  s3.listObjectsV2({ Bucket: BUCKET_NAME }, (err, data) => {
    if (err) {
      console.error("List files error:", err);
      return res.status(500).send("Error listing files");
    }

    // Generate pre-signed URLs for private access
    const files = data.Contents.map((obj) => {
      // Pre-signed URL expires in 1 hour (3600 seconds)
      const url = s3.getSignedUrl("getObject", {
        Bucket: BUCKET_NAME,
        Key: obj.Key,
        Expires: 3600,
      });

      return {
        name: obj.Key,
        url: url,
        size: obj.Size,
        lastModified: obj.LastModified,
      };
    });

    res.json(files);
  });
});

// Download endpoint with pre-signed URL
app.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;

  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Expires: 3600, // URL expires in 1 hour
  };

  const url = s3.getSignedUrl("getObject", params);
  res.json({ url });
});

// Delete endpoint (optional)
app.delete("/delete/:filename", (req, res) => {
  const filename = req.params.filename;

  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).send("Delete failed: " + err.message);
    }
    console.log("File deleted successfully:", filename);
    res.send("File deleted successfully!");
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
