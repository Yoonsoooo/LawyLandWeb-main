//InsertDoubleReport, CheckDouble_User

const DBDI = {}; //db관련 di

DBDI.rollback_query = function (connection_, pool_) {
  console.log("rollback ");
  return connection_.rollback(function () {
    pool_.releaseConnection(connection_);
  });
};
DBDI.commit_query = function (connection_, pool_) {
  console.log("commit ");
  return connection_.commit(function () {
    pool_.releaseConnection(connection_);
  });
};
//search select---------------------------------------------------
DBDI.SelectAnnouncePreshow = function () {
  return `SELECT content_title AS title, content_date AS date, content_num AS num FROM content_announce ORDER BY content_date DESC LIMIT 10 OFFSET ?;`;
};
DBDI.SelectAnnounceDetails = function () {
  return `SELECT content_content AS content FROM content_announce WHERE content_num=?;`;
};

DBDI.SelectPreshowContent = function (
  condition_,
  condition_text_,
  order_,
  offset_,
  limit_ = "50"
) {
  //limit 처리 필요
  return `SELECT sub.content_title AS title, LEFT(sub.content_content, 40) AS content,
  g.content_num AS num ,g.content_category1 AS category1,g.content_category2 AS category2,g.content_category3 AS category3,g.content_view_count AS view_count,g.content_sub_count AS sub_count,g.content_comment_count AS comment_count,g.content_date AS date 
  FROM(
    SELECT f.content_num, f.content_title,f.content_content FROM content_qa_details AS f ${condition_text_}
  ) AS sub STRAIGHT_JOIN content_qa_preshow AS g ON sub.content_num=g.content_num ${condition_} ${order_} LIMIT ${limit_} ${offset_};`;
};

DBDI.SelectPreshowDouble = function (
  condition_,
  order_,
  offset_,
  limit_ = "50"
) {
  return `SELECT d.content_num AS num, d.content_category AS category,d.content_place AS place,d.content_du_date AS du_date,d.content_cost AS cost,d.is_comment_user AS is_comment
   FROM content_double_preshow AS d ${condition_} ${order_} LIMIT ${limit_} ${offset_};`;
};
DBDI.SelectUserAlarmPreshow = function () {
  return `SELECT o.alarm_num AS num,o.alarm_type AS type,o.alarm_text AS content,o.alarm_date AS date,o.expire_date AS expire
  FROM content_alarm_preshow AS o WHERE o.res_user_num=?;`;
};
//-----------------------------------------------------------------
DBDI.SelectDetailsContent = function () {
  return `SELECT sub.num, sub.anonymous, sub.content, sub.file ,sub.anonymous,IF(sub.anonymous,k.user_name2,k.user_name1) AS name,IF(sub.user_num=?,0,1) AS user_type,
  k.user_acquisition AS acquisition, k.user_field AS field
  FROM (
    SELECT content_num AS num,is_anonymous AS anonymous, user_num, content_content AS content,file_name AS file FROM content_qa_details WHERE content_num=?
  ) AS sub STRAIGHT_JOIN user_permanent AS k ON sub.user_num=k.user_num;`;
};

DBDI.SelectDetailsDouble = function () {
  return `SELECT sub1.content_match_date AS match_date,sub1.content_bank_name AS bank_name,sub1.content_bank_user AS bank_user,sub1.content_bank_account AS bank_account,
  c.content_num,c.content_case_num AS case_num, c.content_party_name AS party_name,c.content_party_position AS party_position,c.content_oponent AS oponent,c.content_else, c.content_memo AS memo,
  IF(sub1.user_num=k.user_num,0,1) AS user_type,k.user_name1 AS name, k.user_email AS email,k.user_phone AS phone,k.user_agency AS agency 
  FROM (
    SELECT b.content_num, b.user_num, b.comment_user_num, b.content_match_date,b.content_bank_name,b.content_bank_user,b.content_bank_account
    FROM content_double_user AS b WHERE b.content_num=? AND (b.user_num=? OR b.comment_user_num=?)
  ) AS sub1
  STRAIGHT_JOIN content_double_details AS c ON sub1.content_num=c.content_num
  STRAIGHT_JOIN user_permanent AS k ON sub1.user_num=k.user_num OR sub1.comment_user_num=k.user_num;`;
};

