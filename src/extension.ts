// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// List of Quran verses with translations
const quranVerses = [
	{
		arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
		translation: 'Indeed, with hardship [will be] ease. (Quran 94:6)'
	},
	{
		arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
		translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. (Quran 2:255)'
	},
	{
		arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
		translation: 'And say: My Lord, increase me in knowledge. (Quran 20:114)'
	},
	{
		arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
		translation: 'For indeed, with hardship [will be] ease. (Quran 94:5)'
	},
	{
		arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
		translation: 'Indeed, Allah is with the patient. (Quran 2:153)'
	}
];

function showRandomVerse() {
	const verse = quranVerses[Math.floor(Math.random() * quranVerses.length)];
	vscode.window.showInformationMessage(`${verse.arabic}\n${verse.translation}`);
}

let interval: NodeJS.Timeout | undefined;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "quranReminder" is now active!');

	// Show a verse immediately on activation
	showRandomVerse();

	// Set up an hourly reminder (3600000 ms = 1 hour)
	interval = setInterval(() => {
		showRandomVerse();
	}, 3600000);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('quranReminder.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from quran-memorization-reminder!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (interval) {
		clearInterval(interval);
	}
}
