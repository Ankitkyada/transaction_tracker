const db = require('./db');
const express = require('express');

const app = express();
app.get('/user-list', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            res.status(500).send('Database error');
            return;
        }
        res.json(results);
    });
});

app.listen(4500, () => {
    console.log('Server running on http://localhost:4500');
});


app.post('/add-user', express.json(), (req, res) => {
    const data = req.body;
    // Example data structure:
    const { name, designation, image } =data;
    // const data= { name :"Ankit", designation :"test@gmail.com" , image :"https://picsum.photos/200/300" } ;

    const query = 'INSERT INTO teams (name, designation, image) VALUES (?, ?, ?)';
    db.query(query, [data.name, data.designation, data.image], (err, results) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            res.status(500).send('Database error');
            return;
        }
        res.json({ message: 'User added successfully', id: results.insertId });
    });
}
);


app.put('/update-user/:id', express.json(), (req, res) => {

    const userId = req.params.id;
    const data = req.body;

    const { name, designation, image } = data;

    const query = 'UPDATE teams SET name = ?, designation = ?, image = ? WHERE id = ?';
    db.query(query, [data.name, data.designation, data.image, userId], (err, results) => {
        if (err) {
            console.error('Error updating data in database:', err);
            res.status(500).send('Database error');
            return;
        }
        res.json({ message: 'User updated successfully' });
    });
});

app.delete('/delete-user/:id', (req, res) => {
    const userId = req.params.id;

    const query = 'DELETE FROM teams WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error deleting data from database:', err);
            res.status(500).send('Database error');
            return;
        }
        res.json({ message: 'User deleted successfully' });
    });
}           
);