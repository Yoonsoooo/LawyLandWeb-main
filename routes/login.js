var express = require("express");
var router = express.Router();
var mysql = require("mysql2");
var sqlInfo = require("../config/mysql");
var pool = mysql.createPool(sqlInfo);

var Redis= require("../config/Redis")
var transporter = require("../config/nodemailer");
const check = require("../router_function/checkForm");
var dbdi = require("../router_function/DBDI");

//Validation Joi
const {
  requestLogin,
  checkId,
  requestRegister,
  requestAdditional,
  requestFind,
} = require("../router_function/schmas");
const e = require("express");

//이동 필요------------------------


router.post("/request_login", async function (req, res, next) {
  try {
    var key_data_ = req.body;
    const { error } = requestLogin.validate(key_data_);
    if (error) {
      console.log("Error", error);
      res.send({
        success: false,
        message:"서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
      });
      return;
    }

    pool.execute(
      SelectLogin(),
      [key_data_.id, key_data_.pw],
      function (err, rows, field) {
        if (err) {
          console.log(err)
          return res.send({
            success: false,
            message: "서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
          });
        } else if (rows.length === 1 && rows[0].user > 0) {
          if(key_data_.is_auto_check) return process_autologin(rows[0],res)
          else return process_login(rows[0] ,res) 
        } else
          return res.send({
            success: false,
            message:"입력하신 내용을 다시 확인해 주세요.",
          });
      }
    );
  } catch (e) {
    console.log("login: ", e);
    return res.send({
      success: false,
      message: "서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
    });
  }
});

router.post("/check_id", async function (req, res, next) {
  try {
    var key_data_ = req.body;
    const { error } = checkId.validate(key_data_);

    if (error) {
      console.log("Error", error);
      res.send({
        success: false,
        message:"입력하신 내용을 다시 확인해 주세요.",
      });

      return;
    }

    if (!check.isEmailForm(key_data_.id))
      return res.send({ success: false, message: "잘못된 이메일형식입니다." });
    else {
      pool.execute(
        CheckUser_Id(),
        [key_data_.id],
        function (err, rows, field) {
          if (rows.length == 0){
            res.send({success:true, message:"사용 가능한 이메일입니다.\n해당 메일로 인증번호를 발송했습니다."}) 
            EmailVariationCheck(key_data_.id);
          }
          else
            return res.send({
              success: false,
              message: "이미 가입된 이메일 주소입니다.",
            });
        }
      );
    }
  } catch (e) {
    console.log("login: ", e);
    res.send({success:false, message:"서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요."})
  }
});

router.post("/check_name2", function(req, res, err){
  try{
    pool.execute(CheckUser_name2(),[req.body.name2], function(err, rows, field){
      if(err || rows.length>0) res.send({success:false, message:'이미 존제하는 닉네임입니다.'})
      else res.send({success:true, message:'사용 가능한 닉네임입니다.'})
    })
  }catch(e){
    res.send({success:false, message:"서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요."})
  }
})

router.post("/request_register", function (req, res, next) {
  try {
    var key_data_ = req.body;
    //유효성 검사
    const { error } = requestRegister.validate(key_data_);

    if (error) {
      console.log("Error", error);
      res.send({
        success: false,
        message: "서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
      });

      return;
    }
    check_form_register(key_data_, function (temp_) {
      if (!temp_.success) return res.send(temp_);
      Redis.get(key_data_.id, function (err, res_) {
        if (err)
          return res.send({
            success: false,
            message:"서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
          });
        else if (!res_)
          return res.send({ success: false, message: "인증번호를 확인해주세요." });
        else if (
          JSON.parse(res_).certification_num ==
          String(key_data_.certification_num)
        )
          res.send({ success: true, message: null });
        else res.send({ success: false, message: "인증번호를 확인해주세요." });
      });
    });
  } catch (e) {
    return res.send({
      success: false,
      message:"서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
    });
  }
});

