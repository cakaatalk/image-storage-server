const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();

// 파일 저장을 위한 multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 'uploads' 폴더에 파일 저장
  },
  filename: (req, file, cb) => {
    // 파일명 설정 (원본 파일명 사용)
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// 파일 필터링 (jpeg, jpg, png만 허용)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false); // 다른 형식의 파일은 거부
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB 제한
  },
  fileFilter: fileFilter,
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).send();
  } else {
    next();
  }
});

// 라우트 설정
app.post("/upload", upload.single("image"), (req, res) => {
  if (req.file) {
    res.json({
      imageUrl: `/uploads/${req.file.filename}`,
    });
  } else {
    res.status(400).send("Invalid file type.");
  }
});

app.use("/uploads", express.static("uploads")); // 업로드된 파일 제공

// 서버 시작
const PORT = process.env.PORT || 8040;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
