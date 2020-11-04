window.addEventListener('load', settingsInit);
/*
Settigs initialization
*/
function settingsInit() {
    document.getElementById("btnClear").addEventListener('click', clearData);
    document.getElementById('addNotifySiteBtn').addEventListener('click', addNotifySites);
    $('.clockpicker').clockpicker();
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
    confirm(newSite);
}

/*function addDomainToEditableListBox(entity, elementId, actionEdit, actionDelete, actionUpdateTimeFromList, actionUpdateList) {
    var li = document.createElement('li');

    var domainLbl = document.createElement('input');
    domainLbl.type = 'text';
    domainLbl.classList.add('readonly-input', 'inline-block', 'element-item');
    domainLbl.value = entity.domain;
    domainLbl.readOnly = true;
    domainLbl.setAttribute('name', 'domain');

    var edit = document.createElement('img');
    edit.setAttribute('name', 'editCmd');
    edit.height = 14;
    edit.src = '/icons/edit.png';
    edit.addEventListener('click', function (e) {
        actionEdit(e, actionUpdateTimeFromList, actionUpdateList);
    });

    var del = document.createElement('img');
    del.height = 12;
    del.src = '/icons/delete.png';
    del.classList.add('margin-left-5');
    del.addEventListener('click', function (e) {
        actionDelete(e, actionUpdateTimeFromList, actionUpdateList);
    });

    var bloc = document.createElement('div');
    bloc.classList.add('clockpicker');
    bloc.setAttribute('data-placement', 'left');
    bloc.setAttribute('data-align', 'top');
    bloc.setAttribute('data-autoclose', 'true');
    var timeInput = document.createElement('input');
    timeInput.type = 'text';
    timeInput.classList.add('clock', 'clock-li-readonly');
    timeInput.setAttribute('readonly', true);
    timeInput.setAttribute('name', 'time');
    timeInput.value = convertShortSummaryTimeToString(entity.time);
    bloc.appendChild(timeInput);

    var hr = document.createElement('hr');
    var li = document.getElementById(elementId).appendChild(li);
    li.appendChild(domainLbl);
    li.appendChild(del);
    li.appendChild(edit);
    li.appendChild(bloc);
    li.appendChild(hr);
}
*/