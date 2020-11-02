const CURRENT_ACTIVE_TAB_KEY = "currentActiveTab";
const LAST_ACTIVE_TAB_KEY = "lastActiveTab";

/*
sort object based on multiple key properties
*/
const sortMultipleProperties = (...property) => {

    return function (obj1, obj2) {
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

    return function (a, b) {
        let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

/*
format time in 00h 00m 00s
*/
const formatTime = (time) => {

    let hours = Math.floor(time / 3600);
    time -= hours * 3600;

    let minutes = Math.floor(time / 60);
    time -= minutes * 60;

    let seconds = parseInt(time % 60, 10);

    let formatedTime = (hours === 0 || hours < 10 ? "0" + hours : hours) + "h " +
        (minutes < 10 ? "0" + minutes : minutes) + "m " +
        (seconds < 10 ? "0" + seconds : seconds) + "s";
    return formatedTime;

}

/*
convert time to format display on icon badge
*/
const convertTimeToBadgeString = (time) => {
    var sec = (time);
    var min = (time / 60).toFixed(0);
    var hours = (time / (60 * 60)).toFixed(0);
    var days = (time / (60 * 60 * 24)).toFixed(0);

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