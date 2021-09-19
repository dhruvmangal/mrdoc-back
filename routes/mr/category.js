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
	let sql = "SELECT * FROM category";
	connection.query(sql, function (err, rows, fields) {
		if(err) throw err;
		rows.filter( (row)=>{
			delete row.description;
			delete row.status;
			delete row.time;
			delete row.date;
			return row
		});
		res.json(rows);	
	});
})

module.exports = router;