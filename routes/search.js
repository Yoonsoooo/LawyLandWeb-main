var express = require("express");
var router = express.Router();
var mysql = require("mysql2");
var sqlInfo = require("../config/mysql");
var transporter= require("../config/nodemailer")

var pool = mysql.createPool(sqlInfo);

var dbdi = require("../router_function/DBDI");
const Cache = require("../router_function/CacheModule");
const check = require("../router_function/checkForm");


//validation Joi
const {
  reqSearchPreshow,
  reqSearchDetails,
  reqDoubleDetails,
  reqWriteComment,
  reqAddScrap,
} = require("../router_function/schmas");

router.post("/req_search_preshow", async function (req, res, next) {
  try {
    var key_data_ = req.body;
    //유효성 검사
    const { error } = reqSearchPreshow.validate(key_data_);

    if (error) {
      console.log("Error", error);
      res.send({
        success: false,
        message: "입력을 다시 한번 확인 해주세요",
      });

      return;
    }
    var condition_ = await add_condition_query_search(
      key_data_.type,
      key_data_
    );
    if (key_data_.type == "content")
      var query_ = dbdi.SelectPreshowContent(
        condition_.condition,
        condition_.condition_text,
        condition_.order,
        condition_.offset
      );
    else if (key_data_.type == "double")
      var query_ = dbdi.SelectPreshowDouble(
        condition_.condition,
        condition_.order,
        condition_.offset
      );
    pool.query(query_, function (err, rows, field) {
      if (err)
        return res.send({
          success: false,
          message: "글을 불러오는데 실패했습니다. 다시 시도해주세요",
        });
      else return res.send({ success: true, message: rows });
    });
  } catch (e) {
    console.log(e);
  }
});

router.post(
  "/req_search_details",
  Cache.Chack_login_middleware,
  function (req, res, next) {
    try {
      //Cache.Chack_login_middleware  개발 편의를 위한
      var key_data_ = req.body;
      if (key_data_.type == "content")
        var { error } = reqSearchDetails.validate(key_data_);
      else if (key_data_.type == "double")
        var { error } = reqDoubleDetails.validate(key_data_);
      else
        return res.send({
          success: false,
          message: "잘못된 요청입니다(어플을 종료해주세요)",
        });

      if (error) {
        console.log("Error", error);
        res.send({
          success: false,
          message: "입력을 다시 한번 확인 해주세요",
        });

        return;
      }
      if (typeof key_data_.num !== "number"){
        res.send({
          success: false,
          message: "잘못된 상세보기 요청입니다 (User warning)",
        });
      }else if (key_data_.type === "content")
        find_content_details(res, key_data_.num, key_data_.user);
      else if (key_data_.type === "double"){
        find_double_details(
          res,
          key_data_.num,
          key_data_.user,
          key_data_.bank_name,
          key_data_.bank_user,
          key_data_.bank_account
        );
      }
      else{
        res.send({
          success: false,
          message: "잘못된 상세보기 요청입니다 (User warning)",
        });
      }
    } catch (e) {
      console.log(e);
      res.send({
        success: false,
        message: "Server error (본문 전송 실패): 서버측에 오류가 생겼습니다",
      });
    }
  }
);
router.post(
  "/req_write_comment",
  Cache.Chack_login_middleware,
  async function (req, res, next) {
    var key_data_ = req.body;
    const { error } = reqWriteComment.validate(key_data_);

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
        dbdi.InsertContentComment(),
        [
          key_data_.num,
          key_data_.user,
          key_data_.anonymous,
          key_data_.parent_num,
          key_data_.content,
        ],
        function (err, rows, field) {
          if (err) {
            res.send({ success: false, message: "댓글 등록에 실패했습니다" });
            return pool.releaseConnection(connection);
          }
          connection.execute(
            dbdi.SelectDetailsComment(),
            [key_data_.user,key_data_.num],
            function (err, rows1, field) {
              if (err) {
                console.log(err);
                res.send({
                  success: false,
                  message: "댓글 등록 완료되었습니다. (댓글 불러오기 실패)",
                });
                return pool.releaseConnection(connection);
              }
              res.send({ success: true, message: rows1 });
              var query_ = dbdi.returnUpdateQuery(2);
              query_ = dbdi.UpdateTemplate(query_[0], query_[1], query_[2]);
              connection.execute(
                query_,
                [key_data_.num],
                function (err, rows, field) {
                  return pool.releaseConnection(connection);
                }
              );
            }
          );
        }
      );
    });
  }
);

