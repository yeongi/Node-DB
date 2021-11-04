const express = require("express");
const path = require("path");

const router = express.Router();
//router 분리
// "/" 경로에 get 요청 처리 middleware
router.get("/", (req, res) => {
  // res.sendFile()를 통해 안의 경로에 있는 파일이 띄어 진다.
  // __dirname = 요청 파일에 경로를 단축시켜주는 절대 경로 (현재 실행중인 폴더 경로이다.)
  // __dirname + /src/index.html 파일을 보낸다.
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

router.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "about.html"));
});

//모듈로 분리
module.exports = router;
