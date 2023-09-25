//取得網頁上的元件
const nametInput = document.querySelector('#name');
const accountInput = document.querySelector('#account');
const passwordInput = document.querySelector('#password');
const loginBtn = document.querySelector('#register');

loginBtn.onclick = async () => {
const name = nametInput.value;
const account = accountInput.value;
const password = passwordInput.value;
//確定輸入框都不是空的
if(!account || !password)
    return alert('請輸入帳號跟密碼');

const postData = {
    name:$('#name').val(),
    account:$('#account').val(),
    password:$('#password').val()
};
const userLogin = await DB_API.getUser(account,password);
// const usersignup = await 
if(userLogin === 'user not found') {
    try {
        const writePromise = await DB_API.addUsers(postData);
        // 使用 confirm 对话框替代 alert
        const confirmed = confirm('註冊成功!');
        if (confirmed) {
            // 如果用户确认，等待数据库写入完成后进行页面导航
            if (writePromise) {
                location.assign('./index.html'); // 寫入成功後進行導航
            }
        }
    } catch (error) {
        console.error('註冊失敗', error); // 處理寫入失敗的情況
    }
    } else {
    alert('帳號已存在');
    }
}