var express = require('express');
var router = express.Router();

var connection = require('../../db');
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';

router.post('/login',  function(req, res){
    const {username, password} = req.body;
    var sql = "SELECT id FROM doctor where phone= '"+username+"' AND password='"+ password+"'";
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
    const { name, clinic, phone, email, password, address, city, state, pincode } = req.body;
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
    var sql= "INSERT INTO doctor (name, clinic, phone, email, password, address, city, state, pincode, status, time, date) VALUES('"+name+"', '"+clinic+"', '"+phone+"', '"+email+"', '"+password+"', '"+address+"', '"+city+"', '"+state+"', '"+pincode+"', 'true','"+time+"', '"+date+"')";
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
