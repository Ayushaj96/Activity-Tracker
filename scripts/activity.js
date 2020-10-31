var temp = {
    "hackerearth": {
        "url": "hackerearth",
        "trackedSeconds": 41957.905,
        "lastVisit": 1603866976431,
        "icon": "https://static-fastly.hackerearth.com/static/hackerearth/images/logo/HE_identity.png",
    },
    "leetcode.com": {
        "url": "leetcode.com",
        "trackedSeconds": 4514.243000000002,
        "lastVisit": 1603820960588,
        "icon": "https://leetcode.com/favicon-32x32.png",
    },
    "meet.google.com": {
        "url": "meet.google.com",
        "trackedSeconds": 3491.318,
        "lastVisit": 1603816889901,
        "icon": "https://www.google.com/favicon.ico",
    },
    "extensions": {
        "url": "extensions",
        "trackedSeconds": 34706.59500000001,
        "lastVisit": 1603867188402,
        "icon": '',
    }
}

var data = {
    "currentActiveTab": JSON.stringify(temp)
}

// ---------------------------------------------------------------------------------
window.addEventListener('load', init);

let clearButton, errorMessageElement, timeTable, chart;

function init() {
    clearButton = document.getElementById("btnClear");
    errorMessageElement = document.getElementById("errorMessage");
    timeTable = document.getElementById("timeTable");
    chart = document.getElementById("chart");

    clearButton.addEventListener('click', clearData);
    displayData();
}


const displayData = () => {

    let dataJson = data[CURRENT_ACTIVE_TAB_KEY];
    if (dataJson == undefined || dataJson == null) {
        return;
    }

    try {

        let dataObj = JSON.parse(dataJson);

        let entries = [];
        for (let key in dataObj) {
            entries.push(dataObj[key]);
        }

        entries.sort(sortMultipleProperties('-trackedSeconds'));

        clearRows();
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

const calculateTotalTimeInSeconds = (array) => {

    let secondsArray = array.map((obj) => obj['trackedSeconds']);
    let totalSeconds = secondsArray.reduce((element1, element2) => element1 + element2);

    return totalSeconds;
}

const calculatePercentage = (element, total) => {

    let percentage = ((element / total) * 100).toFixed(2) + '%';
    return percentage;
}

const clearRows = () => {

    timeTable.innerHTML = '';
};

const clearData = () => {

    let response = confirm('Are you sure you want to clear tracking history?');
    if (response) {
        clearRows();
        chart.style.display = 'none';
    }
}