const fs = require("fs");
const multer = require("multer");
const path = require("path");

// Define storage for multer
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    // eslint-disable-next-line no-undef
    const folderPath = path.join(__dirname, "../public")
    fs.mkdirSync(folderPath, { recursive: true })
    cb(null, folderPath)
  },

  filename: function (req, file, cb) {
    const originalName = file.originalname;
    const newName = originalName.trim().replace(/\s+/g, "_");
    // eslint-disable-next-line no-undef
    const normalizedFileName =
      Date.now() + "_" + Buffer.from(newName, "utf8").toString("utf8");
    cb(null, normalizedFileName);
  },
});

// File filter to allow only specific extensions
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, .png, and  formats are allowed!"));
  }
};

// Set upload limits and storage options
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
  fileFilter: fileFilter,
}).single("imageUrl");

exports.upload = (req, res, next) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        return res
          .status(400)
          .json({ message: `Error uploading file : ${err}` });
        // eslint-disable-next-line no-dupe-else-if
      } else if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      // Check if the file exists before proceeding with the upload
      if (!req.file || !req.file.originalname) {
        return res.status(400).json({ error: "No file provided" });
      }

      res.json({
        filePath: req.file.filename,
        message: "File uploaded to local  successfully",
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = (req, res) => {
  try {
    // const folderName = req.body.folderName || "images"; // Default folder name
    const imageName = req.body.imageName; // Name of the image to be deleted

    if (!imageName) {
      return res.status(400).json({ error: "No image name provided" });
    }

    // eslint-disable-next-line no-undef
    const imagePath = path.join(__dirname, "../public", imageName);

    // Check if the file exists
    if (fs.existsSync(imagePath)) {
      // Delete the file
      fs.unlinkSync(imagePath); //use to delete file in specific path local

      return res.json({ message: "Image deleted at local successfully" });
    } else {
      return res.status(404).json({ message: "Image not found" });
    }
  } catch (err) {
    console.log("failed to delete image", err);
    return res
      .status(500)
      .json({ message: `An error occurred while deleting the image ${err}` });
  }
};
