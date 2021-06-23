var express = require("express");
var router = express.Router();
var mysql = require("mysql2");
var sqlInfo = require("../config/mysql");
var pool = mysql.createPool(sqlInfo);

var dbdi = require("../router_function/DBDI");
const Cache = require("../router_function/CacheModule");
const check = require("../router_function/checkForm");
var transporter = require("../config/nodemailer");

const {
  writeDoubleAgentWritePath,
  writeDoubleAgentRevisePath,
  writeDoubleAgentSecondPath,
  writeDoubleAgentReviseSecondPath,
  emailAlarmSecond,
} = require("../router_function/schmas");

router.post(
  "/write_path",
  Cache.Chack_login_middleware,
  async function (req, res, next) {
    try {
      var key_data_ = req.body;

      console.log("write_path : ", key_data_);
      //유효성 검사
      const { error } = writeDoubleAgentWritePath.validate(key_data_);

      if (error) {
        console.log("Error", error.details[0].message);
        res.send({
          success: false,
          message: error.message,
        });

        return;
      } else {
        console.log("insert");
        pool.getConnection(function (err, connection) {
          if (err) {
            console.log("1.", err);
            res.send({
              success: false,
              message: "서버에러1, 다시 시도해주세요",
            });
            return pool.releaseConnection(connection);
          }
          console.log("a");
          connection.beginTransaction(function (err) {
            if (err) {
              console.log("2.", err);
              res.send({
                success: false,
                message: "서버에러2, 다시 시도해주세요",
              });
              return dbdi.rollback_query(connection, pool);
            }
            console.log("b");
            var query_ = InsertDouble();
            connection.query(
              query_[0],
              [key_data_.user],
              function (err, rows1, field) {
                if (err) {
                  console.log("3.", err);
                  res.send({
                    success: false,
                    message: "서버에러3, 다시 시도해주세요",
                  });
                  return dbdi.rollback_query(connection, pool);
                }
                var before_num_ = rows1.insertId;
                console.log(before_num_);
                connection.query(
                  query_[1],
                  [
                    before_num_,
                    key_data_.category,
                    key_data_.place,
                    key_data_.du_date,
                    key_data_.cost,
                  ],
                  function (err, rows2, field) {
                    if (err) {
                      console.log("4.", err);
                      res.send({
                        success: false,
                        message: "서버에러4, 다시 시도해주세요",
                      });
                      return dbdi.rollback_query(connection, pool);
                    }
                    connection.query(
                      query_[2],
                      [
                        before_num_,
                        key_data_.case_num,
                        key_data_.party_name,
                        key_data_.party_position,
                        key_data_.oponent,
                        key_data_.else,
                        key_data_.memo,
                      ],
                      function (err, rows3, field) {
                        console.log(rows3);
                        if (err) {
                          console.log("5.", err);
                          res.send({
                            success: false,
                            message: "서버에러5, 다시 시도해주세요",
                          });
                          return dbdi.rollback_query(connection, pool);
                        } else if (
                          rows1.affectedRows == 1 &&
                          rows2.affectedRows == 1 &&
                          rows3.affectedRows == 1
                        ) {
                          console.log("write double success");
                          res.send({
                            success: true,
                            message: "복대리 모집을 시작하겠습니다",
                          });
                          return dbdi.commit_query(connection, pool);
                        } else {
                          res.send({
                            success: false,
                            message: "복대리 작성 실패, 다시 시도해주세요",
                          });
                          return dbdi.rollback_query(connection, pool);
                        }
                      }
                    );
                  }
                );
              }
            );
          });
        });
      }
    } catch (e) {
      console.log("write double: ", e);
    }
  }
);