DBDI.SelectDetailsComment = function () {
  //우선 일반적인 join
  return `SELECT sub.c_num,sub.anonymous,sub.date,sub.parent_num,sub.scrap_count,sub.content_comment,
  IF(sub.anonymous=true,k.user_name2,k.user_name1) AS name,IF(sub.user_num=?,0,1) AS user_type,k.user_acquisition AS acquisition, k.user_field AS field
  FROM (
    SELECT a.comment_num AS c_num,a.is_anonymous AS anonymous, a.comment_date AS date, a.parent_comment_num AS parent_num,a.comment_scrap_count AS scrap_count,a.comment_content AS content_comment,
    a.user_num FROM content_comment_preshow AS a WHERE a.content_num=? ) AS sub 
    STRAIGHT_JOIN user_permanent AS k ON sub.user_num=k.user_num;`;
};
//insert------------------------------------------------
DBDI.InsertDouble = function () {
  //#
  return [
    `INSERT INTO content_double_user(user_num) VALUES(?)`,
    `INSERT INTO content_double_preshow(content_num,content_category,content_place,content_du_date,content_cost) VALUES(?,?,?,?,?);`,
    `INSERT INTO content_double_details(content_num,content_case_num,content_party_name,content_party_position,content_oponent,content_else,content_memo) VALUES(?,?,?,?,?,?,?);`,
  ];
};
DBDI.MigrateDoubleUser = function () {
  //#
  return [
    `INSERT INTO content_double_user(user_num,comment_user_num,content_match_date,content_bank_name,content_bank_user,content_bank_account) VALUES(?,?,NOW(),?,?,?)`,
    `INSERT INTO content_double_preshow(content_num,content_category,content_place,content_du_date,content_cost,is_comment_user) VALUES(?,?,?,?,?,true);`,
    `INSERT INTO content_double_details(content_num,content_case_num,content_party_name,content_party_position,content_oponent,content_else,content_memo) VALUES(?,?,?,?,?,?,?);`,
  ];
};
//====================후속복대리 관련

DBDI.InsertAlarm = function () {
  return `INSERT INTO content_alarm_preshow(alarm_type,req_user_num,res_user_num,alarm_text, expire_date) VALUES(?,?,?,?,?);`;
};

DBDI.SelectDoubleSecondPreshow = function () {
  return `SELECT r.alarm_num AS num,r.content_category AS category,r.content_place AS place,r.content_du_date AS du_date,r.content_cost AS cost
  FROM( SELECT alarm_num, alarm_date FROM content_alarm_preshow WHERE req_user_num=?
  )AS sub STRAIGHT_JOIN content_double_second_preshow AS r ON sub.alarm_num=r.alarm_num ORDER BY alarm_date DESC limit 50 offset ?;`;
};

