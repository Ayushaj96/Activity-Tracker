function ActiveTab(currentTab) {

    if (currentTab === undefined || currentTab === null) {
        return;
    }
    console.log(currentTab);

    let url = currentTab.status === 'loading' ? currentTab.pendingUrl : currentTab.url;
    hostName = url;

    try {
        let urlObj = new URL(url);
        urlObj.protocol === 'file:' ? (hostName = urlObj.origin) : (hostName = urlObj.hostname);

    } catch (error) {
        console.log(`Could not construct url from ${currentTab.url}, error:${error}`);
    }

    chrome.storage.local.get([CURRENT_ACTIVE_TAB_KEY], (storageData) => {

        let currentActiveTab = storageData[CURRENT_ACTIVE_TAB_KEY];
        let currentActiveTabObj = currentActiveTab != null ? JSON.parse(currentActiveTab) : {};

        let currentDate = Date.now();
        let passedSeconds = 1;

        // if url already exists then update time
        if (currentActiveTabObj.hasOwnProperty(hostName)) {

            let urlInfo = currentActiveTabObj[hostName];
            urlInfo['trackedSeconds'] += passedSeconds;
            urlInfo['lastVisit'] = currentDate;
            urlInfo['icon'] = currentTab.favIconUrl;
            currentActiveTabObj[hostName] = urlInfo;

        } else {
            let newUrlInfo = {
                'url': hostName,
                'trackedSeconds': passedSeconds,
                'lastVisit': currentDate,
                'icon': currentTab.favIconUrl
            };
            currentActiveTabObj[hostName] = newUrlInfo;
        }

        let newCurrentActiveTabObj = {};
        newCurrentActiveTabObj[CURRENT_ACTIVE_TAB_KEY] = JSON.stringify(currentActiveTabObj);

        chrome.storage.local.set(newCurrentActiveTabObj, () => {});
    });

}

function backgroundCheck() {

    chrome.windows.getLastFocused({ populate: true }, function(currentWindow) {
        if (currentWindow.focused) {
            let activeTab = currentWindow.tabs.find(t => t.active === true);
            ActiveTab(activeTab);
            chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] })
            chrome.browserAction.setBadgeText({
                tabId: activeTab.id,
                text: 'abc'
            });
        }
    });
}

function updateSummaryTime() {
    // call function in 1 sec interval
    window.setInterval(backgroundCheck, 1000);
}
// function call
updateSummaryTime();