router.post("/request_additional", function (req, res, next) {
  try {
    var key_data_ = req.body;
    //유효성 검사
    const { error } = requestAdditional.validate(key_data_);

    if (error) {
      console.log("Error", error);
      res.send({
        success: false,
        message: "서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
      });

      return;
    }
    check_form_register(key_data_, function (temp_) {
      if (!temp_.success) return res.send(temp_);
      check_form_additional(key_data_, function (temp_) {
        if (!temp_.success) return res.send(temp_);
        Redis.get(key_data_.id, function (err, res_) {
          console.log(res_);
          if (err)
            return res.send({
              success: false,
              message:
              "서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
            });
          else if (!res_)
            return res.send({ success: false, message: "잘못된 인증번호입니다." });
          else if (
            JSON.parse(res_).certification_num ==
            String(key_data_.certification_num)
          ) {
            RunNewUserInsertQuery(key_data_, res);
          } else res.send({ success: false, message:  "잘못된 인증번호입니다." });
        });
      });
    });
  } catch (e) {
    res.send({
      success: false,
      message:"서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
    });
  }
});

router.post("/request_find", function (req, res, next) {
  try {
    var key_data_ = req.body;
    const { error } = requestFind.validate(key_data_);

    if (error) {
      console.log("Error", error);
      res.send({
        success: false,
        message:"서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
      });

      return;
    }
    if (key_data_.type == 0) {
      pool.execute(
        SelectFindId(),
        [key_data_.law_num, key_data_.phone, key_data_.name],
        function (err, rows, field) {
          if (err) {
            console.log(err);
            return res.send({
              success: false,
              message:"서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
            });
          } else if (rows.length === 1)
            return res.send({ success: true, message: rows[0].id });
          else {
            return res.send({
              success: false,
              message: "입력하신 내용을 다시 확인해 주세요.",
            });
          }
        }
      );
    } else if (key_data_.type == 1) {
      pool.execute(
        SelectFindPw(),
        [key_data_.id, key_data_.law_num, key_data_.phone, key_data_.name],
        function (err, rows, field) {
          console.log("find pw ", rows);
          if (err) {
            console.log(err);
            return res.send({
              success: false,
              message:"서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
            });
          } else if (rows.length == 1) {
            res.send({
              success: true,
              message: `"${rows[0].id}"로 비밀번호가 전송됐습니다.`,
            });
            EmailFindPw(rows[0].id, rows[0].pw);
          } else
            return res.send({
              success: false,
              message: "입력하신 내용을 다시 확인해 주세요.",
            });
        }
      );
    } else {
      return res.send({ success: true, message: "경고" });
    }
  } catch (e) {
    return res.send({
      success: false,
      message:"서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
    });
  }
});

//===========================auto login logic
router.post("/request_autologin", function (req, res, next) {
  try{
    var key_data_=req.body// uid, secure_key1,2,3, secure_res
    pool.getConnection(function (err, connection) {
      if (err) {
        res.send({
          success: false,
          message:"서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
        });
        return pool.releaseConnection(connection);
      }else{
        connection.execute(SelectAutoLogin(),[key_data_.uid], function(err, rows1, field){
          if(err){
            res.send({
              success: false,
              message:"서버와 통신에 실패했습니다.\n 점검일정을 확인해 주세요.",
            });
            return pool.releaseConnection(connection);
          }else if(rows1.length!=1){ 
            res.send({success:false, message:'다시 시도해주세요'})
            return pool.releaseConnection(connection);
          }else{
            var temp_=rows1[0].user_secure_card.substr(rows1[0].server_key1, 6)
              +rows1[0].user_secure_card.substr(rows1[0].server_key2, 6)
              +rows1[0].user_secure_card.substr(rows1[0].server_key3, 6)

            if(temp_!==key_data_.cli_card_res){
              res.send({success:false, message:'유저정보 소실, 보안을 위해 직접 로그인 해주세요'})
              return pool.releaseConnection(connection);
            }else{
              var rand_key1=Math.floor(Math.random() * 100)-6
              var rand_key2=Math.floor(Math.random() * 100)-6
              var rand_key3=Math.floor(Math.random() * 100)-6
              connection.execute(UpdateAutoLoginAfterSuccess() , [rand_key1,rand_key2,rand_key3, rows1[0].user], function(err,rows2, field){
                if(err){ 
                  res.send({success:false, message:'다시 시도해주세요'})
                  return pool.releaseConnection(connection);
                }else{
                  process_login(rows1[0],res,{
                    key1:rand_key1,
                    key2:rand_key2,
                    key3:rand_key3,
                    card:null,
                    set_flag:false
                  })
                  return pool.releaseConnection(connection);
                }
              })
            }
          }
        })        
      }
    })

  }catch(e){
    console.log('auto: ',e)
  }
})

