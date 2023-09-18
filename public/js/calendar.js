$('#calendar').fullCalendar({
    editable: true,
    events: [{
      title: '昨天的活動',
      start: moment().subtract(1, 'days').format('YYYY-MM-DD')
    }, {
      title: '持續一周的活動',
      start: moment().add(7, 'days').format('YYYY-MM-DD'),
      end: moment().add(14, 'days').format('YYYY-MM-DD'),
      color: 'lightBlue'
    }],
    dayClick: function(date, event, view) {
      console.log('add event');
      console.log(date);
      console.log(event);
      console.log(view);
    },
    eventClick: function(date, event, view) {
      console.log('modify event');
      console.log(date);
      console.log(event);
      console.log(view);
    }
  });
  
  $('#calendar').fullCalendar('renderEvent', {
    title: '明天的活動',
    start: moment().add(1, 'days').format('YYYY-MM-DD')
  });
  
  $('#calendar').fullCalendar('renderEvent', {
    id: 'eventGroup1',
    title: '活動1',
    start: moment().add(3, 'days').format('YYYY-MM-DD'),
    textColor: 'black',
    color: 'beige'
  });
  
  $('#calendar').fullCalendar('renderEvent', {
    id: 'eventGroup1',
    title: '活動2',
    start: moment().add(5, 'days').format('YYYY-MM-DD'),
    textColor: 'black',
    color: 'beige'
  });
  