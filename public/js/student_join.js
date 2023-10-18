// 获取元素
const selectElement = document.getElementById("room");
const roomContentElement = document.getElementById("roomContent");
const submitButton = document.getElementById("startChatButton");

const fetchCourseID = async () =>{
    const userID = sessionStorage.getItem('userId');
    const coursesID = await DB_API.getUserCoursesID(userID);

    return coursesID;
};

// 測試代碼
// (async ()=> {
//     const tempt = await fetchCourseID();
//     console.log(tempt);
// })();

document.addEventListener('DOMContentLoaded', async function () {
    const courseID = await fetchCourseID();
    const courseRoomAndID = [];

    // 使用 Promise.all 等待所有课程数据获取完成
    await Promise.all(courseID.map(async (courseID) => {
        // 获取每个课程的数据
        const courseData = await DB_API.getCourseData(courseID);

        const option = document.createElement("option");
        option.value = courseData.room;
        option.text = courseData.room;
        selectElement.appendChild(option);

        courseRoomAndID.push({courseID, room: courseData.room});
    }));
    
    // 添加事件监听器，当<select>的值发生变化时触发
    selectElement.addEventListener("change", async () => {
        const selectedRoom = selectElement.value; // 获取选中的房间值

        submitButton.disabled = false;

        await Promise.all(courseRoomAndID.map(async (courseroomanddata) => {
            if (selectedRoom === courseroomanddata.room) {
                const courseData = await DB_API.getCourseData(courseroomanddata.courseID);

                // 清空roomContentElement
                roomContentElement.innerHTML = "";

                var subjectDiv = document.createElement("div");
                subjectDiv.innerHTML =  `科目: ${courseData.subject}`;
                roomContentElement.appendChild(subjectDiv);

                var topicDiv = document.createElement("div");
                topicDiv.innerHTML = `探討主題: ${courseData.topic}`;
                roomContentElement.appendChild(topicDiv);

            }
        }))


    });

});

