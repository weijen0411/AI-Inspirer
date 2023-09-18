const userMessage = document.getElementById("msg").value; // 获取用户输入的消息
fetch("/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "chatglm2-6b", // ChatGLM2-6B模型的ID
    messages: [
      {
        role: "user",
        content: userMessage, // 用户的消息内容
      },
    ],
  }),
})
.then((response) => response.json())
.then((data) => {
  // 处理API的回应，显示AI的回复
  const aiReply = data.choices[0].message.content;
  // 将AI的回复添加到聊天界面
  addMessage("AI", aiReply);
})
.catch((error) => {
  console.error("Error:", error);
});