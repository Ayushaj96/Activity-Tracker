const ALL_TIME_DATA_KEY = "allTimeData";
const NOTIFYING_SITES_KEY = "notifySites";
const CURRENT_DAY_DATA_KEY = "currentDayData";

/*
sort object based on multiple key properties
*/
const sortMultipleProperties = (...property) => {

    return function(obj1, obj2) {
        let i = 0,
            result = 0,
            numberOfProperties = property.length;

        while (result === 0 && i < numberOfProperties) {
            result = sortData(property[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}

/*
sort object based on single key property
*/
const sortData = (property) => {

    let sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function(a, b) {
        let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

/*
format time in 00h 00m 00s
*/
const formatTime = (time) => {

    let days = Math.floor(time / (60 * 60 * 24));
    time -= days * (60 * 60 * 24);

    let hours = Math.floor(time / 3600);
    time -= hours * 3600;

    let minutes = Math.floor(time / 60);
    time -= minutes * 60;

    let seconds = parseInt(time % 60, 10);

    let formatedTime = (days === 0 || days < 10 ? "0" + days : days) + "d " +
        (hours === 0 || hours < 10 ? "0" + hours : hours) + "h " +
        (minutes < 10 ? "0" + minutes : minutes) + "m " +
        (seconds < 10 ? "0" + seconds : seconds) + "s";
    return formatedTime;
}

/*
convert time to format display on icon badge
*/
const convertTimeToBadgeString = (time) => {

    let sec = (time);
    let min = Math.floor(time / 60);
    let hours = Math.floor(time / (60 * 60));
    let days = Math.floor(time / (60 * 60 * 24));

    if (sec < 60) {
        return sec + "s";
    } else if (min < 60) {
        return min + "m";
    } else if (hours < 24) {
        return hours + "h";
    } else {
        return days + "d"
    }
}

/*
get hostname from url
*/
const getHostName = (url) => {

    let hostName = url;
    try {
        let urlObj = new URL(url);
        urlObj.protocol.includes('http') ? (hostName = urlObj.hostname) : (hostName = '');

    } catch (error) {
        console.log(`Could not construct url from ${url}, error:${error}`);
    }
    return hostName;
}

/*
set text on icon badge
*/
const setBadgeText = (id, text) => {

    chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] })
    chrome.browserAction.setBadgeText({
        tabId: id,
        text: convertTimeToBadgeString(text)
    });
}