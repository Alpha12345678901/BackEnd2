const app = require("express")();
const httpServer = require("http").createServer(app);
const options = {cors: {orgin:"*"}};
const io = require("socket.io")(httpServer, options);
io.on("connection", socket => {
  socket.on("creat", (params , callback)=>{
    socket.join(socket.id);
    console.log("HI");
  });
  socket.on("join", (params, callback)=>{
    socket.join(params);
    if(io.sockets.adapter.rooms.get(params).size==2){
      io.to(params).emit("HI");
    }
  });
});

httpServer.listen(3000);
