// server/middleware/upload.js
import multer from "multer";
import path from "path";

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    // Use a timestamp to ensure unique filenames
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

// Set up file type filter
// Adjusted fileFilter function
const fileFilter = (req, file, cb) => {
  // Define allowed file extensions and corresponding MIME types
  const allowedTypes = {
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    mp4: "video/mp4",
    avi: "video/x-msvideo"
  };

  // Extract file extension and MIME type
  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
  const mimetype = file.mimetype;

  // Check if the file extension and MIME type are allowed
  if (allowedTypes[ext] === mimetype) {
    cb(null, true);
  } else {
    console.error(`Error: Unsupported file type - ${file.originalname} (${mimetype})`);
    cb("Error: Unsupported file type.");
  }
};

// Initialize multer with the storage and filter options
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 } // Example size limit of 10MB
});

export default upload;