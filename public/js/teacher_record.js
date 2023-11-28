// const updatebtn = document.querySelector('#updatebtn');
const nametInput = document.querySelector('#name');
const accountInput = document.querySelector('#account');
const passwordInput = document.querySelector('#password');

const fetchData = async () =>{
    const account = sessionStorage.getItem('account');
    const write = await DB_API.getTeacherdata(account);

    nametInput.textContent = write.name;
    accountInput.textContent = write.account;
    passwordInput.textContent = write.password;       
}
fetchData();


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