# Quick Python Printf

<img src="https://github.com/wakamex/Quick-Python-Print/blob/main/images/Cover.png?raw=true" height=300 width=300 alt="Quick Python Printf Cover Image">

## Installation

In VSCode's plugin tab: search "Quick-Python-Printf".

Or get it from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=MihaiCosma.quick-python-printf).

Works on vscode version ≥ 1.57.0.

## Description

Forked from [Quick Python Print](https://github.com/wwdok/Quick-Python-Print).

The motivation was to use python [f-strings](https://peps.python.org/pep-0498/), but version 2000 brought a total refactor with the following additions:
- Use any f-string you want (completely customizable)
- Undo any command with a single undo
- 81% fewer lines of code (only 65!)
- Change default keybinds to `Ctrl+Shift+L`, `Ctrl+Shift+;`, `Ctrl+Shift+'`, `Ctrl+Shift+/`, `Ctrl+Shift+Alt+/`

Features from previous versions:
- Recognize multiple variables being assigned to (if nothing is selected).
- Add delimiter string

See this extension's [github repo](https://github.com/wakamex/Quick-Python-Print) for changelog and feature requests.

## Usage

Select the text you want to print, then press a keybind (like `Ctrl+Shift+L`).

Modify f-string as desired in VSCode's settings under `QPP: Quick Python Print`.

Modify keybindings as desired in VSCode's keyboard shortcuts settings.

This extension only activates when VSCode detects a python file is open (`onLanguage:python`).

## License
MIT License
