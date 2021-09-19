var mysql = require('mysql')
const { connect } = require('./routes')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mrdoc'
})


connection.connect()

module.exports = connection;