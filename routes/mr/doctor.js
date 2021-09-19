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
	let sql = "SELECT doctor.id, doctor.name, doctor.clinic,doctor.city, category.category, doctor_profile.profile, favorite.id AS favorite FROM doctor LEFT JOIN doctor_profile ON doctor.id = doctor_profile.doctor_id LEFT JOIN category ON category.id = doctor.category LEFT JOIN (SELECT id, doctor_id, mr_id FROM doctor_favorite WHERE mr_id="+req.body.id+") AS favorite ON favorite.doctor_id = doctor.id";
	let n=0;
	if(req.query.filter){
		sql+=" WHERE ";
		let filter = JSON.parse(req.query.filter);
		if(filter.category){
			if(n>0)
				sql+=" AND ";
			sql+=" doctor.category in ("+filter.category+") ";
			n++;
		}
		if(filter.name){
			if(n>0)
				sql+=" AND ";
			sql+=" doctor.name LIKE '%"+filter.name+"%' ";
			n++;
		}
	
	}
	connection.query(sql, function (err, rows, fields) {
		res.json(rows);	
	});
})

//get favorites

router.get('/favorite', authenticateJWT, function(req, res){
	let sql = "SELECT doctor.id, doctor.name, doctor.clinic,doctor.city, category.category, doctor_profile.profile, favorite.id AS favorite FROM doctor LEFT JOIN doctor_profile ON doctor.id = doctor_profile.doctor_id LEFT JOIN category ON category.id = doctor.category INNER JOIN (SELECT id, doctor_id, mr_id FROM doctor_favorite WHERE mr_id="+req.body.id+") AS favorite ON favorite.doctor_id = doctor.id";
	let n=0;
	if(req.query.filter){
		sql+=" WHERE ";
		let filter = JSON.parse(req.query.filter);
		if(filter.category){
			if(n>0)
				sql+=" AND ";
			sql+=" doctor.category in ("+filter.category+") ";
			n++;
		}
		if(filter.name){
			if(n>0)
				sql+=" AND ";
			sql+=" doctor.name LIKE '%"+filter.name+"%' ";
			n++;
		}
	
	}
	connection.query(sql, function (err, rows, fields) {
		res.json(rows);	
	});
})

//fovorite add and delete
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
	
	let sql = "SELECT doctor_id, mr_id FROM doctor_favorite WHERE doctor_id='"+req.params.id+"'  AND mr_id='"+req.body.id+"'";
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
	
	
	let sql = "INSERT INTO doctor_favorite (doctor_id, mr_id, time, date) VALUES('"+req.params.id+"', '"+req.body.id+"', '"+res.locals.time+"', '"+res.locals.date+"')";
	connection.query(sql, function (err, result) {
        if(err) throw err;
        res.json({
            flag: true,
            id: result.insertId
        });
    });
});



router.delete('/favorite/:id', authenticateJWT, function(req, res, next){
	
	let sql = "SELECT doctor_id, mr_id FROM doctor_favorite WHERE doctor_id='"+req.params.id+"'  AND mr_id='"+req.body.id+"'";
	connection.query(sql, function (err, rows, fields) {
		if(err) throw err;
		console.log(rows);
		console.log(req.body);
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
	
	let sql = "DELETE FROM doctor_favorite WHERE mr_id='"+req.body.id+"' AND doctor_id = '"+req.params.id+"' ";
	connection.query(sql, function (err, result) {
        if(err) throw err;
        res.json({
            flag: true
        });
    });
});

router.get('/:id', authenticateJWT, function(req, res){
	let sql = "SELECT doctor.id, doctor.name, doctor.clinic, doctor.state, doctor.city, doctor.address, category.category, doctor_profile.profile, favorite.id AS favorite FROM doctor LEFT JOIN doctor_profile ON doctor.id = doctor_profile.doctor_id LEFT JOIN category ON category.id = doctor.category LEFT JOIN (SELECT id, doctor_id, mr_id FROM doctor_favorite WHERE mr_id="+req.body.id+") AS favorite ON favorite.doctor_id = doctor.id WHERE doctor.id = '"+req.params.id+"'";
	connection.query(sql, function (err, rows, fields) {
		if(err) throw err;
		res.json(rows);	
	});
})


module.exports = router;