router.post(
  "/revise_path",
  Cache.Chack_login_middleware,
  async function (req, res, next) {
    try {
      var key_data_ = req.body;
      console.log("revise path: ", key_data_);

      //유효성 검사
      const { error } = writeDoubleAgentRevisePath.validate(key_data_);

      if (error) {
        console.log("Joi Error", error.details[0].message);
        res.send({
          success: false,
          message: error.message,
        });

        return;
      }
      pool.getConnection(function (err, connection) {
        if (err) {
          res.send({
            success: false,
            message: "서버에러1, 다시 시도해주세요",
          });
          return pool.releaseConnection(connection);
        }
        connection.execute(
          dbdi.CheckDouble_User(),
          [key_data_.num],
          function (err, rows1, field) {
            if (err) {
              res.send({
                success: false,
                message: "서버에러1, 다시 시도해주세요",
              });
              return pool.releaseConnection(connection);
            } else if (rows1.length !== 1) {
              res.send({
                success: false,
                message: "서버에러1, 다시 시도해주세요",
              });
              return pool.releaseConnection(connection);
            } else if (
              rows1[0].user_num !== key_data_.user ||
              rows1[0].comment_user_num
            ) {
              res.send({
                success: false,
                message: "정당하지 않는 접근입니다. (Reported)",
              });
              return pool.releaseConnection(connection);
            } else {
              connection.execute(
                UpdateDouble(),
                [
                  key_data_.category,
                  key_data_.place,
                  key_data_.du_date,
                  key_data_.cost,
                  key_data_.case_num,
                  key_data_.party_name,
                  key_data_.party_position,
                  key_data_.oponent,
                  key_data_.else,
                  key_data_.memo,
                  key_data_.num,
                ],
                function (err, rows, field) {
                  console.log("err : ", err);
                  console.log("rows : ", rows);
                  if (err) {
                    console.log("6.", err);
                    res.send({
                      success: false,
                      message: "서버에러2, 다시 시도해주세요",
                    });
                    return pool.releaseConnection(connection);
                  } else if (rows.changedRows < 4 && rows.changedRows > 0) {
                    console.log("revise double success");
                    res.send({
                      success: true,
                      message: "복대리 수정을 완료했습니다",
                    });
                    return pool.releaseConnection(connection);
                  } else {
                    res.send({
                      success: false,
                      message:
                        "복대리 수정에 실패했습니다, 입력 내용을 다시 확인해주세요 \n(매칭된 복대리는 수정이 불가능합니다)",
                    });
                    return pool.releaseConnection(connection);
                  }
                }
              );
            }
          }
        );
      });
    } catch (e) {
      console.log("write double: ", e);
    }
  }
);

router.post(
  "/second_path",
  Cache.Chack_login_middleware,
  async function (req, res, next) {
    try {
      var key_data_ = req.body;
      console.log("second path: ", key_data_);

      //유효성 검사
      const { error } = writeDoubleAgentSecondPath.validate(key_data_);

      if (error) {
        console.log("Joi Error", error.details[0].message);
        res.send({
          success: false,
          message: error.message,
        });

        return;
      } else {
        pool.getConnection(function (err, connection) {
          if (err) {
            res.send({
              success: false,
              message: "서버에러1, 다시 시도해주세요",
            });
            return pool.releaseConnection(connection);
          }
          var query_ = SelectDoubleSecondComment();
          connection.execute(
            query_,
            [key_data_.num, key_data_.user],
            function (err, rows1, field) {
              if (err) {
                console.log("7.", err);
                res.send({
                  success: false,
                  message: "서버에러3, 다시 시도해주세요",
                });
                return pool.releaseConnection(connection);
              } else if (rows1.length != 1) {
                console.log("매칭상대가 있어야 후속복대리 작성이 가능합니다");
                res.send({
                  success: false,
                  message: "매칭상대가 있어야 후속복대리 작성이 가능합니다",
                });
                return pool.releaseConnection(connection);
              }
              connection.beginTransaction(function (err) {
                if (err)
                  return dbdi.rollback_query(
                    res,
                    "서버에러2, 다시 시도해주세요",
                    connection,
                    pool
                  );
                query_ = dbdi.InsertAlarm();
                var now_ = new Date();
                now_.setMinutes(now_.getMinutes() + 10);
                connection.query(
                  query_,
                  [
                    1,
                    key_data_.user,
                    rows1[0].comment_user_num,
                    rows1[0].user_name1 +
                      "님으로 부터 후속 복대리 요청이 왔습니다.",
                    now_,
                  ],
                  function (err, rows2, field) {
                    if (err) {
                      res.send({
                        success: false,
                        message: "서버에러4, 다시 시도해주세요",
                      });
                      return dbdi.rollback_query(connection, pool);
                    }
                    var num_ = rows2.insertId;
                    query_ = InsertDoubleSecond();
                    connection.query(
                      query_[0],
                      [
                        num_,
                        key_data_.category,
                        key_data_.place,
                        key_data_.du_date,
                        key_data_.cost,
                      ],
                      function (err, rows3, field) {
                        if (err) {
                          res.send({
                            success: false,
                            message: "서버에러5, 다시 시도해주세요",
                          });
                          return dbdi.rollback_query(connection, pool);
                        }
                        connection.query(
                          query_[1],
                          [
                            num_,
                            key_data_.case_num,
                            key_data_.party_name,
                            key_data_.party_position,
                            key_data_.oponent,
                            key_data_.else,
                            key_data_.memo,
                          ],
                          function (err, rows3, field) {
                            console.log(rows3);
                            if (err) {
                              console.log("err : ", err);
                              res.send({
                                success: false,
                                message: "서버에러6, 다시 시도해주세요",
                              });
                              return dbdi.rollback_query(connection, pool);
                            } else {
                              console.log("후속 복대리 모집을 시작하겠습니다");
                              res.send({
                                success: true,
                                message: "후속 복대리 모집을 시작하겠습니다",
                              });
                              EMailAlarmSecond({
                                user: rows1[0].comment_user_num,
                                place: key_data_.place,
                                cost: key_data_.cost,
                                du_date: key_data_.du_date,
                              });
                            }
                            return dbdi.commit_query(connection, pool);
                          }
                        );
                      }
                    );
                  }
                );
              });
            }
          );
        });
      }
    } catch (e) {
      console.log("write double: ", e);
    }
  }
);

