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

    const userLogin = await DB_API.getUser(account,password);

    if(userLogin === 'user not found') alert('未找到該帳號');
    else if (userLogin === 'wrong password') alert('密碼錯誤');
    else if(userLogin === 'logged in') {
        sessionStorage.setItem('account',account);
        location.assign('./select.html');
    }
}