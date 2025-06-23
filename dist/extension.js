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
function showRandomVerse() {
  const verse = quranVerses[Math.floor(Math.random() * quranVerses.length)];
  vscode.window.showInformationMessage(`${verse.arabic}
${verse.translation}`);
}
var interval;
function activate(context) {
  console.log('Congratulations, your extension "quranReminder" is now active!');
  showRandomVerse();
  interval = setInterval(() => {
    showRandomVerse();
  }, 36e5);
  const disposable = vscode.commands.registerCommand("quranReminder.helloWorld", () => {
    vscode.window.showInformationMessage("Hello World from quran-memorization-reminder!");
  });
  context.subscriptions.push(disposable);
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
