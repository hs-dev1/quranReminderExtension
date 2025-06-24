"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var path = __toESM(require("path"));
var fs = __toESM(require("fs"));
var quranVerses = [
  {
    arabic: "\u0625\u0650\u0646\u064E\u0651 \u0645\u064E\u0639\u064E \u0627\u0644\u0652\u0639\u064F\u0633\u0652\u0631\u0650 \u064A\u064F\u0633\u0652\u0631\u064B\u0627",
    translation: "Indeed, with hardship [will be] ease. (Quran 94:6)"
  },
  {
    arabic: "\u0627\u0644\u0644\u064E\u0651\u0647\u064F \u0644\u064E\u0627 \u0625\u0650\u0644\u064E\u0670\u0647\u064E \u0625\u0650\u0644\u064E\u0651\u0627 \u0647\u064F\u0648\u064E \u0627\u0644\u0652\u062D\u064E\u064A\u064F\u0651 \u0627\u0644\u0652\u0642\u064E\u064A\u064F\u0651\u0648\u0645\u064F",
    translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. (Quran 2:255)"
  },
  {
    arabic: "\u0648\u064E\u0642\u064F\u0644 \u0631\u064E\u0651\u0628\u0650\u0651 \u0632\u0650\u062F\u0652\u0646\u0650\u064A \u0639\u0650\u0644\u0652\u0645\u064B\u0627",
    translation: "And say: My Lord, increase me in knowledge. (Quran 20:114)"
  },
  {
    arabic: "\u0641\u064E\u0625\u0650\u0646\u064E\u0651 \u0645\u064E\u0639\u064E \u0627\u0644\u0652\u0639\u064F\u0633\u0652\u0631\u0650 \u064A\u064F\u0633\u0652\u0631\u064B\u0627",
    translation: "For indeed, with hardship [will be] ease. (Quran 94:5)"
  },
  {
    arabic: "\u0625\u0650\u0646\u064E\u0651 \u0627\u0644\u0644\u064E\u0651\u0647\u064E \u0645\u064E\u0639\u064E \u0627\u0644\u0635\u064E\u0651\u0627\u0628\u0650\u0631\u0650\u064A\u0646\u064E",
    translation: "Indeed, Allah is with the patient. (Quran 2:153)"
  }
];
var HISTORY_KEY = "quranReminder.verseHistory";
var STATUS_KEY = "quranReminder.verseStatus";
function getReminderInterval() {
  const config = vscode.workspace.getConfiguration("quranReminder");
  return (config.get("reminderInterval") || 60) * 60 * 1e3;
}
function getVerseStatus(context) {
  return context.globalState.get(STATUS_KEY, {});
}
function setVerseStatus(context, status) {
  context.globalState.update(STATUS_KEY, status);
}
function getVerseHistory(context) {
  return context.globalState.get(HISTORY_KEY, []);
}
function addVerseToHistory(context, verseIndex) {
  const history = getVerseHistory(context);
  history.unshift({ timestamp: Date.now(), verseIndex, status: getVerseStatus(context)[verseIndex] || "pending" });
  context.globalState.update(HISTORY_KEY, history.slice(0, 50));
}
function showRandomVerse(context) {
  const verseIndex = Math.floor(Math.random() * quranVerses.length);
  const verse = quranVerses[verseIndex];
  addVerseToHistory(context, verseIndex);
  vscode.window.showInformationMessage(`${verse.arabic}
${verse.translation}`, "Mark as Memorized", "Mark as Pending").then((selection) => {
    if (selection) {
      const status = getVerseStatus(context);
      status[verseIndex] = selection === "Mark as Memorized" ? "memorized" : "pending";
      setVerseStatus(context, status);
    }
  });
}
function showHistory(context) {
  const history = getVerseHistory(context);
  if (history.length === 0) {
    vscode.window.showInformationMessage("No verse history yet.");
    return;
  }
  const status = getVerseStatus(context);
  const items = history.map((item) => {
    const verse = quranVerses[item.verseIndex];
    return {
      label: `${verse.arabic}`,
      description: `${verse.translation}`,
      detail: `Status: ${status[item.verseIndex] || "pending"} | ${new Date(item.timestamp).toLocaleString()}`,
      verseIndex: item.verseIndex
    };
  });
  vscode.window.showQuickPick(items, { placeHolder: "Past Quranic verses shown as reminders", canPickMany: false }).then((selected) => {
    if (selected) {
      vscode.window.showInformationMessage(
        `${quranVerses[selected.verseIndex].arabic}
${quranVerses[selected.verseIndex].translation}`,
        "Mark as Memorized",
        "Mark as Pending"
      ).then((selection) => {
        if (selection) {
          const status2 = getVerseStatus(context);
          status2[selected.verseIndex] = selection === "Mark as Memorized" ? "memorized" : "pending";
          setVerseStatus(context, status2);
        }
      });
    }
  });
}
function showSettings(context) {
  const config = vscode.workspace.getConfiguration("quranReminder");
  const currentInterval = config.get("reminderInterval") || 60;
  vscode.window.showInputBox({
    prompt: "Set reminder interval in minutes",
    value: currentInterval.toString(),
    validateInput: (v) => isNaN(Number(v)) || Number(v) < 1 ? "Enter a positive number" : void 0
  }).then((val) => {
    if (val) {
      config.update("reminderInterval", Number(val), vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`Reminder interval set to ${val} minutes.`);
    }
  });
}
function openReminderPanel(context) {
  const panel = vscode.window.createWebviewPanel(
    "quranReminderPanel",
    "Quran Reminder",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, "src"))]
    }
  );
  const htmlPath = path.join(context.extensionPath, "src", "reminderPanel.html");
  let html = fs.readFileSync(htmlPath, "utf8");
  panel.webview.html = html;
  panel.webview.onDidReceiveMessage(async (message) => {
    switch (message.command) {
      case "getVerse":
        panel.webview.postMessage({ command: "verse", data: {
          /* verse data */
        } });
        break;
      case "saveNote":
        break;
      case "setPreference":
        break;
      case "getProgress":
        break;
    }
  });
}
var interval;
function activate(context) {
  console.log('Congratulations, your extension "quranReminder" is now active!');
  showRandomVerse(context);
  function startReminder() {
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      showRandomVerse(context);
    }, getReminderInterval());
  }
  startReminder();
  vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration("quranReminder.reminderInterval")) {
      startReminder();
    }
  });
  context.subscriptions.push(
    vscode.commands.registerCommand("quranReminder.helloWorld", () => {
      vscode.window.showInformationMessage("Hello World from quran-memorization-reminder!");
    }),
    vscode.commands.registerCommand("quranReminder.showHistory", () => {
      showHistory(context);
    }),
    vscode.commands.registerCommand("quranReminder.openSettings", () => {
      showSettings(context);
    }),
    vscode.commands.registerCommand("quranReminder.openReminderPanel", () => {
      openReminderPanel(context);
    })
  );
}
function deactivate() {
  if (interval) {
    clearInterval(interval);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
