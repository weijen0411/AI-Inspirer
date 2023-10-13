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
var createButton = document.getElementById("createBtn");
createButton.onclick = async function() {

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

    await DB_API.addCourses(courseData);
    // 创建course-box内的h2和p元素
    var h2 = document.createElement("h2");
    h2.textContent = selectedText;
    
    var p = document.createElement("p");
    p.textContent = topicValue;
    
    // 将h2和p元素添加到新的course-box中
    newCourseBox.appendChild(h2);
    newCourseBox.appendChild(p);
    
    // 获取course-container元素，并将新的course-box添加到其中
    var courseContainer = document.querySelector(".course-container");
    courseContainer.appendChild(newCourseBox);

    // 最后，关闭 modal dialog
    modal.style.display = "none";
}


document.addEventListener('DOMContentLoaded', async function() {
    const courses = await DB_API.getCourses();
    // 遍歷courses數組，獲取每個物件中的topic和subject
    courses.forEach(course => {
        const topic = course.topic;
        const subject = course.subject;
        
        // 创建一个新的course-box元素
        var newCourseBox = document.createElement("div");
        newCourseBox.className = "course-box";
        
        // 创建course-box内的h2和p元素
        var h2 = document.createElement("h2");
        h2.textContent = subject;
        
        var p = document.createElement("p");
        p.textContent = topic;
        
        // 将h2和p元素添加到新的course-box中
        newCourseBox.appendChild(h2);
        newCourseBox.appendChild(p);
        
        // 获取course-container元素，并将新的course-box添加到其中
        var courseContainer = document.querySelector(".course-container");
        courseContainer.appendChild(newCourseBox);

    });
});

