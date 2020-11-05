let notifyList = {};

window.addEventListener('load', settingsInit);
/*
Settigs initialization
*/
function settingsInit() {

    //storage.saveValue(NOTIFYING_SITES_KEY, {});
    document.getElementById("btnClear").addEventListener('click', clearData);
    document.getElementById('addNotifySiteBtn').addEventListener('click', addNotifySites);
    $('.clockpicker').clockpicker();

    storage.getValue(NOTIFYING_SITES_KEY, function (items) {
        if (items !== undefined && items !== null && items !== '{}') {
            notifyList = JSON.parse(items);
            viewNotificationList(notifyList);
        }
    });
}

/*
Clear everything from popup
*/
const clearData = () => {
    let response = confirm('Are you sure you want to clear tracking history?');
    if (response) {
        storage.saveValue(CURRENT_DAY_DATA_KEY, {})
        // ui.clearActivityUI();
        storage.getMemoryUse(CURRENT_DAY_DATA_KEY, function (integer) {
            document.getElementById('memoryUse').innerHTML = (integer / 1024).toFixed(2) + 'Kb';
        });
    }
}

const showSettings = () => {
    ui.setUIForSettings();
    storage.getMemoryUse(CURRENT_DAY_DATA_KEY, function (integer) {
        document.getElementById('memoryUse').innerHTML = (integer / 1024).toFixed(2) + 'Kb';
    });
}

const addNotifySites = () => {
    let newSite = document.getElementById('addNotifySiteLbl').value;
    let newTime = document.getElementById('addNotifyTimeLbl').value;
    if (newSite !== '' && newTime !== '') {
        newSite = getHostName(newSite);
        actionAddNotifyToList(newSite, newTime);
    } else { alert('Field Cannot be left Empty'); }
}

function actionAddNotifyToList(newSite, newTime) {
    if (!isContainsNotificationSite(newSite)) {
        newTime = convertTimeToSeconds(newTime);
        addDomainToEditableListBox(newSite, newTime);

        notifyList[newSite] = newTime;
        storage.saveValue(NOTIFYING_SITES_KEY, notifyList);

        document.getElementById('addNotifySiteLbl').value = '';
        document.getElementById('addNotifyTimeLbl').value = '';

    } else { alert('Site Already Present'); }
}

function viewNotificationList(dataObj) {
    for (let item in dataObj) {
        addDomainToEditableListBox(item, dataObj[item]);
    }
}

function isContainsNotificationSite(domain) {
    return domain in notifyList;
}

function deleteNotificationSite(e) {
    let targetElement = e.path[1];
    let itemValue = targetElement.querySelector("[id='domain']").innerHTML;
    console.log('itemValue', itemValue);
    delete notifyList[itemValue];
    console.log(notifyList);
    document.getElementById('notifyList').removeChild(targetElement);
    storage.saveValue(NOTIFYING_SITES_KEY, notifyList);
}

function addDomainToEditableListBox(domain, time) {

    let li = document.createElement('li');

    let domainLbl = document.createElement('label');
    domainLbl.classList.add('block', 'element-item', 'margin-left-5');
    domainLbl.innerHTML = domain;
    domainLbl.setAttribute('id', 'domain');

    let timeLbl = document.createElement('label');
    timeLbl.classList.add('margin-left-5');
    timeLbl.innerHTML = formatTime(time);

    let del = document.createElement('img');
    del.height = 12;
    del.src = '/images/delete.png';
    del.classList.add('margin-left-5', 'delete-btn');
    del.addEventListener('click', function (e) {
        deleteNotificationSite(e);
    });


    let hr = document.createElement('hr');
    let _li = document.getElementById('notifyList').appendChild(li);
    _li.appendChild(domainLbl);
    _li.appendChild(timeLbl);
    _li.appendChild(del);
    _li.appendChild(hr);
}