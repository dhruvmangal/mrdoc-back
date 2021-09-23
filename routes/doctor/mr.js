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
        next();
    }else{
		console.log('authHeader not found');
		res.send(500);
	}
};


router.get('/', authenticateJWT, function(req, res){
	let sql = "SELECT mr.id, mr.name, mr.company, mr.city, favorite.id AS favorite FROM mr LEFT JOIN (SELECT id, doctor_id, mr_id FROM mr_favorite WHERE doctor_id="+req.body.id+") AS favorite ON favorite.mr_id = mr.id";
	let n=0;
	if(req.query.filter){
		sql+=" WHERE ";
		let filter = JSON.parse(req.query.filter);
		
		if(filter.name){
			if(n>0)
				sql+=" AND ";
			sql+=" mr.name LIKE '%"+filter.name+"%' ";
			n++;
		}
	
	}
	console.log(sql)
	connection.query(sql, function (err, rows, fields) {
		res.json(rows);	
	});
})

//get favorites

router.get('/favorite', authenticateJWT, function(req, res){
	let sql = "SELECT mr.id, mr.name, mr.company, mr.city, favorite.id AS favorite FROM mr INNER JOIN (SELECT id, doctor_id, mr_id FROM mr_favorite WHERE doctor_id="+req.body.id+") AS favorite ON favorite.mr_id = mr.id";
	let n=0;
	if(req.query.filter){
		sql+=" WHERE ";
		let filter = JSON.parse(req.query.filter);
		
		if(filter.name){
			if(n>0)
				sql+=" AND ";
			sql+=" mr.name LIKE '%"+filter.name+"%' ";
			n++;
		}
	
	}
	connection.query(sql, function (err, rows, fields) {
		res.json(rows);	
	});
})


//get single mr
router.get('/:id', authenticateJWT, function(req, res){
	let sql = "SELECT mr.id, mr.name, mr.company, mr.state, mr.city, mr.address, favorite.id AS favorite FROM mr LEFT JOIN (SELECT id, doctor_id, mr_id FROM mr_favorite WHERE doctor_id="+req.body.id+") AS favorite ON favorite.mr_id = mr.id WHERE mr.id = '"+req.params.id+"'";
	connection.query(sql, function (err, rows, fields) {
		if(err) throw err;
		res.json(rows);	
	});
});

// get drugs 

router.get('/drugs/:id', authenticateJWT, function(req, res){
	let sql = "SELECT * FROM drugs WHERE mr_id = '"+req.params.id+"'";
	console.log(sql);
	connection.query(sql, function (err, rows, fields) {
		if(err) throw err;
		rows.filter( (row)=>{
			return row
		});
		res.json(rows);	
	});
});

router.get('/drug/:id', authenticateJWT, function(req, res){
	let sql = "select * from drugs where id='"+req.params.id+"' ";
	connection.query(sql, function(err, rows, fields){
		if(err) throw err;
		rows.filter( (row)=>{
			return row;
		});
		res.json(rows);
	})
})

router.get('/drug/image/:id', authenticateJWT, function(req, res){
	let sql= "SELECT * FROM drugs_image WHERE drug_id="+req.params.id+"";
	connection.query(sql, function (err, rows, fields) {
		if(err) throw err;
		rows.filter( (row)=>{
			return row
		});
		res.json(rows);	
	});
});

router.get('/drug/details/:id', authenticateJWT, function(req, res){
	let sql= "SELECT * FROM drugs_details WHERE drug_id="+req.params.id+"";
	connection.query(sql, function (err, rows, fields) {
		if(err) throw err;
		rows.filter( (row)=>{
			return row
		});
		res.json(rows);	
	});
});


router.post('/favorite/:id', authenticateJWT, function(req, res, next){
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
	
	let sql = "SELECT doctor_id, mr_id FROM mr_favorite WHERE mr_id='"+req.params.id+"'  AND doctor_id='"+req.body.id+"'";
	connection.query(sql, function (err, rows, fields) {
		if(err) throw err;
		console.log(rows);
		console.log(req.body);
		if(rows.length==0){
			res.locals.time = time;
			res.locals.date = date;
			next();
			
		}else{
			res.json({
				flag: false,
				message: 'table already exists'
			})
		}
			
			
	});
}, function(req, res){
	
	
	let sql = "INSERT INTO mr_favorite (doctor_id, mr_id, time, date) VALUES('"+req.body.id+"', '"+req.params.id+"', '"+res.locals.time+"', '"+res.locals.date+"')";
	connection.query(sql, function (err, result) {
        if(err) throw err;
        res.json({
            flag: true,
            id: result.insertId
        });
    });
});


router.delete('/favorite/:id', authenticateJWT, function(req, res, next){
	
	let sql = "SELECT doctor_id, mr_id FROM mr_favorite WHERE doctor_id='"+req.body.id+"'  AND mr_id='"+req.params.id+"'";
	console.log(sql);
	connection.query(sql, function (err, rows, fields) {
		if(err) throw err;
		if(rows.length==1){
			next();
			
		}else{
			res.json({
				flag: false,
				message: 'row does not exists'
			})
		}
			
			
	});
}, function(req, res){
	
	let sql = "DELETE FROM mr_favorite WHERE mr_id='"+req.params.id+"' AND doctor_id = '"+req.body.id+"' ";
	connection.query(sql, function (err, result) {
        if(err) throw err;
        res.json({
            flag: true
        });
    });
});
// request meeting 

router.post('/request', authenticateJWT, function(req, res, next){
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
	//console.log(mr_id)
	let sql = "INSERT INTO request_meeting (mr_id, doctor_id, requested_by, request_status, message, status, time, date) VALUES('"+req.body.mr_id+"', '"+req.body.id+"', 'DOCTOR', 'PENDING', '"+req.body.message+"', '1', '"+time+"', '"+date+"')";
	
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
	let message="You were requested a meeting at  "+res.locals.result.time+", "+res.locals.result.date+"";
	let sql ="INSERT INTO notification_mr(mr_id, message, status, time, date) VALUES('"+req.body.mr_id+"', '"+message+"', '0', '"+res.locals.result.time+"', '"+res.locals.result.date+"')";
	connection.query(sql, function (err, result) {
        if(err) throw err;
        res.locals.result={
            flag: true,
            id: result.insertId
        };
    });
	next();
}, function(req, res){
	let message="You requested a meeting at "+res.locals.result.time+", "+res.locals.result.date+"";
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
