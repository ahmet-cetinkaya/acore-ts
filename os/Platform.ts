export default class Platform {
    private _isWindows: boolean;
    private _isLinux: boolean;
    private _isMacOS: boolean;
    private _isAndroid: boolean;
    private _isIOS: boolean;
    private _isWeb: boolean;
    private _isElectron: boolean;

    constructor() {
        // Detect platform
        const platform = process.platform;
        this._isWindows = platform === 'win32';
        this._isLinux = platform === 'linux';
        this._isMacOS = platform === 'darwin';

        // Detect if running in Electron
        this._isElectron = process.versions.hasOwnProperty('electron');

        // Detect if running in browser
        this._isWeb = typeof window !== 'undefined' && !this._isElectron;

        // Detect mobile platforms when in browser
        if (this._isWeb) {
            const userAgent = navigator.userAgent.toLowerCase();
            this._isAndroid = userAgent.includes('android');
            this._isIOS = userAgent.includes('iphone') || userAgent.includes('ipad');
        } else {
            this._isAndroid = false;
            this._isIOS = false;
        }
    }

    get isWindows(): boolean {
        return this._isWindows;
    }

    get isLinux(): boolean {
        return this._isLinux;
    }

    get isMacOS(): boolean {
        return this._isMacOS;
    }

    get isAndroid(): boolean {
        return this._isAndroid;
    }

    get isIOS(): boolean {
        return this._isIOS;
    }

    get isWeb(): boolean {
        return this._isWeb;
    }

    get isElectron(): boolean {
        return this._isElectron;
    }

    get isDesktop(): boolean {
        return this._isWindows || this._isLinux || this._isMacOS;
    }

    get isMobile(): boolean {
        return this._isAndroid || this._isIOS;
    }

    toString(): string {
        return {
            windows: this._isWindows,
            linux: this._isLinux,
            macOS: this._isMacOS,
            android: this._isAndroid,
            iOS: this._isIOS,
            web: this._isWeb,
            electron: this._isElectron,
            desktop: this.isDesktop,
            mobile: this.isMobile
        }.toString();
    }
}
