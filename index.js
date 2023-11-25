const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose= require("mongoose");
const socket=require("socket.io");
const userRoute=require("./routes/userroutes");
const messageRouter = require("./routes/messagesroutes");

const app =express();

dotenv.config();
// app.use(cors());
app.use(cors());
app.use(express.json());

app.use("/api/auth",userRoute);
app.use("/api/message",messageRouter);

mongoose.connect(process.env.MONGO__DB,{   
}).then(()=>{
    console.log("connected to the database");
}).catch((error)=>{
    console.log(error);
})

app.get("/",(req,res)=>{
    res.send("Hello World From Server");
})

const server= app.listen(process.env.PORT,()=>{
    console.log(`Server Started On Port ${process.env.PORT}`);
});

const io = socket(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });


