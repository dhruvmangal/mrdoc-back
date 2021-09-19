var express = require('express');
var router = express.Router();
var auth = require('./auth');
var category = require('./category');
const jwt = require('jsonwebtoken');
var connection = require('../../db');
var cors = require('cors')

router.use(cors());


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
        req.body.id= decodedToken.payload.username;
        //console.log(req.body.id);
        if(req.body.id)
            next();
        else   
            res.send(500);
    }else{
		res.send(500);
	}
};

router.get('/', authenticateJWT ,function(req, res, next) {
    let sql = "SELECT * FROM admin";
    connection.query(sql, function (err, rows, fields) {
        res.json(rows);
    }) 
});

router.get('/profile', authenticateJWT ,function(req, res, next) {
    let sql = "SELECT * FROM admin WHERE id = '"+req.body.id+"' ";
    connection.query(sql, function (err, rows, fields) {
        res.json(rows);
    }) 
});


router.put('/', authenticateJWT, function(req, res){
    let sql = "UPDATE admin SET";
    let n= 0;
    if(req.body.name){
        if(n>0)
            sql+=" , ";
        sql+=" name = '"+req.body.name+"'";
        n++;
    }
    if(req.body.phone){
        if(n>0)
            sql+=" , ";
        sql+=" phone = '"+req.body.phone+"'";
        n++;
    }
    if(req.body.email){
        if(n>0)
            sql+=" , ";
        sql+=" email = '"+req.body.email+"'";
        n++;
    }
    if(req.body.password){
        if(n>0)
            sql+=" , ";
        sql+=" password = '"+req.body.password+"'";
        n++;
    }
    if(req.body.status){
        if(n>0)
            sql+=" , ";
        sql+=" status = '"+req.body.status+"'";
        n++;
    }
    sql+=" WHERE id = '"+req.body.id+"' ";

    connection.query( sql, function(err, result){
        if(err) throw err;
        res.json({
            flag: true,
            message: result.message,
            affectedRows: result.affectedRows
        });
    })
})
router.use('/auth', auth);
router.use('/category', category);
module.exports = router;
