var express = require("express");
var router = express.Router();
var mysql = require("mysql2");
var sqlInfo = require("../config/mysql");
var pool = mysql.createPool(sqlInfo);

var dbdi = require("../router_function/DBDI");
const Cache = require("../router_function/CacheModule");
/* GET users listing. */

router.get("/", function (req, res, next) {
  res.render("repository");
});

router.post(
  "/req_repository_preshow",
  Cache.Chack_login_middleware,
  function (req, res, next) {
    //Cache.Chack_login_middleware   개발 편의를 위한 수정  나중에 고치기 필요
    var key_data_ = req.body;
    try {
      if (key_data_.type == 0)
        //작성글
        var query_ = SelectRepoContentPreshow();
      else if (key_data_.type == 1)
        //답글
        var query_ = SelectRepoCommentPreshow();
      else if (key_data_.type == 2)
        //위임
        var query_ = `SELECT d.content_num AS num, d.content_category AS category,d.content_place AS place,d.content_du_date AS du_date,d.content_cost AS cost,d.is_comment_user AS is_comment, d.is_report
      FROM(
        SELECT b.content_num FROM content_double_user AS b WHERE b.user_num=?) AS sub STRAIGHT_JOIN content_double_preshow AS d ON sub.content_num=d.content_num ORDER BY d.content_date DESC LIMIT 50 OFFSET ?;`;
      else if (key_data_.type == 3)
        //수임
        var query_ = `SELECT d.content_num AS num, d.content_category AS category,d.content_place AS place,d.content_du_date AS du_date,d.content_cost AS cost,d.is_comment_user AS is_comment, d.is_report
      FROM(
        SELECT b.content_num FROM content_double_user AS b WHERE b.comment_user_num=?) AS sub STRAIGHT_JOIN content_double_preshow AS d ON sub.content_num=d.content_num ORDER BY d.content_date DESC LIMIT 50 OFFSET ?;`;
      else if (key_data_.type == 4)
        //스크랩
        var query_ = `SELECT sub1.scrap_num,g.content_num AS num ,g.content_category1 AS category1,g.content_category2 AS category2,g.content_category3 AS category3,g.content_view_count AS view_count,g.content_sub_count AS sub_count,g.content_comment_count AS comment_count,g.content_date AS date,
      f.content_title AS title,f.content_content AS content 
      FROM (SELECT l.scrap_num, l.content_num FROM content_qa_scrap AS l WHERE l.user_num=?) AS sub1 STRAIGHT_JOIN content_qa_preshow AS g ON sub1.content_num=g.content_num STRAIGHT_JOIN content_qa_details AS f ON sub1.content_num=f.content_num ORDER BY g.content_date DESC LIMIT 50 OFFSET ?;`;
      else if (key_data_.type == 5)
        var query_ = dbdi.SelectDoubleSecondPreshow();
      pool.execute(
        query_,
        [key_data_.user, key_data_.offset],
        function (err, rows, field) {
          if (err) {
            console.log(err);
            return res.send({
              success: false,
              message: "유저 내역을 가져올 수 없습니다, 다시 시도해주세요",
            });
          }
          return res.send({ success: true, message: rows });
        }
      );
    } catch (e) {
      console.log("err", e);
    }
  }
);

router.post(
  "/req_repository_details",
  Cache.Chack_login_middleware,
  function (req, res, next) {
    try {
      var key_data_ = req.body; //await get_data_from_cli(req_body)
      if (key_data_.type == "double")
        repository_double_details(
          res,
          key_data_.num,
          key_data_.user,
          key_data_.else
        );
      else if (key_data_.type == "content")
        repository_content_details(res, key_data_.num, key_data_.user);
      else
        res.send({
          success: false,
          message: "옳바르지 못한 요청입니다 (User warning)",
        });
    } catch (e) {
      console.log("err", e);
      res.send({
        success: false,
        message: "Server error (유저 레포지토리): 서버측에 오류가 생겼습니다",
      });
    }
  }
);

