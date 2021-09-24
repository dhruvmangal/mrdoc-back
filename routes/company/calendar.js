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


router.get('/', authenticateJWT, function(req, res){
	let sql = "SELECT * FROM calander INNER JOIN mr on mr.id = calander.id WHERE mr.company_id = company.id";
	let n= 0;
	sql+=" WHERE ";
	if(req.body.id){
		if(n>0)
			sql+=" AND ";	
		sql+= "company_id = "+req.body.id+" ";
		
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

module.exports = router;


