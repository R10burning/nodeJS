
//连接池模块---因为node.js机制,每一个模块都是"单例"
//多次require()不会创建多个
const mysql = require("mysql");
let pool = mysql.createPool({
   host:"127.0.0.1",
   user:"root",
   password:"",
   database:"mysql",
   port:3306,
   connectionLimit:5
});
module.exports = pool;