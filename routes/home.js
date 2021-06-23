var express = require("express");
var router = express.Router();
const Cache = require("../router_function/CacheModule");
var dbdi = require("../router_function/DBDI");
var mysql = require("mysql2");
var sqlInfo = require("../config/mysql");
var pool = mysql.createPool(sqlInfo);

//validation Joi
const { logOut, getData } = require("../router_function/schmas");

/* GET home page. */
router.post("/logout", Cache.Logout_middleware, function (req, res, next) {
  try {
    var key_data_ = req.body;
    const { error } = logOut.validate(key_data_);

    if (error) {
      console.log("Error", error);
      res.send({
        success: false,
        message: "입력하신 내용을 다시 확인해 주세요.",
      });

      return;
    }
  } catch (e) {
    throw new Error(e);
  }
});

router.post("/get_data", function (req, res, next) {
  try {
    var key_data_ = req.body;

    const { error } = getData.validate(key_data_);

    if (error) {
      console.log("Error", error);
      res.send({
        success: false,
        message: "입력하신 내용을 다시 확인해 주세요.",
      });

      return;
    }

    pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        res.send({
          success: false,
          message: "서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
        });
        pool.releaseConnection(connection);
      } else {
        var query_ = dbdi.SelectPreshowContent(
          "",
          "",
          "ORDER BY sub.content_num DESC",
          "",
          "3"
        );
        connection.query(query_, function (err, rows1, field) {
          if (err) {
            console.log(err);
            res.send({
              success: false,
              message:"서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
            });
            pool.releaseConnection(connection);
          } else {
            query_ = dbdi.SelectPreshowDouble(
              "WHERE d.content_category=?",
              "ORDER BY d.content_date DESC",
              "",
              "3"
            );
            console.log(key_data_);
            connection.query(
              query_,
              [key_data_.place],
              function (err, rows2, field) {
                if (err) {
                  console.log(err);
                  res.send({
                    success: false,
                    message:
                    "서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
                  });
                  pool.releaseConnection(connection);
                } else {
                  res.send({
                    success: true,
                    message: { content: rows1, double: rows2, news: null },
                  });
                  pool.releaseConnection(connection);
                }
              }
            );
          }
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.send({
      success: false,
      message: "서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
    });
  }
});

module.exports = router;
