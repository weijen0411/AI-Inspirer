const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const inputMsg = document.getElementById('msg');



// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on('loginFail', function(){
  alert('房間已滿');
  history.back();
  
})

// Message from server
socket.on('message', (message) => {
  // console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit & enter
inputMsg.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    
    // Get message text
    let msg = e.target.value;

    msg = msg.trim();

    if (!msg) {
      return false;
    }

    // Emit message to server
    socket.emit('chatMessage', msg);
    // Clear input
    e.target.value = '';
    e.target.focus();
  
  }
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('botChatMessage', msg);
  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();

});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>&nbsp;&nbsp;${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('確定要離開房間?');
  if (leaveRoom) {
    window.location = '../student_join.html'; 
  } else {
  }
});



// research container
document.addEventListener('DOMContentLoaded', async function () {
    const titleElement = document.getElementById("modalTitle");
    const contentElement = document.getElementById("modalContent");
    const questionsElement = document.getElementById("modalQuestion");

    // 获取当前页面的 URL 查询字符串
    const queryString = window.location.search;

    // 创建 URLSearchParams 对象以解析查询字符串
    const urlParams = new URLSearchParams(queryString);

    const course_id = urlParams.get("courseID");

    const courseData = await DB_API.getCourseData(course_id);
  
    // 获取相应的数据，例如根据 courseBox 内的 subject 获取数据
    const subject = courseData.subject; // 从 h2 元素中获取 subject
    const topic = courseData.topic; // 从 h2 元素中获取 subject
  
    const courseQuestion =  await DB_API.getQuestion(course_id);
  
  
    // 将原始数据显示在模态对话框中，包装在<span>中
    titleElement.innerHTML = `<span>科目  ${subject}</span>`;
    contentElement.innerHTML = `<span><br>探討主題<br></span><span><br>${topic}</span>`;
  
    // 清空原始的问题内容
    questionsElement.innerHTML = "";
  
    // 使用forEach循环遍历courseQuestion数组并添加每个问题
    courseQuestion.forEach((question, index) => {
        const questionElement = document.createElement("span");
        questionElement.innerHTML = `<span><br><br>問題 ${index + 1}<br></span><span><br>${question}<br><br></span>`;

        // const answerTextarea = document.createElement("textarea");
        // answerTextarea.className = "answers";
        // answerTextarea.placeholder = "請輸入答案";
        // questionElement.appendChild(answerTextarea);
  
        // 将问题元素添加到questionsElement中
        questionsElement.appendChild(questionElement);
        
    });
  
});