function process_login(data_, res, secure_card_=null){
  try{
    var user_virtual_num_ = createSecureCard(10);
    var card_= createSecureCard(20)
    var json_=JSON.stringify({temp_user:user_virtual_num_, user:data_.user, light_card:card_})
    Redis.set(data_.uid, json_, function(err, res_){
      if(err){
        return res.send({success:false, message:'서버가 로그인을 처리 못했습니다. 후에 다시 시도해주세요.'})
      }else{
        Redis.expire(data_.uid, 7200) 
        return res.send({ 
          success: true, 
          message: {
            uid:data_.uid, 
            user:user_virtual_num_, 
            light_card:card_, 
            name:data_.name, 
            acquisition:data_.acquisition,
            field:data_.field,
            place:data_.place,
            secure_card:secure_card_?secure_card_.card:null,
            last_key1: secure_card_?secure_card_.key1:null,
            last_key2: secure_card_?secure_card_.key2:null,
            last_key3: secure_card_?secure_card_.key3:null
          },
          set_flag: secure_card_?secure_card_.set_flag:false
        });
      }
    })
  }catch(e){
    res.send({success:false, message:'서버가 로그인을 처리 못했습니다. 후에 다시 시도해주세요.'})
  }
}


function process_autologin(data_, res_){
  try{
    var query_=`SELECT user_secure_card, server_key1, server_key2, server_key3 FROM user_secure_data WHERE user_num=?;`

    pool.getConnection(function (err, connection) {
      if (err) {
        res_.send({ success: false, message: "서버에러1, 다시 시도해주세요" });
        pool.releaseConnection(connection);
      }else{
    
        connection.execute(query_, [data_.user], function(err, rows1, field) {
          if (err) {
            res_.send({ success: false, message: "서버에러1, 다시 시도해주세요" });
            return pool.releaseConnection(connection);
          }else if(rows1.length===1){
            pool.releaseConnection(connection);
            return process_login(data_, res_, {
              card:rows1[0].user_secure_card,
              key1:rows1[0].server_key1,
              key2:rows1[0].server_key2,
              key3:rows1[0].server_key3,
              set_flag:true
            })
          }else if(rows1.length===0){
            var card_= createSecureCard(100)
            var rand_key1=Math.floor(Math.random() * 100)-6
            var rand_key2=Math.floor(Math.random() * 100)-6
            var rand_key3=Math.floor(Math.random() * 100)-6
            query_=`INSERT INTO user_secure_data(user_num, user_secure_card, server_key1, server_key2, server_key3) VALUES(?,?,?,?,?);`
            connection.execute(query_, [data_.user, card_, rand_key1, rand_key2, rand_key3], function(err, rows, field) {
              if(err){
                res_.send({ success: false, message: "서버에러1, 다시 시도해주세요" });
                return pool.releaseConnection(connection);
              }else{
                pool.releaseConnection(connection);
                console.log('auto login')
                return process_login(data_, res_, {card:card_, key1:rand_key1, key2:rand_key2, key3:rand_key3, set_flag:true})
              }
            })

          }else{
            res_.send({ success: false, message: "서버에러1, 다시 시도해주세요" });
            return pool.releaseConnection(connection);
          }
        })
      }
    })
  }catch(e){

  }
}
//==========================================================
async function check_form_register(data_, ftn_ = null) {
  if (!check.isEmailForm(data_.id))
    return { success: false, message: "잘못된 이메일형식입니다" };
  else if (!check.isPwForm(data_.pw))
    return { success: false, message: "비밀번호는 8자 이상 필요" };
  else if (data_.pw != data_.pw_check)
    return { success: false, message: "비밀번호와 확인이 같지 않습니다" };
  else if (!check.isLawnumForm(data_.law_num))
    return { success: false, message: "잘못된 변호사번호형식입니다" };
  else if (!check.isPhoneForm(data_.phone))
    return { success: false, message: "잘못된 휴대번호형식입니다" };
  else {
    if (ftn_) ftn_({ success: true, message: null });
    else return { success: true, message: null };
  }
}

