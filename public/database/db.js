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

    async getTeachers() {
        const getTeachers = await db.collection('teachers').get();
        return getTeachers.docs.map(teacher => teacher.data());
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

    async getTeacher(account, password) {
        const getTeacher = await db.collection('teachers').where('account', '==', account).get();
        if (getTeacher.empty) return 'teacher not found';
        const teacherData = getTeacher.docs[0].data();
        if (teacherData.password !== password) return 'wrong password';

        return 'logged in';
    }

    async getUserID(account, password) {
        try {
            const querySnapshot = await db.collection('users')
                .where('account', '==', account)
                .where('password', '==', password)
                .get();
            if (!querySnapshot.empty) {
                // 如果找到匹配的用户记录，您可以获取第一个匹配的事件的ID
                const userID = querySnapshot.docs[0].id;
                return userID;
            } else {
                console.log('未找到符合的使用者紀錄');
                return null; // 或者可以返回其他适当的值，表示未找到匹配记录
            }
        } catch (error) {
            console.error('查詢出错:', error);
            return null; // 处理错误情况，也可以返回其他适当的值
        }
    }

    async getTeacherID(account, password) {
        try {
            const querySnapshot = await db.collection('teachers')
                .where('account', '==', account)
                .where('password', '==', password)
                .get();
            if (!querySnapshot.empty) {
                // 如果找到匹配的用户记录，您可以获取第一个匹配的事件的ID
                const userID = querySnapshot.docs[0].id;
                return userID;
            } else {
                console.log('未找到符合的使用者紀錄');
                return null; // 或者可以返回其他适当的值，表示未找到匹配记录
            }
        } catch (error) {
            console.error('查詢出错:', error);
            return null; // 处理错误情况，也可以返回其他适当的值
        }
    }

    async addUsers(postData) {
        try {
            const dbref = await db.collection('users').doc();
            await dbref.set(postData);
            return true; // 返回成功状态
        } catch (error) {
            throw error; // 抛出错误，以便在调用方进行错误处理
        }
    }

    async updateUsers(newData) {
        // const getUser = (await db.collection('users').where('account', '==', account).get()).docs[0];
        // if (!getUser) return 'user not found';
        const dbref = await db.collection('users').doc();
        return dbref.update(newData);
    }

    //輸入:帳號
    //輸出:該帳號資料
    async getUserdata(account) {
        const getUser = await db.collection('users').where('account', '==', account).get();
        if (getUser.empty) return 'user not found';
        const userData = getUser.docs[0].data();
        
        return userData;
    }

    async getTeacherdata(account) {
        const getTeacher = await db.collection('teachers').where('account', '==', account).get();
        if (getTeacher.empty) return 'user not found';
        const teacherData = getTeacher.docs[0].data(); // 獲取第一個文件的數據

        return teacherData; // 返回教師文件的所有欄位數據
    }

    async getEventData(userId) {
        try {
            // 先在 "users" 集合中查找用户文档
            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();
    
            // 检查用户文档是否存在
            if (!userDoc.exists) {
                return 'User not found';
            }
    
            // 然后在 "events" 集合中查找名为 "test" 的事件文档
            const eventRef = userRef.collection('events');
            const eventsSnapshot = await eventRef.get();
            
            const eventsData = [];
            eventsSnapshot.forEach((doc) => {
                const eventData = doc.data();
                // 将文档的ID添加到事件数据中
                eventData.id = doc.id;
                eventsData.push(eventData);
            });

            // 返回事件数据数组
            return eventsData;
        } catch (error) {
            console.error('無法得到event資料', error);
            return '無法得到event資料';
        }
    }

    async addEventData(userId, eventData) {
        try {
            // 先在 "users" 集合中查找用户文档
            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();
    
            // 检查用户文档是否存在
            if (!userDoc.exists) {
                return 'User not found';
            }
    
            // 然后在 "events" 集合中查找名为 "test" 的事件文档
            const eventRef = userRef.collection('events').doc();
            await eventRef.set(eventData);
            return true; // 返回成功状态
        } catch (error) {
            console.error('無法新增event資料', error);
            return '無法新增event資料';
        }
    }
    
    async getEventID(userId, title, start, end) {
        try {
            const userRef = db.collection('users').doc(userId);

            const querySnapshot = await userRef.collection('events')
                .where('title', '==', title)
                .where('start', '==', start)
                .where('end', '==', end)
                .get();
            if (!querySnapshot.empty) {
                // 如果找到匹配的用户记录，您可以获取第一个匹配的事件的ID
                const eventID = querySnapshot.docs[0].id;
                return eventID;
            } else {
                console.log('未找到符合的使用者事件');
                return null; // 或者可以返回其他适当的值，表示未找到匹配记录
            }
        } catch (error) {
            console.error('查詢出錯:', error);
            return null; // 处理错误情况，也可以返回其他适当的值
        }
    }

    async updateEvent(userId, eventId, newEvent) {
        const dbref = await db.collection('users').doc(userId);
        const dbevent = await dbref.collection('events').doc(eventId);
        return dbevent.update(newEvent);
    }

    async deleteEvent(userId, eventId) {
        const dbref = db.collection('users').doc(userId);
        const dbevent = dbref.collection('events').doc(eventId);

        try {
            await dbevent.delete();
            console.log('刪除成功');
            return true;
        } catch (error) {
            console.error('刪除失敗', error);
            return false;
        }
    }

    // courses 主題
    async getCourses() {
        // 引用 "courses" 集合
        const coursesCollection = await db.collection("courses");
      
        try {
          const courseData = [];
      
          // 获取 "courses" 集合中的所有文档
          const querySnapshot = await coursesCollection.get();
      
          querySnapshot.forEach((doc) => {
            // 获取每个文档的 "subject" 和 "topic" 字段
            const data = doc.data();
            const subject = data.subject;
            const topic = data.topic;
            const question1 = data.question1;
            const teacher = data.name
      
            // 将数据存入数组
            courseData.push({ subject, teacher, topic, question1 });
          });
      
          // 返回储存了所有文档数据的数组
          return courseData;
        } catch (error) {
          console.error("获取文档时出错：", error);
          throw error; // 可以选择抛出错误以便在调用方处理
        }
    }

    async addCourses(coursesData) {
        try {
            const dbref = await db.collection('courses').doc();
            await dbref.set(coursesData);
            return true; // 返回成功状态
        } catch (error) {
            throw error; // 抛出错误，以便在调用方进行错误处理
        }
    }

    async getQuestion(topic) {
        try {
            const querySnapshot = await db.collection('courses')
                .where("topic", "==", topic).get();
            if (!querySnapshot.empty) {
                // 如果找到匹配的用户记录，您可以获取第一个匹配的事件的ID
                const Question = querySnapshot.docs[0].data();
                return Question;
            } else {
                console.log('未找到符合的問題紀錄');
                return null; // 或者可以返回其他适当的值，表示未找到匹配记录
            }
        } catch (error) {
            console.error('查詢出错:', error);
            return null; // 处理错误情况，也可以返回其他适当的值
        }
    }

    // get 個人資料中的任務清單id
    async getUserCoursesID(userID) {
        try {
            const dbref = await db.collection('users').doc(userID);
            const missionQuerySnapshot = await dbref.collection('mission').get();
    
            const courseIDs = [];
            missionQuerySnapshot.forEach((doc) => {
                const missionData = doc.data();
                const courseID = missionData.course_id;
                if (courseID) {
                    courseIDs.push(courseID);
                }
            });
    
            return courseIDs;
        } catch (error) {
            throw error; // 抛出错误，以便在调用方进行错误处理
        }
    }

    // get 任務清單id 的詳細資料
    async getCourseData(courseID) {
        try {
            const courseRef = db.collection("courses").doc(courseID);
            const courseDoc = await courseRef.get();
    
            if (courseDoc.exists) {
                // 提取课程文档的所有数据
                const courseData = courseDoc.data();
                return courseData;
            } else {
                console.log("找不到指定的课程文档");
                return null;
            }
        } catch (error) {
            console.error("获取文档时出错：", error);
            throw error; // 抛出错误，以便在调用方处理
        }
    }

    async addCoursemember(topic, memberData) {
        try {
            const querySnapshot = await db.collection('courses')
            .where("topic", "==", topic).get();
            if (!querySnapshot.empty) {
                // 如果找到匹配的用户记录，您可以获取第一个匹配的事件的ID
                const courseid = querySnapshot.docs[0].id;
                const courseRef = db.collection('courses').doc(courseid);
                const memberRef = courseRef.collection('member').doc();
                const getmember = await courseRef.collection('member').where('account', '==', account).get();
                if (getmember.empty){
                    await memberRef.set(memberData);
                    alert('加入成功!'); 
                    return true; // 返回成功状态
                } else{
                    console.log('已加入此任務');
                    alert('已加入此任務');
                    return '已加入';
                } 
            }
        } catch (error) {
            console.error('無法新增member資料', error);
            return '無法新增member資料';
        }
    }

    async getCoursemember(topic) {
        try {
            const querySnapshot = await db.collection('courses')
            .where("topic", "==", topic).get();
            if (!querySnapshot.empty) {
                // 如果找到匹配的用户记录，您可以获取第一个匹配的事件的ID
                const courseid = querySnapshot.docs[0].id;
                const courseRef = db.collection('courses').doc(courseid);
                const memberRef = courseRef.collection('member');
                const membeSnapshot = await memberRef.get();

                const membersData = [];
                membeSnapshot.forEach((doc) => {
                    const memberData = doc.data();
                    // 将文档的ID添加到事件数据中
                    memberData.id = doc.id;
                    membersData.push(memberData);
            });
            // 返回事件数据数组
            return membersData;
            }
        } catch (error) {
            console.error('無法得到member資料', error);
            return '無法得到member資料';
        }
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