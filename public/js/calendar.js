document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var today = new Date();

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    initialDate: today.toISOString().split('T')[0],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    locale: 'zh-tw',
    editable: true,  
    dayMaxEvents: true,
    events: [
      {
        title: 'All Day Event',
        start: '2023-09-01'
      },
      {
        title: 'Long Event',
        start: '2023-09-07',
        end: '2023-09-10'
      },
      {
        groupId: '999',
        title: 'Repeating Event',
        start: '2023-09-09T16:00:00'
      },
      {
        groupId: '999',
        title: 'Repeating Event',
        start: '2023-09-16T16:00:00'
      },
      {
        title: 'Conference',
        start: '2023-09-11',
        end: '2023-09-13'
      },
      {
        title: 'Meeting',
        start: '2023-09-12T10:30:00',
        end: '2023-09-12T12:30:00'
      },
      {
        title: 'Meeting',
        start: '2023-09-12T10:30:00',
        end: '2023-09-12T12:30:00'
      },
      {
        title: 'Meeting',
        start: '2023-09-12T10:30:00',
        end: '2023-09-12T12:30:00'
      },
      {
        title: 'Meeting',
        start: '2023-09-12T10:30:00',
        end: '2023-09-12T12:30:00'
      },
      {
        title: 'Lunch',
        start: '2023-09-12T12:00:00'
      },
      {
        title: 'Meeting',
        start: '2023-09-12T14:30:00'
      },
      {
        title: 'Birthday Party',
        start: '2023-09-13T07:00:00'
      },
      {
        title: 'Click for Google',
        url: 'https://google.com/',
        start: '2023-09-28'
      }
    ]
  });

  calendar.render();
});