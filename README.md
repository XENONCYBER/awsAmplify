# Doc Vault 📂

Doc Vault is a web-based document management system built with Node.js and Express. It provides a simple interface for uploading, listing, and managing files using S3-compatible storage (such as Backblaze B2 or AWS S3).

## 🚀 Features

- **File Upload**: Easily upload documents to your S3 bucket.
- **File Management**: List, download, and delete files directly from the web interface.
- **S3 Compatible**: Works with AWS S3, Backblaze B2, and other S3-compatible APIs.
- **Clean UI**: Simple and intuitive frontend for seamless interaction.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Storage**: AWS SDK (S3 compatible)
- **File Handling**: Multer
- **Frontend**: React,JavaScript

## 📋 Prerequisites

- Node.js (v14 or higher)
- An S3-compatible storage account (AWS, Backblaze B2, etc.)
- A bucket created in your storage provider.

## ⚙️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/XENONCYBER/awsAmplify.git
   cd awsAmplify
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   B2_ENDPOINT=s3.your-region.backblazeb2.com
   B2_APPLICATION_KEY_ID=your_key_id
   B2_APPLICATION_KEY=your_application_key
   B2_BUCKET_NAME=your_bucket_name
   ```
   *Note: Refer to `AWS_SETUP_GUIDE.md` for detailed AWS configuration.*

## 🏃 Running the Project

To start the server:
```bash
npm start
```
The application will be available at `http://localhost:3000`.

## 📂 Project Structure

- `server.js`: Main Express server with S3 integration.
- `public/`: Frontend assets (HTML, CSS, JS).
- `AWS_SETUP_GUIDE.md`: Detailed guide for setting up AWS/S3 permissions.
- `test-s3-connection.js`: Utility script to test your S3 connection.

## 📜 License

This project is licensed under the ISC License.
