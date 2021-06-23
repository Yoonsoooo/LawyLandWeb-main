const Redis= require("../config/Redis")
const RedisCache={}

RedisCache.Chack_login_middleware=function(req,res,next){
    if(!req.body.user) next()
    else{
        console.log(req.cookies)
        console.log(req.ip)
        if(!req.body.uid) return res.send({success:false, message:"로그아웃되었습니다.\n다시 로그인해 주세요."})
        Redis.get(req.body.uid,function(err,rows){
            if(err){
                console.log("redis err:",err)
                res.send({success:false, message:"로그아웃되었습니다.\n다시 로그인해 주세요."})
            }else{
                console.log('rows: ',rows)
                if(rows){
                    var json_rows_=JSON.parse(rows)
                    if(typeof json_rows_!=='object')
                        return res.send({success:false, message:"로그아웃되었습니다.\n다시 로그인해 주세요."})
                    else{
                        var card_res_=json_rows_.light_card.substr(req.body.cli_key1,6)
                            +json_rows_.light_card.substr(req.body.cli_key2,6)
                            +json_rows_.light_card.substr(req.body.cli_key3,6)
                        if(card_res_===req.body.cli_card_res && req.body.user===json_rows_.temp_user){
                            console.log('change user: ',json_rows_.user)
                            Redis.expire(req.body.uid, 7200)
                            req.body.user=json_rows_.user
                            delete req.body.cli_card_res
                            delete req.body.cli_key1
                            delete req.body.cli_key2
                            delete req.body.cli_key3
                            delete req.body.uid
                            return next()
                        }else
                            return res.send({success:false, message:"로그아웃되었습니다.\n다시 로그인해 주세요."})
                    }
                }else
                    res.send({success:false, message:"로그아웃되었습니다.\n다시 로그인해 주세요."})
            }
        })
    }
}
RedisCache.Logout_middleware=function(req,res,next){
    Redis.del(req.body.uid,function(err,rows){
        if(err) res.send({success:false, message:"로그아웃 실패, 다시 시도해 주세요."})
        else res.send({success:true, message:"로그아웃에 성공했습니다."})
    })
}

module.exports = RedisCache