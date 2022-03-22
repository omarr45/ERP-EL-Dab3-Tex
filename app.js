const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{cors: {origin:"*"}})
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: false }));
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
require('dotenv').config();

app.use(expressLayouts);
app.set('view engine', 'ejs');


const PORT = process.env.PORT || 4000;

app.use(cookieParser());
app.use(
    session({
        secret:"secret",
        saveUninitialized:true,
        resave:true
    })
)


app.use(express.static(__dirname + '/public'));

const db = require('./src/mongo setup').uri;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() =>  console.log("mongo db connected "))
    .catch(err => console.log(err));

app.use('/', require('./routes/orderRoutes'));

server.listen(PORT, console.log("Server running on port 3000"));

io.on('connection',(socket)=>{
    socket.on('قسم الفرد',(data)=>{
        socket.broadcast.emit('قسم الفرد',data);
    })
    socket.on('قسم الرام',(data)=>{
        socket.broadcast.emit('قسم الرام',data);
    })
    socket.on('قسم طباعه',(data)=>{
        socket.broadcast.emit('قسم طباعه',data);
    })
    socket.on('قسم صباغه',(data)=>{
        socket.broadcast.emit('قسم صباغه',data);
    })
    socket.on('قسم كستره',(data)=>{
        socket.broadcast.emit('قسم كستره',data);
    })
    socket.on('قسم بوليش كمبكتور علي المفتوح',(data)=>{
        socket.broadcast.emit('قسم بوليش كمبكتور علي المفتوح',data);
    })
    socket.on('قسم بوليش كمبكتور علي القفول',(data)=>{
        socket.broadcast.emit('قسم بوليش كمبكتور علي القفول',data);
    })
    socket.on('قسم تغليف',(data)=>{
        socket.broadcast.emit('قسم تغليف',data);
    })
    socket.on('قسم غسيل الطباعه',(data)=>{
        socket.broadcast.emit('قسم غسيل الطباعه',data);
    })
    socket.on('قسم جاهز للاستلام',(data)=>{
        socket.broadcast.emit('قسم جاهز للاستلام',data);
    })
    console.log("Order dep " + socket.id);
})
