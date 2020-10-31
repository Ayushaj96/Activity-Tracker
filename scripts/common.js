const CURRENT_ACTIVE_TAB_KEY = "currentActiveTab";
const LAST_ACTIVE_TAB_KEY = "lastActiveTab";

const sortMultipleProperties = (...property) => {

    return function (obj1, obj2) {
        let i = 0,
            result = 0,
            numberOfProperties = property.length;

        while (result === 0 && i < numberOfProperties) {
            result = sortData(property[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}

const sortData = (property) => {

    let sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a, b) {
        let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

const formatTime = (time) => {

    let hours = Math.floor(time / 3600);
    time -= hours * 3600;

    let minutes = Math.floor(time / 60);
    time -= minutes * 60;

    let seconds = parseInt(time % 60, 10);

    let formatedTime = (hours === 0 || hours < 10 ? "0" + hours : hours) + "h " +
        (minutes < 10 ? "0" + minutes : minutes) + "m " +
        (seconds < 10 ? "0" + seconds : seconds) + "s";
    return formatedTime;

}