var express = require("express");
var router = express.Router();
var mysql = require("mysql2");
var sqlInfo = require("../config/mysql");
var pool = mysql.createPool(sqlInfo);
var dbdi = require("../router_function/DBDI");
const Cache = require("../router_function/CacheModule");
const { writePath } = require("../router_function/schmas");

router.post(
  "/write_path",
  Cache.Chack_login_middleware,
  async function (req, res, next) {
    try {
      var key_data_ = req.body; //await get_data_from_cli(req_body)

      const { error } = writePath.validate(key_data_);
      if (error) {
        console.log("Error", error);
        res.send({
          success: false,
          message: "입력을 다시 한번 확인 해주세요",
        });
        return;
      }

      pool.query(
        InsertServiceCenter(),
        [key_data_.user, key_data_.title, key_data_.content],
        function (err, rows, field) {
          if (err) res.send({ success: false, message: "작성에 실패했습니다" });
          else res.send({ success: true, message: "작성됬습니다" });
        }
      );
    } catch (e) {
      res.send({ success: false, message: "다시 시도해주세요" });
    }
  }
);

router.post("/req_announce", async function (req, res, next) {
  try {
    var query_ = dbdi.SelectAnnouncePreshow();
    pool.execute(query_, function (err, rows, field) {
      if (err) res.send({ success: false, message: "불러오기에 실패했습니다" });
      res.send({ success: true, message: rows });
    });
  } catch (e) {
    res.send({ success: false, message: "서버에러" });
  }
});

router.post(
  "/req_complain_preshow",
  Cache.Chack_login_middleware,
  async function (req, res, next) {
    try {
      var key_data_ = req.body;
      console.log("key_data : ", key_data_);
      pool.execute(
        SelectComplainPreshow(),
        [key_data_.user],
        function (err, rows, field) {
          if (err) {
            res.send({ success: false, message: "불러오기에 실패했습니다" });
          }

          console.log(rows);
          res.send({ success: true, message: rows });
        }
      );
    } catch (e) {
      res.send({ success: false, message: "서버에러" });
    }
  }
);

router.post(
  "/req_complain_details",
  Cache.Chack_login_middleware,
  async function (req, res, next) {
    try {
      var key_data_ = req.body;
      console.log("key_data : ", key_data_);

      pool.execute(
        SelectComplainDetails(),
        [key_data_.num],
        function (err, rows, field) {
          if (err || rows.length===0)  res.send({ success: false, message: "불러오기에 실패했습니다" });
          else res.send({ success: true, message: rows });
        }
      );
    } catch (e) {
      res.send({ success: false, message: "서버에러" });
    }
  }
);

function InsertServiceCenter() {
  return `INSERT INTO content_service_center(user_num,content_title,content_content) VALUES(?,?,?);`;
}
function SelectComplainPreshow() {
  return `SELECT content_num AS num, content_title AS title, content_date AS date, content_content AS content FROM content_service_center WHERE user_num=? ORDER BY content_date DESC LIMIT 10 OFFSET 0;`;
}
function SelectComplainDetails() {
  return `SELECT comment_content, comment_date FROM comment_service_center WHERE content_num=?;`;
}

module.exports = router;
