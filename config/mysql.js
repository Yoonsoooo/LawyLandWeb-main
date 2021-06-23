var mysql = {
  //for gcp

  //user:'root',
  //password:'F7kdrtqe2hpc0p59',
  //database:'test_db',
  //socketPath: `/cloudsql/lawyland-test-ver1:asia-northeast3:test-ver1`

  //for local
  user: "root",
  password: "zaxsdc1234@",
  database: "test_db",
  host: "192.168.1.8",
  //host: "192.168.0.14",
  port: "3306",
  connectionLimit: 10,
};
module.exports = mysql;