router.post('/req_comment_update', Cache.Chack_login_middleware,function(req,res,err){
  try{
    var key_data_ = req.body;
    pool.getConnection(function (err, connection) {
      if (err) {
        res.send({ success: false, message: "서버에러1, 다시 시도해주세요" });
         console.log(err);
         return pool.releaseConnection(connection);
      }
      connection.execute(
        dbdi.UpdateComment(),[key_data_.anonymous, key_data_.content, key_data_.num, key_data_.user],
         function (err, rows, field) {
           if (err){
             res.send({
                success: false,
                message: "답글 변경 실패, 다시 시도해주세요",
             });
                return pool.releaseConnection(connection);
              }else if (rows.changedRows != 1){
                res.send({
                  success: false,
                  message: "답글 변경 실패, 다시 시도해주세요",
                });
                return pool.releaseConnection(connection);
              }
              else{
                connection.execute(
                  dbdi.SelectDetailsComment(),
                  [key_data_.user,key_data_.content_num],
                  function (err, rows1, field) {
                    if (err) {
                      console.log(err);
                      res.send({
                        success: false,
                        message: "댓글 수정이 완료되었습니다. (댓글 불러오기 실패)",
                      });
                      return pool.releaseConnection(connection);
                    }else{
                      res.send({
                        success: true,
                        message: rows1
                      });
                      return pool.releaseConnection(connection);
                    }
                  }
                );
              }
            });
          });
  }catch(e){

  }
})

