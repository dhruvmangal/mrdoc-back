var express = require('express');
var router = express.Router();
var auth = require('./auth');
const jwt = require('jsonwebtoken');
var calander = require('./calander');
var doctor = require('./doctor');
var category = require('./category');
var request = require('./request');
var notification = require('./notification');
var drugs = require('./drugs');
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
    let sql = "SELECT * FROM mr WHERE id='"+req.body.id+"'";
    console.log(sql);
	connection.query(sql, function (err, rows, fields) {
        res.json(rows);
    })
});

router.put('/', authenticateJWT, function(req, res){
    let sql = "UPDATE mr SET";
    let no=0;
    if(req.body.name){
        if(no>0)
            sql+=" , ";
        sql+=" name = '"+req.body.name+"' ";
        no++;
    }
    if(req.body.phone){
        if(no>0)
            sql+=" , ";
        sql+=" phone = '"+req.body.phone+"' ";
        no++;
    }
    if(req.body.email){
        if(no>0)
            sql+=" , ";
        sql+=" email = '"+req.body.email+"' ";
        no++;
    }
    if(req.body.password){
        if(no>0)
            sql+=" , ";
        sql+=" password = '"+req.body.password+"' ";
        no++;
    }
    if(req.body.status){
        if(no>0)
            sql+=" , ";
        sql+=" status = '"+req.body.status+"' ";
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
	if(req.body.password){
        if(no>0)
            sql+=" , ";
        sql+=" state = '"+req.body.state+"' ";
        no++;
    }
    sql+=" WHERE id= '"+req.body.id+"' ";
    connection.query( sql, function(err, result){
        if(err) throw err;
        res.json({
            flag: true,
            message: result.message,
            affectedRows: result.affectedRows
        });
    })

});


router.use('/auth', auth);
router.use('/calander', calander);
router.use('/doctor', doctor);
router.use('/category', category);
router.use('/request', request);
router.use('/notification', notification);
router.use('/drugs', drugs);

module.exports = router;
