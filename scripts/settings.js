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
        console.log(items)
        if (items !== '{}') {
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
        ui.clearActivityUI();
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

function addDomainToEditableListBox(site, time) {
    let li = document.createElement('li');

    let domainLbl = document.createElement('label');
    domainLbl.classList.add('inline-block', 'element-item');
    domainLbl.innerHTML = site + '   ' + formatTime(time);

    // var del = document.createElement('img');
    // del.height = 12;
    // del.src = '/icons/delete.png';
    // del.classList.add('margin-left-5');
    // del.addEventListener('click', function (e) {
    //     actionDelete(e, actionUpdateTimeFromList, actionUpdateList);
    // });

    // var bloc = document.createElement('div');
    // bloc.classList.add('clockpicker');
    // bloc.setAttribute('data-placement', 'left');
    // bloc.setAttribute('data-align', 'top');
    // bloc.setAttribute('data-autoclose', 'true');
    // var timeInput = document.createElement('input');
    // timeInput.type = 'text';
    // timeInput.classList.add('clock', 'clock-li-readonly');
    // timeInput.setAttribute('readonly', true);
    // timeInput.setAttribute('name', 'time');
    // timeInput.value = convertShortSummaryTimeToString(entity.time);
    // bloc.appendChild(timeInput);

    var hr = document.createElement('hr');
    let _li = document.getElementById('notifyList').appendChild(li);
    _li.appendChild(domainLbl);
    // li.appendChild(del);
    // li.appendChild(edit);
    // li.appendChild(bloc);
    _li.appendChild(hr);
}