router.post(
  "/req_repository_second_details",
  Cache.Chack_login_middleware,
  function (req, res, next) {
    try {
      var key_data_ = req.body; //await get_data_from_cli(req_body)
      repository_double_details(res, key_data_.num, key_data_.user, true);
    } catch (e) {
      console.log("err", e);
      res.send({
        success: false,
        message: "Server error (유저 레포지토리): 서버측에 오류가 생겼습니다",
      });
    }
  }
);

router.post(
  "/req_repository_delete",
  Cache.Chack_login_middleware,
  function (req, res, next) {
    try {
      var key_data_ = req.body;
      if (key_data_.type === 0) {
        var query_ = dbdi.CheckComment_content();
        pool.execute(query_, [key_data_.num], function (err, rows, field) {
          if (err)
            return res.send({
              success: false,
              message: "서버 에러 다시시도해주세요",
            });
          else if (rows[0].content_comment_count > 0)
            return res.send({
              success: false,
              message: "답변이 있는 글은 지울 수 없습니다",
            });
          else {
            pool.execute(
              dbdi.DeleteContent(),
              [key_data_.num, key_data_.user],
              function (err, rows, field) {
                console.log(err)
                if (err)
                  res.send({
                    success: false,
                    message: "글 삭제 실패, 다시 시도해주세요",
                  });
                else
                  res.send({
                    success: true,
                    message: "글이 성공적으로 삭제됐습니다",
                  });
              }
            );
          }
        });
      } else {
        if (key_data_.type === 1) var query_ = dbdi.UpdateCommentDelete();
        else if (key_data_.type === 2) var query_ = dbdi.DeleteDouble();
        else if (key_data_.type === 4) var query_ = dbdi.DeleteScrap();
        else if (key_data_.type === 5) var query_ = dbdi.DeleteAlarm();
        pool.execute(
          query_,
          [key_data_.num, key_data_.user],
          function (err, rows, field) {
            console.log(err);
            if (err)
              res.send({
                success: false,
                message: "삭제 실패, 다시 시도해주세요",
              });
            else res.send({ success: true, message: "삭제되었습니다" });
          }
        );
      }
    } catch (e) {
      console.log("err", e);
    }
  }
);

router.post(
  "/req_repository_update",
  Cache.Chack_login_middleware,
  function (req, res, next) {
    try {
      var key_data_ = req.body;
      pool.execute(
        dbdi.UpdateComment(),
        [key_data_.anonymous, key_data_.content, key_data_.num, key_data_.user],
        function (err, rows, field) {
          if (err) {
            console.log(err);
            res.send({
              success: false,
              message: "답글 변경 실패, 다시 시도해주세요",
            });
          } else if (rows.changedRows == 1)
            res.send({ success: true, message: "댓글 수정 완료" });
          else
            res.send({
              success: false,
              message: "답글 변경 실패, 다시 시도해주세요",
            });
        }
      );
    } catch (e) {
      console.log("err", e);
      res.send({ success: false, message: "서버에러, 다시 시도해주세요" });
    }
  }
);

