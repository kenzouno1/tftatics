/*global overwolf*/

import WindowNames from "../constants/window-names";
import LaunchSourceService from "../services/launch-source-service";
import RunningGameService from "../services/running-game-service";

function _obtainWindow(name) {
  return new Promise((resolve, reject) => {
    overwolf.windows.obtainDeclaredWindow(name, response => {
      if (response.status !== "success") {
        return reject(response);
      }

      resolve(response);
    });
  });
}

function _getCurrentWindow() {
  return new Promise((resolve, reject) => {
    overwolf.windows.getCurrentWindow(result => {
      if (result.status === "success") {
        resolve(result.window);
      } else {
        reject(result);
      }
    });
  });
}

function restore(name) {
  return new Promise(async (resolve, reject) => {
    try {
      await _obtainWindow(name);
      overwolf.windows.restore(name, result => {
        if (result.status === "success") {
          resolve();
        } else {
          reject(result);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

function preLaunch(name) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("preLaunch begin");
      await _obtainWindow(name);
      await hide(name);
      console.log("preLaunch end");
    } catch (e) {
      reject(e);
    }
  });
}

function firstLaunch(name, width, height, left, top) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("firstLaunch begin");
      await _obtainWindow(name);
      await hide(name);
      overwolf.windows.changeSize(name, width, height, result => {
        if (result.status === "success") {
          console.log(
            "Change Size for: " +
              name +
              " width: " +
              width +
              " height: " +
              height
          );
          resolve();
        } else {
          reject(result);
        }
      });
      overwolf.windows.changePosition(name, left, top, result => {
        if (result.status === "success") {
          console.log(
            "Change Position for: " + name + " left: " + left + " top: " + top
          );
          resolve();
        } else {
          reject(result);
        }
      });
      console.log("firstLaunch end");
    } catch (e) {
      reject(e);
    }
  });
}

function dragMove(name) {
  return new Promise(async (resolve, reject) => {
    try {
      await _obtainWindow(name);
      let window = await _getCurrentWindow();
      overwolf.windows.dragMove(window.id, result => {
        if (result.status === "success") {
          resolve();
        } else {
          reject(result);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

function hide(name) {
  return new Promise(async (resolve, reject) => {
    try {
      await _obtainWindow(name);
      overwolf.windows.hide(name, result => {
        if (result.status === "success") {
          resolve();
        } else {
          reject(result);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

function close(name) {
  return new Promise(async (resolve, reject) => {
    try {
      await _obtainWindow(name);
      overwolf.windows.close(name, result => {
        if (result.status === "success") {
          resolve();
        } else {
          reject(result);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

async function getStartupWindowName() {
  let launchSource = LaunchSourceService.getLaunchSource();

  if (launchSource === "gamelaunchevent") {
    return WindowNames.BACKGROUND;
  }

  // if toggle hotkey -> 'settings'

  let isGameRunning = await RunningGameService.isGameRunning();
  if (isGameRunning) {
    return WindowNames.BACKGROUND;
  }

  return WindowNames.IN_GAME;
}

/**
 * get state of the window
 * @returns {Promise<*>}
 */
async function getWindowState(name) {
  return new Promise(async (resolve, reject) => {
    try {
      overwolf.windows.getWindowState(name, state => {
        if (state.status === "success") {
          resolve(state.window_state_ex);
        } else {
          reject("rejected get window state");
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

export default {
  restore,
  dragMove,
  hide,
  close,
  getStartupWindowName,
  getWindowState,
  firstLaunch,
  preLaunch
};
