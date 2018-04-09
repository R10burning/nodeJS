//1:加载对应模块
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");        //处理post请求
const cookieParser = require("cookie-parser");    //session
const expressSession = require("express-session");//session
const cors = require("cors");                      //cors
const pool = require("./pool");
//导入加密模块
const crypto = require("crypto");
//2:引用连接池
//3:创建express 对象
var app = express();
var server = http.createServer(app);
server.listen(3000);
app.use(cors({
  origin:["http://127.0.0.1"],
  credentials:true
}));
//4.2:post  req.body.uname
app.use(bodyParser.urlencoded({extended:false}));
//4.3:cookie/session
app.use(cookieParser());
app.use(expressSession({
  resave:false,           //每次请求是否重新设置session
  saveUninitialized:true,//每次请求是否设置cookie
  secret:"teducn",       //https加密码传输，密钥
}));
//5:指定静态资源目录  public
app.get("/index",(req,res)=>{
  let login_name = req.query.name;
  let pwd = req.query.pwd;
  let md5 = crypto.createHash("md5");
  let newPas = md5.update(pwd).digest("hex");
  pool.getConnection((err,conn)=>{
    if(err)throw err;
    //4:创建sql语句并且发送sql获取返回结果
    var sql = " SELECT name FROM sys_user";
    sql +=    " WHERE  login_name= ? AND password=?";
    conn.query(sql,[login_name,newPas],(err,result)=>{
        if(err)throw err;
        if(result.length>0){
           //获取uid值,保存session
           req.session.name = result[0].name;
          //  res.json({code:1,msg:"登录成功"});
          res.jsonp({code:10000,data:result[0].name});
        }else{
           res.jsonp({code:-3,msg:"用户名或密码有误"});
        }
        conn.release();
    });
    //5:返回 json
    //6如果登录保存 uid session
});
})