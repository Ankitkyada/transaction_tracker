const express = require('express');
const app = express();
const path = require('path');

// Required for routing and middleware
const route = express.Router(); // define route
const reqFilter = require('./app/Middleware/auth'); // or define a dummy one temporarily

// OR temporarily define middleware inline
// const reqFilter = (req, res, next) => { next(); };

const publicPath = path.join(__dirname, 'public');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(publicPath));

// Apply middleware before route
route.use(reqFilter);

route.get('/about', (req, res) => {
    res.sendFile(path.join(publicPath, 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(publicPath, 'contact.html'));
});

app.get('/profile', (_, res) => {
    const user = {
        name: 'John Doe',
        email: 'jdoe@yopmail.com',
        age: 30,
        city: ['New York', 'Los Angeles', 'Chicago'],
    };
    res.render('profile', { user: user });
});

app.use('/', route);

app.listen(4500, () => {
    console.log('Server running on http://localhost:4500');
});
