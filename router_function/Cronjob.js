var mysql=require('mysql2/promise')
var sqlInfo=require('../config/mysql');
var conn= mysql.createPool(sqlInfo);
var dbdi= require('./DBDI')

async function process_expire_double(rows){

    var connection= await conn.getConnection(async connt => connt)
    try{
        await connection.beginTransaction()
        var before_num_=100;
        var query_=dbdi.InsertDouble()
        var val_=0;
        for(var i=0; i<rows.length;i++){
            val_=rows[i]
            console.log('cron :',val_)
            await connection.beginTransaction()
            var [rows1,field1]=await connection.query(query_[0],[val_.user])
            before_num_=rows1.insertId
            var [rows2,field2]=await connection.query(query_[1],[before_num_,val_.category,val_.place,val_.du_date,val_.cost])
            var [rows3,field3]=await connection.query(query_[2],[before_num_,val_.case_num,val_.party_name,val_.party_position,val_.oponent,val_.content_else, val_.memo])
            if(rows1.affectedRows==1 && rows2.affectedRows==1 && rows3.affectedRows==1){
                query_=dbdi.DeleteAlarm()
                await connection.query(query_,[val_.num])   
                await connection.commit()
            }else{
                await connection.rollback()
            }
        }
        connection.release()
    }catch(e){
        if(typeof connection){
            await connection.rollback()
            connection.release()
        }
        return
    }
}

exports.process_expire_double=process_expire_double