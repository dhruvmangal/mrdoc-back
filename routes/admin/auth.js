var express = require('express');
var router = express.Router();

var connection = require('../../db');
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';

router.post('/login', function(req, res){
    const {username, password} = req.body;
    var sql = "SELECT id FROM admin where phone= '"+username+"' AND password='"+ password+"'";
    
    connection.query(sql, function (err, rows, fields) {

        //console.log(rows.length);
        if( rows.length==1 ){
            const accessToken = jwt.sign({ username: rows[0].id,  role: 'admin' }, accessTokenSecret);
            res.json({
                accessToken
            })
        }else{
            res.send("Username or password is wrong");
        }
    });

})

router.post('/register', function(req, res){
    const { name, phone, email, password } = req.body;
    Date.prototype.yyyymmdd = function() {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();
      
        return [this.getFullYear(),
                '-',
                (mm>9 ? '' : '0') + mm,
                '-',
                (dd>9 ? '' : '0') + dd
               ].join('');
      };
    var d = new Date();
    var time = d.toLocaleTimeString('en-US', { hour12: false });
    var date = d.yyyymmdd();
    var sql= "INSERT INTO admin (name, phone, email, password, create_time, create_date) VALUES('"+name+"', '"+phone+"', '"+email+"', '"+password+"', '"+date+"', '"+time+"')";
    console.log(sql);
    connection.query(sql, function (err, result) {
        if(err) throw err;
        res.json({
            flag: true,
            id: result.insertId
        });
    });
});

module.exports = router;

