const account = sessionStorage.getItem('account');

// 获取打开和关闭 modal dialog 的元素
var openModalButton = document.getElementById("addCourse");
var modal = document.getElementById("myModal");

// 点击 "新增课程" 按钮时打开 modal dialog
openModalButton.onclick = function() {
    modal.style.display = "block";
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



document.addEventListener('DOMContentLoaded', async function() {
    const courses = await DB_API.getCourses();
    // 遍歷courses數組，獲取每個物件中的topic和subject
    courses.forEach(course => {
        const topic = course.topic;
        const subject = course.subject;
        
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
        
        // 将h2和p元素添加到新的course-box中
        newCourseBox.appendChild(img);
        newCourseBox.appendChild(h2);
        newCourseBox.appendChild(p);
        
        // 获取course-container元素，并将新的course-box添加到其中
        var courseContainer = document.querySelector(".course-container");
        courseContainer.appendChild(newCourseBox);

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
  
