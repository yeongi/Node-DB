const mysql = require("mysql");
//db 기본 포트 3306
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1111",
});

module.exports = {
  connection: con,
  connect: () => {
    con.connect((err) => {
      if (err) {
        throw err;
      }
      console.log("db Connected");
    });
  },
};