async function check_form_additional(data_, ftn_ = null) {
  if (!check.isNameForm(data_.name1))
    return { success: false, message: "잘못된 이름형식입니다" };
  else if (!check.isName2Form(data_.name2))
    return { success: false, message: "잘못된 닉네임형식입니다" };
  else if (!check.iscAquisitionForm(data_.acquisition))
    return { success: false, message: "잘못된 등록 연도입니다" };
  else if (!check.isPlaceNum(data_.place))
    return { success: false, message: "잘못된 지역선택입니다" };
  else if (!check.isFieldNum(data_.field))
    return { success: false, message: "잘못된 전문분야 선택입니다" };
  else if (!check.isAgencyLength(data_.agency))
    return { success: false, message: "소속 기관/단체의 이름 15자 내외" };
  else {
    if (ftn_) ftn_({ success: true, message: null });
    else return { success: true, message: null };
  }
}

function RunNewUserInsertQuery(key_data_, res_) {
  try {
    pool.getConnection(function (err, connection) {
      if (err) {
        res_.send({ success: false, message: "서버에러1, 다시 시도해주세요" });
        pool.releaseConnection(connection);
      }
      connection.beginTransaction(function (err) {
        if (err) {
          res_.send({
            success: false,
            message: "서버에러2, 다시 시도해주세요",
          });
          return dbdi.rollback_query(connection, pool);
        }
        connection.execute(CheckUser_name2(),[key_data_.name2], function(err, rows5, field){
          if(err||rows5.length>0){
            res_.send({success:false, message:'이미 존제하는 닉네임 입니다.'})
            pool.releaseConnection(connection)
          }
          else{
            var query_ = InsertUserinfo();
            connection.execute(
              query_[0],
              [key_data_.id, key_data_.pw, key_data_.law_num],
              function (err, rows1, field) {
                if (err) {
                  res_.send({
                    success: false,
                    message: "서버에러3, 다시 시도해주세요",
                  });
                  return dbdi.rollback_query(connection, pool);
                }
                var before_num_ = rows1.insertId;
                var user_uid=`${before_num_}n${createSecureCard(10)}`
                connection.execute(
                  query_[1],
                  [before_num_, key_data_.acquisition,key_data_.field,key_data_.id,key_data_.phone,key_data_.agency,key_data_.name1,key_data_.name2,key_data_.place, user_uid ],
                  function (err, rows2, field) {
                    if (err) {
                      res_.send({
                        success: false,
                        message: "서버에러4, 다시 시도해주세요",
                      });
                      return dbdi.rollback_query(connection, pool);
                    }else if (
                      rows1.affectedRows == 1 &&
                      rows2.affectedRows == 1
                    ) {
                      res_.send({ success: true, message: null });
                      Redis.del(key_data_.id)
                      return dbdi.commit_query(connection, pool);
                    }else{
                      res_.send({
                        success: false,
                        message: "서버에러5, 다시 시도해주세요",
                      });
                      return dbdi.rollback_query(connection, pool);
                    }
                });
            });
          }
        })

      });
    });
  } catch (e) {
    console.log("login: ", e);
  }
}

