Chart.defaults.global.defaultFontFamily = "Arial, Helvetica, sans-serif";

const chartColors = {
    orange: "rgb(255, 159, 64)",
    purple: "rgb(153, 102, 255)",
    yellow: "rgb(255, 205, 86)",
    green: "rgb(75, 192, 192)",
    red: "rgb(255, 99, 132)",
    blue: "rgb(54, 162, 235)",
};

const getRandomColor = () => {

    let color = "#" + ("00000" + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6);
    return color;
};

const getBackgroundColors = (values) => {

    const colors = Object.values(chartColors);

    let bgColors = [];
    for (let i = 0; i < values.length; i++) {
        if (values.length <= colors.length) {
            bgColors.push(colors[i]);
        } else {
            if (i < colors.length) {
                bgColors.push(colors[i]);
            } else {
                bgColors.unshift(getRandomColor());
            }
        }
    }

    return bgColors;
}

const getUrlsAndPercentage = (data) => {
    let visitedUrls = {};
    let resultObj = {};

    for (const obj of data) {
        const newKey = obj['url'];
        const newValue = obj['trackedSeconds'];
        visitedUrls[newKey] = newValue;
    }

    let sum = Object.keys(visitedUrls).reduce((s, key) => (s += visitedUrls[key]), 0);

    let result = Object.keys(visitedUrls).map((key) => ({
        [key]: ((visitedUrls[key] / sum) * 100).toFixed(2),
    }));

    resultObj = Object.assign({}, ...result);
    return resultObj;
};

const showPieChart = (data) => {

    const visitedUrls = getUrlsAndPercentage(data);

    const keys = Object.keys(visitedUrls);
    const values = Object.values(visitedUrls);
    const bgColors = getBackgroundColors(values);

    let chartJson = {
        type: "doughnut",
        data: {
            labels: keys,
            datasets: [{
                data: values,
                backgroundColor: bgColors,
            }, ],
        },
        options: {
            cutoutPercentage: 15,
            legend: {
                display: false,
            },
            tooltips: {
                bodyFontSize: 14,
                callbacks: {
                    label: function(tooltipItem, data) {
                        return `${data["labels"][tooltipItem["index"]]}: ${data["datasets"][0]["data"][tooltipItem["index"]]}%`
                    }
                }
            }
        }
    }

    return new Chart("chart", chartJson);
};