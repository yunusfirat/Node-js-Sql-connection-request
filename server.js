const express = require("express");
const app = express();
const dotenv = require('dotenv');
const { Pool } = require('pg');
  
dotenv.config();
// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
// Add new booking
app.post("/bookings", (req, res) => {
    // let name = req.body.name;
    // let checkindate = request.body.checkindate;
    let sql ="INSERT INTO bookings (id,customer_id,hotel_id,checkin_date,nights) VALUES ('10','1','2','2020-02-02','12')";
    pool.query(sql, (error, result) => {
        if(error) throw error;
        res.json(result.rows);
    });
});
//  delete booking
app.delete("/booking/:id", (req,res) => {
    let sql = `DELETE FROM bookings where ${req.params.id} = bookings.id`;
    pool.query(sql, (err,result) => {
        if(err) throw err;
        res.send("item has been deleted.")
    })
})

// update booking
app.put("/booking/:id", (req,res) => {
    let body = req.body;
    let sql = `UPDATE bookings
               SET nights=${body.nights},
               customer_id=${body.customer_id},
               checkin_date=CAST('${body.checkin_date}' AS DATE)
               WHERE ${req.params.id} = bookings.id`
    pool.query(sql, (err,result) => {
        if(err) throw err;
        res.send("item has been updated.")
        console.log(result);
    })
})

app.listen(5000, function() {
    console.log("Server is listening on port 5000. Ready to accept requests!");
});