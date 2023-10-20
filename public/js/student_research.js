const account = sessionStorage.getItem('account');
var modal = document.getElementById("courseModal");

document.addEventListener('DOMContentLoaded', async function() {
    const courses = await DB_API.getCourses();
    // 遍歷courses數組，獲取每個物件中的topic和subject
    courses.forEach(course => {
        const topic = course.topic;
        const subject = course.subject;
        const courseID = course.docId;
        
        // 创建一个新的course-box元素
        var newCourseBox = document.createElement("div");
        newCourseBox.className = "course-box";
        newCourseBox.id = courseID;
        
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

        joinButton.addEventListener("click", async function() {
            const account = sessionStorage.getItem('account');
            const userID = sessionStorage.getItem('userId');
            const write = await DB_API.getUserdata(account);
            const memberData = {
                account: write.account,
                name: write.name
              };
            try{
                await DB_API.addCoursemember(topic, memberData);  
                await DB_API.addUsermission(userID, topic);
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

        const titleElement = document.getElementById("modalTitle");
        const contentElement = document.getElementById("modalContent");
        const questionsElement = document.getElementById("modalQuestion");

        courseBox.addEventListener("click", async function() {

            const course_id = courseBox.getAttribute("id");
            const courseData = await DB_API.getCourseData(course_id);

            // 获取相应的数据，例如根据 courseBox 内的 subject 获取数据
            const subject = courseData.subject; // 从 h2 元素中获取 subject
            const topic = courseData.topic; // 从 h2 元素中获取 subject


            const sendBtn = document.getElementById("sendBtn");
            const answers = document.querySelectorAll(".answers");
      

            const courseQuestion =  await DB_API.getQuestion(course_id);

            const courseMember = await DB_API.getCourseMember(course_id);

            const checkmember = await DB_API.checkCourseMember(course_id, account);

            if (checkmember === 'hide') {
                answers.forEach(answer => {
                    answer.style.display = "none";
                });
                sendBtn.style.display = "none";
            } else if (checkmember === 'show') {
                answers.forEach(answer => {
                    answer.style.display = "flex";
                });
                sendBtn.style.display = "flex";
            }

            // 将原始数据显示在模态对话框中，包装在<span>中
            titleElement.innerHTML = `<span>科目  ${subject}</span>`;
            contentElement.innerHTML = `<span><br>探討主題<br></span><span><br>${topic}</span>`;

            // 清空原始的问题内容
            questionsElement.innerHTML = "";

            // 使用forEach循环遍历courseQuestion数组并添加每个问题
            courseQuestion.forEach((question, index) => {
                const questionElement = document.createElement("span");
                questionElement.innerHTML = `<span><br><br>問題 ${index + 1}<br></span><span><br>${question}<br><br></span>`;

                // 创建<textarea>元素
                const answerTextarea = document.createElement("textarea");
                answerTextarea.className = "answers";
                answerTextarea.placeholder = "請輸入答案";

                
                // 将<textarea>元素添加到问题元素中
                questionElement.appendChild(answerTextarea);

                // 将问题元素添加到questionsElement中
                questionsElement.appendChild(questionElement);
            });

            var ml = document.getElementById("memberlist");
            ml.innerHTML = `<ol>`

            courseMember.forEach((coursememberData, index) => {
                // 這裡假設每個任務都是一個對象，您可以根據您的數據結構進行調整
                ml.innerHTML += `<li>${index + 1} . ${coursememberData.name}</li>`;
            });

            ml.innerHTML += `</ol>`
     

            // 打开模态对话框
            const modal = document.getElementById("courseModal");
            modal.style.display = "flex";

            
        });

        var coursemodal = document.getElementById("courseModal");
        window.onclick = function(event) {
            if (event.target == coursemodal) {
                coursemodal.style.display = "none";
            }
        }
    });
    // // 关闭模态对话框的按钮
    // document.querySelector(".close").addEventListener("click", function() {
    // const modal = document.getElementById("courseModal");
    // modal.style.display = "none";
    // });
});