function EmailVariationCheck(email_addr_) {
  var authNum = Math.random().toString().substr(2, 6);
  Redis.set(email_addr_,JSON.stringify({'certification_num':authNum}), function(err, res){
    if(err) return res_.send({success:false, message:'다시 시도해주세요'})
    else{
      Redis.expire(email_addr_, 1200)
      transporter.sendMail(
        {
          from: '"LawyLand no-reply" <Lawyland-no-reply@original.com>',
          to: email_addr_,
          subject: "로이랜드 가입을 위한 인증번호 입니다",
          html: `인증번호 ${authNum} (만료시간 20분)`,
        }
      );
    }
  })
}

function EmailFindPw(email_addr_, pw_) {
  transporter.sendMail(
    {
      from: '"LawyLand no-reply" <Lawyland-no-reply@original.com>',
      to: email_addr_,
      subject: "로이랜드 비밀번호 찾기",
      html: `Pw: ${pw_}`,
    }
  );
}

function createSecureCard(length) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  Array.from(Array(length)).forEach(() => {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  })
  return text
}

function CheckUser_Id() {
  return "SELECT user_num FROM user_info WHERE user_id=? ;";
};
function CheckUser_name2(){
  return `SELECT user_num FROM user_permanent WHERE user_name2=? AND is_deleted=false;`
}
function InsertUserinfo() {
  return [
    `INSERT INTO user_info(user_id,user_pw,user_law_num) VALUES(?,?,?);`,
    `INSERT INTO user_permanent(user_num, user_acquisition, user_field, user_email, user_phone, user_agency, user_name1, user_name2,user_place, user_uid) 
     VALUES(?,?,?,?,?,?,?,?,?,?);`
  ]
};

function SelectLogin() {
  return `SELECT sub.user_num AS user, k.user_acquisition AS acquisition, k.user_field AS field, k.user_name1 AS name,k.user_place AS place, k.user_uid AS uid
  FROM( SELECT user_num FROM user_info WHERE user_id=? AND user_pw=?) AS sub 
  STRAIGHT_JOIN user_permanent AS k ON sub.user_num=k.user_num;`;
}

function SelectAutoLogin(){
  return `SELECT sub.*, a.user_secure_card,a.server_key1,a.server_key2,a.server_key3
  FROM(
    SELECT user_num AS user,user_acquisition AS acquisition, user_field AS field, user_name1 AS name,user_place AS place, user_uid AS uid FROM user_permanent WHERE user_uid=? 
  ) AS sub STRAIGHT_JOIN user_secure_data AS a ON sub.user=a.user_num;`
}
function UpdateAutoLoginAfterSuccess(){
  return `UPDATE user_secure_data SET server_key1=?, server_key2=?, server_key3=? WHERE user_num=?;`
}

function SelectFindId() {
  return `SELECT sub.user_id AS id 
  FROM ( SELECT user_num, user_id FROM user_info WHERE user_law_num=? ) AS sub
  STRAIGHT_JOIN user_permanent AS i ON sub.user_num=i.user_num WHERE i.user_phone=? AND i.user_name1=?;`;
}
function SelectFindPw() {
  return `SELECT sub.user_id AS id, sub.user_pw AS pw
  FROM ( SELECT user_num, user_id, user_pw FROM user_info WHERE user_id=? AND user_law_num=? ) AS sub
  STRAIGHT_JOIN user_permanent AS i ON sub.user_num=i.user_num WHERE i.user_phone=? AND i.user_name1=?;`;
}
module.exports = router;
