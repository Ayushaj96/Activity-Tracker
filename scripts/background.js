let storage = new LocalStorage();

let notifySitesData = {
    "developer.chrome.com": 10,
    "www.google.com": 9,
    "stackoverflow.com": 6
}

/*
process current active tab
*/
const trackCurrentActiveTab = (currentTab) => {

    if (currentTab === undefined || currentTab === null) {
        return;
    }

    storage.getValue(CURRENT_DAY_DATA_KEY, (data) => {
        let dataObj = checkCurrentDayData(data);
        saveData(CURRENT_DAY_DATA_KEY, dataObj, currentTab);
    });
}


/*
check whether is day is changed or not
*/
const checkCurrentDayData = (data) => {

    let dataObj = data != null ? JSON.parse(data) : {};

    let today = new Date();
    let currentDate = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    let passedDate = '';

    if (!(dataObj.hasOwnProperty('passedDate'))) {
        passedDate = currentDate;
    } else {
        passedDate = dataObj['passedDate'];
    }

    dataObj['passedDate'] = currentDate;
    if (!(dataObj.hasOwnProperty('data')) || (passedDate != currentDate)) {
        dataObj['data'] = {};
    }

    return dataObj;
}

/*
process and save data to localstorage
*/
const saveData = (storageKey, dataObj, currentTab) => {

    let hostName = getHostName(currentTab.url);
    if (hostName.length === 0) {
        return;
    }

    let currentActiveTabObj = dataObj['data'];

    let currentDate = Date.now();
    let passedSeconds = 1;

    // if url already exists then update time and last visit
    if (currentActiveTabObj.hasOwnProperty(hostName)) {
        currentActiveTabObj[hostName].trackedSeconds += passedSeconds;
        currentActiveTabObj[hostName].lastVisit = currentDate;
        currentActiveTabObj[hostName].icon = currentTab.favIconUrl;
    }
    // if url not exist, then add 
    else {
        let newUrlInfo = {
            'url': hostName,
            'trackedSeconds': passedSeconds,
            'lastVisit': currentDate,
            'icon': currentTab.favIconUrl
        };
        currentActiveTabObj[hostName] = newUrlInfo;
    }

    // display time on extension icon
    let trackedTime = currentActiveTabObj[hostName].trackedSeconds;
    setBadgeText(currentTab.id, trackedTime);

    if (isNotifyRequired(hostName) && isTimeLimitExceed(hostName, trackedTime)) {
        showNotification(hostName, trackedTime);
        //console.log(hostName, trackedTime);
    }

    // save value in localstorage
    dataObj['data'] = currentActiveTabObj;
    storage.saveValue(storageKey, dataObj);
}

/*
check current tab need notification
*/
const isNotifyRequired = (currentTabUrl) => {

    return (currentTabUrl in notifySitesData);
}

/*
check time limit exceed on current tab
*/
const isTimeLimitExceed = (currentTabUrl, timeSpent) => {

    if ((timeSpent == notifySitesData[currentTabUrl]) || (timeSpent == notifySitesData[currentTabUrl] + 120)) {
        return true;
    }
    return false;
}

/*
create and show notification
*/
function showNotification(activeUrl, timeSpent) {
    chrome.notifications.clear('site-notification', function (wasCleared) {
        console.log(wasCleared);
        if (!wasCleared) {
            console.log('!wasCleared');

            chrome.notifications.create(
                'site-notification', {
                type: 'basic',
                iconUrl: 'images/icon-64.png',
                title: "Activity Tracker",
                contextMessage: activeUrl + ' ' + formatTime(timeSpent),
                message: STORAGE_NOTIFICATION_MESSAGE_DEFAULT,
                eventTime: Date.now() + 8
            },
                function (notificationId) {
                    console.log(notificationId);
                    chrome.notifications.clear('site-notification', function (wasCleared) {
                        if (wasCleared)
                            notificationAction(activeUrl, timeSpent);
                    });
                });
        } else {
            notificationAction(activeUrl, timeSpent);
        }
    });
}

function notificationAction(activeUrl, timeSpent) {

    chrome.notifications.create(
        'site-notification', {
        type: 'basic',
        iconUrl: 'images/icon-64.png',
        title: "Activity Tracker",
        contextMessage: activeUrl + ' ' + formatTime(timeSpent),
        message: STORAGE_NOTIFICATION_MESSAGE_DEFAULT
    });
}


/*
call function in background in 1 sec interval
*/
const backgroundCheck = () => {
    chrome.windows.getLastFocused({ populate: true }, function (currentWindow) {
        if (currentWindow.focused) {
            let activeTab = currentWindow.tabs.find(t => t.active === true);
            trackCurrentActiveTab(activeTab);
        }
    });
}

/*
call function in 1 sec interval
*/
const updateSummaryTime = () => {
    window.setInterval(backgroundCheck, 1000);
}

/*
initialization
*/
updateSummaryTime();