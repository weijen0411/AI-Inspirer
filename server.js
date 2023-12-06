const path = require("path");
const axios = require('axios');
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const ngrok = require("@ngrok/ngrok");
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
const cors = require('cors');
app.use(cors());
const fetch = require('node-fetch');
const server = http.createServer(app);
const io = socketio(server);


let listener2Url = '';

(async function () {
  const listener1 = await ngrok.connect({
      addr: 3000,
      authtoken: '2Un0UTeJU14fjN9fABZKqv4Xsqj_5cWrUq7KQCWhJmCb9jj6p',
  });

  const listener2 = await ngrok.connect({
    addr: 8501,
    authtoken: '2Un0UTeJU14fjN9fABZKqv4Xsqj_5cWrUq7KQCWhJmCb9jj6p',
});

  console.log(`Ingress established at port 3000: ${listener1.url()}`);
  console.log(`Ingress established at port 8501: ${listener2.url()}`);

  listener2Url = listener2.url();

})();

app.get('/listener2Url', (req, res) => {
  // 直接返回全局变量 listener2Url 的值
  res.json({ url: listener2Url });
});

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
    
    if (roomuserCount < 5){
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
    } else if(roomuserCount >=5){
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
    const ask = "請使用繁體中文回答。" + msg;

    const data = {
      query: ask,
      // history: [
      //   { role: 'user', content: '您好，請使用繁體中文回答我所有的問題!' },
      //   { role: 'assistant', content: '好的!' },
      // ],
      stream: false, // 如果希望流式输出，设置为 true
    };

    io.to(user.room).emit("message", formatMessage(`${user.username}`, msg));
    
    axios
    .post(url, data)
    .then((response) => {
      if (response.status === 200) {
        // 处理模型生成的对话
        // response.data.split('\n').forEach((chunk) => {
        //  io.to(user.room).emit("message", formatMessage(`${botName}`, chunk));
          
        // });
        io.to(user.room).emit("message", formatMessage(`${botName}`, response.data));
      } else {
        console.error(`错误响应：${response.status}`);
      }
    })
    .catch((error) => {
      console.error('请求出错:', error);
    });


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


app.get('/ngrok-url', async (req, res) => {
  try {
      const response = await fetch('http://localhost:4040/api/tunnels/second', {
        method: 'GET'
      });
      const data = await response.json();
      const publicUrl = data.public_url;

      res.json({ publicUrl });
  } catch (error) {
      console.log('Error fetching ngrok URL:', error);
      res.status(500).json({ error: 'Unable to fetch ngrok URL' });
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('uncaughtException', function (err) {
  console.log(err);
});

