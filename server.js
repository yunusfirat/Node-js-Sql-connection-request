const express = require("express");
const app = express();
const dotenv = require('dotenv');
const { Pool } = require('pg');
const validator = require('validator');

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
        if(error) throw error;
        res.json(result.rows);
    });
});
 
//  get all bookings
app.get("/bookings", function(req, res) {
    pool.query('SELECT * FROM bookings', (error, result) => {
        if(error) throw error;
        res.json(result.rows);

    });
});
//  get single hotel
app.get("/hotel/:id", function (req, res) {
    // let sql = "select * from hotels where id $1",[req.params.hotel_id]
    pool.query("select * from hotels where hotels.id=$1", [req.params.id], (error, result) => {
        if(error){ res.send(JSON.stringify(error))};
      res.json(result.rows);
    })
  })

//    add new hotel
  app.post("/hotels", function (req, res) {
    const newHotelName = req.body.name;
    const newHotelRooms = req.body.rooms;
    const newHotelPostcode = req.body.postcode;
  
    if (!Number.isInteger(newHotelRooms) || newHotelRooms <= 0) {
      return res
        .status(400)
        .send("The number of rooms should be a positive integer.");
    }
  
    pool
      .query("SELECT * FROM hotels WHERE name=$1", [newHotelName])
      .then((result) => {
        if (result.rows.length > 0) {
          return res
            .status(400)
            .send("An hotel with the same name already exists!");
        } else {
          const query =
            "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3)";
          pool
            .query(query, [newHotelName, newHotelRooms, newHotelPostcode])
            .then(() => res.send("Hotel created!"))
            .catch((e) => console.error(e));
        }
      });
  });


  
// add new customer 
app.post("/customers", function (req, res) {
    const newCustomerName = req.body.name;
    const newCustomerEmail = req.body.email;
    const newCustomerAddress = req.body.address;
    const newCustomerCity = req.body.city;
    const newCustomerPostcode = req.body.postcode;
    const newCustomerCountry = req.body.country;
    if (!typeof newCustomerName === "string") {
      return res
        .status(400)
        .send("The name must be unique");
    }
  
    pool
      .query("SELECT * FROM customers WHERE name=$1", [newCustomerName])
      .then((result) => {
        if (result.rows.length > 0) {
          return res
            .status(400)
            .send("A customer with the same name already exists!");
        } else {
          const query =
            "INSERT INTO customers (name, email, address,city, postcode, country) VALUES ($1, $2, $3, $4, $5, $6)";
          pool
            .query(query, [newCustomerName, newCustomerEmail, newCustomerAddress, newCustomerCity, newCustomerPostcode, newCustomerCountry])
            .then(() => res.send("customer created!"))
            .catch((e) => console.error(e));
        }
      });
  });

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
app.delete("/booking/:id", function (req, res) {
    const bookingId = req.params.id;
    pool
      .query("DELETE FROM bookings WHERE id=$1", [bookingId])
      .then(() => {
        pool
          .query("DELETE FROM bookings WHERE id=$1", [bookingId])
          .then(() => res.send(`Customer ${bookingId} deleted!`))
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  });


//  delete customer
// app.delete("/customers/:customerId", function (req, res) {
//     const customerId = req.params.customerId;
//     pool
//       .query("DELETE FROM bookings WHERE customer_id=$1", [customerId])
//       .then(() => {
//         pool
//           .query("DELETE FROM customers WHERE id=$1", [customerId])
//           .then(() => res.send(`Customer ${customerId} deleted!`))
//           .catch((e) => console.error(e));
//       })
//       .catch((e) => console.error(e));
//   });

//  delete hotel
  app.delete("/hotels/:hotelId", function (req, res) {
    const hotelId = req.params.hotelId;
    pool
      .query("DELETE FROM bookings WHERE hotel_id=$1", [hotelId])
      .then(() => {
        pool
          .query("DELETE FROM hotels WHERE id=$1", [hotelId])
          .then(() => res.send(`Hotel ${hotelId} deleted!`))
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  });
  
// delete customer if exist
  app.delete('/customers/:customer_id', (req, resp) => {
    let customer_id = req.params.customer_id;
    pool.query('select * from customers where id = $1', [customer_id], (db_err, db_res) => {
        if(db_err){ res.send(JSON.stringify(error))};
        if (db_res.rows.length > 0) {
            pool.query('delete from customers where id = $1', [customer_id], (db_err, db_res) => {
                if (db_err) {
                    resp.status(500).send(JSON.stringify(db_err.message));
                } else {
                    resp.json(db_res.rows);
                }
            })
        } else {
            resp.status(400).send("The id you want to delete is not present");
        }
    })
})

// update customers
app.put("/customers/:customerId", function (req, res) {
    const customerId = req.params.customerId;
    const newEmail = req.body.email;
    const newCustomerName = req.body.name;
    const newCustomerAddress = req.body.address;
    const newCustomerCity = req.body.city;
    const newCustomerPostcode = req.body.postcode;
    const newCustomerCountry = req.body.country;
  if(validator.isEmail(newEmail)){
      pool
        .query("UPDATE customers SET email=$1, address=$3,city=$4, postcode=$5, country=$6, name=$7 WHERE id=$2", [newEmail, customerId, newCustomerAddress,newCustomerCity, newCustomerPostcode, newCustomerCountry,newCustomerName])
        .then(() => res.send(`Customer ${customerId} updated!`))
        .catch((e) => console.error(e));
  }else{
      res.send({msg:"please make sure you added valid email address."})
  }
  });

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