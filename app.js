const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{cors: {origin:"*"}})
const cors = require('cors');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: false }));
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

app.use(expressLayouts);
app.set('view engine', 'ejs');


const PORT = 4000;

app.use(express.static(__dirname + '/public'));

const db = require('./src/mongo setup').uri;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() =>  console.log("mongo db connected "))
    .catch(err => console.log(err));

app.use('/', require('./routes/orderRoutes'));

server.listen(PORT, console.log("Server running on port 3000"));
console.log(__dirname);
io.on('connection',(socket)=>{
    socket.on('department1',(data)=>{
        socket.broadcast.emit('department1',data);
    })
    socket.on('department2',(data)=>{
        socket.broadcast.emit('department2',data);
    })
    socket.on('department3',(data)=>{
        socket.broadcast.emit('department3',data);
    })
    console.log("Order dep " + socket.id);
})