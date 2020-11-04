/*
Clear everything from popup
*/
const clearData = () => {

    let response = confirm('Are you sure you want to clear tracking history?');
    if (response) {
        storage.saveValue(CURRENT_DAY_DATA_KEY, {})
        ui.clearActivityUI();
    }
}