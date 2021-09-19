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

router.post('/', authenticateJWT, function(req, res, next){
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
	
	let sql = "INSERT INTO request_meeting (mr_id, doctor_id, requested_by, request_status, message, status, time, date) VALUES('"+req.body.id+"', '"+req.body.doctor_id+"', 'MR', 'PENDING', '"+req.body.message+"', '1', '"+time+"', '"+date+"')";
	
	connection.query(sql, function (err, result) {
        if(err) throw err;
        console.log(result.insertId);
		res.locals.result={
            flag: true,
            id: result.insertId,
			date: date,
			time: time
        };
		next();
    });
	
}, function(req, res, next){
	let message="You requested a meeting at  "+res.locals.result.time+", "+res.locals.result.date+"";
	let sql ="INSERT INTO notification_mr(mr_id, message, status, time, date) VALUES('"+req.body.id+"', '"+message+"', '0', '"+res.locals.result.time+"', '"+res.locals.result.date+"')";
	connection.query(sql, function (err, result) {
        if(err) throw err;
        res.locals.result={
            flag: true,
            id: result.insertId
        };
    });
	next();
}, function(req, res){
	let message="You were requested a meeting at "+res.locals.result.time+", "+res.locals.result.date+"";
	let sql ="INSERT INTO notification_dr(doctor_id, message, status, time, date) VALUES('"+req.body.id+"', '"+message+"', '0', '"+res.locals.result.time+"', '"+res.locals.result.date+"')";
	connection.query(sql, function (err, result) {
        if(err) throw err;
        res.json({
            flag: true,
            id: result.insertId
        });
    });
});

module.exports = router;