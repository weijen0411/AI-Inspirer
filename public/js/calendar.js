document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    // initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
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
    // events: [
    //   {
    //     title: 'All Day Event',
    //     start: '2023-09-01'
    //   },
    //   {
    //     groupId: '999',
    //     title: 'Repeating Event',
    //     start: '2023-09-09T16:00:00'
    //   },
    //   {
    //     title: 'Conference',
    //     start: '2023-09-11',
    //     end: '2023-09-13'
    //   },
    //   {
    //     title: 'Meeting',
    //     start: '2023-09-12T10:30:00',
    //     end: '2023-09-12T12:30:00'
    //   },
    //   {
    //     title: 'Click for Google',
    //     url: 'https://google.com/',
    //     start: '2023-09-28'
    //   }
    // ]
  });

  calendar.render();

});
