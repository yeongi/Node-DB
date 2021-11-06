const express = require("express");
const path = require("path");

const router = express.Router();
//router 분리
// "/" 경로에 get 요청 처리 middleware
router.get("/", (req, res) => {
  res.render("index", { name: "장의영", message: "메세지를 받았습니다." });
});

router.get("/signUp", (req, res) => {
  res.render("signUp");
});

router.get("/signIn", (req, res) => {
  res.render("signIn");
});

router.get("/order", (req, res) => {
  res.render("order");
});

router.get("/basket", (req, res) => {
  res.render("basket");
});

router.get("/books", (req, res) => {
  res.render("books");
});

//모듈로 분리
module.exports = router;
