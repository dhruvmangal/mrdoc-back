var express = require('express');
var router = express.Router();
var auth = require('./auth');
const jwt = require('jsonwebtoken');
var connection = require('../../db');

const authenticateJWT = (req, res, next) => {

    const authHeader = req.headers.token;
    //console.log(authHeader);
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        //console.log(token);
        const decodedToken = jwt.decode(authHeader, {
            complete: true
        });
        req.body.id= decodedToken.payload.username;
        console.log(req.body.id);
        next();
    }
};


router.get('/', authenticateJWT, function(req, res){
    let sql = "SELECT * FROM doctor";
    connection.query(sql, function (err, rows, fields) {
        res.json(rows);
    })

});

router.post('/', authenticateJWT,function(req, res){
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

router.put('/', authenticateJWT, function(req, res){
    let sql = "UPDATE doctor SET";
    let no=0;
    if(req.body.name){
        if(no>0)
            sql+=" , ";
        sql+=" name = '"+req.body.name+"' ";
        no++;
    }
    if(req.body.clinic){
        if(no>0)
            sql+=" , ";
        sql+=" clinic = '"+req.body.clinic+"' ";
        no++;
    }
    if(req.body.name){
        if(no>0)
            sql+=" , ";
        sql+=" phone = '"+req.body.phone+"' ";
        no++;
    }
    if(req.body.password){
        if(no>0)
            sql+=" , ";
        sql+=" password = '"+req.body.password+"' ";
        no++;
    }
    if(req.body.address){
        if(no>0)
            sql+=" , ";
        sql+=" address = '"+req.body.address+"' ";
        no++;
    }
    if(req.body.city){
        if(no>0)
            sql+=" , ";
        sql+=" city = '"+req.body.city+"' ";
        no++;
    }
    if(req.body.state){
        if(no>0)
            sql+=" , ";
        sql+=" state = '"+req.body.state+"' ";
        no++;
    }
    if(req.body.pincode){
        if(no>0)
            sql+=" , ";
        sql+=" pincode = '"+req.body.pincode+"' ";
        no++;
    }
    if(req.body.status){
        if(no>0)
            sql+=" , ";
        sql+=" status = '"+req.body.status+"' ";
        no++;
    }
    sql+=" WHERE id = '"+req.body.id+"'";

    connection.query(sql, function (err, result) {
        if(err) throw err;
        res.json({
            flag: true,
            message: result.message,
            affectedRows: result.affectedRows
        });
    });
});


module.exports = router;
