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

// Types for verse history and memorization
interface VerseHistoryItem {
	timestamp: number;
	verseIndex: number;
	status: 'memorized' | 'pending';
}

const HISTORY_KEY = 'quranReminder.verseHistory';
const STATUS_KEY = 'quranReminder.verseStatus';

function getReminderInterval(): number {
	// Get interval in minutes from config, default to 60
	const config = vscode.workspace.getConfiguration('quranReminder');
	return (config.get<number>('reminderInterval') || 60) * 60 * 1000;
}

function getVerseStatus(context: vscode.ExtensionContext): Record<number, 'memorized' | 'pending'> {
	return context.globalState.get<Record<number, 'memorized' | 'pending'>>(STATUS_KEY, {});
}

function setVerseStatus(context: vscode.ExtensionContext, status: Record<number, 'memorized' | 'pending'>) {
	context.globalState.update(STATUS_KEY, status);
}

function getVerseHistory(context: vscode.ExtensionContext): VerseHistoryItem[] {
	return context.globalState.get<VerseHistoryItem[]>(HISTORY_KEY, []);
}

function addVerseToHistory(context: vscode.ExtensionContext, verseIndex: number) {
	const history = getVerseHistory(context);
	history.unshift({ timestamp: Date.now(), verseIndex, status: getVerseStatus(context)[verseIndex] || 'pending' });
	context.globalState.update(HISTORY_KEY, history.slice(0, 50)); // keep last 50
}

function showRandomVerse(context: vscode.ExtensionContext) {
	const verseIndex = Math.floor(Math.random() * quranVerses.length);
	const verse = quranVerses[verseIndex];
	addVerseToHistory(context, verseIndex);
	vscode.window.showInformationMessage(`${verse.arabic}\n${verse.translation}`, 'Mark as Memorized', 'Mark as Pending').then(selection => {
		if (selection) {
			const status = getVerseStatus(context);
			status[verseIndex] = selection === 'Mark as Memorized' ? 'memorized' : 'pending';
			setVerseStatus(context, status);
		}
	});
}

function showHistory(context: vscode.ExtensionContext) {
	const history = getVerseHistory(context);
	if (history.length === 0) {
		vscode.window.showInformationMessage('No verse history yet.');
		return;
	}
	const status = getVerseStatus(context);
	const items = history.map(item => {
		const verse = quranVerses[item.verseIndex];
		return {
			label: `${verse.arabic}`,
			description: `${verse.translation}`,
			detail: `Status: ${status[item.verseIndex] || 'pending'} | ${new Date(item.timestamp).toLocaleString()}`,
			verseIndex: item.verseIndex
		};
	});
	vscode.window.showQuickPick(items, { placeHolder: 'Past Quranic verses shown as reminders', canPickMany: false }).then(selected => {
		if (selected) {
			vscode.window.showInformationMessage(
				`${quranVerses[selected.verseIndex].arabic}\n${quranVerses[selected.verseIndex].translation}`,
				'Mark as Memorized', 'Mark as Pending'
			).then(selection => {
				if (selection) {
					const status = getVerseStatus(context);
					status[selected.verseIndex] = selection === 'Mark as Memorized' ? 'memorized' : 'pending';
					setVerseStatus(context, status);
				}
			});
		}
	});
}

function showSettings(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('quranReminder');
	const currentInterval = config.get<number>('reminderInterval') || 60;
	vscode.window.showInputBox({
		prompt: 'Set reminder interval in minutes',
		value: currentInterval.toString(),
		validateInput: v => isNaN(Number(v)) || Number(v) < 1 ? 'Enter a positive number' : undefined
	}).then(val => {
		if (val) {
			config.update('reminderInterval', Number(val), vscode.ConfigurationTarget.Global);
			vscode.window.showInformationMessage(`Reminder interval set to ${val} minutes.`);
		}
	});
}

function openReminderPanel(context: vscode.ExtensionContext) {
	const panel = vscode.window.createWebviewPanel(
		'quranReminderPanel',
		'Quran Reminder',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'src'))]
		}
	);

	const htmlPath = path.join(context.extensionPath, 'src', 'reminderPanel.html');
	let html = fs.readFileSync(htmlPath, 'utf8');
	// Optionally inject script/css URIs if needed
	panel.webview.html = html;

	// Handle messages from the Webview
	panel.webview.onDidReceiveMessage(async (message) => {
		switch (message.command) {
			case 'getVerse':
				// TODO: Fetch verse from API or local cache
				panel.webview.postMessage({ command: 'verse', data: {/* verse data */} });
				break;
			case 'saveNote':
				// TODO: Save note/tag for verse
				break;
			case 'setPreference':
				// TODO: Save user preferences
				break;
			case 'getProgress':
				// TODO: Send progress data
				break;
			// Add more cases as needed
		}
	});
}

let interval: NodeJS.Timeout | undefined;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "quranReminder" is now active!');

	// Show a verse immediately on activation
	showRandomVerse(context);

	// Set up a reminder with customizable interval
	function startReminder() {
		if (interval) clearInterval(interval);
		interval = setInterval(() => {
			showRandomVerse(context);
		}, getReminderInterval());
	}
	startReminder();

	// Listen for config changes
	vscode.workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration('quranReminder.reminderInterval')) {
			startReminder();
		}
	});

	// Register commands
	context.subscriptions.push(
		vscode.commands.registerCommand('quranReminder.helloWorld', () => {
			vscode.window.showInformationMessage('Hello World from quran-memorization-reminder!');
		}),
		vscode.commands.registerCommand('quranReminder.showHistory', () => {
			showHistory(context);
		}),
		vscode.commands.registerCommand('quranReminder.openSettings', () => {
			showSettings(context);
		}),
		vscode.commands.registerCommand('quranReminder.openReminderPanel', () => {
			openReminderPanel(context);
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (interval) {
		clearInterval(interval);
	}
}
