var express = require("express");
var router = express.Router();
var mysql = require("mysql2");
var sqlInfo = require("../config/mysql");
var pool = mysql.createPool(sqlInfo);

var dbdi = require("../router_function/DBDI");
const Cache = require("../router_function/CacheModule");

const {
  checkUserAuthentication,
  changeUserInfo,
} = require("../router_function/schmas");


router.post(
  "/check_userAuthentication",
  Cache.Chack_login_middleware,
  function (req, res, next) {
    var key_data_ = req.body;
    //유효성 검사
    const { error } = checkUserAuthentication.validate(key_data_);
    if (error) {
      console.log("Error", error);
      res.send({
        success: false,
        message: "입력하신 내용을 다시 확인해 주세요.",
      });
      return;
    }

    pool.execute(
      SelectUserChange(),
      [key_data_.id,key_data_.user, key_data_.pw, key_data_.law_num],
      function (err, rows, field) {
        console.log(rows)
        if (err){
        console.log(err)
          return res.send({
            success: false,
            message: "서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
          });
        }
        else if (rows.length == 1)
          return res.send({ success: true, message: rows });
        else
          return res.send({
            success: false,
            message: "입력하신 내용을 다시 확인해 주세요.",
          }); //여러명이 검색될 경우
      }
    );
  }
);
router.post(
  "/change_userinfo",
  Cache.Chack_login_middleware,
  function (req, res, next) {
    var key_data_ = req.body;
    //유효성 검사
    const { error } = changeUserInfo.validate(key_data_);
    if (error) {
      console.log("Error", error);
      res.send({
        success: false,
        message:"서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
      });
      return;
    }
    var user_tab_='user_permanent'
    if (key_data_.info_index == 1) var user_col_ = "user_name2";
    else if (key_data_.info_index == 2) var user_col_ = "user_phone";
    else if (key_data_.info_index == 4) var user_col_ = "user_place";
    else if (key_data_.info_index == 5) var user_col_ = "user_agency";
    else if (key_data_.info_index == 6) var user_col_ = "user_field";
    else if(key_data_.info_index === 10) return DeleteUserProcess(key_data_, res)
    else if (key_data_.info_index == 3) {
      if (
        key_data_.data[0] != key_data_.data[1]
      )
        return res.send({ success: false, message: "새 비밀번호가 일치하지 않습니다." });
      user_tab_='user_info'
      var user_col_ = "user_pw";
      key_data_.data=key_data_.data[0]
    } 
    else return res.send({ success: false, message: "잘못된 요청입니다, 오류보고중" });
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err)
        res_.send({ success: false, message: "입력하신 내용을 다시 확인해 주세요." });
        return pool.releaseConnection(connection);
      }else{
        connection.execute(CheckUserInfo(),[key_data_.id,key_data_.user,key_data_.pw, key_data_.law_num], function(err,rows,field){
          if (err) {
            console.log(err)
            res_.send({ success: false, message: "서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요." });
            return pool.releaseConnection(connection);
          }
          else if(rows[0].user_num===key_data_.user){
            connection.execute(UpdateUserInfo(user_tab_, user_col_), [key_data_.data, key_data_.user], function (err, rows, field) {
              if (err){
                console.log(err)
                res.send({
                  success: false,
                  message: "서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
                });
                return pool.releaseConnection(connection);
              }
              else{
                res.send({
                  success: true,
                  message:
                    key_data_.info_index == 10
                      ? "탈퇴 완료, 지금까지 사용해주셔서 감사합니다."
                      : "변경이 완료되었습니다.",
                });
                return pool.releaseConnection(connection);
              }
            });
          }else{
            res.send({ success: false, message: "입력하신 내용을 다시 확인해 주세요." });
            return pool.releaseConnection(connection);
          }
        })
      }
    })  
  
  }
);

//-알람부분 인덱스 설정 필요, 쿼리 최적화 필요()특히 후속 복대리 -------------------------

router.post(
  "/req_alarm_preshow",
  Cache.Chack_login_middleware,
  async function (req, res, next) {
    var key_data_ = req.body;
    //check
    pool.execute(
      SelectUserAlarmPreshow(),
      [key_data_.user, key_data_.offset],
      function (err, rows, field) {
        if (err){
          console.log(err)
          return res.send({
            success: false,
            message:"서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
          });
        }
        return res.send({ success: true, message: rows });
      }
    );
  }
);

router.post(
  "/req_second_preshow",
  Cache.Chack_login_middleware,
  async function (req, res, next) {
    var key_data_ = req.body;

    pool.execute(
      SelectDoubleSecondPreshow(),
      [key_data_.num, key_data_.user],
      function (err, rows, field) {
        if (err){
        console.log(err)
          return res.send({
            success: false,
            message: "서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
          });
        }
        return res.send({ success: true, message: rows });
      }
    );
  }
);

