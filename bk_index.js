
// let app = require('./app');
// console.log(app.z()); // Call the function from the app module

// var  x=20;

// if(x > 10) {
//     // for(var i = 0; i < x; i++) {
//     //     console.log(i);
//     // }

//     const arr = [1, 2, 3, 4, 5,3];
//     // console.log(arr);

//     let result= arr.filter((item)=>{
//         return item === 3
//     })
//    console.log(result)
// }

// import fs from 'fs';

// const input = process.argv;
// if(input[2] === 'read') {
// if (input[3] && input[4]) {
//     fs.writeFileSync(input[3], input[4]);
// }else{
//     console.log('Invalid command. Use "read" or "write".');
 
// }
// }else if(input[2] === 'write') {
//     fs.unlinkSync(input[3], (err) => {
//         if (err) {
//             console.error('Error deleting file:', err);
//         } else {
//             console.log('File deleted successfully');
//         }
//       });
// }else{
//       console.log('Invalid command. Use "read" or "write".');
// }

// const http = require('http');
// const data = require('./api'); // Importing the data from api.js
// http.createServer(greet).listen(4500);

// function greet(req, res) {
//     res.writeHead(200, { 'Content-Type': 'application\json' });
//     res.write(JSON.stringify(data));
//     res.end();
//  }

// const fs = require('fs');
// const path = require('path');
// const dirPath = path.join(__dirname,'files');

// for(i=0; i<3; i++){
//     fs.writeFileSync(dirPath+"/hello"+i+".txt","a simple txt file");
// }

// fs.readdir(dirPath, (err, files) => {
//     if (err) {
//         console.error('Error reading directory:', err);
//         return;
//     }
    
//     files.forEach(file => {
//         const filePath = path.join(dirPath, file);
        
//         fs.stat(filePath, (err, stats) => {
//             if (err) {
//                 console.error('Error getting file stats:', err);
//                 return;
//             }
            
//             if (stats.isFile()) {
//                 console.log(`${file} is a file`);
//             } else if (stats.isDirectory()) {
//                 console.log(`${file} is a directory`);
//             }
//         });
//     });
// }
// );


const express = require('express');

const path = require('path');
const reqFilter = require('./app/Middleware/auth');
const app = express();
const route = express.Router();


// app.use(reqFilter);
// app.get('/', (req, res) => {
//     res.send('<h1>Hello World!</h1>');
// });

// app.get('/about', (_, res) => {
//     res.send(`
//         <h2>This is the about page</h2>
//         <form>
//             <input type="text" placeholder="Enter something" />
//             <button type="submit">Submit</button>
//         </form>
//     `);
// });

// app.get('/contact', (_, res) => {
//     res.send(`
//         <h2>This is the contact page</h2>
//         <a href="/about">Go to About Page</a>
//     `);
// });

const path = require('path');

const publicPath = path.join(__dirname, 'public');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(publicPath));

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
        email:'jdoe@yopmail.com',
        age: 30,
        city: ['New York','Los Angeles','Chicago'],
    };
    res.render('profile', { user: user });
});

app.use('/', route);

app.listen(4500);