router.post(
  "/revise_second_path",
  Cache.Chack_login_middleware,
  async function (req, res, next) {
    try {
      var key_data_ = req.body;

      //유효성 검사
      const { error } = writeDoubleAgentReviseSecondPath.validate(key_data_);

      if (error) {
        console.log("Joi Error", error.details[0].message);
        res.send({
          success: false,
          message: error.message,
        });

        return;
      }

      pool.getConnection(function (err, connection) {
        if (err) {
          res.send({
            success: false,
            message: "서버에러1, 다시 시도해주세요",
          });
          return pool.releaseConnection(connection);
        }
        connection.execute(
          dbdi.CheckAlarm_User(),
          [key_data_.num],
          function (err, rows1, field) {
            if (err) {
              res.send({
                success: false,
                message: "서버에러1, 다시 시도해주세요",
              });
              return pool.releaseConnection(connection);
            } else if (rows1.length !== 1) {
              res.send({
                success: false,
                message: "서버에러1, 다시 시도해주세요",
              });
              return pool.releaseConnection(connection);
            } else if (rows1.req_user_num !== key_data_.user) {
              res.send({
                success: false,
                message: "정당하지 않는 접근입니다. (Reported)",
              });
              return pool.releaseConnection(connection);
            } else {
              connection.execute(
                UpdateSecondDouble(),
                [
                  key_data_.category,
                  key_data_.place,
                  key_data_.du_date,
                  key_data_.cost,
                  key_data_.case_num,
                  key_data_.party_name,
                  key_data_.party_position,
                  key_data_.oponent,
                  key_data_.else,
                  key_data_.memo,
                  key_data_.num,
                ],
                function (err, rows, field) {
                  if (err) {
                    console.log("8.", err);
                    res.send({
                      success: false,
                      message:
                        "후속복대리 수정에 실패했습니다, 입력 내용을 다시 확인해주세요",
                    });
                    return pool.releaseConnection(connection);
                  } else {
                    res.send({
                      success: true,
                      message: "복대리 수정에 성공했습니다",
                    });
                    return pool.releaseConnection(connection);
                  }
                }
              );
            }
          }
        );
      });
    } catch (e) {
      console.log("write double: ", e);
    }
  }
);

