let storage = new LocalStorage();

/*
update time of current active tab
*/
const trackCurrentActiveTab = (currentTab) => {

    if (currentTab === undefined || currentTab === null) {
        return;
    }

    let hostName = getHostName(currentTab.url);
    if (hostName.length === 0) {
        return;
    }

    // get value from localstorage
    storage.getValue(CURRENT_ACTIVE_TAB_KEY, (currentActiveTab) => {

        let currentActiveTabObj = currentActiveTab != null ? JSON.parse(currentActiveTab) : {};

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
        storage.saveValue(CURRENT_ACTIVE_TAB_KEY, currentActiveTabObj)
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