//보완 필요
router.post(
  "/apply_second_double",
  Cache.Chack_login_middleware,
  async function (req, res, next) {
    var key_data_ = req.body;

    pool.getConnection(function (err, connection) {
      if (err) {
        res.send({ success: false, message: "서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요."});
        return pool.releaseConnection(connection);
      }
      connection.beginTransaction(function (err) {
        if (err){
          res.send({success:false, message:"서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요."})
          return dbdi.rollback_query(
            connection,
            pool
          );
        }
        var query_ = SelectSecondDouble();
        connection.query(
          query_,
          [key_data_.num, key_data_.user],
          function (err, val_, field) {
            if (err){
              res.send({success:false, message:"서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요."})
              return dbdi.rollback_query(
                connection,
                pool
              );
            }
            else if (val_.length != 1){
              res.send({success:false, message:"후속복대리 신청에 실패하였습니다.\n 다시 시도해 주세요."})
              return dbdi.rollback_query(
                connection,
                pool
              );
            }
            val_ = val_[0];
            query_ = dbdi.MigrateDoubleUser();
            connection.query(
              query_[0],
              [
                val_.user,
                key_data_.user,
                key_data_.bank_name,
                key_data_.bank_user,
                key_data_.bank_account,
              ],
              function (err, rows1, field) {
                if (err){
                  res.send({success:false, message:"후속복대리 신청에 실패하였습니다.\n 다시 시도해 주세요."})
                  return dbdi.rollback_query(
                    connection,
                    pool
                  );
                }
                var before_num_ = rows1.insertId;
                connection.query(
                  query_[1],
                  [
                    before_num_,
                    val_.category,
                    val_.place,
                    val_.du_date,
                    val_.cost,
                  ],
                  function (err, rows2, field) {
                    if (err){
                      res.send({success:false, message:"후속복대리 신청에 실패하였습니다.\n 다시 시도해 주세요."})
                      return dbdi.rollback_query(
                        connection,
                        pool
                      );
                    }
                    connection.query(
                      query_[2],
                      [
                        before_num_,
                        val_.case_num,
                        val_.party_name,
                        val_.party_position,
                        val_.oponent,
                        val_.content_else,
                        val_.memo
                      ],
                      function (err, rows3, field) {
                        if (err){
                          console.log(err)
                          res.send({success:false,message:"후속복대리 신청에 실패하였습니다.\n 다시 시도해 주세요."})
                          return dbdi.rollback_query( 
                            connection,
                            pool
                          );
                        }
                        else if (
                          rows1.affectedRows == 1 &&
                          rows2.affectedRows == 1 &&
                          rows3.affectedRows == 1
                        ) {
                          res.send({success:true, message:"후속복대리 신청이 완료되었습니다."})
                          dbdi.commit_query(
                            connection,
                            pool
                          );
                          connection.query(dbdi.DeleteAlarm(), [key_data_.num]);
                        }
                      }
                    );
                  }
                );
              }
            );
          }
        );
      });
    });
  }
);

function DeleteUserProcess(key_data_, res_){
  try{
    console.log(key_data_)
    pool.getConnection(function(err, connection){
      if(err){
        console.log(err)
        res_.send({success:false, message:'다시 시도해주세요.'})
        return pool.releaseConnection(connection)
      }else{
        connection.execute(`DELETE FROM user_info WHERE user_id=? AND user_num=? AND user_pw=? AND user_law_num=?;`,
              [key_data_.id,key_data_.user,key_data_.pw, key_data_.law_num]
              ,function(err, rows, field){
                if(err){
                  console.log(err)
                  res_.send({success:false, message:'다시 시도해주세요.'})
                  return pool.releaseConnection(connection)
                }else{
                  connection.execute(`UPDATE user_Permanent SET is_deleted=true WHERE user_num=?;`
                    ,[key_data_.user]
                    ,function(err, rows, field){
                      if(err) res_.send({success:false, message:'다시 시도해주세요.'})
                      else res_.send({success:true, message:"탈퇴 완료, 지금까지 사용해주셔서 감사합니다."})
                      return pool.releaseConnection(connection)
                  })
                }
        })
      }
    })
  
  }catch(e){
    console.log(e)
    res_.send({success:false, message:'다시 시도해주세요.'})
  }
}

function CheckUserInfo(){
  return 'SELECT user_num FROM user_info WHERE user_id=? AND user_num=? AND user_pw=? AND user_law_num=?;'
}
function UpdateUserInfo(table_, column_) {
  return `UPDATE ${table_} SET ${column_}=? WHERE user_num=?;`;
}

function SelectUserChange(){
  return `SELECT sub.user_joined AS date, k.user_acquisition AS acquisition,k.user_field AS field, k.user_email AS email,k.user_phone AS phone,k.user_agency AS agency,k.user_name1 AS name1,k.user_name2 AS name2,k.user_place AS place
  FROM (
    SELECT j.user_num,j.user_joined FROM user_info AS j WHERE j.user_id=? AND j.user_num=? AND j.user_pw=? AND j.user_law_num=?
  ) AS sub STRAIGHT_JOIN user_permanent AS k ON sub.user_num=k.user_num;`
}

function SelectUserAlarmPreshow() {
  return `SELECT o.alarm_num AS num,o.alarm_type AS type,o.alarm_text AS content,o.alarm_date AS date,o.expire_date AS expire
  FROM content_alarm_preshow AS o WHERE o.res_user_num=? LIMIT 50 OFFSET ?`;
};
function SelectDoubleSecondPreshow() {
  return `SELECT r.alarm_num AS num,r.content_category AS category,r.content_place AS place,r.content_du_date AS du_date,r.content_cost AS cost
  FROM( SELECT alarm_num, alarm_date FROM content_alarm_preshow WHERE alarm_num=? AND res_user_num=?
  )AS sub STRAIGHT_JOIN content_double_second_preshow AS r ON sub.alarm_num=r.alarm_num;`;
};

function SelectSecondDouble(){
  return `SELECT a.alarm_num AS num, a.req_user_num AS user, d.content_category AS category,d.content_place AS place,d.content_du_date AS du_date,d.content_cost AS cost,
    c.content_case_num AS case_num, c.content_party_name AS party_name,c.content_party_position AS party_position,c.content_oponent AS oponent
    ,c.content_else, c.content_memo AS memo  
    FROM(
      SELECT alarm_num, req_user_num,  content_alarm_preshow WHERE alarm_num=? AND res_user_num=?
    ) AS a STRAIGHT_JOIN content_double_second_preshow AS d ON a.alarm_num=d.alarm_num STRAIGHT_JOIN content_double_second_details AS c ON a.alarm_num=c.alarm_num;`;
};
module.exports = router;
