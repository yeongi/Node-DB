const express = require("express");
const mssql = require('mysql');
const db = require('./lib/db');

const router = express.Router();
//router 분리
// "/" 경로에 get 요청 처리 middleware
router.get("/", (req, res) => {
  if(!req.session.isLoggedIn){
    res.render("index", { isLoggedIn: false , userMessage: "로그인을 하세요." });
  }else{
    const username = req.session.name;
    const grade = req.session.grade_num;
    let gradeMessage = "";
    switch (grade){
      case 300:
        gradeMessage = "IRON";
        break;
      case 301:
        gradeMessage = "bronze";
        break;
      case 302:
        gradeMessage = "silver";
        break;
      case 303:
        gradeMessage = "gold";
        break;
      case 500:
        gradeMessage = "admin";
        break;
      default:
        break;
    }
    
    res.render("index", { 
      isloggedIn: true , userMessage: `${username}님 환영합니다.`,
      grade:gradeMessage }
      );
  }
  
  console.log('메인페이지 작동');

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
  if(!req.session.isLoggedIn){
    res.render('index', { isLoggedIn: false , userMessage: "장바구니를 이용 하려면 로그인을 하세요." });
  }else{
    const usernum = req.session.user_num;
    console.log(usernum);
    db.connection.query('select * from basket where user_num=?',[usernum] , (err,result)=>{
      if(err) throw err;

      if(result.length == 0 && usernum){
        console.log('장바구니 생성됨');
        db.connection.query('insert into basket (user_num,basket_date) values(?,?)',[
          usernum ,new Date()
        ]);
        res.render("index", { userMessage: "장바구니 생성 완료" });
      }else{
        console.log("장바구니 보여주기");
        db.connection.query('select * from basket where user_num=?',[usernum] , (err,result)=>{
          if(err) throw err;
          console.log(result[0]);
          date = result[0].basket_date;
          db.connection.query('select * from book_basket where basket_num=?',[result[0].basket_num] , (err,result)=>{
            if(err) throw err;
            if(result.length > 0){
              res.render("basket",{
                basket_date : date ,
                basketList : result});
            }
          });
        });
      }
    });
  }
});

router.get("/books", (req, res) => {
  db.connection.query('select * from book' , (err,result)=>{
    res.render("books",{ bookList: result });
  });
});

//장바구니 추가
router.post("/books", (req, res) => {
  if(!req.session.isLoggedIn){
    res.render('index', { isLoggedIn: false , userMessage: "장바구니를 이용 하려면 로그인을 하세요." });
  }else{
    const body = req.body;
    const usernum = req.session.user_num;
    db.connection.query('select * from basket where user_num=?',[usernum] , (err,result)=>{
      if(err) throw err;

      if(result.length == 0 && usernum){
        console.log('장바구니 생성됨');
        db.connection.query('insert into basket (user_num,basket_date) values(?,?)',[
          usernum ,new Date()
        ]);
        res.render("basket",{basket_date : new Date()});
      }else{
        console.log("장바구니 추가완료");
        //유저 넘버로 장바구니 찾기
        db.connection.query('select * from basket where user_num=?',[usernum] , (err,result)=>{
          if(err) throw err;
          console.log(body);
          basket = result[0].basket_num;
          //장바구니에 책 넣기
          db.connection.query('insert into book_basket (basket_num,book_num,book_name,book_amount) values(?,?,?,?)',[
            basket,body.book_num,body.book_name,body.amount] , (err,result)=>{
            if(err) throw err;
            console.log(result);
            res.send('<script>alert("장바구니 책 넣기 완료");window.open("basket")</script>');
          });
        });
        
      }
    });

  }
  
});

router.get("/manager", (req,res)=>{
  if(req.session.grade_num === 500){
    res.render("manager");
  }
})

//책 추가 하기 관리자
router.post("/manager", (req, res)=>{
  const book = req.body;
  console.log(req.body);
  console.log(book.bookName);
  db.connection.query('select * from book where book_name=?',[book.booName],(err,result)=>{
    console.log(result);
    if(err) throw err;
    if(result.length == 0){
        console.log('책넣기 성공');
        db.connection.query('insert into book (book_name, book_stock, book_price) values(?,?,?)',[
          book.bookName , book.bookStock, book.bookPrice
        ]);
    }else{
        console.log('책넣기 실패');
    }
  });
})

//회원 가입
router.post("/signIn" , (req,res) =>{

  console.log('회원가입 하는중')
  let body = req.body;
  //쿼리문
  db.connection.query('select * from user where id=?',[body.id],(err,result)=>{
    console.log(result);
    if(err) throw err;
    if(result.length == 0){
        console.log('유저 정보 넣기 성공');
        db.connection.query('insert into user (name, id, password) values(?,?,?)',[
         body.name, body.id, body.password
        ]);
        res.redirect('signUp');
    }else{
        console.log('회원가입 실패');
        res.send('<script>alert("회원가입 실패");</script>')
        res.redirect('signUp');
    }
  });

});

//로그인
router.post("/signUp" , (req,res) =>{
  console.log('로그인 하는중')
  let body = req.body;
  
  db.connection.query('select * from user where id=?',[body.id],(err,result)=>{
    if (err) throw err;
    if(body.id === result[0].id && body.password === result[0].password) {

      console.log("로그인 성공!?!");
      console.log(result[0]);
      // 세션에 추가
      req.session.isLoggedIn = true;
      req.session.user_num = result[0].user_num;
      req.session.name = result[0].name;
      req.session.id = result[0].id;
      req.session.grade_num = result[0].grade_num;
      req.session.save(() => { // 세션 스토어에 적용하는 작업
          res.redirect('/');
      });

      
    }else{

      console.log("로그인 실패!?!");
      res.send('<script>alert("아이디 비밀번호를 확인해 주세요.");window.open("signUp")</script>');
    }
  });
});

//로그아웃하기
router.get('/logout',(req,res)=>{
  console.log('로그아웃 성공');
  req.session.destroy(function(err){
      // 세션 파괴후 할 것들
      res.redirect('/');
  });

});


//모듈로 분리
module.exports = router;
