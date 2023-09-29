const path = require("path");
const axios = require('axios');
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const createAdapter = require("@socket.io/redis-adapter").createAdapter;
const redis = require("redis");
require("dotenv").config();
const { createClient } = redis;
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const url = 'http://127.0.0.1:7861/chat/chat';
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "學習機器人";

(async () => {
  pubClient = createClient({ url: "redis://127.0.0.1:6379" });
  await pubClient.connect();
  subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));
})();

// Run when client connects
io.on("connection", (socket) => {
  console.log(io.of("/").adapter);
  socket.on("joinRoom", ({ username, room }) => {
    var roomusers = getRoomUsers(room);
    var roomuserCount = (roomusers === null) ? 0 : roomusers.length;
    
    if (roomuserCount < 2){
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(`${botName}`, "歡迎來到討論室! 如果想要問我問題，請再輸入完後點擊左邊的圖示喔!"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(`${botName}`, `${user.username} 加入了討論室`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
    } else if(roomuserCount >=2){
      console.log('Room is full');
      socket.emit('loginFail', '')
    }
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    
    io.to(user.room).emit("message", formatMessage(`${user.username}`, msg));
  });

  // Listen for botChatMessage
  socket.on("botChatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    
    const data = {
      query: msg,
      // history: [
      //   { role: 'user', content: '你好，请告诉我今天的天气。' },
      //   { role: 'assistant', content: '今天的天气是晴朗的。' },
      // ],
      stream: true, // 如果希望流式输出，设置为 true
    };
    
    axios
    .post(url, data)
    .then((response) => {
      if (response.status === 200) {
        // 处理模型生成的对话
        response.data.split('\n').forEach((chunk) => {
         io.to(user.room).emit("message", formatMessage(`${botName}`, chunk));
          
        });
      } else {
        console.error(`错误响应：${response.status}`);
      }
    })
    .catch((error) => {
      console.error('请求出错:', error);
    });

    io.to(user.room).emit("message", formatMessage(`${user.username}`, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(`${botName}`, `${user.username} 離開了討論室`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('uncaughtException', function (err) {
  console.log(err);
});