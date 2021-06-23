process.on('uncaughtException', function(err){
  console.log('err uncaught: ',err)
})

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
//var logger = require("morgan");
var session = require("express-session");
var helmet = require("helmet");

var mysql = require("mysql2");
var sqlInfo = require("./config/mysql");
var pool = mysql.createPool(sqlInfo);
var cron = require("node-cron");

var loginRouter = require("./routes/login");
var homeRouter = require("./routes/home");
var searchRouter = require("./routes/search");
var writeRouter = require("./routes/write");
var write_double_agentRouter = require("./routes/write_double_agent");
//var aboutRouter = require("./routes/about");
var change_userinfoRouter = require("./routes/change_userinfo");
var repositoryRouter = require("./routes/repository");
var service_centerRouter = require("./routes/service_center");
//var newsRouter = require("./routes/news");
var viewResultsRouter = require("./routes/view_results");
var app = express();
var Cache = require("./router_function/CacheModule");
var Cron = require("./router_function/Cronjob");

//==========================================
// view engine setup
app.set("views", path.join(__dirname, "/dist/views"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use(express.static(path.join(__dirname, "dist")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    key: "sdfsdf@sfnnni@",
    httpOnly: true,
    //secure:true, httpsdptj
    secret: "esdfag38@adsjdnuwn@",
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: true },
  })
);
//app.use(helmet())
//app.use(Cache.Chack_login_middleware)

//---------
//router react ex
app.use("/", express.static(path.resolve(__dirname, "/dist/static")));
//app.get("/login", (req,res)=>{
//    res.render()
//})
app.get("*", (req, res, next) => {
  console.log("dur: ", __dirname);
  res.render("index.html");
  //res.sendFile(path.resolve(__dirname,'/dist/index.html'));
});

//----------

app.use("/login", loginRouter);
app.use("/homepage", homeRouter);
app.use("/search", searchRouter);
app.use("/write", writeRouter);
app.use("/write_double_agent", write_double_agentRouter);
//app.use("/about", aboutRouter);
app.use("/change_userinfo", change_userinfoRouter);
app.use("/repository", repositoryRouter);
app.use("/service_center", service_centerRouter);
//app.use("/news", newsRouter);
app.use("/view_results", viewResultsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log(req.url);
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  console.log("app console: ", err);
  res.status(err.status || 500);
  res.render("error");
});



//10분   후속 자동 등록
cron.schedule("*/8 * * * *", () => {
  pool.execute( SelectSecondDouble(), function (err, rows, field) {
    if (!err) {
      if (rows.length >= 1) Cron.process_expire_double(rows);
    }
  });
});

function SelectSecondDouble() { //수정 사항
  return `SELECT sub.*, d.content_category AS category,d.content_place AS place,d.content_du_date AS du_date,d.content_cost AS cost,
    c.content_case_num AS case_num, c.content_party_name AS party_name,c.content_party_position AS party_position,c.content_oponent AS oponent
    ,c.content_else, c.content_memo AS memo  
    FROM(
      SELECT alarm_num AS num, req_user_num AS user FROM content_alarm_preshow WHERE expire_date<NOW()
    ) AS sub STRAIGHT_JOIN content_double_second_preshow AS d ON sub.num=d.alarm_num STRAIGHT_JOIN content_double_second_details AS c ON sub.num=c.alarm_num;`;
};

module.exports = app;