router.post(
  "/req_add_scrap",
  Cache.Chack_login_middleware,
  function (req, res, next) {
    var key_data_ = req.body;
    const { error } = reqAddScrap.validate(key_data_);

    if (error) {
      console.log("Error", error);
      res.send({
        success: false,
        message: "입력을 다시 한번 확인 해주세요",
      });

      return;
    }
    if (typeof key_data_.num != "number")
      res.send({ success: false, message: "잘못된 요청입니다 (User warning)" });
    else if (key_data_.type == "content") {
      var query1_ = dbdi.CheckScrap_Content();
      var query2_ = dbdi.InsertContentScrap();
      var query3_ = dbdi.returnUpdateQuery(1, key_data_.num);
      query3_ = dbdi.UpdateTemplate(query3_[0], query3_[1], query3_[2]);
    } else if (key_data_.type == "comment") {
      var query1_ = dbdi.CheckScrap_comment();
      var query2_ = dbdi.InsertCommentScrap();
      var query3_ = dbdi.returnUpdateQuery(4);
      query3_ = dbdi.UpdateTemplate(query3_[0], query3_[1], query3_[2]);
    } else {
      res.send({
        success: "false",
        message: "잘못된 요청입니다 (User warning)",
      });
      return;
    }

    pool.getConnection(function (err, connection) {
      if (err) {
        res.send({ success: false, message: "서버에러1, 다시 시도해주세요" });
        pool.releaseConnection(connection);
      }
      pool.execute(
        query1_,
        [key_data_.num, key_data_.user],
        function (err, rows1, field) {
          if (err) {
            res.send({
              success: false,
              message: "서버에러2, 다시 시도해주세요",
            });
            return pool.releaseConnection(connection);
          } else if (rows1.length != 0) {
            res.send({ success: false, message: "이미 요청한 내용입니다" });
            pool.releaseConnection(connection);
            return;
          } else {
            connection.beginTransaction(function (err) {
              if (err) {
                res.send({
                  success: false,
                  message: "서버에러3, 다시 시도해주세요",
                });
                return dbdi.rollback_query(connection, pool);
              }
              connection.query(
                query2_,
                [key_data_.num, key_data_.user],
                function (err, rows2, field) {
                  if (err) {
                    res.send({
                      success: false,
                      message: "서버에러4, 다시 시도해주세요",
                    });
                    return dbdi.rollback_query(connection, pool);
                  }
                  connection.query(
                    query3_,
                    [key_data_.num],
                    function (err, rows3, field) {
                      if (err) {
                        res.send({
                          success: false,
                          message: "서버에러5, 다시 시도해주세요",
                        });
                        return dbdi.rollback_query(connection, pool);
                      } else if (
                        rows3.changedRows != 1 &&
                        rows2.changedRows != 1
                      ) {
                        res.send({
                          success: false,
                          message:
                            "추천입력이 실패했습니다(서버에러, 다시 시도해주세요",
                        });
                        return dbdi.rollback_query(connection, pool);
                      } else {
                        res.send({
                          success: true,
                          message: "스크랩 등록 성공",
                        });
                        return dbdi.commit_query(connection, pool);
                      }
                    }
                  );
                }
              );
            });
          }
        }
      );
    });
  }
);
//================================================================
async function find_content_details(res_, num_, user_) {
  pool.getConnection(function (err, connection) {
    if (err) {
      res_.send({ success: false, message: "서버에러1, 다시 시도해주세요" });
      pool.releaseConnection(connection);
    }
    var query_ = dbdi.SelectDetailsContent();
    connection.execute(query_, [user_, num_], function (err, rows1, field) {
      if (err) {
        console.log(err);
        res_.send({
          success: false,
          message: "상세보기를 찾을 수 없습니다1 (Server error)",
        });
        return pool.releaseConnection(connection);
      }else if(rows1.length<=0){
        res_.send({
          success: false,
          message: "상세보기를 찾을 수 없습니다(삭제된 글입니다)",
        });
      }else{
        query_ = dbdi.SelectDetailsComment();
        connection.execute(query_, [user_, num_], function (err, rows2, field) {
          if (err) {
            console.log(err);
            res_.send({
              success: false,
              message: "상세보기를 찾을 수 없습니다2 (Server error)",
            });
            return pool.releaseConnection(connection);
          }
          res_.send({
            success: true,
            message: { details: rows1, comment: rows2 },
          });
          query_ = dbdi.returnUpdateQuery(0, num_);
          query_ = dbdi.UpdateTemplate(query_[0], query_[1], query_[2]);
          connection.query(query_, [num_], function (err, rows, field) {
            return pool.releaseConnection(connection);
          });
        });
      }
    });
  });
}

async function find_double_details(
  res_,
  num_,
  user_,
  bank_name_,
  bank_user_,
  bank_account_
) {
  var CK = check.APPLYDOUBLE({
    bank_name: bank_name_,
    bank_user: bank_user_,
    bank_account: bank_account_,
  });
  if (!CK[0]) {
    res_.send({ success: false, message: CK[1] });
    return;
  }
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log("err: ", err);
      res_.send({ success: false, message: "서버에러1, 다시 시도해주세요" });
      return pool.releaseConnection(connection);
    }
    connection.beginTransaction(function (err) {
      if (err) {
        res_.send({ success: false, message: "서버에러2, 다시 시도해주세요" });
        return dbdi.rollback_query(connection, pool);
      }
      var query_ = dbdi.UpdateApplyDouble();
      connection.execute(
        query_,
        [user_, bank_name_, bank_user_, bank_account_, num_, user_],
        function (err, rows1, field) {
          if (err) {
            res_.send({
              success: false,
              message: "서버에러3, 다시 시도해주세요",
            });
            return dbdi.rollback_query(connection, pool);
          } else if (rows1.changedRows != 2) {
            res_.send({ success: false, message: "본인이 작성하였거나 이미 신청된 복대리입니다" });
            return dbdi.rollback_query(connection, pool);
          } else {
            //connection.commit(function () {
            connection.commit(function () {
              query_ = dbdi.SelectDetailsDouble();
              connection.query(
                query_,
                [num_, user_, user_],
                function (err, rows2, field) {
                  if (err || rows2.length===0) {
                    res_.send({
                      success: false,
                      message:
                        "복대리 신청에 성공했습니다, 상세보기 불러오기 실패(나의 이력에서 확인해주세요)",
                    });
                    SendDoubleMatchMail(num_,user_)
                    return pool.releaseConnection(connection);
                  }
                  res_.send({ success: true, message: rows2 });
                  SendDoubleMatchMail(num_,user_)
                  return pool.releaseConnection(connection);
                }
              );
            });
          }
        }
      );
    });
  });
}

