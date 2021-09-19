var express = require('express');
var router = express.Router();

var connection = require('../../db');
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';
const multer  = require('multer');

var storage = multer.diskStorage({
	destination: (req, res, cb)=>{
		
		cb(null, './uploads');
	},
	filename: (req, file, cb)=>{
		cb(null, file.fieldname+'-'+Date.now()+ file.originalname);
	}
})

const upload = multer({ storage: storage}).array('files', 10);

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

router.post('/', authenticateJWT, function(req, res){
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
	
	let sql = "INSERT INTO drugs (mr_id, name, description, status, time, date) VALUES('"+req.body.id+"', '"+req.body.name+"', '"+req.body.description+"', '1', '"+time+"', '"+date+"')";
	connection.query(sql, function (err, result) {
        if(err) throw err;
        res.json({
            flag: true,
            id: result.insertId,
			
        });
    });
});

router.post('/image/:id', authenticateJWT, function(req, res){
	upload(req, res, function(err){
		if(err) {  
			console.log(err);
            return res.end("Error uploading file.");  
        }else{
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
			
			var sql = "INSERT INTO drugs_image (drug_id, image, status, time, date) VALUES('"+req.params.id+"', '"+req.files[0].filename+"', '1', '"+time+"', '"+date+"')";	
			
		}
		console.log(req.files[0]);
		connection.query(sql, function (err, result) {
			if(err) throw err;
			res.json({
				flag: true,
				id: result.insertId
			});
		});
		
	})
	/*
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
	
	var sql = "INSERT INTO drugs_image (drug_id, image, status, time, date) VALUES('"+req.params.id+"', '"+req.files[0].path+"', '1', '"+time+"', '"+date+"')";
	
	for(let i = 0; i<files.length; i++){
		if(i>0){
			sql+=",('"+req.params.id+"', '"+req.files[i].fieldname+'-'+Date.now()+"', '1', '"+time+"', '"+date+"')"
		}else{
			sql+="('"+req.params.id+"', '"+req.files[i].fieldname+'-'+Date.now()+"', '1', '"+time+"', '"+date+"')"
		}
		console.log(i);
	}
	
	console.log(sql);
	res.json({'a':'a'})
	
	connection.query(sql, function (err, result) {
        if(err) throw err;
        res.json.result;
    });
	
	*/
})

router.post('/details/:id', authenticateJWT, function(req, res){
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
	
	let sql = "INSERT INTO drugs_details (drug_id, details_question, details_answer, status, time, date) VALUES('"+req.params.id+"', '"+req.body.title+"', '"+req.body.description+"', '1', '"+time+"', '"+date+"')";
	connection.query(sql, function (err, result) {
        if(err) throw err;
        res.json({
			flag: true,
            message: result.message,
            affectedRows: result.affectedRows
		});
    });
});

router.get('/', authenticateJWT, function(req, res){
	let sql = "SELECT * FROM drugs WHERE mr_id = '"+req.body.id+"'";
	console.log(sql);
	connection.query(sql, function (err, rows, fields) {
		if(err) throw err;
		rows.filter( (row)=>{
			return row
		});
		res.json(rows);	
	});
})

router.put('/:id', authenticateJWT, function(req, res){
	let sql = "UPDATE drugs SET name='"+req.body.title+"', description='"+req.body.description+"' WHERE id = '"+req.params.id+"'";
	console.log(sql);
	connection.query(sql, function (err, rows, fields) {
		if(err) throw err;
		if(err) throw err;
        res.json({
            flag: true
        });	
	});
})

router.get('/:id', authenticateJWT, function(req, res){
	let sql = "SELECT * FROM drugs WHERE id = '"+req.params.id+"' ";
	console.log(sql);
	connection.query(sql, function (err, rows, fields) {
		if(err) throw err;
		rows.filter( (row)=>{
			return row
		});
		res.json(rows);	
	});
})

router.get('/details/:id', authenticateJWT, function(req, res){
	let sql= "SELECT * FROM drugs_details WHERE drug_id="+req.params.id+"";
	connection.query(sql, function (err, rows, fields) {
		if(err) throw err;
		rows.filter( (row)=>{
			return row
		});
		res.json(rows);	
	});
})

router.get('/image/:id', authenticateJWT, function(req, res){
	let sql= "SELECT * FROM drugs_image WHERE drug_id="+req.params.id+"";
	connection.query(sql, function (err, rows, fields) {
		if(err) throw err;
		rows.filter( (row)=>{
			return row
		});
		res.json(rows);	
	});
});

router.delete('/details/:id', authenticateJWT, function(req, res){
	let sql = "DELETE FROM drugs_details WHERE id="+req.params.id+"";
	connection.query(sql, function (err, result) {
        if(err) throw err;
        res.json({
            flag: true
        });
    });
})

router.delete('/image/:id', authenticateJWT, function(req, res){
	let sql = "DELETE FROM drugs_image WHERE id="+req.params.id+"";
	connection.query(sql, function (err, result) {
        if(err) throw err;
        res.json({
            flag: true
        });
    });
})
module.exports = router;