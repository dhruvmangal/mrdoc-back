var express = require('express');
var router = express.Router();

var connection = require('../../db');
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';

router.post('/login',  function(req, res){
    const {username, password} = req.body;
    var sql = "SELECT id FROM company where phone= '"+username+"' AND password='"+ password+"'";
    connection.query(sql, function (err, rows, fields) {
        if( rows.length==1 ){
            const accessToken = jwt.sign({ username: rows[0].id,  role: 'doctor' }, accessTokenSecret);
            res.json({
                accessToken
            })
        }else{
            res.send("Username or password is wrong");
        }
    })
});


router.post('/register', function(req, res){
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
    let sql = "INSERT INTO company( company, phone, email, password, adddress, city, state, pincode, status, time, date) VALUES('"+req.body.company+"', '"+req.body.phone+"', '"+req.body.email+"', '"+req.body.password+"', '"+req.body.city+"', '"+req.body.state+"', '"+req.body.pincode+"', '"+req.body.status+"', '"+time+"', '"+date+"')"
    connection.query(sql, function (err, result) {
        if(err) throw err;
        res.json({
            flag: true,
            id: result.insertId
        });
    });
});