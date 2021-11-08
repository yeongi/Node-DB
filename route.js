const express = require("express");
const mssql = require("mysql");
const db = require("./lib/db");

const router = express.Router();
//router 분리
// "/" 경로에 get 요청 처리 middleware
router.get("/", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render("index", { isLoggedIn: false, userMessage: "로그인을 하세요." });
  } else {
    const username = req.session.name;
    const grade = req.session.grade_num;
    let gradeMessage = "";
    switch (grade) {
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
      isloggedIn: true,
      userMessage: `${username}님 환영합니다.`,
      grade: gradeMessage,
    });
  }

  console.log("메인페이지 작동");
});

router.get("/signUp", (req, res) => {
  res.render("signUp");
});

router.get("/orderHistory", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render("orderHistory");
  }
  const usernum = req.session.user_num;
  db.connection.query(
    "SELECT m.*, bo.book_order_amount, bo.book_order_price, bk.book_name, bk.book_price FROM myorder m INNER JOIN book_order bo ON m.order_num = bo.order_num INNER JOIN book bk ON bk.book_num = bo.book_num where m.user_num = ?",
    [usernum],
    (err, result) => {
      if (err) throw err;
      res.render("orderHistory", { history: result });
    }
  );
});

router.get("/signIn", (req, res) => {
  res.render("signIn");
});

router.get("/order", (req, res) => {
  const usernum = req.session.user_num;
  let userInfo;
  //회원 정보 불러 오기
  db.connection.query(
    "SELECT u.name, a.zip_code, a.default_addr, a.detail_addr, c.card_num, c.card_valid_date, c.card_type FROM USER u INNER JOIN Address a ON u.user_num = a.user_num INNER JOIN Card c ON u.user_num = c.user_num where u.user_num =? ",
    [usernum],
    (err, result) => {
      if (err) throw err;
      userInfo = result[0];
    }
  );

  //장바구니 불러 오기
  db.connection.query(
    "select * from basket where user_num=?",
    [usernum],
    (err, result) => {
      if (err) throw err;
      db.connection.query(
        "select book_basket.basket_num, book_basket.book_num, book_basket.book_name, book_basket.book_amount, book.book_price from book_basket inner join book on book_basket.book_num = book.book_num where basket_num=?",
        [result[0].basket_num],
        (err, result) => {
          if (err) throw err;
          if (result.length > 0) {
            res.render("order", {
              basketList: result,
              user: userInfo,
            });
          } else {
            res.render("order", {
              basketList: [],
              user: userInfo,
            });
          }
        }
      );
    }
  );
});

//주문 넣기
router.post("/order", (req, res) => {
  const usernum = req.session.user_num;
  const body = req.body;

  // 주문 생성
  db.connection.query(
    "insert into myorder (user_num, order_date, order_zip_code, order_default_addr, order_detail_addr, order_card_num, order_card_valid_date, order_card_type, order_total) values (?,?,?,?,?,?,?,?,?)",
    [
      usernum,
      new Date(),
      body.zipCode,
      body.addr,
      body.detailAddr,
      body.cardNum,
      new Date(body.cardValidDate),
      body.cardType,
      body.total,
    ]
  );

  //주문검색
  db.connection.query(
    "select order_num from myorder where user_num=?",
    [usernum],
    (err, res) => {
      order = res[0].order_num;
    }
  );

  //장바구니 목록 가져오기
  db.connection.query(
    "select * from basket where user_num=?",
    [usernum],
    (err, basket) => {
      if (err) throw err;
      db.connection.query(
        "SELECT b.*, bb.*, bk.* FROM basket b INNER JOIN book_basket bb ON b.basket_num = bb.basket_num INNER JOIN book bk ON bb.book_num = bk.book_num where b.basket_num=?",
        [basket[0].basket_num],
        (err, result) => {
          if (err) throw err;
          const bookList = result;
          console.log(typeof basket[0].basket_num);
          for (const b in bookList) {
            //재고량 업데이트

            db.connection.query(
              "UPDATE book SET book_stock = book_stock -? where book_num = ? ",
              [bookList[b].book_amount, bookList[b].book_num],
              (err, res) => {
                console.log("재고량 업데이트");
                if (err) throw err;
              }
            );

            //주문에 넣기
            db.connection.query(
              "insert into book_order (order_num, book_num, book_order_amount, book_order_price) values(?,?,?,?)",
              [
                order,
                bookList[b].book_num,
                bookList[b].book_amount,
                bookList[b].book_price * bookList[b].book_amount,
              ]
            );

            //장바구니 삭제
            db.connection.query("DELETE from basket where user_num=?", [
              usernum,
            ]);
          }
        }
      );
    }
  );

  res.render("index", {
    isLoggedIn: true,
    userMessage: "주문 완료 주문내역을 확인하세요.",
  });
});

