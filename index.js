const app = require("express")();
const httpServer = require("http").createServer(app);
const options = {cors: {orgin:"*"}};
const io = require("socket.io")(httpServer, options);
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
io.on("connection", socket => {
  socket.on("creat", (params , callback)=>{
    if(socket.rooms.size==0){
     socket.join(socket.id);
    console.log("HI2");
    }
    console.log(socket.rooms);
      });
  socket.on("join", (params, callback)=>{
    console.log(socket.rooms);
    console.log(params);
    socket.join(params);
    socket.leave(socket.id);
    console.log(socket.rooms);
    if(io.sockets.adapter.rooms.get(params).size==2){
      io.in(params).fetchSockets().then((value)=>{
        var orientation=Math.floor(Math.random()*2);
        value[0].emit("HI", orientation==1 ? "black" : "white");
        value[1].emit("HI", !(orientation==1) ? "black" : "white");
      });
    }
  });
  socket.on("move", (params, callback)=>{
    set1=socket.rooms;
    const iterator1 = set1.values();
    const room=iterator1.next().value;
    console.log(params.RoomID);
    io.to(params.RoomID).emit("moves", params);
    console.log("HI2");
    console.log(params);
  });
});
app.post("/uploadAI", async (req, res)=>{
  console.log(req.files);
});

httpServer.listen(3000);
