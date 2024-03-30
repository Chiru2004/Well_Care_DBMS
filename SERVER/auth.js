import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import  {createTokens,validateToken} from './jwt.js';
const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000',methods:["POST","GET","DELETE","PUT"], credentials: true })); // Allow requests from localhost:3000
app.use(cookieParser());
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'PUT');
    next();});

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "farhanf0220",
    database: "hospital"
});

   db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL database");
});



// Register endpoint
app.post('/api/register', async (req, res) => {
    const { username, email, password, age, bloodgroup, phoneNumber, gender, aadharNo, address } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        db.query('INSERT INTO patient (PatientName, Email, Password, Age, Bloodgroup, PHONENUMBER, GENDER, Aadhar_number, Address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [username, email, hashedPassword, age, bloodgroup, phoneNumber, gender, aadharNo, address],
            (error, results) => {
                if (error) {
                    console.error(error);
                    if (error.code === 'ER_DUP_ENTRY') {
                        // Duplicate entry error
                        let message = "";
                        if (error.message.includes("Email")) {
                            message += "Email already exists";
                        } 
                        res.status(400).json({ message });
                        console.log(message);
                    } else {
                        // Other internal server errors
                        res.status(500).json({ message: "Internal server error" });
                    }
                } else {
                    res.status(201).json({ message: "User registered successfully" });
                }
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


   
app.post('/api/login', async (req, res) => {
    const { patientEmail, password } = req.body;

    try {
        // Check if the user exists
        db.query('SELECT * FROM patient WHERE Email = ?',
            [patientEmail],
            async (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: "Internal server error" });
                }

                // Check if results array is empty
                if (results.length === 0) {
                    return res.status(400).json({ message: "User not found" });
                }

                // User found, compare passwords
                const user = results[0];
                console.log('Hashed Password:', user.Password); // Log hashed password from the database
                console.log('Provided Password:', password); // Log password provided in the request
                const passwordMatch = await bcrypt.compare(password, user.Password);
                console.log('Password Match:', passwordMatch); // Log whether passwords match
                if (!passwordMatch) {
                    return res.status(400).json({ message: "Incorrect password" });
                }

                // Generate JWT token
                  const accessToken=createTokens(user);                // Set token in cookie
                res.cookie('accessToken', accessToken, { httpOnly: true, sameSite:'strict', },{maxAge:60*60*24*30*1000,});
                res.json({ message: "Login successful" });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Protected route
app.get('/api/home', validateToken, (req, res) => {
    // Return user credentials
    res.json({ user: req.user });
});
  

// Logout endpoint
app.get('/api/logout', (req, res) => {
    res.clearCookie('accessToken').json({ message: "Logout successful" });
});

app.use('/api/home', (req, res, next) => {
    res.status(401).json({ message: "Unauthorized" });
}); 

app.get('/api/departments', (req, res) => {
    // Query to fetch distinct departments from the doctor table
    const query = 'SELECT DISTINCT doc_dept AS department FROM doctor';

    // Execute the query
    db.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching departments:", error);
            res.status(500).json({ error: "Internal server error" });
            return;
        }

        // Extract departments from the results
        const departments = results.map(row => row.department);
         console.log(departments);
        // Send the list of departments as a response
        res.json(departments);
    });
});


app.get('/api/doctors/:department', (req, res) => {
    const department = req.params.department;
    const query = 'SELECT doc_id,doc_name,doc_qualification,doc_specification FROM doctor WHERE doc_dept = ?';

    db.query(query, [department], (error, results) => {
        if (error) {
            console.error(`Error fetching doctors for department ${department}:`, error);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
         console.log(results);
        res.json(results);
    });
});


app.get('/api/slots', (req, res) => {
    const { date, doctorId } = req.query;

    const currentTimestamp = new Date().toISOString().split('.')[0];

    const query = `
        SELECT *
        FROM slots
        WHERE slot_occupied = 0 
        AND slot_date = ?
        AND CONCAT(slot_date, ' ', slot_time) >= ?
        AND doc_id = ?
    `;

    db.query(query, [date, currentTimestamp, doctorId], (error, results) => {
        if (error) {
            console.error('Error fetching slots:', error);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        if (results.length === 0) {
            console.log("No slots available");
        }

        console.log(results);
        res.json(results);
    });
});

const slotsLocks = {}; // Object to store slot locking status

app.post('/api/confirmappointment', (req, res) => {
    const { patientId, doctorId, appointmentTime, appointmentDate,slotId } = req.body;
    const slotKey = `${doctorId}_${appointmentDate}_${appointmentTime}`;

    // Check if the slot is already locked
    if (slotsLocks[slotKey]) {
        return res.status(400).json({ message: "Slot is already booked" });
    }

    // Lock the slot to prevent concurrent bookings
    slotsLocks[slotKey] = true;

    // Insert into appointments table
    db.query('INSERT INTO appointments (patient_id, doc_id, appointment_time, appointment_date, appointment_status,slot_id) VALUES (?, ?, ?, ?, ?,?)', [patientId, doctorId, appointmentTime, appointmentDate, 'Confirmed',slotId], (error, results) => {
        if (error) {
            console.error('Error inserting appointment:', error);
            return res.status(500).json({ message: "Internal server error" });
        }
        // Update slots table
        db.query('UPDATE slots SET slot_occupied = ? WHERE doc_id = ? AND slot_date = ? AND slot_time = ?', [1, doctorId, appointmentDate, appointmentTime], (error, results) => {
            if (error) {
                console.error('Error updating slots:', error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
        db.query('INSERT INTO logs(p_id,d_id,log_time,log_date,a_fulfilled) values (?,?,?,?,?)',[patientId, doctorId, appointmentTime, appointmentDate,'no'],(error,results)=>{
            if(error){
                console.error('Error updating logs:', error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
            res.status(200).json({ message: "Appointment confirmed successfully" });
       
    });
});

app.post('/api/adddoctors', (req, res) => {
    const { docName, docAge, docQualification, docDept, docExperience, docContact, docSpecification } = req.body;
    const query = 'INSERT INTO doctor (doc_name, doc_age, doc_qualification, doc_dept, doc_experience, doc_contact, doc_specification) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [docName, docAge, docQualification, docDept, docExperience, docContact, docSpecification], (err, results) => {
      if (err) {
        console.error('Error adding doctor:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.status(201).json({ message: 'Doctor added successfully', doctorId: results.insertId });
    });
  });
  //fetch doctors
  app.get('/api/fetchdoctors', (req, res) => {
    const query = 'SELECT * FROM doctor';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching doctors:', err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      res.json(results);
    });
  });
  
  // Remove a doctor
  app.delete('/api/deletedoctors/:id', (req, res) => {
    const doctorId = req.params.id;
    const query = 'DELETE FROM doctor WHERE doc_id = ?';
    const q2='DELETE FROM logs WHERE log_id IN ( SELECT log_id  FROM (SELECT log_id FROM logs   WHERE d_id = ? ) AS subquery)';
    db.query(query, [doctorId], (err, results) => {
        db.query(q2,[doctorId], (err, results) => {if (err) {
            console.error('Error removing logs:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
          }
        });
      if (err) {
        console.error('Error removing doctor:', err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      res.status(200).json({ message: 'Doctor removed successfully' });
    });
  });

//INSERTING SLOTS
// POST endpoint to add a slot to a doctor
app.post('/api/addslot', async (req, res) => {
  const { doctorId, slotDate, slotTime } = req.body;
  try {
    // Insert the slot data into the database
    db.query('INSERT INTO slots (doc_id, slot_date, slot_time,slot_occupied) VALUES (?, ?, ?,0)', [doctorId, slotDate, slotTime]);
    res.status(200).send('Slot added successfully');
  } catch (error) {
    console.error('Error adding slot:', error);
    res.status(500).send('Error adding slot. Please try again.');
  }
});


// Endpoint to fetch slots for a specific doctor with timestamp filter
app.get('/api/F_slots/:docId', (req, res) => {
    const { docId } = req.params;
    const { timestamp } = req.query; // Get the timestamp from the query parameters

    // Query to fetch slots for the specified doctor with timestamp filter
    const fetchSlotsQuery = 'SELECT * FROM slots WHERE doc_id = ? AND CONCAT(slot_date, " ", slot_time) >= ?';

    // Execute the query
    db.query(fetchSlotsQuery, [docId, timestamp], (error, results) => {
        if (error) {
            console.error('Error fetching slots:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(200).json(results);
    });
});

// Endpoint to delete expired slots
app.delete('/api/delete_expired_slots', (req, res) => {
    const { timestamp } = req.query; // Get the timestamp from the query parameters

    // Query to delete expired slots
    const deleteExpiredSlotsQuery = 'DELETE FROM slots WHERE CONCAT(slot_date, " ", slot_time) < ?';

    // Execute the query
    db.query(deleteExpiredSlotsQuery, [timestamp], (error, results) => {
        if (error) {
            console.error('Error deleting expired slots:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(200).json({ message: 'Expired slots deleted successfully' });
    });
});
//delete slots api
app.delete('/api/d_slots/:slotId', (req, res) => {
    const slotId = req.params.slotId;

    // Query to delete the slot from the database
    const deleteSlotQuery = 'DELETE FROM slots WHERE slot_id = ?';

    // Execute the query
    db.query(deleteSlotQuery, [slotId], (error, results) => {
        if (error) {
            console.error('Error deleting slot:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        // Return success message if the slot was deleted successfully
        res.status(200).json({ message: 'Slot deleted successfully' });
    });
});


app.get('/api/fetchlogs/:doctorId', async (req, res) => {
    const { doctorId } = req.params;

    try {
        // Get current timestamp
        const currentTimestamp = new Date().toISOString().split('.')[0];
        
        // Fetch logs for the specified doctor from the database after the current timestamp
        db.query('SELECT * FROM logs WHERE d_id = ?', [doctorId], (error, results) => {
            if (error) {
                console.error('Error fetching logs:', error);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





app.get('/api/medicines', (req, res) => {
    // Query to fetch all medicines from the medicine table
    const query = 'SELECT * FROM medicine';

    // Execute the query
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching medicines:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});

app.post('/api/addToPrescription', (req, res) => {
    const { medicineId, quantity, log} = req.body;

    try {
        // Insert the medicine into the prescription table
       db.query('INSERT INTO prescription_table (Patient_id, Doctor_id, Medicine_id, Med_Quant, log_id) VALUES (?, ?, ?, ?, ?)',
            [log.p_id, log.d_id, medicineId, quantity, log.log_id]);

            try{
                db.query('UPDATE logs SET a_fulfilled = ? WHERE log_id = ?', ['yes',log.log_id]);
                console.log("hii");
            }
            catch(error)
            {
                console.error('Error updating logs', error);
                res.status(500).json({ error: 'Internal server error' }); 
            }

        res.status(200).json({ message: 'Medicine added to prescription successfully' });
    } catch (error) {
        console.error('Error adding medicine to prescription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/uappointments/:patient_id', (req, res) => {
    const patientId = req.params.patient_id;
    const currentDate = new Date().toISOString(); // Get current date in YYYY-MM-DD format
  
    // SQL query to fetch upcoming appointments for the given patient
    const sql = `
    SELECT a.*, d.*
    FROM appointments a
    JOIN doctor d ON a.doc_id = d.doc_id
    WHERE a.patient_id = ?
    AND CONCAT(a.appointment_date, ' ', a.appointment_time) >= ?
    ORDER BY a.appointment_date, a.appointment_time;
  `;
  
    // Execute the query
    db.query(sql, [patientId, currentDate], (error, results) => {
      if (error) {
        console.error('Error fetching upcoming appointments:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json(results);
    });
  });


  // Backend API to fetch logs for the given user and include associated doctor details
// Import necessary modules and initialize your Express app

// Backend API to fetch logs for the given user and include associated doctor details
app.get('/api/mhistory/:patient_id', async (req, res) => {
    const { patient_id } = req.params;
    try {
      // Perform SQL query to fetch logs and join with doctors table
      const sql = `
        SELECT l.*, d.*
        FROM logs l
        LEFT JOIN doctor d ON l.d_id = d.doc_id
        WHERE l.p_id = ? and l.a_fulfilled="yes"
      `;

      db.query(sql, [patient_id, ], (error, results) => {
        if (error) {
          console.error('Error fetching upcoming appointments:', error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.json(results);
    });
  } catch(error)
  {
    console.error(error);
    res.json(error);
  }
}
  );


  app.get('/api/view_prescription/:log_id', (req, res) => {
    const { log_id } = req.params;
  
    // SQL query to fetch medicines listed in the prescription for the given log_id
    const sql = `
      SELECT p.*, m.*
      FROM prescription_table p
      JOIN medicine m ON p.Medicine_id = m.Medicine_id
      WHERE p.log_id = ?
    `;
  
    // Execute the query
    db.query(sql, [log_id], (error, results) => {
      if (error) {
        console.error('Error fetching prescription:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json(results);
    });
  });


////yashas code




app.get('/api/search', (req, res) => {
    const { query } = req.query;
    const queryString = `SELECT * FROM Medicine WHERE LOWER(Med_name) LIKE LOWER('%${query}%');`;
   db.query(queryString, (err, rows) => {
      if (err) {
        console.error('Error executing MySQL query: ', err);
        res.status(500).json({ error: 'Error executing MySQL query' });
        return;
      }
      console.log(rows);
      console.log("Hi");
      res.json(rows);
    });
  });
  
  app.post('/api/add-to-cart', (req, res) => {
    const { Patient_id, Medicine_id, Med_quant, Unit_price, Total_price } = req.body;
  
    // Generate timestamp for added time and update time
    const added_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const update_time = added_time;
  
    // Check if the entry already exists
    const selectQuery = `SELECT * FROM Cart WHERE Patient_id = ? AND Medicine_id = ?`;
   db.query(selectQuery, [Patient_id, Medicine_id], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query: ', err);
        res.status(500).json({ error: 'Error checking for existing entry in cart' });
        return;
      }
  
      if (results.length > 0) {
        // Entry already exists, update the Med_quant
        const existingQuant = results[0].Med_quant;
        const updatedQuant = existingQuant + Med_quant;
  
        const updateQuery = `UPDATE Cart SET Med_quant = ?, Total_price = ? WHERE Patient_id = ? AND Medicine_id = ?`;
       db.query(updateQuery, [updatedQuant, updatedQuant * Unit_price, Patient_id, Medicine_id], (err, result) => {
          if (err) {
            console.error('Error executing MySQL query: ', err);
            res.status(500).json({ error: 'Error updating existing entry in cart' });
            return;
          }
          console.log('Item quantity updated in cart');
          res.json({ message: 'Item quantity updated in cart successfully' });
        });
      } else {
        // Entry does not exist, insert a new row
        const insertQuery = `INSERT INTO Cart (Patient_id, Medicine_id, Med_quant, Unit_price, Total_price, Added_time, Update_time) VALUES (?, ?, ?, ?, ?, ?, ?)`;
       db.query(insertQuery, [Patient_id, Medicine_id, Med_quant, Unit_price, Total_price, added_time, update_time], (err, result) => {
          if (err) {
            console.error('Error executing MySQL query: ', err);
            res.status(500).json({ error: 'Error adding new item to cart' });
            return;
          }
          console.log('New item added to cart');
          res.json({ message: 'New item added to cart successfully' });
        });
      }
    });
  });
  
  app.get('/api/cart/order', (req, res) => {
    const selectQuery = 'SELECT c.*, m.Med_name FROM Cart c INNER JOIN Medicine m ON c.Medicine_id = m.Medicine_id';
   db.query(selectQuery, (err, rows) => {
      if (err) {
        console.error('Error executing MySQL query: ', err);
        res.status(500).json({ error: 'Error fetching cart/order data' });
        return;
      }
      res.json(rows);
    });
  });
  
  app.delete('/api/cart/order/:patientId/:medicineId', (req, res) => {
    const { patientId, medicineId } = req.params;
  
    // Construct the DELETE query to remove the item from the cart
    const deleteQuery = `DELETE FROM cart WHERE Patient_id = ? AND Medicine_id = ?`;
  
    // Execute the query
   db.query(deleteQuery, [patientId, medicineId], (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Error removing item from cart' });
        return;
      }
  
      // Check if any rows were affected (item removed)
      if (result.affectedRows === 0) {
        // If no rows were affected, the item may not have been found in the cart
        res.status(404).json({ error: 'Item not found in cart' });
        return;
      }
  
      // If the item was successfully removed, send a success response
      res.status(200).json({ message: 'Item removed from cart successfully' });
    });
  });
  
  // GET endpoint to fetch patient details by ID
  app.get('/api/patient/:id', (req, res) => {
    const patientId = req.params.id;
    const selectQuery = 'SELECT * FROM patient WHERE idPatient = ?';
   db.query(selectQuery, [patientId], (err, rows) => {
      if (err) {
        console.error('Error executing MySQL query: ', err);
        res.status(500).json({ error: 'Error fetching patient details' });
        return;
      }
      if (rows.length === 0) {
        res.status(404).json({ error: 'Patient not found' });
        return;
      }
      const patientDetails = rows[0];
      res.json(patientDetails);
    });
  });
  
  // POST endpoint to place an order
  app.post('/api/orders', async (req, res) => {
    try {
      const { orderId, patientId, orderDate, totalAmount, address } = req.body;
      const insertOrderQuery = 'INSERT INTO orders (Order_id, Patient_id, Order_Date, Order_Status, Amount, Del_Address) VALUES (?, ?, ?, ?, ?, ?)';
     db.query(insertOrderQuery, [orderId, patientId, orderDate, 'Pending', totalAmount, address], (error, results) => {
        if (error) {
          console.error('Error inserting order:', error);
          res.status(500).json({ error: 'Error placing order' });
        } else {
          console.log('Order inserted successfully');
          const orderId = results.insertId;
          res.status(201).json({
            orderId: orderId,
            patientId: patientId,
            orderDate: orderDate,
            orderStatus: 'Pending',
            amount: totalAmount,
            deliveryAddress: address,
          });
        }
      });
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.post('/api/order-items', (req, res) => {
    const { orderId, medicineId, quantity, totalPrice } = req.body;
  
    // Check if the order details already exist
    const selectQuery = `SELECT * FROM order_details WHERE Order_id = ? AND Medicine_id = ?`;
   db.query(selectQuery, [orderId, medicineId], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Error adding order details' });
        return;
      }
  
      if (results.length > 0) {
        // Order details already exist, update the quantity and subtotal
        const updateQuery = `UPDATE order_details SET Med_Quant = ?, Subtotal = ? WHERE Order_id = ? AND Medicine_id = ?`;
       db.query(updateQuery, [quantity, totalPrice, orderId, medicineId], (err, result) => {
          if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Error updating order details' });
            return;
          }
          res.status(200).json({ message: 'Order details updated successfully' });
        });
      } else {
        // Order details do not exist, insert a new row
        const insertQuery = `INSERT INTO order_details (Order_id, Medicine_id, Med_Quant, Subtotal) VALUES (?, ?, ?, ?)`;
       db.query(insertQuery, [orderId, medicineId, quantity, totalPrice], (err, result) => {
          if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Error adding order details' });
            return;
          }
          res.status(201).json({ message: 'Order details added successfully' });
        });
      }
    });
  });
  
  
  app.get('/api/orders/lastOrderId', (req, res) => {
    const selectQuery = 'SELECT Order_id FROM order_details ORDER BY Order_id DESC LIMIT 1';
   db.query(selectQuery, (err, rows) => {
      if (err) {
        console.error('Error executing MySQL query: ', err);
        res.status(500).json({ error: 'Error fetching last order ID' });
        return;
      }
      if (rows.length === 0) {
        // If no orders exist yet, return a default value
        res.json({ lastOrderId: 0});
        return;
      }
      // Extract and send the last order ID
      const lastOrderId = rows[0].Order_id;
      res.json({ lastOrderId });
    });
  });
  // POST endpoint to update stock quantity
  app.get('/api/medicine/:id', (req, res) => {
    const medicineId = req.params.id;
    const selectQuery = 'SELECT * FROM medicine WHERE Medicine_id = ?';
   db.query(selectQuery, [medicineId], (err, rows) => {
      if (err) {
        console.error('Error executing MySQL query: ', err);
        res.status(500).json({ error: 'Error fetching medicine details' });
        return;
      }
      if (rows.length === 0) {
        res.status(404).json({ error: 'Medicine not found' });
        return;
      }
      const medicineDetails = rows[0];
      res.json(medicineDetails);
    });
  });
  
  // PUT endpoint to update stock quantity for a medicine
  // PUT endpoint to update the quantity of an item in the cart
  app.put('/api/update/:medicineId/:Med_quant', (req, res) => {
    const { medicineId,Med_quant} = req.params;
    
  console.log(Med_quant);
    // Construct the UPDATE query to update the quantity of the item in the cart
    const updateQuery = `UPDATE medicine SET Stock_Quant = ? WHERE  Medicine_id = ?`;
  
    // Execute the query
   db.query(updateQuery, [Med_quant, medicineId], (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Error updating quantity in cart' });
        return;
      }
  
      // Check if any rows were affected (item updated)
      if (result.affectedRows === 0) {
        console.log("no item found");
        // If no rows were affected, the item may not have been found in the cart
        res.status(404).json({ error: 'Item not found in cart' });
        return;
      }
      ;
  
        });
      });
   
  
      app.post('/api/addmedicine', (req, res) => {
        const { Med_name, Med_Description, Unit_price, Stock_Quant } = req.body;
      
        // Validate the request body here if needed
        
        const insertQuery = 'INSERT INTO medicine (Med_name, Med_Description, Unit_price, Stock_Quant) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [Med_name, Med_Description, Unit_price, Stock_Quant], (err, result) => {
          if (err) {
            console.error('Error adding medicine:', err);
            res.status(500).json({ error: 'Error adding medicine' });
            return;
          }
          console.log('Medicine added successfully');
          res.status(201).json({ message: 'Medicine added successfully' });
        });
      });

      // GET endpoint to fetch all medicines
app.get('/api/fetchmedicines', (req, res) => {
    db.query('SELECT * FROM medicine', (err, result) => {
      if (err) {
        console.error('Error fetching medicines:', err);
        res.status(500).json({ error: 'Error fetching medicines' });
        return;
      }
      res.json(result);
    });
  });
  
  // DELETE endpoint to delete a medicine by ID
app.delete('/api/deletemedicines/:id', (req, res) => {
    const medicineId = req.params.id;
    db.query('DELETE FROM medicine WHERE Medicine_id = ?', [medicineId], (err, result) => {
      if (err) {
        console.error('Error deleting medicine:', err);
        res.status(500).json({ error: 'Error deleting medicine' });
        return;
      }
      res.status(200).json({ message: 'Medicine deleted successfully' });
    });
  });
  

  // PUT endpoint to update stock quantity of a medicine by ID
app.put('/api/updatemedicines/:id', (req, res) => {
    const medicineId = req.params.id;
    const { Stock_Quant } = req.body;
    db.query('UPDATE medicine SET Stock_Quant = ? WHERE Medicine_id = ?', [Stock_Quant, medicineId], (err, result) => {
      if (err) {
        console.error('Error updating stock quantity:', err);
        res.status(500).json({ error: 'Error updating stock quantity' });
        return;
      }
      res.status(200).json({ message: 'Stock quantity updated successfully' });
    });
  });
  




           


app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
