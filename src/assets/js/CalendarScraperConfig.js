formatGoogleCalendar.init({
    calendarUrl: 'https://www.googleapis.com/calendar/v3/calendars/roger@kazourmt.be/events?key=AIzaSyCR3-ptjHE-_douJsn8o20oRwkxt-zHStY',
    past: true,
    upcoming: true,
    sameDayTimes: true,
    pastTopN: 3,
    upcomingTopN: 20,
    recurringEvents: true,
    itemsTagName: 'div class="dateItem"',
    upcomingSelector: '#events-upcoming',
    pastSelector: '#events-past',
    upcomingHeading: '<h2>Binnenkort!</h2>',
    pastHeading: '<h2>Dit heb je gemist?</h2>',
    format: ['*dateDay*', '<div class="details">', '*summary*', ' : ', '*date*', ' &mdash; ', '*description*', ' @ ', '*location*', '</div>'],
    timeMin: '2000-06-03T10:00:00-07:00',
    timeMax: '2030-06-03T10:00:00-07:00'
  });