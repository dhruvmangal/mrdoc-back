var express = require('express');
var router = express.Router();
var auth = require('./auth');
var connection = require('../../db');

const accessTokenSecret = 'youraccesstokensecret';

const authenticateJWT = (req, res, next) => {

    const authHeader = req.headers.token;
    //console.log(authHeader);
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        //console.log(token);
        const decodedToken = jwt.decode(authHeader, {
            complete: true
        });
        console.log(decodedToken);
        req.body.id= decodedToken.payload.username;
        //console.log(req.body.id);
        if(req.body.id)
            next();
        else   
            res.send(500);
    }
};

router.get('/', authenticateJWT,function(){
    let sql = "SELECT * FROM company";
    connection.query(sql, function (err, rows, fields) {
        res.json(rows);
    });    
});

router.put('/', function(){
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
})

module.exports = router;