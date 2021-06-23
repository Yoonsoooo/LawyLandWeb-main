var express = require("express");
var router = express.Router();
var mysql = require("mysql2");
var sqlInfo = require("../config/mysql");
var pool = mysql.createPool(sqlInfo);

const Cache = require("../router_function/CacheModule");

const { reqWrite } = require("../router_function/schmas");

router.post(
  "/req_write",
  Cache.Chack_login_middleware,
  function (req, res, next) {
    try {
      key_data_ = req.body;
      console.log(key_data_);
      const { error } = reqWrite.validate(key_data_);
      if (error) {
        console.log("Error", error);
        res.send({
          success: false,
          message: "입력을 다시 한번 확인 해주세요",
        });
        return;
      }

      pool.getConnection(function (err, connection) {
        if (err) {
          res.send({ success: false, message: "서버에러1, 다시 시도해주세요" });
          console.log(err);
          return pool.releaseConnection(connection);
        }
        connection.execute(
          CheckDoubleReport(),
          [key_data_.num, key_data_.user],
          function (err, rows, field) {
            console.log("res ", rows);
            if (err) {
              res.send({
                success: false,
                message: "서버에러2, 다시 시도해주세요",
              });
              console.log(err);
              return pool.releaseConnection(connection);
            } else if (rows.length == 1) {
              if (rows[0].is_report) {
                res.send({
                  success: false,
                  message: "이미 결과가 작성된 복대리입니다",
                });
                return pool.releaseConnection(connection);
              } else {
                connection.execute(
                  InsertDoubleReport(),
                  [
                    key_data_.num,
                    key_data_.attendee,
                    key_data_.contentsOfdefense,
                    key_data_.dateOfNextHearing,
                    key_data_.otherSide,
                    key_data_.otherThings,
                    key_data_.place,
                  ],
                  function (err, rows, field) {
                    if (err) {
                      res.send({
                        success: false,
                        message: "서버에러2, 다시 시도해주세요",
                      });
                      console.log(err);
                      return pool.releaseConnection(connection);
                    } else {
                      res.send({ success: true, message: "보고서 작성 완료" });
                      connection.execute(
                        UpdateDoubleIsReport(),
                        [key_data_.num],
                        function (err, rows, field) {
                          console.log(err);
                          console.log(rows);
                          return pool.releaseConnection(connection);
                        }
                      );
                    }
                  }
                );
              }
            } else {
              res.send({
                success: false,
                message: "존제하지 않은 복대리입니다",
              });
              console.log(err);
              return pool.releaseConnection(connection);
            }
          }
        );
      });
    } catch (e) {
      console.log("view");
      console.log(e);
      res.send({ success: false, message: "서버에러1, 다시 시도해주세요" });
    }
  }
);

function InsertDoubleReport() {
  return `INSERT INTO content_double_report(content_num, content_attendee, content_ofdefense, 
   content_dateofnexthearing, content_otherside, content_otherthing, content_place) VALUES(?,?,?,?,?,?,?);`;
}

function CheckDoubleReport() {
  return `SELECT a.is_report FROM (
      SELECT content_num FROM content_double_user WHERE content_num=? AND comment_user_num=?
      ) AS sub STRAIGHT_JOIN content_double_preshow AS a ON sub.content_num=a.content_num;`;
}
function UpdateDoubleIsReport() {
  return "UPDATE content_double_preshow SET is_report=true WHERE content_num=?;";
}

module.exports = router;
