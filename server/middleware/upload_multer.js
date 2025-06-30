const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Destination logic
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Assume you have `req.user` populated by your auth middleware
    const role = req.user.role;

    // Map role to folder
    let folderName;
    switch (role) {
      case "admin":
        folderName = "Avatar_Admin";
        break;
      case "faculty":
        folderName = "Avatar_Faculty";
        break;
      case "student":
        folderName = "Avatar_Student";
        break;
      default:
        folderName = "Avatar_Others";
    }

    const uploadPath = path.join(__dirname, "..", "uploads", folderName);

    // Ensure the folder exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Filter only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Export configured multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
});

module.exports = upload;
