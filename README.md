# Fix All Extension

The "Fix All" extension for Visual Studio Code provides a convenient way to apply fixes to similar problems in your code. It leverages the VS Code diagnostics and code actions API to streamline the process of resolving issues detected in your code.

## Features

### Fix Similar Problems
The `fixall.fixSimilarProblems` command allows you to apply a selected fix to all occurrences of a specific problem in the current file. This is particularly useful when you have multiple instances of the same issue and want to resolve them all at once.

### Fix Similar Problems One by One
The `fixall.fixSimilarProblemsOneByOne` command lets you address each problem individually. For each issue, the extension highlights the problem in the editor and presents you with a list of available fixes. You can then choose the appropriate fix for each occurrence.

## How to Use

1. Open a file with diagnostics (e.g., warnings or errors).
2. Use the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS) and search for one of the following commands:
   - **Fix Similar Problems**: Apply a fix to all similar problems in the file.
   - **Fix Similar Problems One by One**: Address each problem individually.
3. Follow the prompts to select and apply the desired fixes.

## Commands

- `fixall.fixSimilarProblems`: Applies a selected fix to all similar problems in the current file.
- `fixall.fixSimilarProblemsOneByOne`: Guides you through fixing each problem one by one.

## Installation

1. Clone this repository.
2. Open the folder in Visual Studio Code.
3. Run the `npm install` command to install dependencies.
4. Press `F5` to launch an Extension Development Host with the extension loaded.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the extension.

## License

This extension is licensed under the MIT License.