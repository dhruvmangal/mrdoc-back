var express = require('express');
var router = express.Router();
var auth = require('./auth');
const jwt = require('jsonwebtoken');
var connection = require('../../db');
var calendar = require('./calendar');
var notification = require('./notification');
var mr = require('./mr');
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
    var sql = "SELECT * FROM doctor";
    connection.query(sql, function (err, rows, fields) {
        res.json(rows);
    })
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

router.use('/auth', auth);
router.use('/calendar', calendar);
router.use('/mr', mr);
router.use('/notification', notification);
module.exports = router;

