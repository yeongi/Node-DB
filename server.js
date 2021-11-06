//express 로드 , 이를 통해 express 모듈을 제어한다.
const express = require("express");
const path = require("path");
const db = require("./lib/db.js");
const app = express();

//포트 지정
const port = 3000;
//route를 분리한 것을 가져옴
const route = require("./route.js");

//뷰 엔진 pug 로 지정
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "view"));
app.use(express.static(path.join(__dirname, "view")));

//route 가져오기
app.use("/", route);

//db 실행
db.connect();

app.use((req, res, next) => {
  console.log("안녕!");
  next();
});

//404 처리 부분
app.use((req, res, next) => {
  res.status(404).send("일치하는 주소가 없습니다.");
});

//500 상태 표시 후 에러 메시지 전송
app.use((req, res, next) => {
  res.status(500).send("서버에러!");
});

//middleware
//port에 접속 성공하면 콜백 함수를 실행시킨다.
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
