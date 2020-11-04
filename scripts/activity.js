let ui = new UI();
let storage = new LocalStorage();
let errorMessageElement, timeTable;

window.addEventListener('load', init);

/*
initialization
*/
function init() {

    errorMessageElement = document.getElementById("errorMessage");
    timeTable = document.getElementById("timeTable");

    document.getElementById("btnClear").addEventListener('click', clearData);
    document.getElementById("btnToday").addEventListener('click', showTodayData);
    document.getElementById("btnAll").addEventListener('click', showAllData);
    document.getElementById("btnSettings").addEventListener('click', showSettings);

    showTodayData();
}

const showTodayData = () => {
    ui.setUIForToday();
    storage.getValue(ALL_TIME_DATA_KEY, displayData);
}

const showAllData = () => {
    ui.setUIForAll();
    storage.getValue(ALL_TIME_DATA_KEY, displayData);
}

const showSettings = () => {
    ui.setUIForSettings();
    storage.getMemoryUse(ALL_TIME_DATA_KEY, function (integer) {
        document.getElementById('memoryUse').innerHTML = (integer / 1024).toFixed(2) + 'Kb';
    });
}
/*
Display data on popup
*/
const displayData = (data) => {

    if (data == undefined || data == null) {
        return;
    }

    try {

        let dataObj = JSON.parse(data);

        let entries = [];
        for (let key in dataObj) {
            entries.push(dataObj[key]);
        }

        entries.sort(sortMultipleProperties('-trackedSeconds'));

        ui.clearRows();
        let headerRow = timeTable.insertRow(0);
        headerRow.classList.add("table-header");

        headerRow.insertCell(0).innerHTML = "";
        headerRow.insertCell(1).innerHTML = "Url";
        headerRow.insertCell(2).innerHTML = "Total time";
        headerRow.insertCell(3).innerHTML = "%";
        headerRow.insertCell(4).innerHTML = "Last Visit";

        entries.forEach(displayRow);
        showPieChart(entries);

    } catch (error) {
        const message = `loading current tab active object went wrong ${error.toString()}`;
        console.error(message);

        errorMessageElement.innerText = message;
        errorMessageElement.innerText = DataString;
    }
}


/*
Display data in table
*/
const displayRow = (currentObj, index, array) => {

    let totalSeconds = calculateTotalTimeInSeconds(array);
    let percentage = calculatePercentage(currentObj['trackedSeconds'], totalSeconds);

    let row = timeTable.insertRow(-1);
    let icon = row.insertCell(0);
    let url = row.insertCell(1);
    let totalTime = row.insertCell(2);
    let percentTime = row.insertCell(3);
    let lastVisit = row.insertCell(4);

    let img = document.createElement('img');
    icon.appendChild(img);
    img.src = currentObj["icon"];
    img.classList.add("icon");

    url.innerHTML = currentObj["url"];

    percentTime.innerHTML = percentage;

    let time = currentObj["trackedSeconds"] != null ? currentObj["trackedSeconds"] : 0;
    totalTime.innerHTML = formatTime(time);

    let date = new Date();
    date.setTime(currentObj["lastVisit"] != null ? currentObj["lastVisit"] : 0);
    lastVisit.innerHTML = date.toLocaleString("sr-Latn-RS");
}

/*
Calculate total time in seconds from array
*/
const calculateTotalTimeInSeconds = (array) => {

    let secondsArray = array.map((obj) => obj['trackedSeconds']);
    let totalSeconds = secondsArray.reduce((element1, element2) => element1 + element2);

    return totalSeconds;
}

/*
Calculate percentage 
*/
const calculatePercentage = (element, total) => {

    let percentage = ((element / total) * 100).toFixed(2) + '%';
    return percentage;
}

/*
Clear everything from popup
*/
const clearData = () => {

    let response = confirm('Are you sure you want to clear tracking history?');
    if (response) {
        storage.saveValue(ALL_TIME_DATA_KEY, {})
        ui.clearActivityUI();
    }
}