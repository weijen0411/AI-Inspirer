
// 获取要插入元素的父元素
var ulElement = document.querySelector(".dropdown-menu");

const fetchData = async () =>{
    const userAccount = sessionStorage.getItem('account');
    const userID = sessionStorage.getItem('userId');

    const write = await DB_API.getUserdata(userAccount);
    const coursesID = await DB_API.getUserCoursesID(userID);
    
    var userInfo = {
        name: write.name,
        account: write.account,
        password: write.password,
        mission: []
    };

    // 使用 Promise.all 等待所有课程数据获取完成
    await Promise.all(coursesID.map(async (courseID) => {
        // 获取每个课程的数据
        const courseData = await DB_API.getCourseData(courseID);
        userInfo.mission.push(courseData);
    }));

    return userInfo;
};

document.addEventListener('DOMContentLoaded', async function() {

    // 从 fetchData 函数获取用户信息
    const userInfo = await fetchData();

    // 创建并插入姓名元素
    var nameLi = document.createElement("li");
    nameLi.innerHTML = `<span class="dropdown-item-text">姓名：<label class="info fs-5" id="name" type="text">${userInfo.name}</label></span>`;
    ulElement.appendChild(nameLi);

    // 创建并插入帐号元素
    var accountLi = document.createElement("li");
    accountLi.innerHTML = `<span class="dropdown-item-text">帳號：<label class="info fs-5" id="account" type="text">${userInfo.account}</label></span>`;
    ulElement.appendChild(accountLi);

    // 创建并插入密码元素
    var passwordLi = document.createElement("li");
    passwordLi.innerHTML = `<span class="dropdown-item-text">密碼：<label class="info fs-5" id="password" type="text">${userInfo.password}</label></span>`;
    ulElement.appendChild(passwordLi);


    // 创建并插入任務元素
    var missionLi = document.createElement("li");

    // 創建一個存放任務數據的 HTML 字符串
    var missionHTML = `<span class="dropdown-item-text">任務：<ul class="info fs-5" id="mission">`;

    userInfo.mission.forEach((missionData, index) => {
        // 這裡假設每個任務都是一個對象，您可以根據您的數據結構進行調整
        missionHTML += `<li>${index + 1} : ${missionData.subject} ${missionData.topic}</li>`;

    });

    missionHTML += `</ul></span>`;

    missionLi.innerHTML = missionHTML;
    ulElement.appendChild(missionLi);

    // 创建分隔线元素
    var dividerLi = document.createElement("li");
    dividerLi.innerHTML = `<hr class="dropdown-divider">`;
    ulElement.appendChild(dividerLi);

    // 创建并插入登出选项
    var logoutLi = document.createElement("li");
    logoutLi.innerHTML = `<a class="dropdown-item fs-4" href="index.html">登出</a>`;
    ulElement.appendChild(logoutLi);

});




// updatebtn.onclick = async () => {
//     const { account } = sessionStorage;
//     // const name = nametInput.value;
//     // const account = accountInput.value;
//     // const password = passwordInput.value;
//     //確定輸入框都不是空的
//     if(!account || !password)
//         return alert('請輸入帳號跟密碼');
    
//     const update = await DB_API.getUser(account,password);
//     if(update) {
//         const newData = {
//         name:$('#name').val(),
//         account:$('#account').val(),
//         password:$('#password').val()
//         };
//         await DB_API.updateUsers(newData);
//         alert('更改成功');
// }
            
    // location.assign('./login.html', 2000);
    
// }