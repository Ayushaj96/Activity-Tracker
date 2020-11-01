/*
class to save and get value from localstorage
*/
class LocalStorage {

    saveValue(name, value) {
        chrome.storage.local.set({
            [name]: JSON.stringify(value)
        });
    }

    getValue(name, callback) {
        chrome.storage.local.get(name, function(item) {
            if (item !== undefined) {
                callback(item[name]);
            }
        });
    }

}