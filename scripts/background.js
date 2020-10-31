let isWindowActive = true;
let hostname = '';

function onTabTrack() {
    isWindowActive = true;
    processTabChange();
}

function processTabChange() {
    console.log(new Date());
    chrome.tabs.query({ active: true }, getTabs);
}

function getTabs(tabs) {

    if (tabs === undefined || tabs.length == 0 || tabs[0] === null) {
        return;
    }

    let currentTab = tabs[0];
    let url = currentTab.status === 'loading' ? currentTab.pendingUrl : currentTab.url;
    hostName = url;

    try {
        let urlObj = new URL(url);
        urlObj.protocol === 'file:' ? (hostName = urlObj.origin) : (hostName = urlObj.hostname);

    } catch (error) {
        console.log(`Could not construct url from ${currentTab.url}, error:${error}`);
    }

    chrome.storage.local.get([CURRENT_ACTIVE_TAB_KEY, LAST_ACTIVE_TAB_KEY], (storageData) => {

        let currentActiveTab = storageData[CURRENT_ACTIVE_TAB_KEY];
        let lastActiveTab = storageData[LAST_ACTIVE_TAB_KEY];

        // console.log(currentActiveTab);
        // console.log(lastActiveTab);

        let currentActiveTabObj = currentActiveTab != null ? JSON.parse(currentActiveTab) : {};
        let lastActiveTabObj = lastActiveTab != null ? JSON.parse(lastActiveTab) : {};

        if (lastActiveTabObj.hasOwnProperty('url') && lastActiveTabObj.hasOwnProperty('lastVisit')) {

            let lastUrl = lastActiveTabObj['url'];
            let currentDate = Date.now();
            let passedSeconds = (currentDate - lastActiveTabObj['lastVisit']) * 0.001;

            if (currentActiveTabObj.hasOwnProperty(lastUrl)) {

                let urlInfo = currentActiveTabObj[lastUrl];
                if (urlInfo.hasOwnProperty('trackedSeconds')) {
                    urlInfo['trackedSeconds'] += passedSeconds;
                } else {
                    urlInfo['trackedSeconds'] = passedSeconds;
                }
                urlInfo['lastVisit'] = currentDate;

            } else {
                let newUrlInfo = {
                    'url': lastUrl,
                    'trackedSeconds': passedSeconds,
                    'lastVisit': currentDate
                };
                currentActiveTabObj[lastUrl] = newUrlInfo;
            }
        }

        let currentDate = Date.now();
        let lastActiveTabInfo = {
            'url': hostName,
            'lastVisit': currentDate
        }
        if (!isWindowActive) {
            lastActiveTabInfo = {};
        }

        let newLastActiveTabObj = {};
        newLastActiveTabObj[LAST_ACTIVE_TAB_KEY] = JSON.stringify(lastActiveTabInfo);

        // save data
        chrome.storage.local.set(newLastActiveTabObj, () => { });

        let newCurrentActiveTabObj = {};
        newCurrentActiveTabObj[CURRENT_ACTIVE_TAB_KEY] = JSON.stringify(currentActiveTabObj);

        chrome.storage.local.set(newCurrentActiveTabObj, () => { });
    });

}

chrome.tabs.onActivated.addListener(onTabTrack);
chrome.windows.onFocusChanged.addListener((windowId) => {

    if (windowId == chrome.windows.WINDOW_ID_NONE) {
        isWindowActive = false;
        processTabChange();
    } else {
        isWindowActive = true;
        processTabChange();
    }
});