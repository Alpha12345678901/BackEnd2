const app = require("express")();
const httpServer = require("http").createServer(app);
const options = {cors: {orgin:"*"}};
const io = require("socket.io")(httpServer, options);
io.on("connection", socket => {
  socket.on("creat", socket=>{
    socket.join("Room");
  });
  socket.on("join", socket=>{
    //socket.join();
    console.log(socket)
  });
});

httpServer.listen(3000);
