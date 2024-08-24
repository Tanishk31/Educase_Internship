const mysql = require("mysql2/promise");

const mysqlPool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Tanishk@31#",
    database: "School_Info"
})

    
module.exports  = mysqlPool;
