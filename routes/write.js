var express = require("express");
var router = express.Router();

var mysql=require('mysql2')
var sqlInfo=require('../config/mysql');
var pool= mysql.createPool(sqlInfo);

const { writeSchema } = require("../router_function/schmas");

var dbdi = require("../router_function/DBDI");
const Cache = require("../router_function/CacheModule");
const check = require("../router_function/checkForm");

router.post(
  "/write_path",
  Cache.Chack_login_middleware,
  function (req, res, next) {
    var key_data_ = req.body;

    const { error } = writeSchema.validate(key_data_);

    if (error) {
      console.log("Error", error.details[0].message);
      res.send({
        success: false,
        message: error.message,
      });

      return;
    }

    pool.getConnection(function (err, connection) {
      if (err) {
        res.send({ success: false, message: "서버에러1, 다시 시도해주세요" });
        pool.releaseConnection(connection);
      }
      connection.beginTransaction(function (err) {
        if (err)
          return dbdi.rollback_query(
            res,
            "서버에러2, 다시 시도해주세요",
            connection,
            pool
          );
        var query_ = InsertContent();
        connection.execute(
          query_[0],
          [
            key_data_.user, 
            key_data_.anonymous,
            key_data_.title,
            key_data_.content,
            key_data_.file,
          ],
          function (err, rows1, field) {
            if (err) {
              console.log(err);
              res.send({
                success: false,
                message: "서버에러3, 다시 시도해주세요",
              });
              return dbdi.rollback_query(connection, pool);
            }
            var before_id_ = rows1.insertId;
            connection.execute(
              query_[1],
              [
                before_id_,
                key_data_.category[0],
                key_data_.category[1],
                key_data_.category[2],
              ],
              function (err, rows2, field) {
                if (err) {
                  res.send({
                    success: false,
                    message: "서버에러5, 다시 시도해주세요",
                  });
                  return dbdi.rollback_query(connection, pool);
                } else if (
                  rows1.affectedRows == 1 &&
                  rows2.affectedRows == 1 
                ) {
                  res.send({
                    success: true,
                    message: "Q/A가 등록됬습니다",
                  });
                  return dbdi.commit_query(connection, pool);
                } else {
                  res.send({
                    success: false,
                    message: "서버에러6, 다시 시도해주세요",
                  });
                  return dbdi.rollback_query(connection, pool);
                }
              }
            );
          }
        );
      });
    });
  }
);

router.post(
  "/revise_path",
  Cache.Chack_login_middleware,
  function (req, res, next) {
    try{
      var key_data_ = req.body;

    const { error } = writeSchema.validate(key_data_);

    if (error) {
      console.log("Error", error.details[0].message);
      res.send({
        success: false,
        message: error.message,
      });

      return;
    }
    pool.execute(
      UpdateContent(),
      [
        key_data_.category[0],
        key_data_.category[1],
        key_data_.category[2],
        key_data_.title,
        key_data_.content,
        key_data_.anonymous,
        key_data_.num,
        key_data_.user,
      ],
      function (err, rows, field) {
        if (err) {
          res.send({
            success: false,
            message: "서버에러3, 다시 시도해주세요",
          });
        } else {
          res.send({
            success: true,
            message: "수정완료",
          });
        }
      }
    );
    }catch(e){
      console.log(e)
      res.send({success:false, message:'에러'})
    }
  }
);

function InsertContent(){
  return [ `INSERT INTO content_qa_details(user_num, is_anonymous, content_title,content_content,file_name) VALUES (?,?,?,?,?);`,
    `INSERT INTO content_qa_preshow(content_num,content_category1,content_category2,content_category3) VALUES (?,?,?,?);`
  ]
}
function UpdateContent(){
  return `UPDATE content_qa_preshow AS g STRAIGHT_JOIN content_qa_details AS f ON g.content_num=f.content_num
   SET g.content_category1=?,g.content_category2=?,g.content_category3=?,
   f.content_title=?, f.content_content=?, f.is_anonymous=?
   WHERE g.content_num=? AND f.user_num=?;`  
}
//============================================================================
module.exports = router;
