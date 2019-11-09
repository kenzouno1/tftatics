/*global overwolf*/

import HOTKEYS from "../constants/hotkeys-ids";

function _getHotkey(hotkeyId, callback) {
  overwolf.settings.getHotKey(hotkeyId, function(result) {
    if (!result || result.status === "error" || !result.hotkey) {
      setTimeout(function() {
        _getHotkey(hotkeyId, callback);
      }, 2000);
    } else {
      callback(result.hotkey);
    }
  });
}

function _setHotkey(hotkeyId, action) {
  overwolf.settings.registerHotKey(hotkeyId, function(result) {
    if (result.status === "success") {
      action();
    } else {
      console.error(`[HOTKEYS SERVICE] failed to register hotkey ${hotkeyId}`);
    }
  });
}

function getToggleWindowsHotkey() {
  return new Promise((resolve, reject) => {
    _getHotkey(HOTKEYS.TOGGLE_WINDOWS, function(result) {
      resolve(result);
    });
  });
}
function getToggleDatabaseHotkey() {
  return new Promise((resolve, reject) => {
    _getHotkey(HOTKEYS.TOGGLE_DATABASE, function(result) {
      resolve(result);
    });
  });
}

function setToggleWindowsHotkey(action) {
  _setHotkey(HOTKEYS.TOGGLE_WINDOWS, action);
}
function setToggleDatabaseHotkey(action) {
  _setHotkey(HOTKEYS.TOGGLE_DATABASE, action);
}

function addHotkeyChangeListener(listener) {
  overwolf.settings.OnHotKeyChanged.addListener(listener);
}

export default {
  getToggleWindowsHotkey,
  getToggleDatabaseHotkey,
  setToggleWindowsHotkey,
  setToggleDatabaseHotkey,
  addHotkeyChangeListener
};
