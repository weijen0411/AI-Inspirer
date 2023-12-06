const userId = sessionStorage.getItem('userId');
sessionStorage.setItem('start', "");
sessionStorage.setItem('end', "");
sessionStorage.setItem('eventId', "");


document.addEventListener('DOMContentLoaded', async function() {
  var calendarEl = document.getElementById('calendar');
  const userEventDate = await DB_API.getEventData(userId);

  var calendar = new FullCalendar.Calendar(calendarEl, {
    customButtons: {
      addEventButton: {
        text: '新增事件',
        click: async function() {
          var eventTitle = window.prompt('請輸入名稱：', '');

          // 在這裡你可以處理用戶輸入的標題
          if (eventTitle == null || "") {
            alert('您取消了輸入。');
          } else if (eventTitle == "") {
            alert('沒有輸入名稱');
          } else if (sessionStorage.getItem('start') == "" || sessionStorage.getItem('end') == "") {
            alert('沒有選擇日期');
          } else {
            const eventData = {
              title: eventTitle,
              start: sessionStorage.getItem('start'),
              end: sessionStorage.getItem('end')
            };
            const writePromise = await DB_API.addEventData(userId, eventData);
            
            if (writePromise) {
              location.assign('./teacher_calendar.html'); // 寫入成功後進行導航
            }
          }
        }
      },
      deleteEventButton: {
        text: '刪除事件',
        click: async function() {
          var deleteConfirm = window.confirm('確認刪除事件嗎?');
          if (deleteConfirm == true) {
            eventId = sessionStorage.getItem('eventId');

            if (eventId == null || eventId == "") {
              alert('沒有選取事件!');
            } else {
              const deletePromise = await DB_API.deleteEvent(userId, eventId);
              if (deletePromise) {
                location.assign('./tescher_calendar.html'); // 寫入成功後進行導航
              }
            }
          } else {
            alert('你已取消刪除!');
          }
        }
      }
    },

    headerToolbar: {
      left: 'prev,next today addEventButton deleteEventButton',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    locale: 'zh-tw',
    weekNumbers: true,
    navLinks: true, // can click day/week names to navigate views
    selectable: true,
    editable: true,
    droppable: true, // this allows things to be dropped onto the calendar  
    dayMaxEvents: true,
    events: userEventDate,
    eventColor: '#a5a09c',
    
    select: function(info) {
      sessionStorage.setItem('start', info.startStr);
      sessionStorage.setItem('end', info.endStr);
    },
    eventClick: async function(info) {
      const eventId = await DB_API.getEventID(userId, info.event.title, info.event.startStr, info.event.endStr);
      sessionStorage.setItem('eventId', eventId);
    },
    eventDrop: async function(info) {  
      if (!confirm("你確定要進行移動嗎?")) {
        info.revert();
      }
      else {
        const eventId = await DB_API.getEventID(userId, info.oldEvent.title, info.oldEvent.startStr, info.oldEvent.endStr);
        const eventData = {
          title: info.oldEvent.title,
          start: info.event.startStr,
          end: info.event.endStr
        };
        const writePromise = await DB_API.updateEvent(userId, eventId, eventData);
        if (writePromise) {
          location.assign('./calendar.html'); // 寫入成功後進行導航
        }
      }
    },
    eventResize: async function(info) {
      const eventId = await DB_API.getEventID(userId, info.oldEvent.title, info.oldEvent.startStr, info.oldEvent.endStr);
      const eventData = {
        title: info.oldEvent.title,
        start: info.event.startStr,
        end: info.event.endStr
      };
      await DB_API.updateEvent(userId, eventId, eventData);

    }
  });


  calendar.render();

});
