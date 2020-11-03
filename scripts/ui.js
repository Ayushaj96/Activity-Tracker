
class UI {

    setUIForToday() {
        document.getElementById('btnToday').classList.add('active');
        document.getElementById('btnAll').classList.remove('active');
        document.getElementById('settings').classList.remove('active');
        document.getElementById('chart').style.display = 'block';
    }

    setUIForAll() {
        document.getElementById('btnAll').classList.add('active');
        document.getElementById('btnToday').classList.remove('active');
        document.getElementById('settings').classList.remove('active');
        document.getElementById('chart').style.display = 'block';
    }

    setUIForSettings() {
        document.getElementById('settings').classList.add('active');
        document.getElementById('btnAll').classList.remove('active');
        document.getElementById('btnToday').classList.remove('active');
        this.clearActivityUI();
    }

    clearActivityUI() {
        document.getElementById('timeTable').innerHTML = null;
        document.getElementById('chart').style.display = 'none';
    }

    clearSettingsUI() {

    }
}