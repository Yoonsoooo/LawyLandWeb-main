var express = require('express');
var router = express.Router();
var mysql=require('mysql2')
var sqlInfo=require('../config/mysql');
var pool= mysql.createPool(sqlInfo);

var dbdi= require('../router_function/DBDI')
const Cache=require('../router_function/CacheModule')


router.get('/', function(req, res, next) {
    res.render('news');
});

router.post('/req_preshow', function(req,res,next){
    var key_data_=req.body
    pool.execute(SelectNewsPreshow(), [key_data_.offset], function(err, rows, field){
        if(err) res.send({success: false, message:'서버에러 1(다시 시도해주세요)'})
        else res.send({success:true, message:rows})
    })
})
router.post('/req_details', Cache.Chack_login_middleware,function(req, res, next) {
    try{//->안됨
        var key_data_=req.body
        console.log(key_data_)
        pool.execute(SelectNewsDetails(), [key_data_.user,key_data_.num,], function(err, rows, field){
            if(err) res.send({success: false, message:'서버에러 1(다시 시도해주세요)'})
            else res.send({success:true, message:rows})
        })
    }catch(e){
        console.log('aaasdasdasd',e)
    }
});
router.post('/req_sub', Cache.Chack_login_middleware,function(req, res, next) {
    var key_data_= req.body
    var set_= key_data_.type==1?'news_sub_count=news_sub_count+1':'news_dis_sub_count=news_dis_sub_count+1'
    try{
        conn.getConnection(function(err, connection){
            connection.execute(UpdateNewsSub(set_),[key_data_.num,key_data_.user],function(err,rows,field){
                if(err){
                    res.send({success:false,message:'다시 시도해주세요(서버에러)'})
                    return connection.release()
                }else{
                    res.send({success:true,message:'추천'})
                    connection.execute(InsertNewsSub(),[key_data_.num,key_data_.user],function(err,rows,field){
                        connection.release()
                    })
                }
            })
        })
    }catch(e){
        res.send({success:false,message:'다시 시도해주세요 (Server error)'})
        if(!typeof connection) connection.release()
    }
});

router.post('/req_sub_comment',Cache.Chack_login_middleware,function(req,res,next){
    try{
        var key_data_=req.body
        console.log(key_data_)
        pool.execute(UpdateNewsCommentSub(),[key_data_.num,key_data_.user],function(err,rows,field){
            if(err) res.send({success:false,message:'다시 시도해주세요(서버에러)'})
            else res.send({success:true,message:'추천'})
            
        })
    }catch(e){
        res.send({success:false, message:'서버문제, 다시 시도해주세요'})
    }
})
router.post('/req_write_comment',Cache.Chack_login_middleware,function(req,res,next){
    try{
        var key_data_=req.body
        pool.create

        pool.getConnection(function (err, connection) {
            if (err) {
              res.send({ success: false, message: "서버에러1, 다시 시도해주세요" });
              console.log(err);
              return pool.releaseConnection(connection);
            }
            connection.execute(InsertNewsComment(),[key_data_.num,key_data_.user,key_data_.parent_num,key_data_.anonymous,key_data_.content],
            function(err, rows,field){
                if(err){
                    console.log('a',err)
                    res.send({success:false, message:'댓글작성에 실패했습니다(다시 시도해주세요)'})
                    return pool.releaseConnection(connection);
                }else{
                    connection.execute(SelectNewsDetails(), [key_data_.user,key_data_.num,], function(err, rows, field){
                        if(err) res.send({success: false, message:'서버에러 1(다시 시도해주세요)'})
                        else if(rows.length==0) res.send({success:true, message:'댓글을 작성했습니다(댓글 가져오기 실패)'})  
                        else res.send({success:true, message:rows})
                        return pool.releaseConnection(connection);
                    })
                } 
            })
        })

    }catch(e){
        console.log('b',e)
        res.send({success:false, message:'서버문제, 다시 시도해주세요'})
    }
})
router.post('/req_revise_comment',Cache.Chack_login_middleware,function(req,res,next){
    try{
        var key_data_=req.body
        pool.getConnection(function (err, connection) {
            if (err) {
              res.send({ success: false, message: "서버에러1, 다시 시도해주세요" });
              console.log(err);
              return pool.releaseConnection(connection);
            }
            connection.execute(UpdateNewsComment(),[key_data_.anonymous,key_data_.comment, key_data_.num,key_data_.user],
                function(err, rows,field){
                    if(err){ 
                        res.send({success:false, message:'댓글수정에 실패했습니다(다시 시도해주세요)'})
                        return pool.releaseConnection(connection);
                    }else{
                    connection.execute(SelectNewsDetails(), [key_data_.user,key_data_.num,], function(err, rows, field){
                        if(err) res.send({success: false, message:'서버에러 1(다시 시도해주세요)'})
                        else if(rows.length==0) res.send({success:true, message:'댓글을 수정했습니다(댓글 가져오기 실패)'})  
                        else res.send({success:true, message:rows})
                        return pool.releaseConnection(connection);
                    })
                } 
            })
        })
        
    }catch(e){
        res.send({success:false, message:'서버문제, 다시 시도해주세요'})
    }
})

function InsertNewsComment(){
    return `INSERT INTO news_comment_preshow(news_num,user_num,parent_comment_num,is_anonymous,comment_content) VALUES(?,?, ?,?,?);`
}
function SelectNewsPreshow(){
    return `SELECT news_num as num,news_up_date AS up_date,news_title AS title,news_proponent AS proponent, 
    news_view_count AS view_count,news_sub_count AS sub_count,news_comment_count AS comment_count, news_date AS date FROM news_preshow ORDER BY news_date DESC LIMIT 50 OFFSET ?;`
}
function SelectNewsDetails(){
    return `SELECT sub.c_num,sub.anonymous,sub.date,sub.parent_num,sub.scrap_count,sub.content_comment,
  IF(sub.anonymous=true,k.user_name2,k.user_name1) AS name,IF(sub.user_num=?,0,1) AS user_type,h.user_acquisition AS acquisition, h.user_field AS field
  FROM (
    SELECT a.news_comment_num AS c_num,a.is_anonymous AS anonymous, a.comment_date AS date, a.parent_comment_num AS parent_num,a.comment_scrap_count AS scrap_count,a.comment_content AS content_comment,
    a.user_num FROM news_comment_preshow AS a WHERE a.news_num=?
    ) AS sub STRAIGHT_JOIN user_name AS k ON sub.user_num=k.user_num STRAIGHT_JOIN user_preshow AS h ON sub.user_num=h.user_num;`
}

function UpdateNewsSub(set_){
    return `UPDATE TABLE news_preshow SET ${set_} WHERE news_num=?;`
}
function InsertNewsSub(){
    return `INSERT INTO news_preshow_sub(news_num,user_num) VALUES(?, ?);`
}
function UpdateNewsCommentSub() {
    return `UPDATE TABLE news_comment_preshow SET news_sub_count=news_sub_count+1 WHERE comment_num=?;`
}
function InsertNewsCommentSub(){
    return `INSERT INTO news_comment_sub(comment_num,user_num) VALUES(?, ?);`
}
function UpdateNewsComment(){
    return `UPDATE TABLE news_comment_preshow SET comment_content=? is_anonymous=? WHERE comment_num=?;`
}
function DeleteNewsComment(){
    return `UPDATE TABLE news_comment_preshow SET comment_content='삭제된 댓글입니다' is_anonymous=false user_num=0 WHERE comment_num=?;`
 
}
module.exports = router;