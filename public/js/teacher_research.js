const account = sessionStorage.getItem('account');

// 获取打开和关闭 modal dialog 的元素
var openModalButton = document.getElementById("addCourse");
var modal = document.getElementById("myModal");
var modalcontent = document.getElementById("addmodal");

// 点击 "新增课程" 按钮时打开 modal dialog
openModalButton.onclick = function() {
    modal.style.display = "block";
    modalcontent.style.left = "50%";
}

// 当用户点击 modal 之外的区域时关闭 modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// 点击 "取消" 按钮时关闭 modal
var cancelButton = document.getElementById("cancelBtn");
cancelButton.onclick = function() {
    modal.style.display = "none";
}


document.addEventListener('DOMContentLoaded', async function() {
    const courses = await DB_API.getCourses();
    console.log(courses);
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
        else if (subject === '國文') {
            img.src = '../img/chinese.png'; // 根据实际图像路径设置
            img.className = "course-history-img";
            img.alt = '國文圖片';
        } 
        else if (subject === '英文') {
            img.src = '../img/english.png'; // 根据实际图像路径设置
            img.className = "course-history-img";
            img.alt = '英文圖片';
        } 
        else if (subject === '數學') {
            img.src = '../img/math.png'; // 根据实际图像路径设置
            img.className = "course-history-img";
            img.alt = '數學圖片';
        } 
        else if (subject === '地理') {
            img.src = '../img/geography.png'; // 根据实际图像路径设置
            img.className = "course-history-img";
            img.alt = '地理圖片';
        } 
        else if (subject === '公民') {
            img.src = '../img/Civics.png'; // 根据实际图像路径设置
            img.className = "course-history-img";
            img.alt = '公民圖片';
        } 
        else if (subject === '化學') {
            img.src = '../img/Chemical.png'; // 根据实际图像路径设置
            img.className = "course-history-img";
            img.alt = '化學圖片';
        } 
        else if (subject === '物理') {
            img.src = '../img/physics.png'; // 根据实际图像路径设置
            img.className = "course-history-img";
            img.alt = '物理圖片';
        } 
        
       // 创建course-box内的h2和p元素
        var h2 = document.createElement("h2");
        h2.textContent = subject;
        
        var p = document.createElement("p");
        p.textContent = topic;
        
        // 将h2和p元素添加到新的course-box中
        newCourseBox.appendChild(img);
        newCourseBox.appendChild(h2);
        newCourseBox.appendChild(p);
        
        // 获取course-container元素，并将新的course-box添加到其中
        var courseContainer = document.querySelector(".course-container");
        courseContainer.appendChild(newCourseBox);
    });

    // 添加点击事件监听器到每个 course-box 元素
    document.querySelectorAll(".course-box").forEach(function(courseBox) {

        const courseEditButton = document.getElementById("courseContentEditButton");
        const courseSaveButton = document.getElementById("courseContentSaveButton");
        const titleElement = document.getElementById("modalTitle");
        const contentElement = document.getElementById("modalContent");
        const questionsElement = document.getElementById("modalQuestion");


        courseBox.addEventListener("click", async function() {
  
            const course_id = courseBox.getAttribute("id");
            const courseData = await DB_API.getCourseData(course_id);


            const subject = courseData.subject;
            const topic = courseData.topic;

            const courseQuestion =  await DB_API.getQuestion(course_id);

            const courseMember = await DB_API.getCourseMember(course_id);

            // 将原始数据显示在模态对话框中，包装在<span>中
            titleElement.innerHTML = `<span>科目  ${subject}</span>`;
            contentElement.innerHTML = `<span><br>探討主題<br></span><span><br>${topic}</span>`;

            // 清空原始的问题内容
            questionsElement.innerHTML = "";

            // 使用forEach循环遍历courseQuestion数组并添加每个问题
            courseQuestion.forEach((question, index) => {
                const questionElement = document.createElement("span");
                questionElement.innerHTML = `<span>問題 ${index + 1}<br></span><span><br>${question}<br><br></span>`;
                questionsElement.appendChild(questionElement);
            });


            // 点击编辑按钮时
            courseEditButton.addEventListener("click", function() {

                // 启用编辑模式，只替换需要编辑的部分为输入框
                titleElement.innerHTML = `<span>科目 </span><input type="text" id="editTitle" value="${subject}" />`;
                contentElement.innerHTML = `<span><br>探討主題<br></span><br><input type="text" id="editContent" value="${topic}" />`;
                // 清空原始的问题内容
                questionsElement.innerHTML = "";

                // 使用forEach循环遍历courseQuestion数组并添加每个问题的编辑输入框
                courseQuestion.forEach((question, index) => {
                    const questionElement = document.createElement("div");
                    questionElement.innerHTML = `<span>問題 ${index + 1}</span><br><input type="text" id="editQuestion${index + 1}" value="${question}" />`;
                    questionsElement.appendChild(questionElement);
                });


                // 隐藏编辑按钮
                courseEditButton.style.display = "none";

                // 显示保存按钮
                courseSaveButton.style.display = "block";
            });

            // 点击保存按钮时
            courseSaveButton.addEventListener("click", async function() {
                // 获取用户编辑后的值
                const editedSubject = document.getElementById("editTitle").value;
                const editedTopic = document.getElementById("editContent").value;
                const editedQuestions = [];

                // 遍历问题输入框，读取每个问题的值
                courseQuestion.forEach((question, index) => {
                    const editedQuestion = document.getElementById(`editQuestion${index + 1}`).value;
                    editedQuestions.push(editedQuestion);
                });

                const updateData = {
                    subject: editedSubject,
                    topic: editedTopic,
                };
                
                // 添加每个问题到更新数据对象
                editedQuestions.forEach((question, index) => {
                    updateData[`question${index + 1}`] = question;
                });

                // 更新模态对话框中的内容
                titleElement.innerHTML = `<span>科目 ${editedSubject}</span>`;
                contentElement.innerHTML = `<span><br>探討主題<br></span><span><br>${editedTopic}</span>`;
                // 更新问题内容
                questionsElement.innerHTML = "";
                editedQuestions.forEach((editedQuestion, index) => {
                    const questionElement = document.createElement("div");
                    questionElement.innerHTML = `<span>問題 ${index + 1}<br></span><span><br>${editedQuestion}<br><br></span>`;
                    questionsElement.appendChild(questionElement);
                });

                await DB_API.updateCourseData(course_id, updateData);
        
                // 保存更改到数据库
                // 编写数据库更新代码，将editedSubject、editedTopic和editedQuestion1保存到数据库中

                // 显示编辑按钮
                courseEditButton.style.display = "block";

                // 隐藏保存按钮
                courseSaveButton.style.display = "none";

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

            // 显示编辑按钮
            courseEditButton.style.display = "block";

            // 隐藏保存按钮
            courseSaveButton.style.display = "none";

            window.onclick = function(event) {
                if (event.target == modal) {
                    window.location.reload();
                    // modal.style.display = "none";
                }
            }
        });
            
            
    
    });

});



