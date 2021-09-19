var express = require('express');
var router = express.Router();
var moment = require('moment');
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
	let sql = "INSERT INTO calander (mr_id, title, description, meeting_time, meeting_date, meeting_status, status, time, date) VALUES( '"+req.body.id+"', '"+req.body.val.key+"', '"+req.body.val.description+"', '"+req.body.val.time+"', '"+req.body.val.dates+"', 'scheduled', '1', '"+time+"', '"+date+"')";
	connection.query(sql, function (err, result) {
        if(err) throw err;
		console.log(result.insertId);
        res.locals.result ={
            flag: true,
            id: result.insertId,
			time: time,
			date: date
        };
		next();
	});
	
	
}, function(req, res, next){
	let status = "scheduled";	
	let message = req.body.val.description;
	let sql = "INSERT INTO calander_status (calander_id, status, message, time, date) VALUES('"+res.locals.result.id+"', '"+status+"', '"+message+"', '"+res.locals.result.time+"', '"+res.locals.result.date+"')";
	connection.query(sql, function (err, result) {
        if(err) throw err;
        res.json({
            flag: true,
            id: result.insertId,
			
        });
    });
	
});

router.get('/', authenticateJWT, function(req, res){
	let sql = "SELECT * FROM calander";
	let n= 0;
	sql+=" WHERE ";
	if(req.body.id){
		if(n>0)
			sql+=" AND ";	
		sql+= "mr_id = "+req.body.id+" ";
		
		n++;
	}
	if(req.query.date){
		if(n>0)
			sql+=" AND ";
		sql+= "meeting_date BETWEEN '"+req.query.date+"' AND '"+req.query.date+"' ";
		
		n++;
	}
	connection.query(sql, function (err, rows, fields) {
        if(err)
			throw err;
		rows.map((row)=>{
			row.key = row.title;
			row.dates = moment(row.meeting_date).format("YYYY/MM/DD");
			return row;
		})
		
		rows.filter( (row)=>{
			delete row.mr_id;
			delete row.time;
			delete row.title
			return row
		});
		
		res.json(rows);
    })	
	
});
//gets previous meetings 
router.get('/prev', authenticateJWT, function(req, res){
	let sql = "SELECT * FROM calander";
	let n= 0;
	sql+=" WHERE ";
	if(req.body.id){
		if(n>0)
			sql+=" AND ";	
		sql+= "mr_id = "+req.body.id+" ";
		
		n++;
	}
	if(req.query.date){
		if(n>0)
			sql+=" AND ";
		sql+= "meeting_date < '"+req.query.date+"'";
		
		n++;
	}
	connection.query(sql, function (err, rows, fields) {
        if(err)
			throw err;
		rows.map((row)=>{
			row.key = row.title;
			row.dates = moment(row.meeting_date).format("YYYY/MM/DD");
			return row;
		})
		
		rows.filter( (row)=>{
			delete row.mr_id;
			delete row.time;
			delete row.title
			return row
		});
		
		res.json(rows);
    })	
	
});

//get upcoming meetings

//gets previous meetings 
router.get('/upcoming', authenticateJWT, function(req, res){
	let sql = "SELECT * FROM calander";
	let n= 0;
	sql+=" WHERE ";
	if(req.body.id){
		if(n>0)
			sql+=" AND ";	
		sql+= "mr_id = "+req.body.id+" ";
		
		n++;
	}
	if(req.query.date){
		if(n>0)
			sql+=" AND ";
		sql+= "meeting_date > '"+req.query.date+"'";
		
		n++;
	}
	connection.query(sql, function (err, rows, fields) {
        if(err)
			throw err;
		rows.map((row)=>{
			row.key = row.title;
			row.dates = moment(row.meeting_date).format("YYYY/MM/DD");
			return row;
		})
		
		rows.filter( (row)=>{
			delete row.mr_id;
			delete row.time;
			delete row.title
			return row
		});
		
		res.json(rows);
    })	
	
});


router.get('/:id', authenticateJWT, function(req, res){
	let sql = "SELECT * FROM calander where id = '"+req.params.id+"'";
	connection.query(sql, function (err, rows, fields) {
		res.json(rows);	
	});
	
});

router.delete('/:id', authenticateJWT, function(req, res){
	let sql="DELETE FROM calander where id = '"+req.params.id+"'";
	connection.query( sql, function(err, result){
        if(err) throw err;
        res.json({
            flag: true,
            message: result.message,
            affectedRows: result.affectedRows
        });
    })
});

router.put('/:id', authenticateJWT, function(req, res){
	let sql = "UPDATE calander SET";
	let n=0;
	if(req.body.val.date){
		let date  = moment(req.body.val.date).format("YYYY-MM-DD");
		if(n>0)
			sql+=" , ";
		sql+=" meeting_date = '"+date+"' ";
		n++;
	}
	if(req.body.val.time){
		if(n>0)
			sql+=" , ";
		sql+=" meeting_time = '"+req.body.val.time+"' ";
		n++;
	}
	if(req.body.val.title){
		if(n>0)
			sql+=" , ";
		sql+=" title = "+JSON.stringify(req.body.val.title)+" ";
		n++;
	}
	if(req.body.val.description){
		if(n>0)
			sql+=" , ";
		sql+=" description = '"+req.body.val.description+"' ";
		n++;
	}
	sql+=" WHERE id = '"+req.params.id+"' ";
	console.log(sql);
	connection.query( sql, function(err, result){
        if(err) throw err;
        res.json({
            flag: true,
            message: result.message,
            affectedRows: result.affectedRows
        });
    })
})

router.post('/status/:id', authenticateJWT, function(req, res, next){
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
	
	let sql = "INSERT INTO calander_status (calander_id, status, message, time, date) VALUES('"+req.params.id+"', '"+req.body.status+"', '"+req.body.message+"', '"+time+"', '"+date+"')";
	connection.query(sql, function (err, result) {
        if(err) throw err;
        res.locals.result={
            flag: true,
            id: result.insertId
        };
    });
	
	next();
}, function(req, res, next){
	let sql= "UPDATE calander SET meeting_status='"+req.body.status+"' WHERE id='"+req.params.id+"'"; 
	connection.query(sql, function (err, result) {
        if(err) throw err;
        res.json({
            flag: true,
            message: result.message,
			id: res.locals.result.id
        });
    });
});

router.get('/status/:id', authenticateJWT, function(req, res){
	let sql ="SELECT * FROM calander_status where calander_id ='"+req.params.id+"' ";
	connection.query(sql, function (err, rows, fields) {
		if(err) throw err;
		res.json(rows);	
	});
});




module.exports = router;