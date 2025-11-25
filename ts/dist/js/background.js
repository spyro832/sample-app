/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/index.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./ow-game-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-games-events */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-games */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-hotkeys */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-window */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js"), exports);


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGameListener = void 0;
const ow_listener_1 = __webpack_require__(/*! ./ow-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js");
class OWGameListener extends ow_listener_1.OWListener {
    constructor(delegate) {
        super(delegate);
        this.onGameInfoUpdated = (update) => {
            if (!update || !update.gameInfo) {
                return;
            }
            if (!update.runningChanged && !update.gameChanged) {
                return;
            }
            if (update.gameInfo.isRunning) {
                if (this._delegate.onGameStarted) {
                    this._delegate.onGameStarted(update.gameInfo);
                }
            }
            else {
                if (this._delegate.onGameEnded) {
                    this._delegate.onGameEnded(update.gameInfo);
                }
            }
        };
        this.onRunningGameInfo = (info) => {
            if (!info) {
                return;
            }
            if (info.isRunning) {
                if (this._delegate.onGameStarted) {
                    this._delegate.onGameStarted(info);
                }
            }
        };
    }
    start() {
        super.start();
        overwolf.games.onGameInfoUpdated.addListener(this.onGameInfoUpdated);
        overwolf.games.getRunningGameInfo(this.onRunningGameInfo);
    }
    stop() {
        overwolf.games.onGameInfoUpdated.removeListener(this.onGameInfoUpdated);
    }
}
exports.OWGameListener = OWGameListener;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js":
/*!************************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGamesEvents = void 0;
const timer_1 = __webpack_require__(/*! ./timer */ "./node_modules/@overwolf/overwolf-api-ts/dist/timer.js");
class OWGamesEvents {
    constructor(delegate, requiredFeatures, featureRetries = 10) {
        this.onInfoUpdates = (info) => {
            this._delegate.onInfoUpdates(info.info);
        };
        this.onNewEvents = (e) => {
            this._delegate.onNewEvents(e);
        };
        this._delegate = delegate;
        this._requiredFeatures = requiredFeatures;
        this._featureRetries = featureRetries;
    }
    async getInfo() {
        return new Promise((resolve) => {
            overwolf.games.events.getInfo(resolve);
        });
    }
    async setRequiredFeatures() {
        let tries = 1, result;
        while (tries <= this._featureRetries) {
            result = await new Promise(resolve => {
                overwolf.games.events.setRequiredFeatures(this._requiredFeatures, resolve);
            });
            if (result.status === 'success') {
                console.log('setRequiredFeatures(): success: ' + JSON.stringify(result, null, 2));
                return (result.supportedFeatures.length > 0);
            }
            await timer_1.Timer.wait(3000);
            tries++;
        }
        console.warn('setRequiredFeatures(): failure after ' + tries + ' tries' + JSON.stringify(result, null, 2));
        return false;
    }
    registerEvents() {
        this.unRegisterEvents();
        overwolf.games.events.onInfoUpdates2.addListener(this.onInfoUpdates);
        overwolf.games.events.onNewEvents.addListener(this.onNewEvents);
    }
    unRegisterEvents() {
        overwolf.games.events.onInfoUpdates2.removeListener(this.onInfoUpdates);
        overwolf.games.events.onNewEvents.removeListener(this.onNewEvents);
    }
    async start() {
        console.log(`[ow-game-events] START`);
        this.registerEvents();
        await this.setRequiredFeatures();
        const { res, status } = await this.getInfo();
        if (res && status === 'success') {
            this.onInfoUpdates({ info: res });
        }
    }
    stop() {
        console.log(`[ow-game-events] STOP`);
        this.unRegisterEvents();
    }
}
exports.OWGamesEvents = OWGamesEvents;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGames = void 0;
class OWGames {
    static getRunningGameInfo() {
        return new Promise((resolve) => {
            overwolf.games.getRunningGameInfo(resolve);
        });
    }
    static classIdFromGameId(gameId) {
        let classId = Math.floor(gameId / 10);
        return classId;
    }
    static async getRecentlyPlayedGames(limit = 3) {
        return new Promise((resolve) => {
            if (!overwolf.games.getRecentlyPlayedGames) {
                return resolve(null);
            }
            overwolf.games.getRecentlyPlayedGames(limit, result => {
                resolve(result.games);
            });
        });
    }
    static async getGameDBInfo(gameClassId) {
        return new Promise((resolve) => {
            overwolf.games.getGameDBInfo(gameClassId, resolve);
        });
    }
}
exports.OWGames = OWGames;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWHotkeys = void 0;
class OWHotkeys {
    constructor() { }
    static getHotkeyText(hotkeyId, gameId) {
        return new Promise(resolve => {
            overwolf.settings.hotkeys.get(result => {
                if (result && result.success) {
                    let hotkey;
                    if (gameId === undefined)
                        hotkey = result.globals.find(h => h.name === hotkeyId);
                    else if (result.games && result.games[gameId])
                        hotkey = result.games[gameId].find(h => h.name === hotkeyId);
                    if (hotkey)
                        return resolve(hotkey.binding);
                }
                resolve('UNASSIGNED');
            });
        });
    }
    static onHotkeyDown(hotkeyId, action) {
        overwolf.settings.hotkeys.onPressed.addListener((result) => {
            if (result && result.name === hotkeyId)
                action(result);
        });
    }
}
exports.OWHotkeys = OWHotkeys;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js":
/*!********************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWListener = void 0;
class OWListener {
    constructor(delegate) {
        this._delegate = delegate;
    }
    start() {
        this.stop();
    }
}
exports.OWListener = OWListener;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js":
/*!******************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWWindow = void 0;
class OWWindow {
    constructor(name = null) {
        this._name = name;
        this._id = null;
    }
    async restore() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.restore(id, result => {
                if (!result.success)
                    console.error(`[restore] - an error occurred, windowId=${id}, reason=${result.error}`);
                resolve();
            });
        });
    }
    async minimize() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.minimize(id, () => { });
            return resolve();
        });
    }
    async maximize() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.maximize(id, () => { });
            return resolve();
        });
    }
    async hide() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.hide(id, () => { });
            return resolve();
        });
    }
    async close() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            const result = await this.getWindowState();
            if (result.success &&
                (result.window_state !== 'closed')) {
                await this.internalClose();
            }
            return resolve();
        });
    }
    dragMove(elem) {
        elem.className = elem.className + ' draggable';
        elem.onmousedown = e => {
            e.preventDefault();
            overwolf.windows.dragMove(this._name);
        };
    }
    async getWindowState() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.getWindowState(id, resolve);
        });
    }
    static async getCurrentInfo() {
        return new Promise(async (resolve) => {
            overwolf.windows.getCurrentWindow(result => {
                resolve(result.window);
            });
        });
    }
    obtain() {
        return new Promise((resolve, reject) => {
            const cb = res => {
                if (res && res.status === "success" && res.window && res.window.id) {
                    this._id = res.window.id;
                    if (!this._name) {
                        this._name = res.window.name;
                    }
                    resolve(res.window);
                }
                else {
                    this._id = null;
                    reject();
                }
            };
            if (!this._name) {
                overwolf.windows.getCurrentWindow(cb);
            }
            else {
                overwolf.windows.obtainDeclaredWindow(this._name, cb);
            }
        });
    }
    async assureObtained() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.obtain();
            return resolve();
        });
    }
    async internalClose() {
        let that = this;
        return new Promise(async (resolve, reject) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.close(id, res => {
                if (res && res.success)
                    resolve();
                else
                    reject(res);
            });
        });
    }
}
exports.OWWindow = OWWindow;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/timer.js":
/*!**************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/timer.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Timer = void 0;
class Timer {
    constructor(delegate, id) {
        this._timerId = null;
        this.handleTimerEvent = () => {
            this._timerId = null;
            this._delegate.onTimer(this._id);
        };
        this._delegate = delegate;
        this._id = id;
    }
    static async wait(intervalInMS) {
        return new Promise(resolve => {
            setTimeout(resolve, intervalInMS);
        });
    }
    start(intervalInMS) {
        this.stop();
        this._timerId = setTimeout(this.handleTimerEvent, intervalInMS);
    }
    stop() {
        if (this._timerId == null) {
            return;
        }
        clearTimeout(this._timerId);
        this._timerId = null;
    }
}
exports.Timer = Timer;


/***/ }),

