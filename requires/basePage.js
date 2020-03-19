class Page {
    SETTINGS_SAVE_KEY() { return this.settingsSaveKey }
    DEFAULT_SETTINGS() { return this.defaultSettings }

    constructor(ssk, ds) {
	this.settingsSaveKey = ssk;
	this.defaultSettings = ds;
	this.settings = this.defaultSettings;
    }

    loadSettings() {
        this.settings =
	    Helpers.loadSettings(this.settingsSaveKey,
				 this.defaultSettings,
				 this.settings);
    }

    saveSettings() {
        Helpers.saveSettings(this.settingsSaveKey, this.settings)
    }

    getSettings() {
        return this.settings;
    }
    
    populateSettings(obj) {
	if(obj === undefined) {
	    obj = this.settings
	}
        for (let key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }
            let value = obj[key];
	    if (typeof value === 'object') {
		this.populateSettings(obj[key])
	    }
            else if (typeof value === 'boolean') {
                Helpers.toggleSetting(key, value, false);
                continue;
            }
	    else if (typeof value === 'string') {
		Helpers.toggleSetting(key, value, false);
                continue;
            }
        }
    }

    settingsChange(element, textElement, customClass, typeClass) {
	/* empty */
    }

    setupHTML() { /* empty */ }
    setupCSS() { /* empty */ }
    setupObserver() { /* empty */ }
    setupHandlers() { /* empty */ }
} // Page