function SendDoubleMatchMail(num_, comment_user_num_){
  try{
    pool.execute(select_double_mail_content(),[num_, comment_user_num_],
      function(err, rows, field){
        if(err || rows.length!==2){
          console.log(err)
        }else{
          var user_index_=rows[0].user_type===0?0:1
          var comment_index_=rows[0].user_type===0?1:0
          EmailDoubleMatch(user_index_,comment_index_ ,rows)
        }
      }
    )
  }catch(e){
    console.log('catch err: ',e)
  }

}

async function add_condition_query_search(type_, condition_) {
  var query_condition_ = {
    condition: "",
    condition_text: "",
    order: null,
    offset: "",
  };
  var temp_ = [];
  if (type_ == "content") {
    if (condition_.category != 0)
      temp_.push(
        `${condition_.category} in (g.content_category1, g.content_category2, g.content_category3)`
      );
    if (condition_.input.length > 1) {
      var input_context = "";
      condition_.input = condition_.input.split(" ");
      condition_.input.map((val_, index_) => {
        input_context += `f.content_title LIKE '%${val_}%' OR f.content_content LIKE '%${val_}%' OR `;
      });
      input_context=input_context.slice(0,-3)
      query_condition_.condition_text = `WHERE ${input_context}`;
    }
    var sort_ = [
      "g.content_num",
      "g.content_comment_count",
      "g.content_view_count",
    ];
    query_condition_.order = `ORDER BY ${sort_[condition_.sort]} DESC`;
  } else if (type_ == "double") {
    query_condition_.order = "ORDER BY d.content_date DESC";
    if (condition_.category != 0)
      temp_.push(`d.content_category=${condition_.category}`);
    if (condition_.input.length > 1) {
      var input_context = "";
      condition_.input = condition_.input.split(" ");
      condition_.input.map((val_, index_) => {
        input_context += ` content_place LIKE '%${val_}%' OR `;
      });
      input_context=input_context.slice(0,-3)
      temp_.push(
        input_context
      );
    }
  }
  if (condition_.offset > 0)
    query_condition_.offset = `OFFSET ${condition_.offset}`;
  if (temp_.length > 0) {
    query_condition_.condition = "WHERE ";
    for (var i = 0; i < temp_.length; i++)
      query_condition_.condition += temp_[i] + " AND ";
    query_condition_.condition=query_condition_.condition.slice(0,-4)
  }

  console.log(query_condition_)
  return query_condition_;
}


function EmailDoubleMatch(user_index_,comment_index_, data_) {
  var mail_text_=MailDoubleTemplate({
    agency1:data_[comment_index_].agency,
    name1:data_[comment_index_].name1,
    agency2:data_[user_index_].agency,
    name2:data_[user_index_].name1,
    case_num:data_[user_index_].case_num,
    place:data_[user_index_].place,
    du_date:data_[user_index_].du_date,
    party_position:data_[user_index_].party_position,
    party_name:data_[user_index_].party_name,
    oponent:data_[user_index_].oponent,
    memo:data_[user_index_].memo,
    else:data_[user_index_].content_else
  })

  const mainOption = {
    //await있음
    //from:'LawyLand',
    from: '"LawyLand no-reply" <Lawyland-no-reply@original.com>',
    to: data_[user_index_].email,
    subject: "로이랜드) 복대리가 매칭되었습니다",
    html:mail_text_
  };
  transporter.sendMail(mainOption);
}

