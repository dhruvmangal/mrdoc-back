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


router.get('/', authenticateJWT,function(req, res){
    let sql = "SELECT * FROM mr where company_id = '"+req.body.id+"'";
    connection.query(sql, function (err, rows, fields) {
        res.json(rows);
    });    
});

router.get('/:id', authenticateJWT, function(req, res){
	let sql = "SELECT * FROM mr where company_id = '"+req.body.id+"' and id= '"+req.params.id+"'";
    connection.query(sql, function (err, rows, fields) {
        res.json(rows);
    });
});

router.post('/', authenticateJWT, function(req, res){
	const { name, company_id, phone, email, password, status } = req.body;
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
    var sql= "INSERT INTO mr (name, company_id, phone, email, password, status, time, date) VALUES('"+name+"', '"+company_id+"','"+phone+"', '"+email+"', '"+password+"', '1','"+time+"', '"+date+"')";
    
    connection.query(sql, function (err, result) {
        if(err) throw err;
        res.json({
            flag: true,
            id: result.insertId
        });
    });
})

module.exports = router;