//사용하는 부분 repo
DBDI.SelectAlarmSecondDetails = function () {
  return `SELECT sub1.case_num, sub1.party_name, sub1.party_position, sub1.oponent,sub1.content_else, sub1.memo
  ,k.user_name1 AS name, k.user_email AS email,k.user_phone AS phone,k.user_agency AS agency, 0 AS user_type
  FROM (
    SELECT c.alarm_num,c.content_case_num AS case_num, c.content_party_name AS party_name,c.content_party_position AS party_position,c.content_oponent AS oponent,c.content_else, c.content_memo AS memo 
    FROM content_double_second_details AS c WHERE c.alarm_num=? ) AS sub1
  STRAIGHT_JOIN user_permanent AS k ON k.user_num=?;`;
};
//========================
DBDI.InsertContentComment = function () {
  return `INSERT INTO content_comment_preshow(content_num,user_num,is_anonymous,parent_comment_num,comment_content) 
  VALUES(?,?,?,?,?);`;
};
DBDI.InsertContentScrap = function () {
  return `INSERT INTO content_qa_scrap(content_num,user_num) VALUES(?,?);`;
};
DBDI.InsertCommentScrap = function () {
  return `INSERT INTO content_comment_scrap(comment_num,user_num) VALUES(?,?);`;
};
//delete-------------------------------------------------
DBDI.DeleteContent = function () {
  //답변 없을경우만 삭제
  return "DELETE FROM content_qa_details WHERE content_num=? AND user_num=?;";
};
DBDI.DeleteDouble = function () {
  return "DELETE FROM content_double_user WHERE content_num=? AND user_num=? AND comment_user_num IS NULL;";
};
DBDI.DeleteComment = function () {
  return `UPDATE content_comment_preshow SET user_num=2, comment_content='삭제된 댓글입니다' WHERE comment_num=? AND user_num=?;`;
};
DBDI.DeleteScrap = function () {
  return `DELETE FROM content_qa_scrap WHERE scrap_num=? AND user_num=?;`;
};
DBDI.DeleteAlarm = function () {
  return "DELETE FROM content_alarm_preshow WHERE alarm_num=?;";
};
//update---------------------------------------------------------------
DBDI.UpdateCommentDelete = function () {
  return `UPDATE content_comment_preshow AS a SET a.comment_content='삭제된 댓글',a.user_num=0
  WHERE a.comment_num=? AND a.user_num=?;`;
};
DBDI.UpdateTemplate = function (table_, set_, where_) {
  return `UPDATE ${table_} SET ${set_} WHERE ${where_}`;
};
DBDI.UpdateApplyDouble = function () {
  return `UPDATE content_double_user AS b STRAIGHT_JOIN content_double_preshow AS d ON b.content_num=d.content_num 
  SET b.comment_user_num=?, b.content_match_date=NOW(), b.content_bank_name=?,b.content_bank_user=?,b.content_bank_account=?, d.is_comment_user=true 
  WHERE b.content_num=? AND b.user_num!=? AND b.comment_user_num IS NULL;`;
};
DBDI.UpdateComment = function () {
  return `UPDATE content_comment_preshow SET is_anonymous=?, comment_content=? WHERE comment_num=? AND user_num=?;`;
};


DBDI.returnUpdateQuery = function (action_type_) {
  //0:content 조회, 1:content 댓글, 2:content like, 3:double 신청
  switch (action_type_) {
    case 0: //content 조회
      return [
        "content_qa_preshow",
        "content_view_count=content_view_count+1",
        `content_num = ?`,
      ];
    case 1: //content like
      return [
        "content_qa_preshow",
        "content_sub_count=content_sub_count+1",
        `content_num = ?`,
      ];
    case 2: //content 댓글
      return [
        "content_qa_preshow",
        "content_comment_count=content_comment_count+1",
        `content_num = ?`,
      ];
    case 4: //comment like
      return [
        "content_comment_preshow",
        "comment_scrap_count=comment_scrap_count+1",
        `comment_num = ?`,
      ];
  } //각 컨텐츠 수정버튼시 경우 필요
};

//====================================================
//check content & user
DBDI.CheckComment_content = function () {
  return `SELECT content_comment_count FROM content_qa_preshow WHERE content_num=?;`;
};
DBDI.CheckScrap_Content = function () {
  return `SELECT scrap_num FROM content_qa_scrap WHERE content_num=? AND user_num=?;`;
};
DBDI.CheckScrap_comment = function () {
  return "SELECT scrap_num FROM content_comment_scrap WHERE comment_num=? AND user_num=?;";
};

DBDI.CheckDouble_User = function () {
  //need index on selector
  return "SELECT user_num, comment_user_num FROM content_double_user WHERE content_num=?;";
};
DBDI.CheckAlarm_User= function(){
  `SELECT req_user_num. res_user_num FROM content_alarm_preshow WHERE content_num=;`
}
//=====================================================

//-add alarm 알람관련 추가할 db

module.exports = DBDI;
