import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

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
    const query = 'SELECT doc_name,doc_qualification,doc_specification FROM doctor WHERE doc_dept = ?';

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





app.listen(3002, () => {
    console.log("Server is running on port 3002");
});