function EMailAlarmSecond(data_) {
  console.log("email data : ", data_);
  //유효성 검사
  const { error } = emailAlarmSecond.validate(data_);

  if (error) {
    console.log("Joi Error", error.details[0].message);
    res.send({
      success: false,
      message: error.message,
    });

    return;
  }

  pool.execute(
    "SELECT user_email AS email FROM user_permanent WHERE user_num=?;",
    [data_.user],
    function (err, rows, field) {
      if (err) return;
      else {
        var mail_text_ = MailAlarmSecondTemplate(data_);
        transporter.sendMail({
          from: '"LawyLand no-reply" <Lawyland-no-reply@original.com>',
          to: rows[0].email,
          subject: "로이랜드) 후속복대리 요청이 왔습니다",
          html: mail_text_,
        });
      }
    }
  );
}

function MailAlarmSecondTemplate(data_) {
  return `<!doctype html>
  <html amp lang="en">
    <head>
      <meta charset="utf-8">
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <title>Hello, AMPs</title>
      <link rel="canonical" href="http://example.ampproject.org/article-metadata.html" />
      <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
      <script async custom-element="amp-carousel" src="https://cdn.ampproject.org/v0/amp-carousel-0.1.js"></script>
  
      <script type="application/ld+json">
        {
          "@context": "http://schema.org",
          "@type": "NewsArticle",
          "headline": "Open-source framework for publishing content",
          "datePublished": "2015-10-07T12:02:41Z",
          "image": [
            "logo.jpg"
          ]
        }
      </script>
      <style amp-boilerplate>
        .content_preshow_container{
          padding:13px 10px 13px 10px;
          width:fit-content;
          border-radius: 10px;
          border: 1px solid rgb(239,239,239);
          background-color: rgb(255,255,255);
        }
      </style>
      </noscript>
    </head>
    <body>
      <amp-carousel height="100"
                    layout="fixed-height"
                    type="carousel">
                    <div> 후속복대리 요청이 왔습니다( 자세한 내용은 어플의 'MyPage' 에서 확인해주세요 ).</div>
                    <div class="content_preshow_container">
                      <div>법  원 : ${data_.place}</div>
                      <div>기  일 : ${data_.du_date}</div>
                      <div>금  액 : 금${data_.cost} 원 정</div>
                    </div>
      </amp-carousel>
    </body>
  </html>`;
}

function InsertDouble() {
  //#
  return [
    `INSERT INTO content_double_user(user_num) VALUES(?)`,
    `INSERT INTO content_double_preshow(content_num,content_category,content_place,content_du_date,content_cost) VALUES(?,?,?,?,?);`,
    `INSERT INTO content_double_details(content_num,content_case_num,content_party_name,content_party_position,content_oponent,content_else,content_memo) VALUES(?,?,?,?,?,?,?);`,
  ];
}

function UpdateDouble() {
  return `UPDATE content_double_preshow AS d STRAIGHT_JOIN content_double_details AS c ON d.content_num=c.content_num 
  SET d.content_category=?, d.content_place=?, d.content_du_date=?, d.content_cost=?,
  c.content_case_num=?, c.content_party_name=?, c.content_party_position=?,
  c.content_oponent=?, c.content_else=?,c.content_memo=?
  WHERE d.content_num=? AND d.is_comment_user=false;`;
}

function SelectDoubleSecondComment() {
  return `SELECT d.comment_user_num,u.user_name1 
  FROM ( SELECT user_num, comment_user_num FROM content_double_user WHERE content_num=? AND user_num=?) 
  AS d STRAIGHT_JOIN user_name AS u ON d.user_num=u.user_num;`;
}
function InsertDoubleSecond() {
  return [
    `INSERT INTO content_double_second_preshow(alarm_num,content_category,content_place,content_du_date,content_cost) VALUES(?,?,?,?,?);`,
    `INSERT INTO content_double_second_details(alarm_num,content_case_num,content_party_name,content_party_position,content_oponent,content_else,content_memo) VALUES(?,?,?,?,?,?,?);`,
  ];
}

function UpdateSecondDouble() {
  return `UPDATE content_double_second_preshow AS d STRAIGHT_JOIN content_double_second_details AS c ON d.alarm_num=c.alarm_num 
  SET d.content_category=?, d.content_place=?, d.content_du_date=?, d.content_cost=?,
  c.content_case_num=?, c.content_party_name=?, c.content_party_position=?,
  c.content_oponent=?, c.content_else=?,c.content_memo=?  
  WHERE d.alarm_num=?;`;
}

module.exports = router;
