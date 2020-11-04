let storage = new LocalStorage();

/*
update time of current active tab
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

    // save value in localstorage
    dataObj['data'] = currentActiveTabObj;
    storage.saveValue(storageKey, dataObj);
}

/*
call function in background in 1 sec interval
*/
const backgroundCheck = () => {
    chrome.windows.getLastFocused({ populate: true }, function(currentWindow) {
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