/***/ "./src/consts.ts":
/*!***********************!*\
  !*** ./src/consts.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.kHotkeys = exports.kWindowNames = exports.kGameClassIds = exports.kGamesFeatures = void 0;
exports.kGamesFeatures = new Map([
    [
        21216,
        [
            'kill',
            'killed',
            'killer',
            'revived',
            'death',
            'match',
            'match_info',
            'rank',
            'me',
            'phase',
            'location',
            'team',
            'items',
            'counters'
        ]
    ],
    [
        7764,
        [
            'match_info',
            'kill',
            'death',
            'assist',
            'headshot',
            'round_start',
            'match_start',
            'match_info',
            'match_end',
            'team_round_win',
            'bomb_planted',
            'bomb_change',
            'reloading',
            'fired',
            'weapon_change',
            'weapon_acquired',
            'info',
            'roster',
            'player_activity_change',
            'team_set',
            'replay',
            'counters',
            'mvp',
            'scoreboard',
            'kill_feed'
        ]
    ],
    [
        5426,
        [
            'live_client_data',
            'matchState',
            'match_info',
            'death',
            'respawn',
            'abilities',
            'kill',
            'assist',
            'gold',
            'minions',
            'summoner_info',
            'gameMode',
            'teams',
            'level',
            'announcer',
            'counters',
            'damage',
            'heal'
        ]
    ],
    [
        21634,
        [
            'match_info',
            'game_info'
        ]
    ],
    [
        8032,
        [
            'game_info',
            'match_info'
        ]
    ],
    [
        10844,
        [
            'game_info',
            'match_info',
            'kill',
            'death'
        ]
    ],
    [
        10906,
        [
            'kill',
            'revived',
            'death',
            'killer',
            'match',
            'match_info',
            'rank',
            'counters',
            'location',
            'me',
            'team',
            'phase',
            'map',
            'roster'
        ]
    ],
    [
        10826,
        [
            'game_info',
            'match',
            'match_info',
            'roster',
            'kill',
            'death',
            'me',
            'defuser'
        ]
    ],
    [
        21404,
        [
            'game_info',
            'match_info',
            'player',
            'location',
            'match',
            'feed',
            'connection',
            'kill',
            'death',
            'portal',
            'assist'
        ]
    ],
    [
        7212,
        [
            'kill',
            'death',
            'me',
            'match_info'
        ]
    ],
    [
        21640,
        [
            'me',
            'game_info',
            'match_info',
            'kill',
            'death'
        ]
    ],
    [
        7314,
        [
            'game_state_changed',
            'match_state_changed',
            'match_detected',
            'daytime_changed',
            'clock_time_changed',
            'ward_purchase_cooldown_changed',
            'match_ended',
            'kill',
            'assist',
            'death',
            'cs',
            'xpm',
            'gpm',
            'gold',
            'hero_leveled_up',
            'hero_respawned',
            'hero_buyback_info_changed',
            'hero_boughtback',
            'hero_health_mana_info',
            'hero_status_effect_changed',
            'hero_attributes_skilled',
            'hero_ability_skilled',
            'hero_ability_used',
            'hero_ability_cooldown_changed',
            'hero_ability_changed',
            'hero_item_cooldown_changed',
            'hero_item_changed',
            'hero_item_used',
            'hero_item_consumed',
            'hero_item_charged',
            'match_info',
            'roster',
            'party',
            'error',
            'hero_pool',
            'me',
            'game'
        ]
    ],
    [
        21626,
        [
            'match_info',
            'game_info',
            'kill',
            'death'
        ]
    ],
    [
        8954,
        [
            'game_info',
            'match_info'
        ]
    ],
]);
exports.kGameClassIds = Array.from(exports.kGamesFeatures.keys());
exports.kWindowNames = {
    inGame: 'in_game',
    desktop: 'desktop'
};
exports.kHotkeys = {
    toggle: 'sample_app_ts_showhide'
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const overwolf_api_ts_1 = __webpack_require__(/*! @overwolf/overwolf-api-ts */ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js");
const consts_1 = __webpack_require__(/*! ../consts */ "./src/consts.ts");
class BackgroundController {
    constructor() {
        this._windows = {};
        this._windows[consts_1.kWindowNames.desktop] = new overwolf_api_ts_1.OWWindow(consts_1.kWindowNames.desktop);
        this._windows[consts_1.kWindowNames.inGame] = new overwolf_api_ts_1.OWWindow(consts_1.kWindowNames.inGame);
        this._gameListener = new overwolf_api_ts_1.OWGameListener({
            onGameStarted: this.toggleWindows.bind(this),
            onGameEnded: this.toggleWindows.bind(this)
        });
        overwolf.extensions.onAppLaunchTriggered.addListener(e => this.onAppLaunchTriggered(e));
    }
    ;
    static instance() {
        if (!BackgroundController._instance) {
            BackgroundController._instance = new BackgroundController();
        }
        return BackgroundController._instance;
    }
    async run() {
        this._gameListener.start();
        const currWindowName = (await this.isSupportedGameRunning())
            ? consts_1.kWindowNames.inGame
            : consts_1.kWindowNames.desktop;
        this._windows[currWindowName].restore();
    }
    async onAppLaunchTriggered(e) {
        console.log('onAppLaunchTriggered():', e);
        if (!e || e.origin.includes('gamelaunchevent')) {
            return;
        }
        if (await this.isSupportedGameRunning()) {
            this._windows[consts_1.kWindowNames.desktop].close();
            this._windows[consts_1.kWindowNames.inGame].restore();
        }
        else {
            this._windows[consts_1.kWindowNames.desktop].restore();
            this._windows[consts_1.kWindowNames.inGame].close();
        }
    }
    toggleWindows(info) {
        if (!info || !this.isSupportedGame(info)) {
            return;
        }
        if (info.isRunning) {
            this._windows[consts_1.kWindowNames.desktop].close();
            this._windows[consts_1.kWindowNames.inGame].restore();
        }
        else {
            this._windows[consts_1.kWindowNames.desktop].restore();
            this._windows[consts_1.kWindowNames.inGame].close();
        }
    }
    async isSupportedGameRunning() {
        const info = await overwolf_api_ts_1.OWGames.getRunningGameInfo();
        return info && info.isRunning && this.isSupportedGame(info);
    }
    isSupportedGame(info) {
        return consts_1.kGameClassIds.includes(info.classId);
    }
}
BackgroundController.instance().run();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Y2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1nYW1lLWxpc3RlbmVyLmpzIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWdhbWVzLWV2ZW50cy5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1nYW1lcy5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1ob3RrZXlzLmpzIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWxpc3RlbmVyLmpzIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LXdpbmRvdy5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC90aW1lci5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vc3JjL2NvbnN0cy50cyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9zcmMvYmFja2dyb3VuZC9iYWNrZ3JvdW5kLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSkpO1xyXG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZXhwb3J0cywgcCkpIF9fY3JlYXRlQmluZGluZyhleHBvcnRzLCBtLCBwKTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctZ2FtZS1saXN0ZW5lclwiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy1nYW1lcy1ldmVudHNcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctZ2FtZXNcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctaG90a2V5c1wiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy1saXN0ZW5lclwiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy13aW5kb3dcIiksIGV4cG9ydHMpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XR2FtZUxpc3RlbmVyID0gdm9pZCAwO1xyXG5jb25zdCBvd19saXN0ZW5lcl8xID0gcmVxdWlyZShcIi4vb3ctbGlzdGVuZXJcIik7XHJcbmNsYXNzIE9XR2FtZUxpc3RlbmVyIGV4dGVuZHMgb3dfbGlzdGVuZXJfMS5PV0xpc3RlbmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGRlbGVnYXRlKSB7XHJcbiAgICAgICAgc3VwZXIoZGVsZWdhdGUpO1xyXG4gICAgICAgIHRoaXMub25HYW1lSW5mb1VwZGF0ZWQgPSAodXBkYXRlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdXBkYXRlIHx8ICF1cGRhdGUuZ2FtZUluZm8pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXVwZGF0ZS5ydW5uaW5nQ2hhbmdlZCAmJiAhdXBkYXRlLmdhbWVDaGFuZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHVwZGF0ZS5nYW1lSW5mby5pc1J1bm5pbmcpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVTdGFydGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25HYW1lU3RhcnRlZCh1cGRhdGUuZ2FtZUluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2RlbGVnYXRlLm9uR2FtZUVuZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25HYW1lRW5kZWQodXBkYXRlLmdhbWVJbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5vblJ1bm5pbmdHYW1lSW5mbyA9IChpbmZvKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghaW5mbykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpbmZvLmlzUnVubmluZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2RlbGVnYXRlLm9uR2FtZVN0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVTdGFydGVkKGluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHN1cGVyLnN0YXJ0KCk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMub25HYW1lSW5mb1VwZGF0ZWQuYWRkTGlzdGVuZXIodGhpcy5vbkdhbWVJbmZvVXBkYXRlZCk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZ2V0UnVubmluZ0dhbWVJbmZvKHRoaXMub25SdW5uaW5nR2FtZUluZm8pO1xyXG4gICAgfVxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5vbkdhbWVJbmZvVXBkYXRlZC5yZW1vdmVMaXN0ZW5lcih0aGlzLm9uR2FtZUluZm9VcGRhdGVkKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XR2FtZUxpc3RlbmVyID0gT1dHYW1lTGlzdGVuZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dHYW1lc0V2ZW50cyA9IHZvaWQgMDtcclxuY29uc3QgdGltZXJfMSA9IHJlcXVpcmUoXCIuL3RpbWVyXCIpO1xyXG5jbGFzcyBPV0dhbWVzRXZlbnRzIHtcclxuICAgIGNvbnN0cnVjdG9yKGRlbGVnYXRlLCByZXF1aXJlZEZlYXR1cmVzLCBmZWF0dXJlUmV0cmllcyA9IDEwKSB7XHJcbiAgICAgICAgdGhpcy5vbkluZm9VcGRhdGVzID0gKGluZm8pID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25JbmZvVXBkYXRlcyhpbmZvLmluZm8pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5vbk5ld0V2ZW50cyA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uTmV3RXZlbnRzKGUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fZGVsZWdhdGUgPSBkZWxlZ2F0ZTtcclxuICAgICAgICB0aGlzLl9yZXF1aXJlZEZlYXR1cmVzID0gcmVxdWlyZWRGZWF0dXJlcztcclxuICAgICAgICB0aGlzLl9mZWF0dXJlUmV0cmllcyA9IGZlYXR1cmVSZXRyaWVzO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgZ2V0SW5mbygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLmdldEluZm8ocmVzb2x2ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBzZXRSZXF1aXJlZEZlYXR1cmVzKCkge1xyXG4gICAgICAgIGxldCB0cmllcyA9IDEsIHJlc3VsdDtcclxuICAgICAgICB3aGlsZSAodHJpZXMgPD0gdGhpcy5fZmVhdHVyZVJldHJpZXMpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMuc2V0UmVxdWlyZWRGZWF0dXJlcyh0aGlzLl9yZXF1aXJlZEZlYXR1cmVzLCByZXNvbHZlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdHVzID09PSAnc3VjY2VzcycpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZXRSZXF1aXJlZEZlYXR1cmVzKCk6IHN1Y2Nlc3M6ICcgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQsIG51bGwsIDIpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAocmVzdWx0LnN1cHBvcnRlZEZlYXR1cmVzLmxlbmd0aCA+IDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGF3YWl0IHRpbWVyXzEuVGltZXIud2FpdCgzMDAwKTtcclxuICAgICAgICAgICAgdHJpZXMrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdzZXRSZXF1aXJlZEZlYXR1cmVzKCk6IGZhaWx1cmUgYWZ0ZXIgJyArIHRyaWVzICsgJyB0cmllcycgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQsIG51bGwsIDIpKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZWdpc3RlckV2ZW50cygpIHtcclxuICAgICAgICB0aGlzLnVuUmVnaXN0ZXJFdmVudHMoKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMub25JbmZvVXBkYXRlczIuYWRkTGlzdGVuZXIodGhpcy5vbkluZm9VcGRhdGVzKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMub25OZXdFdmVudHMuYWRkTGlzdGVuZXIodGhpcy5vbk5ld0V2ZW50cyk7XHJcbiAgICB9XHJcbiAgICB1blJlZ2lzdGVyRXZlbnRzKCkge1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5vbkluZm9VcGRhdGVzMi5yZW1vdmVMaXN0ZW5lcih0aGlzLm9uSW5mb1VwZGF0ZXMpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5vbk5ld0V2ZW50cy5yZW1vdmVMaXN0ZW5lcih0aGlzLm9uTmV3RXZlbnRzKTtcclxuICAgIH1cclxuICAgIGFzeW5jIHN0YXJ0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbb3ctZ2FtZS1ldmVudHNdIFNUQVJUYCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuc2V0UmVxdWlyZWRGZWF0dXJlcygpO1xyXG4gICAgICAgIGNvbnN0IHsgcmVzLCBzdGF0dXMgfSA9IGF3YWl0IHRoaXMuZ2V0SW5mbygpO1xyXG4gICAgICAgIGlmIChyZXMgJiYgc3RhdHVzID09PSAnc3VjY2VzcycpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkluZm9VcGRhdGVzKHsgaW5mbzogcmVzIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFtvdy1nYW1lLWV2ZW50c10gU1RPUGApO1xyXG4gICAgICAgIHRoaXMudW5SZWdpc3RlckV2ZW50cygpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dHYW1lc0V2ZW50cyA9IE9XR2FtZXNFdmVudHM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dHYW1lcyA9IHZvaWQgMDtcclxuY2xhc3MgT1dHYW1lcyB7XHJcbiAgICBzdGF0aWMgZ2V0UnVubmluZ0dhbWVJbmZvKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5nZXRSdW5uaW5nR2FtZUluZm8ocmVzb2x2ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgY2xhc3NJZEZyb21HYW1lSWQoZ2FtZUlkKSB7XHJcbiAgICAgICAgbGV0IGNsYXNzSWQgPSBNYXRoLmZsb29yKGdhbWVJZCAvIDEwKTtcclxuICAgICAgICByZXR1cm4gY2xhc3NJZDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBnZXRSZWNlbnRseVBsYXllZEdhbWVzKGxpbWl0ID0gMykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIW92ZXJ3b2xmLmdhbWVzLmdldFJlY2VudGx5UGxheWVkR2FtZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmdldFJlY2VudGx5UGxheWVkR2FtZXMobGltaXQsIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdC5nYW1lcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGdldEdhbWVEQkluZm8oZ2FtZUNsYXNzSWQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZ2V0R2FtZURCSW5mbyhnYW1lQ2xhc3NJZCwgcmVzb2x2ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0dhbWVzID0gT1dHYW1lcztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0hvdGtleXMgPSB2b2lkIDA7XHJcbmNsYXNzIE9XSG90a2V5cyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgc3RhdGljIGdldEhvdGtleVRleHQoaG90a2V5SWQsIGdhbWVJZCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgICAgICAgb3ZlcndvbGYuc2V0dGluZ3MuaG90a2V5cy5nZXQocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaG90a2V5O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChnYW1lSWQgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgaG90a2V5ID0gcmVzdWx0Lmdsb2JhbHMuZmluZChoID0+IGgubmFtZSA9PT0gaG90a2V5SWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJlc3VsdC5nYW1lcyAmJiByZXN1bHQuZ2FtZXNbZ2FtZUlkXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgaG90a2V5ID0gcmVzdWx0LmdhbWVzW2dhbWVJZF0uZmluZChoID0+IGgubmFtZSA9PT0gaG90a2V5SWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChob3RrZXkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGhvdGtleS5iaW5kaW5nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc29sdmUoJ1VOQVNTSUdORUQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgb25Ib3RrZXlEb3duKGhvdGtleUlkLCBhY3Rpb24pIHtcclxuICAgICAgICBvdmVyd29sZi5zZXR0aW5ncy5ob3RrZXlzLm9uUHJlc3NlZC5hZGRMaXN0ZW5lcigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0Lm5hbWUgPT09IGhvdGtleUlkKVxyXG4gICAgICAgICAgICAgICAgYWN0aW9uKHJlc3VsdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0hvdGtleXMgPSBPV0hvdGtleXM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dMaXN0ZW5lciA9IHZvaWQgMDtcclxuY2xhc3MgT1dMaXN0ZW5lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZSkge1xyXG4gICAgICAgIHRoaXMuX2RlbGVnYXRlID0gZGVsZWdhdGU7XHJcbiAgICB9XHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XTGlzdGVuZXIgPSBPV0xpc3RlbmVyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XV2luZG93ID0gdm9pZCAwO1xyXG5jbGFzcyBPV1dpbmRvdyB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lID0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuX2lkID0gbnVsbDtcclxuICAgIH1cclxuICAgIGFzeW5jIHJlc3RvcmUoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLnJlc3RvcmUoaWQsIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdC5zdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFtyZXN0b3JlXSAtIGFuIGVycm9yIG9jY3VycmVkLCB3aW5kb3dJZD0ke2lkfSwgcmVhc29uPSR7cmVzdWx0LmVycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIG1pbmltaXplKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5taW5pbWl6ZShpZCwgKCkgPT4geyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIG1heGltaXplKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5tYXhpbWl6ZShpZCwgKCkgPT4geyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIGhpZGUoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmhpZGUoaWQsICgpID0+IHsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBjbG9zZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuZ2V0V2luZG93U3RhdGUoKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzICYmXHJcbiAgICAgICAgICAgICAgICAocmVzdWx0LndpbmRvd19zdGF0ZSAhPT0gJ2Nsb3NlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmludGVybmFsQ2xvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZHJhZ01vdmUoZWxlbSkge1xyXG4gICAgICAgIGVsZW0uY2xhc3NOYW1lID0gZWxlbS5jbGFzc05hbWUgKyAnIGRyYWdnYWJsZSc7XHJcbiAgICAgICAgZWxlbS5vbm1vdXNlZG93biA9IGUgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuZHJhZ01vdmUodGhpcy5fbmFtZSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGFzeW5jIGdldFdpbmRvd1N0YXRlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5nZXRXaW5kb3dTdGF0ZShpZCwgcmVzb2x2ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0Q3VycmVudEluZm8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuZ2V0Q3VycmVudFdpbmRvdyhyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQud2luZG93KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBvYnRhaW4oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY2IgPSByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcyAmJiByZXMuc3RhdHVzID09PSBcInN1Y2Nlc3NcIiAmJiByZXMud2luZG93ICYmIHJlcy53aW5kb3cuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pZCA9IHJlcy53aW5kb3cuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWUgPSByZXMud2luZG93Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzLndpbmRvdyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pZCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5nZXRDdXJyZW50V2luZG93KGNiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3Mub2J0YWluRGVjbGFyZWRXaW5kb3codGhpcy5fbmFtZSwgY2IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBhc3N1cmVPYnRhaW5lZCgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQub2J0YWluKCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBpbnRlcm5hbENsb3NlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmNsb3NlKGlkLCByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcyAmJiByZXMuc3VjY2VzcylcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dXaW5kb3cgPSBPV1dpbmRvdztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5UaW1lciA9IHZvaWQgMDtcclxuY2xhc3MgVGltZXIge1xyXG4gICAgY29uc3RydWN0b3IoZGVsZWdhdGUsIGlkKSB7XHJcbiAgICAgICAgdGhpcy5fdGltZXJJZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVUaW1lckV2ZW50ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl90aW1lcklkID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25UaW1lcih0aGlzLl9pZCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xyXG4gICAgICAgIHRoaXMuX2lkID0gaWQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgd2FpdChpbnRlcnZhbEluTVMpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgaW50ZXJ2YWxJbk1TKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXJ0KGludGVydmFsSW5NUykge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMuX3RpbWVySWQgPSBzZXRUaW1lb3V0KHRoaXMuaGFuZGxlVGltZXJFdmVudCwgaW50ZXJ2YWxJbk1TKTtcclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3RpbWVySWQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcklkKTtcclxuICAgICAgICB0aGlzLl90aW1lcklkID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLlRpbWVyID0gVGltZXI7XHJcbiIsImV4cG9ydCBjb25zdCBrR2FtZXNGZWF0dXJlcyA9IG5ldyBNYXA8bnVtYmVyLCBzdHJpbmdbXT4oW1xyXG4gIC8vIEZvcnRuaXRlXHJcbiAgW1xyXG4gICAgMjEyMTYsXHJcbiAgICBbXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ2tpbGxlZCcsXHJcbiAgICAgICdraWxsZXInLFxyXG4gICAgICAncmV2aXZlZCcsXHJcbiAgICAgICdkZWF0aCcsXHJcbiAgICAgICdtYXRjaCcsXHJcbiAgICAgICdtYXRjaF9pbmZvJyxcclxuICAgICAgJ3JhbmsnLFxyXG4gICAgICAnbWUnLFxyXG4gICAgICAncGhhc2UnLFxyXG4gICAgICAnbG9jYXRpb24nLFxyXG4gICAgICAndGVhbScsXHJcbiAgICAgICdpdGVtcycsXHJcbiAgICAgICdjb3VudGVycydcclxuICAgIF1cclxuICBdLFxyXG4gIC8vIENTR09cclxuICBbXHJcbiAgICA3NzY0LFxyXG4gICAgW1xyXG4gICAgICAnbWF0Y2hfaW5mbycsXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ2RlYXRoJyxcclxuICAgICAgJ2Fzc2lzdCcsXHJcbiAgICAgICdoZWFkc2hvdCcsXHJcbiAgICAgICdyb3VuZF9zdGFydCcsXHJcbiAgICAgICdtYXRjaF9zdGFydCcsXHJcbiAgICAgICdtYXRjaF9pbmZvJyxcclxuICAgICAgJ21hdGNoX2VuZCcsXHJcbiAgICAgICd0ZWFtX3JvdW5kX3dpbicsXHJcbiAgICAgICdib21iX3BsYW50ZWQnLFxyXG4gICAgICAnYm9tYl9jaGFuZ2UnLFxyXG4gICAgICAncmVsb2FkaW5nJyxcclxuICAgICAgJ2ZpcmVkJyxcclxuICAgICAgJ3dlYXBvbl9jaGFuZ2UnLFxyXG4gICAgICAnd2VhcG9uX2FjcXVpcmVkJyxcclxuICAgICAgJ2luZm8nLFxyXG4gICAgICAncm9zdGVyJyxcclxuICAgICAgJ3BsYXllcl9hY3Rpdml0eV9jaGFuZ2UnLFxyXG4gICAgICAndGVhbV9zZXQnLFxyXG4gICAgICAncmVwbGF5JyxcclxuICAgICAgJ2NvdW50ZXJzJyxcclxuICAgICAgJ212cCcsXHJcbiAgICAgICdzY29yZWJvYXJkJyxcclxuICAgICAgJ2tpbGxfZmVlZCdcclxuICAgIF1cclxuICBdLFxyXG4gIC8vIExlYWd1ZSBvZiBMZWdlbmRzXHJcbiAgW1xyXG4gICAgNTQyNixcclxuICAgIFtcclxuICAgICAgJ2xpdmVfY2xpZW50X2RhdGEnLFxyXG4gICAgICAnbWF0Y2hTdGF0ZScsXHJcbiAgICAgICdtYXRjaF9pbmZvJyxcclxuICAgICAgJ2RlYXRoJyxcclxuICAgICAgJ3Jlc3Bhd24nLFxyXG4gICAgICAnYWJpbGl0aWVzJyxcclxuICAgICAgJ2tpbGwnLFxyXG4gICAgICAnYXNzaXN0JyxcclxuICAgICAgJ2dvbGQnLFxyXG4gICAgICAnbWluaW9ucycsXHJcbiAgICAgICdzdW1tb25lcl9pbmZvJyxcclxuICAgICAgJ2dhbWVNb2RlJyxcclxuICAgICAgJ3RlYW1zJyxcclxuICAgICAgJ2xldmVsJyxcclxuICAgICAgJ2Fubm91bmNlcicsXHJcbiAgICAgICdjb3VudGVycycsXHJcbiAgICAgICdkYW1hZ2UnLFxyXG4gICAgICAnaGVhbCdcclxuICAgIF1cclxuICBdLFxyXG4gIC8vIEVzY2FwZSBGcm9tIFRhcmtvdlxyXG4gIFtcclxuICAgIDIxNjM0LFxyXG4gICAgW1xyXG4gICAgICAnbWF0Y2hfaW5mbycsXHJcbiAgICAgICdnYW1lX2luZm8nXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBNaW5lY3JhZnRcclxuICBbXHJcbiAgICA4MDMyLFxyXG4gICAgW1xyXG4gICAgICAnZ2FtZV9pbmZvJyxcclxuICAgICAgJ21hdGNoX2luZm8nXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBPdmVyd2F0Y2hcclxuICBbXHJcbiAgICAxMDg0NCxcclxuICAgIFtcclxuICAgICAgJ2dhbWVfaW5mbycsXHJcbiAgICAgICdtYXRjaF9pbmZvJyxcclxuICAgICAgJ2tpbGwnLFxyXG4gICAgICAnZGVhdGgnXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBQVUJHXHJcbiAgW1xyXG4gICAgMTA5MDYsXHJcbiAgICBbXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ3Jldml2ZWQnLFxyXG4gICAgICAnZGVhdGgnLFxyXG4gICAgICAna2lsbGVyJyxcclxuICAgICAgJ21hdGNoJyxcclxuICAgICAgJ21hdGNoX2luZm8nLFxyXG4gICAgICAncmFuaycsXHJcbiAgICAgICdjb3VudGVycycsXHJcbiAgICAgICdsb2NhdGlvbicsXHJcbiAgICAgICdtZScsXHJcbiAgICAgICd0ZWFtJyxcclxuICAgICAgJ3BoYXNlJyxcclxuICAgICAgJ21hcCcsXHJcbiAgICAgICdyb3N0ZXInXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBSYWluYm93IFNpeCBTaWVnZVxyXG4gIFtcclxuICAgIDEwODI2LFxyXG4gICAgW1xyXG4gICAgICAnZ2FtZV9pbmZvJyxcclxuICAgICAgJ21hdGNoJyxcclxuICAgICAgJ21hdGNoX2luZm8nLFxyXG4gICAgICAncm9zdGVyJyxcclxuICAgICAgJ2tpbGwnLFxyXG4gICAgICAnZGVhdGgnLFxyXG4gICAgICAnbWUnLFxyXG4gICAgICAnZGVmdXNlcidcclxuICAgIF1cclxuICBdLFxyXG4gIC8vIFNwbGl0Z2F0ZTogQXJlbmEgV2FyZmFyZVxyXG4gIFtcclxuICAgIDIxNDA0LFxyXG4gICAgW1xyXG4gICAgICAnZ2FtZV9pbmZvJyxcclxuICAgICAgJ21hdGNoX2luZm8nLFxyXG4gICAgICAncGxheWVyJyxcclxuICAgICAgJ2xvY2F0aW9uJyxcclxuICAgICAgJ21hdGNoJyxcclxuICAgICAgJ2ZlZWQnLFxyXG4gICAgICAnY29ubmVjdGlvbicsXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ2RlYXRoJyxcclxuICAgICAgJ3BvcnRhbCcsXHJcbiAgICAgICdhc3Npc3QnXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBQYXRoIG9mIEV4aWxlXHJcbiAgW1xyXG4gICAgNzIxMixcclxuICAgIFtcclxuICAgICAgJ2tpbGwnLFxyXG4gICAgICAnZGVhdGgnLFxyXG4gICAgICAnbWUnLFxyXG4gICAgICAnbWF0Y2hfaW5mbydcclxuICAgIF1cclxuICBdLFxyXG4gIC8vIFZhbG9yYW50XHJcbiAgW1xyXG4gICAgMjE2NDAsXHJcbiAgICBbXHJcbiAgICAgICdtZScsXHJcbiAgICAgICdnYW1lX2luZm8nLFxyXG4gICAgICAnbWF0Y2hfaW5mbycsXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ2RlYXRoJ1xyXG4gICAgXVxyXG4gIF0sXHJcbiAgLy8gRG90YSAyXHJcbiAgW1xyXG4gICAgNzMxNCxcclxuICAgIFtcclxuICAgICAgJ2dhbWVfc3RhdGVfY2hhbmdlZCcsXHJcbiAgICAgICdtYXRjaF9zdGF0ZV9jaGFuZ2VkJyxcclxuICAgICAgJ21hdGNoX2RldGVjdGVkJyxcclxuICAgICAgJ2RheXRpbWVfY2hhbmdlZCcsXHJcbiAgICAgICdjbG9ja190aW1lX2NoYW5nZWQnLFxyXG4gICAgICAnd2FyZF9wdXJjaGFzZV9jb29sZG93bl9jaGFuZ2VkJyxcclxuICAgICAgJ21hdGNoX2VuZGVkJyxcclxuICAgICAgJ2tpbGwnLFxyXG4gICAgICAnYXNzaXN0JyxcclxuICAgICAgJ2RlYXRoJyxcclxuICAgICAgJ2NzJyxcclxuICAgICAgJ3hwbScsXHJcbiAgICAgICdncG0nLFxyXG4gICAgICAnZ29sZCcsXHJcbiAgICAgICdoZXJvX2xldmVsZWRfdXAnLFxyXG4gICAgICAnaGVyb19yZXNwYXduZWQnLFxyXG4gICAgICAnaGVyb19idXliYWNrX2luZm9fY2hhbmdlZCcsXHJcbiAgICAgICdoZXJvX2JvdWdodGJhY2snLFxyXG4gICAgICAnaGVyb19oZWFsdGhfbWFuYV9pbmZvJyxcclxuICAgICAgJ2hlcm9fc3RhdHVzX2VmZmVjdF9jaGFuZ2VkJyxcclxuICAgICAgJ2hlcm9fYXR0cmlidXRlc19za2lsbGVkJyxcclxuICAgICAgJ2hlcm9fYWJpbGl0eV9za2lsbGVkJyxcclxuICAgICAgJ2hlcm9fYWJpbGl0eV91c2VkJyxcclxuICAgICAgJ2hlcm9fYWJpbGl0eV9jb29sZG93bl9jaGFuZ2VkJyxcclxuICAgICAgJ2hlcm9fYWJpbGl0eV9jaGFuZ2VkJyxcclxuICAgICAgJ2hlcm9faXRlbV9jb29sZG93bl9jaGFuZ2VkJyxcclxuICAgICAgJ2hlcm9faXRlbV9jaGFuZ2VkJyxcclxuICAgICAgJ2hlcm9faXRlbV91c2VkJyxcclxuICAgICAgJ2hlcm9faXRlbV9jb25zdW1lZCcsXHJcbiAgICAgICdoZXJvX2l0ZW1fY2hhcmdlZCcsXHJcbiAgICAgICdtYXRjaF9pbmZvJyxcclxuICAgICAgJ3Jvc3RlcicsXHJcbiAgICAgICdwYXJ0eScsXHJcbiAgICAgICdlcnJvcicsXHJcbiAgICAgICdoZXJvX3Bvb2wnLFxyXG4gICAgICAnbWUnLFxyXG4gICAgICAnZ2FtZSdcclxuICAgIF1cclxuICBdLFxyXG4gIC8vIENhbGwgb2YgRHV0eTogV2Fyem9uZVxyXG4gIFtcclxuICAgIDIxNjI2LFxyXG4gICAgW1xyXG4gICAgICAnbWF0Y2hfaW5mbycsXHJcbiAgICAgICdnYW1lX2luZm8nLFxyXG4gICAgICAna2lsbCcsXHJcbiAgICAgICdkZWF0aCdcclxuICAgIF1cclxuICBdLFxyXG4gIC8vIFdhcmZyYW1lXHJcbiAgW1xyXG4gICAgODk1NCxcclxuICAgIFtcclxuICAgICAgJ2dhbWVfaW5mbycsXHJcbiAgICAgICdtYXRjaF9pbmZvJ1xyXG4gICAgXVxyXG4gIF0sXHJcbl0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGtHYW1lQ2xhc3NJZHMgPSBBcnJheS5mcm9tKGtHYW1lc0ZlYXR1cmVzLmtleXMoKSk7XHJcblxyXG5leHBvcnQgY29uc3Qga1dpbmRvd05hbWVzID0ge1xyXG4gIGluR2FtZTogJ2luX2dhbWUnLFxyXG4gIGRlc2t0b3A6ICdkZXNrdG9wJ1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGtIb3RrZXlzID0ge1xyXG4gIHRvZ2dsZTogJ3NhbXBsZV9hcHBfdHNfc2hvd2hpZGUnXHJcbn07XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQge1xyXG4gIE9XR2FtZXMsXHJcbiAgT1dHYW1lTGlzdGVuZXIsXHJcbiAgT1dXaW5kb3dcclxufSBmcm9tICdAb3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzJztcclxuXHJcbmltcG9ydCB7IGtXaW5kb3dOYW1lcywga0dhbWVDbGFzc0lkcyB9IGZyb20gXCIuLi9jb25zdHNcIjtcclxuXHJcbmltcG9ydCBSdW5uaW5nR2FtZUluZm8gPSBvdmVyd29sZi5nYW1lcy5SdW5uaW5nR2FtZUluZm87XHJcbmltcG9ydCBBcHBMYXVuY2hUcmlnZ2VyZWRFdmVudCA9IG92ZXJ3b2xmLmV4dGVuc2lvbnMuQXBwTGF1bmNoVHJpZ2dlcmVkRXZlbnQ7XHJcblxyXG4vLyBUaGUgYmFja2dyb3VuZCBjb250cm9sbGVyIGhvbGRzIGFsbCBvZiB0aGUgYXBwJ3MgYmFja2dyb3VuZCBsb2dpYyAtIGhlbmNlIGl0cyBuYW1lLiBpdCBoYXNcclxuLy8gbWFueSBwb3NzaWJsZSB1c2UgY2FzZXMsIGZvciBleGFtcGxlIHNoYXJpbmcgZGF0YSBiZXR3ZWVuIHdpbmRvd3MsIG9yLCBpbiBvdXIgY2FzZSxcclxuLy8gbWFuYWdpbmcgd2hpY2ggd2luZG93IGlzIGN1cnJlbnRseSBwcmVzZW50ZWQgdG8gdGhlIHVzZXIuIFRvIHRoYXQgZW5kLCBpdCBob2xkcyBhIGRpY3Rpb25hcnlcclxuLy8gb2YgdGhlIHdpbmRvd3MgYXZhaWxhYmxlIGluIHRoZSBhcHAuXHJcbi8vIE91ciBiYWNrZ3JvdW5kIGNvbnRyb2xsZXIgaW1wbGVtZW50cyB0aGUgU2luZ2xldG9uIGRlc2lnbiBwYXR0ZXJuLCBzaW5jZSBvbmx5IG9uZVxyXG4vLyBpbnN0YW5jZSBvZiBpdCBzaG91bGQgZXhpc3QuXHJcbmNsYXNzIEJhY2tncm91bmRDb250cm9sbGVyIHtcclxuICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IEJhY2tncm91bmRDb250cm9sbGVyO1xyXG4gIHByaXZhdGUgX3dpbmRvd3M6IFJlY29yZDxzdHJpbmcsIE9XV2luZG93PiA9IHt9O1xyXG4gIHByaXZhdGUgX2dhbWVMaXN0ZW5lcjogT1dHYW1lTGlzdGVuZXI7XHJcblxyXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XHJcbiAgICAvLyBQb3B1bGF0aW5nIHRoZSBiYWNrZ3JvdW5kIGNvbnRyb2xsZXIncyB3aW5kb3cgZGljdGlvbmFyeVxyXG4gICAgdGhpcy5fd2luZG93c1trV2luZG93TmFtZXMuZGVza3RvcF0gPSBuZXcgT1dXaW5kb3coa1dpbmRvd05hbWVzLmRlc2t0b3ApO1xyXG4gICAgdGhpcy5fd2luZG93c1trV2luZG93TmFtZXMuaW5HYW1lXSA9IG5ldyBPV1dpbmRvdyhrV2luZG93TmFtZXMuaW5HYW1lKTtcclxuXHJcbiAgICAvLyBXaGVuIGEgYSBzdXBwb3J0ZWQgZ2FtZSBnYW1lIGlzIHN0YXJ0ZWQgb3IgaXMgZW5kZWQsIHRvZ2dsZSB0aGUgYXBwJ3Mgd2luZG93c1xyXG4gICAgdGhpcy5fZ2FtZUxpc3RlbmVyID0gbmV3IE9XR2FtZUxpc3RlbmVyKHtcclxuICAgICAgb25HYW1lU3RhcnRlZDogdGhpcy50b2dnbGVXaW5kb3dzLmJpbmQodGhpcyksXHJcbiAgICAgIG9uR2FtZUVuZGVkOiB0aGlzLnRvZ2dsZVdpbmRvd3MuYmluZCh0aGlzKVxyXG4gICAgfSk7XHJcblxyXG4gICAgb3ZlcndvbGYuZXh0ZW5zaW9ucy5vbkFwcExhdW5jaFRyaWdnZXJlZC5hZGRMaXN0ZW5lcihcclxuICAgICAgZSA9PiB0aGlzLm9uQXBwTGF1bmNoVHJpZ2dlcmVkKGUpXHJcbiAgICApO1xyXG4gIH07XHJcblxyXG4gIC8vIEltcGxlbWVudGluZyB0aGUgU2luZ2xldG9uIGRlc2lnbiBwYXR0ZXJuXHJcbiAgcHVibGljIHN0YXRpYyBpbnN0YW5jZSgpOiBCYWNrZ3JvdW5kQ29udHJvbGxlciB7XHJcbiAgICBpZiAoIUJhY2tncm91bmRDb250cm9sbGVyLl9pbnN0YW5jZSkge1xyXG4gICAgICBCYWNrZ3JvdW5kQ29udHJvbGxlci5faW5zdGFuY2UgPSBuZXcgQmFja2dyb3VuZENvbnRyb2xsZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gQmFja2dyb3VuZENvbnRyb2xsZXIuX2luc3RhbmNlO1xyXG4gIH1cclxuXHJcbiAgLy8gV2hlbiBydW5uaW5nIHRoZSBhcHAsIHN0YXJ0IGxpc3RlbmluZyB0byBnYW1lcycgc3RhdHVzIGFuZCBkZWNpZGUgd2hpY2ggd2luZG93IHNob3VsZFxyXG4gIC8vIGJlIGxhdW5jaGVkIGZpcnN0LCBiYXNlZCBvbiB3aGV0aGVyIGEgc3VwcG9ydGVkIGdhbWUgaXMgY3VycmVudGx5IHJ1bm5pbmdcclxuICBwdWJsaWMgYXN5bmMgcnVuKCkge1xyXG4gICAgdGhpcy5fZ2FtZUxpc3RlbmVyLnN0YXJ0KCk7XHJcblxyXG4gICAgY29uc3QgY3VycldpbmRvd05hbWUgPSAoYXdhaXQgdGhpcy5pc1N1cHBvcnRlZEdhbWVSdW5uaW5nKCkpXHJcbiAgICAgID8ga1dpbmRvd05hbWVzLmluR2FtZVxyXG4gICAgICA6IGtXaW5kb3dOYW1lcy5kZXNrdG9wO1xyXG5cclxuICAgIHRoaXMuX3dpbmRvd3NbY3VycldpbmRvd05hbWVdLnJlc3RvcmUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgb25BcHBMYXVuY2hUcmlnZ2VyZWQoZTogQXBwTGF1bmNoVHJpZ2dlcmVkRXZlbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKCdvbkFwcExhdW5jaFRyaWdnZXJlZCgpOicsIGUpO1xyXG5cclxuICAgIGlmICghZSB8fCBlLm9yaWdpbi5pbmNsdWRlcygnZ2FtZWxhdW5jaGV2ZW50JykpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChhd2FpdCB0aGlzLmlzU3VwcG9ydGVkR2FtZVJ1bm5pbmcoKSkge1xyXG4gICAgICB0aGlzLl93aW5kb3dzW2tXaW5kb3dOYW1lcy5kZXNrdG9wXS5jbG9zZSgpO1xyXG4gICAgICB0aGlzLl93aW5kb3dzW2tXaW5kb3dOYW1lcy5pbkdhbWVdLnJlc3RvcmUoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX3dpbmRvd3Nba1dpbmRvd05hbWVzLmRlc2t0b3BdLnJlc3RvcmUoKTtcclxuICAgICAgdGhpcy5fd2luZG93c1trV2luZG93TmFtZXMuaW5HYW1lXS5jbG9zZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0b2dnbGVXaW5kb3dzKGluZm86IFJ1bm5pbmdHYW1lSW5mbykge1xyXG4gICAgaWYgKCFpbmZvIHx8ICF0aGlzLmlzU3VwcG9ydGVkR2FtZShpbmZvKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGluZm8uaXNSdW5uaW5nKSB7XHJcbiAgICAgIHRoaXMuX3dpbmRvd3Nba1dpbmRvd05hbWVzLmRlc2t0b3BdLmNsb3NlKCk7XHJcbiAgICAgIHRoaXMuX3dpbmRvd3Nba1dpbmRvd05hbWVzLmluR2FtZV0ucmVzdG9yZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fd2luZG93c1trV2luZG93TmFtZXMuZGVza3RvcF0ucmVzdG9yZSgpO1xyXG4gICAgICB0aGlzLl93aW5kb3dzW2tXaW5kb3dOYW1lcy5pbkdhbWVdLmNsb3NlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGlzU3VwcG9ydGVkR2FtZVJ1bm5pbmcoKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICBjb25zdCBpbmZvID0gYXdhaXQgT1dHYW1lcy5nZXRSdW5uaW5nR2FtZUluZm8oKTtcclxuXHJcbiAgICByZXR1cm4gaW5mbyAmJiBpbmZvLmlzUnVubmluZyAmJiB0aGlzLmlzU3VwcG9ydGVkR2FtZShpbmZvKTtcclxuICB9XHJcblxyXG4gIC8vIElkZW50aWZ5IHdoZXRoZXIgdGhlIFJ1bm5pbmdHYW1lSW5mbyBvYmplY3Qgd2UgaGF2ZSByZWZlcmVuY2VzIGEgc3VwcG9ydGVkIGdhbWVcclxuICBwcml2YXRlIGlzU3VwcG9ydGVkR2FtZShpbmZvOiBSdW5uaW5nR2FtZUluZm8pIHtcclxuICAgIHJldHVybiBrR2FtZUNsYXNzSWRzLmluY2x1ZGVzKGluZm8uY2xhc3NJZCk7XHJcbiAgfVxyXG59XHJcblxyXG5CYWNrZ3JvdW5kQ29udHJvbGxlci5pbnN0YW5jZSgpLnJ1bigpO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=