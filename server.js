const express = require("express");
const app = express();
const dotenv = require('dotenv');
const { Pool } = require('pg');
  
dotenv.config();

;

const pool = new Pool({
    // connect with  connection string
    connectionString:process.env.CONNECTIONSTRING,
    //  or another way
    // user: process.env.USER,
    // host: process.env.HOST,
    // database: process.env.DATABASE,
    // password: process.env.PASSWORD,
    // port: 5432
});

//  get all hotels

app.get("/hotels", function(req, res) {
    pool.query('SELECT * FROM hotels', (error, result) => {
        res.json(result.rows);
    });
});

//  get all bookings
app.get("/bookings", function(req, res) {
    pool.query('SELECT * FROM bookings', (error, result) => {
        res.json(result.rows);

    });
});
//  get single hotel
app.get("/hotel/:id", function (req, res) {
    pool.query(`SELECT * FROM hotels where ${req.params.id} = hotels.id`, (error, result) => {
      res.json(result.rows);
    })
  })

app.post("/bookings", (req, res) => {
    // let name = req.body.name;
    // let checkindate = request.body.checkindate;
    let sql ="INSERT INTO bookings (id,customer_id,hotel_id,checkin_date,nights) VALUES ('10','1','2','2020-02-02','12')";
    pool.query(sql, (error, result) => {
        if(error) throw error;
        res.json(result.rows);
    });
});

app.delete("/booking/:id", (req,res) => {
    let sql = `DELETE FROM bookings where ${req.params.id} = bookings.id`;
    pool.query(sql, (err,result) => {
        if(err) throw err;
        console.log(result);
        res.send("item has been deleted.")
    })
})



app.listen(3000, function() {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});