function MailDoubleTemplate(data_){
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
      table,thead, tbody{
          width:100%;
          padding:4px 7px;
      }
      th{
          height: 30px;
      }
      .border_box{
          border: 1px solid black;
          height: fit-content;
          padding:7px 10px 7px 0;
          border-collapse: collapse;
      }
      .column_name{
          width: 100px;
      }
      .column_value{
          width: calc(100% - 100px);
      }
      </style>
      </noscript>
    </head>
    <body>
      <amp-carousel height="100"
                    layout="fixed-height"
                    type="carousel">
                    <div>복대리 매칭이 성사되었습니다( 자세한 내용은 어플의 '나의 이력' 에서 확인해주세요 ).</div>
                    <table>
                        <thead>
                            <th colspan="2">복대리 의뢰서</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="column_name border_box">받으시는 분</td> <td class="border_box">${data_.agency1} (담당변호사 ${data_.name1})</td>
                            </tr>
                            <tr class="border_box">
                                <td class="column_name border_box">보내는 사람</td> <td class="border_box">${data_.agency2} (담당변호사 ${data_.name2})</td>
                            </tr>
                            <tr class="border_box">
                                <td class="column_name border_box">사건정보</td> 
                                <td class="border_box">
                                    <div>사건: ${data_.case_num}</div>
                                    <div>법원: ${data_.place}</div>
                                    <div>기일: ${data_.du_date}</div>
                                    <div>당사자: ${data_.party_position} ${data_.party_name}</div>
                                    <div>상대방: ${data_.oponent}</div>
                                </td>
                            </tr>
            
                            <tr>
                                <td colspan="2">
                                <div>
                                    1.변호사님의 건강과 건승하심을 기원합니다. 급작스럽게 부탁드렸음에도 흔쾌히 복대리를
                                    맡아 주셔서 대단히 감사합니다.
                                    </div>
                                      <div></div>
                                    <div>
                                    2.복대리를 의뢰하는 사건은 ${data_.place} ${data_.du_date} 사건이고 
                                    저는 ${data_.party_position===0?'원고':'피고'} ${data_.party_name}의 소송대리인입니다.
                                      </div>
                                      <div></div>
                                    <div>3.본 사건은 다음과 같습니다.</div>
                                </td>
                            </tr>
            
                            <tr>
                                <td class="border_box" colspan="2">
                                  <div>${data_.else}</div>
                                  <div>${data_.memo}</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">감사합니다.</td>
                            </tr>
                        
                        </tbody>
                    </table>
      </amp-carousel>
    </body>
  </html>`
}

function select_double_mail_content(){
  return `SELECT 
  sub1.content_match_date AS match_date,
  d.content_place AS place, d.content_du_date AS du_date, d.content_cost AS cost,
  c.content_case_num AS case_num,c.content_party_name AS party_name,c.content_party_position AS party_position, c.content_oponent AS oponent, c.content_else, c.content_memo AS memo,
  IF(sub1.user_num=k.user_num,0,1) AS user_type, k.user_name1 AS name1, k.user_email AS email, k.user_agency AS agency
  FROM (
    SELECT b.content_num, b.user_num, b.comment_user_num ,b.content_match_date 
    FROM content_double_user AS b  WHERE b.content_num=? AND b.comment_user_num=?
  ) AS sub1
  STRAIGHT_JOIN content_double_preshow AS d ON sub1.content_num=d.content_num 
  STRAIGHT_JOIN content_double_details AS c ON sub1.content_num=c.content_num 
  STRAIGHT_JOIN user_permanent AS k ON sub1.user_num=k.user_num OR sub1.comment_user_num=k.user_num;`
}
//==========================================
module.exports = router;
