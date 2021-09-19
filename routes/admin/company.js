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
    let sql = "SELECT * FROM company";
    connection.query(sql, function (err, rows, fields) {
        res.json(rows);
    })
})

router.post('/', authenticateJWT, function(req, res){
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


router.put('/', authenticateJWT, function(req, res){
    let sql = "UPDATE company SET ";
    let n =0;
    if(req.body.company){
        if(n>0)
            sql+=" , ";
        sql+=" company = '"+req.body.company+"'";
    }
    if(req.body.phone){
        if(n>0)
            sql+=" , ";
        sql+=" phone = '"+req.body.phone+"'";
    }
    if(req.body.email){
        if(n>0)
            sql+=" , ";
        sql+=" email = '"+req.body.email+"'";
    }    
    if(req.body.password){
        if(n>0)
            sql+=" , ";
        sql+=" password = '"+req.body.password+"'";
    }
    if(req.body.address){
        if(n>0)
            sql+=" , ";
        sql+=" address = '"+req.body.address+"'";
    }
    if(req.body.city){
        if(n>0)
            sql+=" , ";
        sql+=" city = '"+req.body.city+"'";
    }
    if(req.body.state){
        if(n>0)
            sql+=" , ";
        sql+=" state = '"+req.body.state+"'";
    }
    if(req.body.pincode){
        if(n>0)
            sql+=" , ";
        sql+=" pincode = '"+req.body.pincode+"'";
    }
    if(req.body.status){
        if(n>0)
            sql+=" , ";
        sql+=" status = '"+req.body.status+"'";
    }
    sql+=" WHERE id = '"+req.body.id+"'";
    connection.query( sql, function(err, result){
        if(err) throw err;
        res.json({
            flag: true,
            message: result.message,
            affectedRows: result.affectedRows
        });
    })
});

router.delete('/', authenticateJWT, function(req, res){
    
})
teshi
module.exports = router;
