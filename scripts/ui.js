class UI {

    setUIForToday() {
        document.getElementById('btnToday').classList.add('active');
        // document.getElementById('btnAll').classList.remove('active');
        document.getElementById('btnSettings').classList.remove('active');
        // document.getElementById('chart').style.display = 'block';
        document.getElementById('today').style.display = 'block';
        this.clearSettingsUI();
    }

    setUIForAll() {
        document.getElementById('btnToday').classList.remove('active');
        // document.getElementById('btnAll').classList.add('active');
        document.getElementById('btnSettings').classList.remove('active');
        document.getElementById('chart').style.display = 'block';
        this.clearSettingsUI();
    }

    setUIForSettings() {
        document.getElementById('btnToday').classList.remove('active');
        // document.getElementById('btnAll').classList.remove('active');
        document.getElementById('btnSettings').classList.add('active');
        document.getElementById('settings').style.display = 'block';
        this.clearActivityUI();
    }

    clearRows() {
        document.getElementById('timeTable').innerHTML = null;
    }

    clearActivityUI() {
        document.getElementById('today').style.display = 'none';

    }

    clearSettingsUI() {
        document.getElementById('settings').style.display = 'none';
    }
}