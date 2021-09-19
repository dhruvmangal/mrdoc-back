var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
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
    let sql = "SELECT * FROM category";
    connection.query(sql, function (err, rows, fields) {
        res.json(rows);
    });
})

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
    
    let sql = "INSERT INTO category (category, description, status, time, date) VALUES ('"+req.body.category+"', '"+req.body.description+"', '1', '"+time+"', '"+date+"')";
    connection.query(sql, function (err, result) {
        if(err) throw err;
        res.json({
            flag: true,
            id: result.insertId
        });
    });  
})

router.put('/', authenticateJWT, function(req, res){
    let sql = "UPDATE category SET";
    let no =0;
    if(req.body.category){
        if(no>0)
            sql+=" , ";
        sql+=" category = '"+req.body.category+"' ";
        no++;
    }
    if(req.body.description){
        if(no>0)
            sql+=" , ";
        sql+=" description = '"+req.body.description+"' ";
        no++;
    }
    if(req.body.status){
        if(no>0)
            sql+=" , ";
        sql+=" status = '"+req.body.status+"' ";
        no++;
    }
    sql+=" WHERE id= '"+req.body.catId+"' ";
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


router.delete('/', authenticateJWT, function(req, res){
    let sql = "DELETE FROM category WHERE id = '"+req.body.catId+"'";
    connection.query( sql, function(err, result){
        if(err) throw err;
        res.json({
            flag: true,
            message: result.message,
            affectedRows: result.affectedRows
        });
    })
})


module.exports = router;