router.get("/basket", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render("index", {
      isLoggedIn: false,
      userMessage: "장바구니를 이용 하려면 로그인을 하세요.",
    });
  } else {
    const usernum = req.session.user_num;
    console.log(usernum);
    db.connection.query(
      "select * from basket where user_num=?",
      [usernum],
      (err, result) => {
        if (err) throw err;

        if (result.length == 0 && usernum) {
          console.log("장바구니 생성됨");
          db.connection.query(
            "insert into basket (user_num,basket_date) values(?,?)",
            [usernum, new Date()]
          );
          res.redirect("books");
        } else {
          db.connection.query(
            "select * from basket where user_num=?",
            [usernum],
            (err, result) => {
              if (err) throw err;
              date = result[0].basket_date;
              db.connection.query(
                "select book_basket.basket_num, book_basket.book_num, book_basket.book_name, book_basket.book_amount, book.book_price from book_basket inner join book on book_basket.book_num = book.book_num where basket_num=?",
                [result[0].basket_num],
                (err, result) => {
                  if (err) throw err;
                  console.log(result);
                  if (result.length > 0) {
                    res.render("basket", {
                      basket_date: date,
                      basketList: result,
                    });
                  } else {
                    res.render("basket", {
                      basket_date: date,
                    });
                  }
                }
              );
            }
          );
        }
      }
    );
  }
});

router.get("/books", (req, res) => {
  db.connection.query("select * from book", (err, result) => {
    res.render("books", { bookList: result });
  });
});

//장바구니 추가
router.post("/books", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render("index", {
      isLoggedIn: false,
      userMessage: "장바구니를 이용 하려면 로그인을 하세요.",
    });
  } else {
    const body = req.body;
    const usernum = req.session.user_num;
    db.connection.query(
      "select * from basket where user_num=?",
      [usernum],
      (err, result) => {
        if (err) throw err;

        if (result.length == 0 && usernum) {
          console.log("장바구니 생성됨");
          db.connection.query(
            "insert into basket (user_num,basket_date) values(?,?)",
            [usernum, new Date()]
          );
          res.send(
            '<script>alert("장바구니 생성됨");window.open("basket")</script>'
          );
        } else {
          console.log("장바구니 추가완료");
          //유저 넘버로 장바구니 찾기
          db.connection.query(
            "select * from basket where user_num=?",
            [usernum],
            (err, result) => {
              if (err) throw err;
              console.log(body);
              basket = result[0].basket_num;
              //장바구니에 책 넣기
              db.connection.query(
                "insert into book_basket (basket_num,book_num,book_name,book_amount) values(?,?,?,?)",
                [basket, body.book_num, body.book_name, body.amount],
                (err, result) => {
                  if (err) throw err;
                  console.log(result);
                  res.redirect("basket");
                }
              );
            }
          );
        }
      }
    );
  }
});

router.get("/manager", (req, res) => {
  if (req.session.grade_num === 500) {
    res.render("manager");
  }
});

//책 추가 하기 관리자
router.post("/manager", (req, res) => {
  const book = req.body;
  console.log(req.body);
  console.log(book.bookName);
  db.connection.query(
    "select * from book where book_name=?",
    [book.booName],
    (err, result) => {
      console.log(result);
      if (err) throw err;
      if (result.length == 0) {
        console.log("책넣기 성공");
        db.connection.query(
          "insert into book (book_name, book_stock, book_price) values(?,?,?)",
          [book.bookName, book.bookStock, book.bookPrice]
        );
      } else {
        console.log("책넣기 실패");
      }
    }
  );
});

//회원 가입
router.post("/signIn", (req, res) => {
  let body = req.body;
  console.log("회원가입 하는중", body);
  //쿼리문
  db.connection.query(
    "select * from user where id=?",
    [body.id],
    (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        console.log("유저 정보 넣기 성공");
        db.connection.query(
          "insert into user (name, id, password) values(?,?,?)",
          [body.name, body.id, body.password]
        );
        db.connection.query(
          //유저 번호 찾기
          "select * from user where id=?",
          [body.id],
          (err, result) => {
            if (err) throw err;
            //카드 정보 넣기
            db.connection.query(
              "insert into card (card_num, user_num , card_valid_date, card_type) values(?,?,?,?)",
              [
                body.cardNum,
                result[0].user_num,
                body.cardValidDate,
                body.cardType,
              ]
            );
            //주소 정보 넣기
            db.connection.query(
              "insert into address (user_num , zip_code, default_addr, detail_addr) values(?,?,?,?)",
              [result[0].user_num, body.zipCode, body.addr, body.detailAddr]
            );
          }
        );

        res.redirect("signUp");
      } else {
        console.log("회원가입 실패");
        res.send('<script>alert("회원가입 실패");</script>');
        res.redirect("signUp");
      }
    }
  );
});

//로그인
router.post("/signUp", (req, res) => {
  console.log("로그인 하는중");
  let body = req.body;

  db.connection.query(
    "select * from user where id=?",
    [body.id],
    (err, result) => {
      if (err) throw err;
      if (body.id === result[0].id && body.password === result[0].password) {
        console.log("로그인 성공!?!");
        console.log(result[0]);
        // 세션에 추가
        req.session.isLoggedIn = true;
        req.session.user_num = result[0].user_num;
        req.session.name = result[0].name;
        req.session.id = result[0].id;
        req.session.grade_num = result[0].grade_num;
        req.session.save(() => {
          // 세션 스토어에 적용하는 작업
          res.redirect("/");
        });
      } else {
        console.log("로그인 실패!?!");
        res.send(
          '<script>alert("아이디 비밀번호를 확인해 주세요.");window.open("signUp")</script>'
        );
      }
    }
  );
});

//로그아웃하기
router.get("/logout", (req, res) => {
  console.log("로그아웃 성공");
  req.session.destroy(function (err) {
    // 세션 파괴후 할 것들
    res.redirect("/");
  });
});

//모듈로 분리
module.exports = router;
