const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQLHOST || 'viaduct.proxy.rlwy.net',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'BfTxkYZDvtJElLYDbXeWuuIlkuzatZOG',
  database: process.env.MYSQLDATABASE || 'railway',
  port: process.env.MYSQLPORT || 43790
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database as ID', connection.threadId);
    connection.release();
  }
});

module.exports = pool;
