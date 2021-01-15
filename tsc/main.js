import { __assign } from "tslib";
import * as ICAL from 'ical.js';
import { createPlugin } from '@fullcalendar/common';
export function requestICal(url, successCallback, failureCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            successCallback(xhr.responseText, xhr);
        }
        else {
            failureCallback('Request failed', xhr);
        }
    };
    xhr.onerror = function () { return failureCallback('Request failed', xhr); };
    xhr.send(null);
}
var buildIcalEvents = function (rawFeed) {
    try {
        var iCalFeed = ICAL.parse(rawFeed);
        var iCalComponent = new ICAL.Component(iCalFeed);
        return iCalComponent.getAllSubcomponents('vevent');
    }
    catch (err) {
        console.warn("Error parsing feed: " + err);
        return [];
    }
};
var buildEvents = function (vevents) { return vevents.map(function (vevent) {
    var event = null;
    try {
        event = new ICAL.Event(vevent);
        if (!event.startDate) { // is an accessor method. might throw an error
            return null;
        }
    }
    catch (error) {
        console.warn("Unable to process item in calendar: " + error + ".");
        return null;
    }
    var fcEvent = {
        title: event.summary,
        start: event.startDate.toString(),
        end: (event.endDate ? event.endDate.toString() : null),
        extendedProps: { description: event.description },
    };
    if (event.startDate.isDate) {
        return __assign(__assign({}, fcEvent), { allDay: true });
    }
    return fcEvent;
}).filter(function (item) { return item !== null; }); };
var eventSourceDef = {
    ignoreRange: true,
    parseMeta: function (refined) {
        if (refined.url && refined.format === 'ics') {
            return {
                url: refined.url,
                format: 'ics',
            };
        }
        return null;
    },
    fetch: function (arg, success, failure) {
        var meta = arg.eventSource.meta;
        requestICal(meta.url, function (rawFeed, xhr) {
            var icalEvents = buildIcalEvents(rawFeed);
            var events = buildEvents(icalEvents);
            success({ rawEvents: events, xhr: xhr });
        }, function (errorMessage, xhr) {
            failure({ message: errorMessage, xhr: xhr });
        });
    },
};
export default createPlugin({
    eventSourceDefs: [eventSourceDef],
});
//# sourceMappingURL=main.js.map