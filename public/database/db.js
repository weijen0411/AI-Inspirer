const firebaseConfig = {
	apiKey: "AIzaSyAGer98a7gsHMIdrlByjv4N1vsh45qbs54",
	authDomain: "chatroom-44068.firebaseapp.com",
	projectId: "chatroom-44068",
	storageBucket: "chatroom-44068.appspot.com",
	messagingSenderId: "1010427828241",
	appId: "1:1010427828241:web:149e2d8d6cec79f39ff9b0",
	measurementId: "G-GWG7QVFJ2J"
};
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

class API {

    
    //取得所有使用者資料
    async getUsers() {
        const getUsers = await db.collection('users').get();
        return getUsers.docs.map(user => user.data());
    }

    //輸入:帳號,密碼
    //輸出:是否有該使用者
    async getUser(account, password) {
        const getUser = await db.collection('users').where('account', '==', account).get();
        if (getUser.empty) return 'user not found';

        const userData = getUser.docs[0].data();
        if (userData.password !== password) return 'wrong password';

        return 'logged in';
    }

    async addUsers(postData) {
        const dbref = await db.collection("users").doc();
        dbref.set(postData);
    }

    async updateUsers(newData) {
        // const getUser = (await db.collection('users').where('account', '==', account).get()).docs[0];
        // if (!getUser) return 'user not found';
        const dbref = await db.collection("users").doc();
        return dbref.update(newData);
    }

    //輸入:帳號
    //輸出:該帳號資料
    async getUserdata(account) {
        const getUser = await db.collection('users').where('account', '==', account).get();
        if (!getUser) return 'user not found';
        return getUser.docs[0].data();
    }

    // //輸入:帳號
    // //輸出:該帳號所有測驗紀錄
    // async getTestLogs(account) {
    //     const getUser = (await db.collection('users').where('account', '==', account).get()).docs[0];
    //     if (!getUser) return 'account not found';

    //     const getTestLogs = await getUser.ref
    //         .collection('testLogs')
    //         .orderBy('time', 'desc')
    //         .get();

    //     return getTestLogs.docs.map(log => log.data());
    // }

    // //輸入:帳號、測驗主題、分數
    // //輸出:success/error
    // async postTestLog(account, title, score) {
    //     const getUser = (await db.collection('users').where('account', '==', account).get()).docs[0];
    //     if (!getUser) return 'account not found';

    //     const getTimeString = (dateObj) => {
    //         const year = dateObj.getFullYear();
    //         const month = dateObj.getMonth() + 1;
    //         const date = dateObj.getDate();

    //         const hour = dateObj.getHours().toString();
    //         const minute = dateObj.getMinutes().toString();

    //         return `${year}/${month}/${date} ${hour.length === 1 ? '0' + hour : hour}:${minute.length === 1 ? '0' + minute : minute}`;
    //     }

    //     const time = getTimeString(new Date());
    //     await getUser.ref.collection('testLogs').add({ title, score, time });

    //     return 'success';
    // }
}

const DB_API = new API();