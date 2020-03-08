"use strict";

window.formatGoogleCalendar = function () {

    'use strict';

    var config;

    var renderList = function renderList(data, settings) {
        var result = [];

        //Remove cancelled events, sort by date
        result = data.items.filter(function (item) {
            return item && item.hasOwnProperty('status') && item.status !== 'cancelled';
        }).sort(comp).reverse();

        var pastCounter = 0,
            upcomingCounter = 0,
            pastResult = [],
            upcomingResult = [],
            upcomingResultTemp = [],
            upcomingElem = document.querySelector(settings.upcomingSelector),
            pastElem = document.querySelector(settings.pastSelector),
            i;

        if (settings.pastTopN === -1) {
            settings.pastTopN = result.length;
        }

        if (settings.upcomingTopN === -1) {
            settings.upcomingTopN = result.length;
        }

        if (settings.past === false) {
            settings.pastTopN = 0;
        }

        if (settings.upcoming === false) {
            settings.upcomingTopN = 0;
        }

        for (i in result) {

            if (isPast(result[i].end.dateTime || result[i].end.date)) {
                if (pastCounter < settings.pastTopN) {
                    pastResult.push(result[i]);
                    pastCounter++;
                }
            } else {
                upcomingResultTemp.push(result[i]);
            }
        }

        upcomingResultTemp.reverse();

        for (i in upcomingResultTemp) {
            if (upcomingCounter < settings.upcomingTopN) {
                upcomingResult.push(upcomingResultTemp[i]);
                upcomingCounter++;
            }
        }

        for (i in pastResult) {
            pastElem.insertAdjacentHTML('beforeend', transformationList(pastResult[i], settings.itemsTagName, settings.format));
        }

        for (i in upcomingResult) {
            upcomingElem.insertAdjacentHTML('beforeend', transformationList(upcomingResult[i], settings.itemsTagName, settings.format));
        }

        if (upcomingElem.firstChild) {
            upcomingElem.insertAdjacentHTML('beforebegin', settings.upcomingHeading);
        }

        if (pastElem.firstChild) {
            pastElem.insertAdjacentHTML('beforebegin', settings.pastHeading);
        }
    };

    //Gets JSON from Google Calendar and transfroms it into html list items and appends it to past or upcoming events list
    var _init = function _init(settings) {
        config = settings;

        var finalURL = settings.calendarUrl;

        if (settings.recurringEvents) {
            finalURL = finalURL.concat('&singleEvents=true&orderBy=starttime');
        }

        if (settings.timeMin) {
            finalURL = finalURL.concat('&timeMin=' + settings.timeMin);
        };

        if (settings.timeMax) {
            finalURL = finalURL.concat('&timeMax=' + settings.timeMax);
        };

        //Get JSON, parse it, transform into list items and append it to past or upcoming events list
        var request = new XMLHttpRequest();
        request.open('GET', finalURL, true);

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(request.responseText);
                renderList(data, settings);
            } else {
                console.error(err);
            }
        };

        request.onerror = function () {
            console.error(err);
        };

        request.send();
    };

    //Overwrites defaultSettings values with overrideSettings and adds overrideSettings if non existent in defaultSettings
    var mergeOptions = function mergeOptions(defaultSettings, overrideSettings) {
        var newObject = {},
            i;
        for (i in defaultSettings) {
            newObject[i] = defaultSettings[i];
        }
        for (i in overrideSettings) {
            newObject[i] = overrideSettings[i];
        }
        return newObject;
    };

    var isAllDay = function isAllDay(dateStart, dateEnd) {
        var dateEndTemp = subtractOneDay(dateEnd);
        var isAll = true;

        for (var i = 0; i < 3; i++) {
            if (dateStart[i] !== dateEndTemp[i]) {
                isAll = false;
            }
        }

        return isAll;
    };

    var isSameDay = function isSameDay(dateStart, dateEnd) {
        var isSame = true;

        for (var i = 0; i < 3; i++) {
            if (dateStart[i] !== dateEnd[i]) {
                isSame = false;
            }
        }

        return isSame;
    };

    //Get all necessary data (dates, location, summary, description) and creates a list item
    var transformationList = function transformationList(result, tagName, format) {
        var dateStart = getDateInfo(result.start.dateTime || result.start.date),
            dateEnd = getDateInfo(result.end.dateTime || result.end.date),
            dayNames = config.dayNames,
            moreDaysEvent = true,
            isAllDayEvent = isAllDay(dateStart, dateEnd);

        if (typeof result.end.date !== 'undefined') {
            dateEnd = subtractOneDay(dateEnd);
        }

        if (isSameDay(dateStart, dateEnd)) {
            moreDaysEvent = false;
        }

        var dateFormatted = getFormattedDate(dateStart, dateEnd, dayNames, moreDaysEvent, isAllDayEvent),
            output = '<' + tagName + '>',
            summary = result.summary || '',
            description = result.description || '',
            location = result.location || '',
            i;

        for (i = 0; i < format.length; i++) {
            format[i] = format[i].toString();

            if (format[i] === '*summary*') {
                output = output.concat('<span class="summary">' + summary + '</span>');
            } else if (format[i] === '*date*') {
                output = output.concat('<span class="date">' + dateFormatted + '</span>');
            } else if (format[i] === '*description*') {
                output = output.concat('<span class="description">' + description + '</span>');
            } else if (format[i] === '*location*') {
                output = output.concat('<span class="location">' + location + '</span>');
            } else {
                if (format[i + 1] === '*location*' && location !== '' || format[i + 1] === '*summary*' && summary !== '' || format[i + 1] === '*date*' && dateFormatted !== '' || format[i + 1] === '*description*' && description !== '') {

                    output = output.concat(format[i]);
                }
            }
        }

        return output + '</' + tagName + '>';
    };

    //Check if date is later then now
    var isPast = function isPast(date) {
        var compareDate = new Date(date),
            now = new Date();

        if (now.getTime() > compareDate.getTime()) {
            return true;
        }

        return false;
    };

    //Get temp array with information abou day in followin format: [day number, month number, year, hours, minutes]
    var getDateInfo = function getDateInfo(date) {
        date = new Date(date);
        return [date.getDate(), date.getMonth(), date.getFullYear(), date.getHours(), date.getMinutes(), 0, 0];
    };

    //Get month name according to index
    var getMonthName = function getMonthName(month) {
        var monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

        return monthNames[month];
    };

    var getDayName = function getDayName(day) {
        var dayNames = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

        return dayNames[day];
    };

    var calculateDate = function calculateDate(dateInfo, amount) {
        var date = getDateFormatted(dateInfo);
        date.setTime(date.getTime() + amount);
        return getDateInfo(date);
    };

    var getDayNameFormatted = function getDayNameFormatted(dateFormatted) {
        return getDayName(getDateFormatted(dateFormatted).getDay()) + ' ';
    };

    var getDateFormatted = function getDateFormatted(dateInfo) {
        return new Date(dateInfo[2], dateInfo[1], dateInfo[0], dateInfo[3], dateInfo[4] + 0, 0);
    };

    //Compare dates
    var comp = function comp(a, b) {
        return new Date(a.start.dateTime || a.start.date).getTime() - new Date(b.start.dateTime || b.start.date).getTime();
    };

    //Add one day
    var addOneDay = function addOneDay(dateInfo) {
        return calculateDate(dateInfo, 86400000);
    };

    //Subtract one day
    var subtractOneDay = function subtractOneDay(dateInfo) {
        return calculateDate(dateInfo, -86400000);
    };

    //Subtract one minute
    var subtractOneMinute = function subtractOneMinute(dateInfo) {
        return calculateDate(dateInfo, -60000);
    };

    //Transformations for formatting date into human readable format
    var formatDateSameDay = function formatDateSameDay(dateStart, dateEnd, dayNames, moreDaysEvent, isAllDayEvent) {
        var formattedTime = '',
            dayNameStart = '';

        if (dayNames) {
            dayNameStart = getDayNameFormatted(dateStart);
        }

        if (config.sameDayTimes && !moreDaysEvent && !isAllDayEvent) {
            formattedTime = ' van ' + getFormattedTime(dateStart) + ' - ' + getFormattedTime(dateEnd);
        }

        //month day, year time-time
        return dayNameStart + ' ' + dateStart[0] + ' ' + getMonthName(dateStart[1]) + ', ' + dateStart[2] + formattedTime;
    };

    var formatDateOneDay = function formatDateOneDay(dateStart, dayNames) {
        var dayName = '';

        if (dayNames) {
            dayName = getDayNameFormatted(dateStart);
        }
        //month day, year
        return dayName + ' ' + dateStart[0] + ' ' + getMonthName(dateStart[1]) + ' ' +  ', ' + dateStart[2];
    };

    var formatDateDifferentDay = function formatDateDifferentDay(dateStart, dateEnd, dayNames) {
        var dayNameStart = '',
            dayNameEnd = '';

        if (dayNames) {
            dayNameStart = getDayNameFormatted(dateStart);
            dayNameEnd = getDayNameFormatted(dateEnd);
        }
        //month day-day, year
        return dayNameStart + dateStart[0] + ' ' + getMonthName(dateStart[1]) +  ' - ' + dayNameEnd + dateEnd[0] + ' ' + getMonthName(dateEnd[1]) + ', ' + dateStart[2];
    };

    var formatDateDifferentMonth = function formatDateDifferentMonth(dateStart, dateEnd, dayNames) {
        var dayNameStart = '',
            dayNameEnd = '';

        if (dayNames) {
            dayNameStart = getDayNameFormatted(dateStart);
            dayNameEnd = getDayNameFormatted(dateEnd);
        }
        //month day - month day, year
        return dayNameStart + dateStart[0] + ' ' + getMonthName(dateStart[1]) + '-' + dayNameEnd + dateEnd[0] + ' ' + getMonthName(dateEnd[1]) + ' ' + ', ' + dateStart[2];
    };

    var formatDateDifferentYear = function formatDateDifferentYear(dateStart, dateEnd, dayNames) {
        var dayNameStart = '',
            dayNameEnd = '';

        if (dayNames) {
            dayNameStart = getDayNameFormatted(dateStart);
            dayNameEnd = getDayNameFormatted(dateEnd);
        }
        //month day, year - month day, year
        return dayNameStart + dateStart[0] + ' ' + getMonthName(dateStart[1])  + ', ' + dateStart[2] + '-' + dayNameEnd + dateEnd[0] + ' ' + getMonthName(dateEnd[1]) + ', ' + dateEnd[2];
    };

    //Check differences between dates and format them
    var getFormattedDate = function getFormattedDate(dateStart, dateEnd, dayNames, moreDaysEvent, isAllDayEvent) {
        var formattedDate = '';

        if (dateStart[0] === dateEnd[0]) {
            if (dateStart[1] === dateEnd[1]) {
                if (dateStart[2] === dateEnd[2]) {
                    //month day, year
                    formattedDate = formatDateSameDay(dateStart, dateEnd, dayNames, moreDaysEvent, isAllDayEvent);
                } else {
                    //month day, year - month day, year
                    formattedDate = formatDateDifferentYear(dateStart, dateEnd, dayNames);
                }
            } else {
                if (dateStart[2] === dateEnd[2]) {
                    //month day - month day, year
                    formattedDate = formatDateDifferentMonth(dateStart, dateEnd, dayNames);
                } else {
                    //month day, year - month day, year
                    formattedDate = formatDateDifferentYear(dateStart, dateEnd, dayNames);
                }
            }
        } else {
            if (dateStart[1] === dateEnd[1]) {
                if (dateStart[2] === dateEnd[2]) {
                    //month day-day, year
                    formattedDate = formatDateDifferentDay(dateStart, dateEnd, dayNames);
                } else {
                    //month day, year - month day, year
                    formattedDate = formatDateDifferentYear(dateStart, dateEnd, dayNames);
                }
            } else {
                if (dateStart[2] === dateEnd[2]) {
                    //month day - month day, year
                    formattedDate = formatDateDifferentMonth(dateStart, dateEnd, dayNames);
                } else {
                    //month day, year - month day, year
                    formattedDate = formatDateDifferentYear(dateStart, dateEnd, dayNames);
                }
            }
        }

        return formattedDate;
    };

    var getFormattedTime = function getFormattedTime(date) {
        var formattedTime = '',
            hour = date[3],
            minute = date[4];

        // Handle midnight.
        if (hour === 0) {
            hour = 0;
        }

        // Ensure 2-digit minute value.
        minute = (minute < 10 ? '0' : '') + minute;

        // Format time.
        formattedTime = hour + ':' + minute;
        return formattedTime;
    };

    return {
        init: function init(settingsOverride) {
            var settings = {
                calendarUrl: 'https://www.googleapis.com/calendar/v3/calendars/roger@kazourmt.be/events?key=AIzaSyCR3-ptjHE-_douJsn8o20oRwkxt-zHStY',
                past: true,
                upcoming: true,
                sameDayTimes: true,
                dayNames: true,
                pastTopN: -1,
                upcomingTopN: -1,
                recurringEvents: true,
                itemsTagName: 'li',
                upcomingSelector: '#events-upcoming',
                pastSelector: '#events-past',
                upcomingHeading: '<h2>Upcoming events</h2>',
                pastHeading: '<h2>Past events</h2>',
                format: ['*date*', ': ', '*summary*', ' &mdash; ', '*description*', ' in ', '*location*'],
                timeMin: undefined,
                timeMax: undefined
            };

            settings = mergeOptions(settings, settingsOverride);

            _init(settings);
        }
    };
}();