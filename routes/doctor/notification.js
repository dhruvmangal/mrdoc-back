var express = require('express');
var router = express.Router();

var connection = require('../../db');
const jwt = require('jsonwebtoken');
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
        console.log(req.body.id);
        next();
    }else{
		console.log('authHeader not found');
		res.send(500);
	}
};

router.get('/', authenticateJWT, function(req, res){
	let sql = "SELECT * FROM notification_dr WHERE doctor_id = '"+req.body.id+"' AND status='0' ORDER BY id DESC LIMIT 10";
	connection.query(sql, function (err, rows, fields) {
		if(err) throw err;
		rows.filter( (row)=>{
			return row
		});
		res.json(rows);	
	});
});

router.put('/', authenticateJWT, function(req, res){
	let sql = "UPDATE notification_dr SET status ='1' WHERE doctor_id='"+req.body.id+"' ";
	connection.query( sql, function(err, result){
        if(err) throw err;
        res.json({
            flag: true,
            message: result.message,
            affectedRows: result.affectedRows
        });
    })
});

module.exports = router;