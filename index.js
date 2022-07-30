const app = require("express")();
const httpServer = require("http").createServer(app);
const options = {cors: {orgin:"*"}};
const io = require("socket.io")(httpServer, options);
const multer = require("multer");
const cors = require("cors");
const path = require('path');
const fs = require('fs');
const spawn = require("child_process").spawn;
app.use(cors());
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './AI')
  },
  filename: function (req, file, cb) {
    console.log(file.originalname);
    var name=req.query.name;
    cb(null,  name.substring(0,name.indexOf("@"))+"-"+file.originalname) //FileName
  }
})
const upload =multer({ storage: storage });
io.on("connection", socket => {
  socket.on("moveAI", (params)=>{
    console.log(params);
const pythonProcess = spawn('python',["./AI/"+params.AIName, params.Game]);
    pythonProcess.stdout.on('data', (data) => {
      socket.emit("MoveMade",String(data))
      console.log(String(data));
    });
})
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
//socket events
app.post("/uploadAI", upload.single('file'), (req, res) => {

  res.json({ file: req.file });
});
app.get("/ListUserAI", (req, res)=>{
  validFile=[];
var name=req.query.name;
name=name.substring(0,name.indexOf("@"));
  console.log(name);
  const directoryPath = path.join(__dirname, 'AI');
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
      console.log(file.search(name));
      if(file.search(name)!=-1){
        console.log(file);
        validFile.push(file)
      }
    });

      res.json({AI:validFile});
});
})
app.get("/ListAllAI", (req, res)=>{
  validFile=[];
  const directoryPath = path.join(__dirname, 'AI');
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file);
        validFile.push(file)
    });

      res.json({AI:validFile});
});
})

httpServer.listen(3000);
