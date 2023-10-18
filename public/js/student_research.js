const account = sessionStorage.getItem('account');

var modal = document.getElementById("courseModal");


document.addEventListener('DOMContentLoaded', async function() {
    const courses = await DB_API.getCourses();
    // 遍歷courses數組，獲取每個物件中的topic和subject
    courses.forEach(course => {
        const topic = course.topic;
        const subject = course.subject;
        const question1 = course.question1;
        
        // 创建一个新的course-box元素
        var newCourseBox = document.createElement("div");
        newCourseBox.className = "course-box";
        
        var img = document.createElement("img");
        if (subject === '歷史') {
            img.src = '../img/history.png'; // 根据实际图像路径设置
            img.className = "course-history-img";
            img.alt = '歷史圖片';
        } 
       // 创建course-box内的h2和p元素
        var h2 = document.createElement("h2");
        h2.textContent = subject;
        
        var p = document.createElement("p");
        p.textContent = topic;

        // 创建一个加入按钮
        var joinButton = document.createElement("button");
        joinButton.textContent = "加入";
        joinButton.className = "joinButton"; // 添加类名

        joinButton.addEventListener("click", async function(courseID) {
            const account = sessionStorage.getItem('account');
            const write = await DB_API.getUserdata(account);
            const memberData = {
                account: write.account,
                name: write.name
              };
            try{
                await DB_API.addCoursemember(topic, memberData);   
            } catch(error){
                console.error('加入失敗', error);
            }
        });
        // var lable = document.createElement("lable");
        // lable.textContent = question1;
        // 将h2和p元素添加到新的course-box中
        newCourseBox.appendChild(img);
        newCourseBox.appendChild(h2);
        newCourseBox.appendChild(p);
        newCourseBox.appendChild(joinButton);
        // newCourseBox.appendChild(lable);
        // 获取course-container元素，并将新的course-box添加到其中
        var courseContainer = document.querySelector(".course-content-container");
        courseContainer.appendChild(newCourseBox);

    });

    // 添加点击事件监听器到每个 course-box 元素
    document.querySelectorAll(".course-box").forEach(function(courseBox) {
        courseBox.addEventListener("click", async function() {
            // 获取相应的数据，例如根据 courseBox 内的 subject 获取数据
            const subject = courseBox.querySelector("h2").textContent; // 从 h2 元素中获取 subject
            const topic = courseBox.querySelector("p").textContent; // 从 h2 元素中获取 subject
            const course =  await DB_API.getQuestion(topic);
            const coursemember = await DB_API.getCoursemember(topic);
            // 在这里，你可以根据 subject 从数据库或其他数据源中获取相关内容
            // 假设获取到了 title 和 content 数据
            const title = "标题示例：" + subject;
            const content = "内容示例：" + topic;
            const text = "問題一：" + course.question1;
            var ml = document.getElementById("memberlist");
            coursemember.forEach((coursememberData, index) => {
                // 這裡假設每個任務都是一個對象，您可以根據您的數據結構進行調整
                ml.innerHTML = `<ol><li>${index + 1} . ${coursememberData.name}</li></ol>`;
            });
     
            // 填充模态对话框的内容
            document.getElementById("modalTitle").textContent = title;
            document.getElementById("modalContent").textContent = content;
            document.getElementById("modalQuestion1").textContent = text;
            // 打开模态对话框
            const modal = document.getElementById("courseModal");
            modal.style.display = "flex";
            });
    });

    // 关闭模态对话框的按钮
    document.querySelector(".close").addEventListener("click", function() {
    const modal = document.getElementById("courseModal");
    modal.style.display = "none";
    });
});





