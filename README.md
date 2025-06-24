# quranReminder README

This extension reminds you to memorize Quranic verses at a customizable interval. Each reminder shows a random verse in Arabic and English. You can view your verse history, mark verses as memorized or pending, and adjust the reminder interval in the settings.

## Features

- **Rich Reminder Popup (Webview UI):** A modern, customizable popup for reminders with options to change background color and font.
- **Personal Notes/Tags:** Add your own notes, reflections, or tags for each verse.
- **Custom Reminders:** Set repeat frequency for specific verses you want to review more often.
- **Memorization Progress Tracking:** Visual progress bar and stats for your memorization journey.
- **Dynamic Quran Verses:** Verses are fetched from a public Quran API and kept up to date.
- **Persistent Storage:** All preferences, notes, reminders, and progress are saved locally and persist across VS Code sessions.

## Usage

- **Open the Reminder Panel:** Open the Command Palette (`Cmd+Shift+P`/`Ctrl+Shift+P`), run `Quran Reminder: Open Reminder Panel` to access the rich UI.
- **Customize Look:** Use the color picker and font selector in the panel to personalize your reminder popup.
- **Add Notes/Tags:** Enter your thoughts or tags for each verse in the notes area and save them.
- **Set Custom Reminders:** Adjust the repeat interval for any verse directly in the panel.
- **Track Progress:** View your memorization progress with the visual progress bar.
- **Next Verse:** Click 'Next Verse' to fetch a new verse from the API.

## Extension Settings

This extension contributes the following settings:

* `quranReminder.reminderInterval`: Interval in minutes between Quran verse reminders (default: 60).

## Known Issues

- Only the last 50 verses are kept in history.
- No sync across devices (local storage only).

## Release Notes

See [CHANGELOG.md](./CHANGELOG.md) for details.

## Requirements

- Internet connection required for fetching new verses from the Quran API.

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
