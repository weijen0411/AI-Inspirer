//取得網頁上的元件
const accountInput = document.querySelector('#account');
const passwordInput = document.querySelector('#password');
const loginBtn = document.querySelector('#login');

//把登入事件綁定給按鈕
//function前記得加async
//所有DB_API...的操作前加await
loginBtn.onclick = async () => {
    const account = accountInput.value;
    const password = passwordInput.value;

    //確定輸入框都不是空的
    if(!account || !password)
        return alert('請輸入帳號跟密碼');

    const teacherLogin = await DB_API.getTeacher(account,password);

    if(teacherLogin === 'teacher not found') alert('未找到該帳號');
    else if (teacherLogin === 'wrong password') alert('密碼錯誤');
    else if(teacherLogin === 'logged in') {
        const userId = await DB_API.getTeacherID(account, password);
        sessionStorage.setItem('account',account);
        sessionStorage.setItem('userId', userId);
        location.assign('./select.html');
    }
}