document.getElementById("addQuestionButton").addEventListener("click", function() {
    // 创建一个新的问题和答案字段
    var questionDiv = document.createElement("div");
    questionDiv.className = "form-group";
    
    var questionLabel = document.createElement("label");
    questionLabel.textContent = "問答";

    // 创建一个删除按钮
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "-";
    deleteButton.className = "deleteButton"; // 添加类名

    var questionTextarea = document.createElement("textarea");
    questionTextarea.placeholder = "請輸入問答";
    
    document.getElementById("questionContainer").appendChild(questionDiv);

    deleteButton.addEventListener("click", function() {
        // 当删除按钮被点击时，删除对应的问题和答案字段
        questionDiv.remove();
    });
    
    // 将问题、答案和删除按钮添加到容器中
    questionDiv.appendChild(questionLabel);
    questionDiv.appendChild(deleteButton);
    questionDiv.appendChild(questionTextarea);

    
    document.getElementById("questionContainer").appendChild(questionDiv);
  });
  

  // 点击 "建立" 按钮时执行建立课程的操作
document.getElementById("createBtn").addEventListener("click", async function() {
    var questionTextareas = document.querySelectorAll("#questionContainer textarea");
    var topicTextarea = document.getElementById("topic");

    // 遍历每个textarea并检查是否为空
    var allTextareasFilled = true;
    var questionsAndAnswers = [];

    questionTextareas.forEach(function(textarea) {
        if (textarea.value.trim() === "") {
          allTextareasFilled = false;
        }
        var question = textarea.value;
        questionsAndAnswers.push(question);
    });
      
    if (topicTextarea.value.trim() === "") {
        allTextareasFilled = false;
    }

    if (allTextareasFilled) {
        // 获取<select>元素
        var subjectElement = document.getElementById("chooseSubject");
        var selectedText = subjectElement.options[subjectElement.selectedIndex].text;
        const teacherData = await DB_API.getTeacherdata(account)
        
        var topicValue = document.getElementById("topic").value;

        // 创建一个新的course-box元素
        var newCourseBox = document.createElement("div");
        newCourseBox.className = "course-box";
        

        const courseData = {
            subject: selectedText,
            teacher: teacherData.name,
            topic: topicValue
        };
        
        questionsAndAnswers.forEach(function (question, index) {
            courseData['question' + (index + 1)] = question;
        });
        await DB_API.addCourses(courseData);

        // 最后，关闭 modal dialog
        modal.style.display = "none";
        window.location.reload();
    } else {
        // 至少一个textarea为空，显示错误消息或其他处理
        alert("请填写所有问题和答案。");
  }
});