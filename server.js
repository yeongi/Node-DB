//express 로드 , 이를 통해 express 모듈을 제어한다.
const express = require("express");
const path = require("path");
const db = require("./lib/db.js");
const bodyParser = require('body-parser');
const session = require('express-session');
const crypto = require('crypto');
const FileStore = require('session-file-store')(session); // 세션을 파일에 저장
const cookieParser = require('cookie-parser');
const app = express();
const fs = require('fs');


//포트 지정
const port = 3000;
//route를 분리한 것을 가져옴
const route = require("./route.js");

//뷰 엔진 pug 로 지정
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "view"));
app.use(express.static(path.join(__dirname, "view")));

//body-parse 사용
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// 세션 (미들웨어) 6
app.use(session({
  secret: 'blackzat', // 데이터를 암호화 하기 위해 필요한 옵션
  resave: false, // 요청이 왔을때 세션을 수정하지 않더라도 다시 저장소에 저장되도록
  saveUninitialized: true, // 세션이 필요하면 세션을 실행시칸다(서버에 부담을 줄이기 위해)
  store : new FileStore() // 세션이 데이터를 저장하는 곳
}));

//route 가져오기
app.use("/", route);

//db 실행
db.connect();

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