router.post(
  "/req_double_report",
  Cache.Chack_login_middleware,
  function (req, res, next) {
    try {
      var key_data_ = req.body;
      var query_ = SelectDoubleReport();
      pool.execute(
        query_,
        [key_data_.num, key_data_.user, key_data_.user],
        function (err, rows, field) {
          if (err)
            res.send({
              success: false,
              message: "서버에러1, 다시 시도해주세요",
            });
          else if (rows.length == 1) res.send({ success: true, message: rows });
          else
            res.send({
              success: false,
              message: "아직 작성된 결과통지서가 없습니다",
            });
        }
      );
    } catch (e) {
      console.log("report ", e);
    }
  }
);
//===========================================================
async function repository_content_details(res_, num_, user_) {
  try {
    pool.getConnection(function (err, connection) {
      if (err) {
        res_.send({ success: false, message: "서버에러1, 다시 시도해주세요" });
        pool.releaseConnection(connection);
      }
      var query_ = dbdi.SelectDetailsContent();
      connection.execute(query_, [user_, num_], function (err, rows1, field) {
        if (err) {
          res_.send({
            success: false,
            message: "상세보기를 찾을 수 없습니다 (Server error)",
          });
          return pool.releaseConnection(connection);
        } else if (rows1.length <= 0) {
          res_.send({
            success: false,
            message: "상세보기를 찾을 수 없습니다(삭제된 글입니다)",
          });
          return pool.releaseConnection(connection);
        } else {
          query_ = dbdi.SelectDetailsComment();
          connection.execute(
            query_,
            [user_, num_],
            function (err, rows2, field) {
              if (err) {
                res_.send({
                  success: false,
                  message: "상세보기를 찾을 수 없습니다 (Server error)",
                });
                return pool.releaseConnection(connection);
              }
              res_.send({
                success: true,
                message: { details: rows1, comment: rows2 },
              });
              query_ = dbdi.returnUpdateQuery(0, num_);
              connection.query(
                dbdi.UpdateTemplate(query_[0], query_[1], query_[2]),
                [num_],
                function (err, rows, field) {
                  return pool.releaseConnection(connection);
                }
              );
            }
          );
        }
      });
    });
  } catch (e) {
    console.log("err", e);
  }
}

async function repository_double_details(res_, num_, user_, else_) {
  try {
    if (else_) {
      var query_ = dbdi.SelectAlarmSecondDetails();
      var value_ = [num_, user_];
    } else {
      var query_ = dbdi.SelectDetailsDouble();
      var value_ = [num_, user_, user_];
    }
    pool.execute(query_, value_, function (err, rows, field) {
      if (err) {
        console.log("err: ", err);
        return res_.send({
          success: false,
          message: "서버에러1, 다시 시도해주세요",
        });
      } else {
        return res_.send({ success: true, message: rows });
      }
    });
  } catch (e) {
    console.log("err", e);
  }
}

function SelectRepoContentPreshow() {
  return `SELECT sub.content_num AS num, sub.content_title AS title, sub.content_content AS content, sub.file_name AS file,
  g.content_category1 AS category1,g.content_category2 AS category2,g.content_category3 AS category3,g.content_view_count AS view_count,g.content_sub_count AS sub_count,g.content_comment_count AS comment_count,g.content_date AS date 
  FROM(
    SELECT content_num, user_num, content_title ,content_content, file_name FROM content_qa_details WHERE user_num=?
  ) AS sub STRAIGHT_JOIN content_qa_preshow AS g ON sub.content_num=g.content_num ORDER BY g.content_date DESC LIMIT 50 OFFSET ?;`;
}
function SelectRepoCommentPreshow() {
  return `SELECT sub.*,g.content_category1 AS category1,g.content_category2 AS category2,g.content_category3 AS category3,g.content_view_count AS view_count,g.content_sub_count AS sub_count,g.content_comment_count AS comment_count,g.content_date AS date,
  f.content_title AS title FROM (
    SELECT a.comment_num AS c_num,a.content_num AS num,a.is_anonymous AS anonymous, a.comment_date ,a.comment_scrap_count AS scrap_count,a.comment_content AS content_comment
    FROM content_comment_preshow AS a WHERE a.user_num=?
  ) AS sub STRAIGHT_JOIN content_qa_preshow AS g ON sub.num=g.content_num STRAIGHT_JOIN content_qa_details AS f ON sub.num=f.content_num ORDER BY sub.comment_date DESC LIMIT 50 OFFSET ?;`;
}
function SelectDoubleReport() {
  return `SELECT l.content_attendee AS attendee, l.content_ofdefense AS ofdefense, l.content_otherside AS otherside, l.content_dateofnexthearing AS dateofnexthearing, l.content_otherthing AS otherthing, l.content_place AS place 
  FROM (
    SELECT content_num, user_num FROM content_double_user WHERE content_num=? AND (user_num=? OR comment_user_num=?)
  ) AS sub1 STRAIGHT_JOIN content_double_report AS l ON sub1.content_num=l.content_num;`;
}
module.exports = router;
