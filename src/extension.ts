// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "fix all" is now active!');

	const fixAllCommand = vscode.commands.registerCommand('fixall.fixSimilarProblems', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('No active text editor.');
			return;
		}

		const document = editor.document;
		const diagnostics = vscode.languages.getDiagnostics(document.uri);
		const diagnosticsByMessage = new Map<string, vscode.Diagnostic[]>();

		// Group diagnostics by message
		for (const diagnostic of diagnostics) {
			const message = diagnostic.message;
			if (!diagnosticsByMessage.has(message)) {
				diagnosticsByMessage.set(message, []);
			}
			diagnosticsByMessage.get(message)?.push(diagnostic);
		}

		// Process each group
		for (const [message, groupDiagnostics] of diagnosticsByMessage) {
			if (groupDiagnostics.length > 1) { // More than one instance
				// Get code actions for the *first* diagnostic (you could check all)
				const firstDiagnostic = groupDiagnostics[0];
				const codeActions = await vscode.commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider', document.uri, firstDiagnostic.range);

				if (codeActions && codeActions.length > 0) {
					// Present the quick fix options to the user
					const selectedAction = await vscode.window.showQuickPick(
						codeActions.map(action => action.title),
						{ placeHolder: 'Select a Quick Fix to apply to all similar problems' }
					);

					if (selectedAction) {
						const actionToApply = codeActions.find(action => action.title === selectedAction);
						if (!actionToApply) {
							vscode.window.showErrorMessage('No action found for the selected title.');
							return;
						}
						if (actionToApply?.edit) {
							// Apply the edit to all diagnostics in the group
							for (const diagnostic of groupDiagnostics) {
								const edit = new vscode.WorkspaceEdit();
								for (const [uri, edits] of actionToApply.edit.entries()) {
									for (const e of edits) {
										edit.replace(uri, diagnostic.range, e.newText);
									}
								}
								await vscode.workspace.applyEdit(edit);
							}
						}else if (actionToApply?.command) {
							// Execute the command for all diagnostics in the group
							for (const diagnostic of groupDiagnostics) {
								const command = actionToApply.command;
								if (command) {
									await vscode.commands.executeCommand(command.command, ...(command.arguments ?? []));
								}else{
									vscode.window.showErrorMessage('No command found for the selected action.');
									// return;
								}
							}
						} else {
							// If the action doesn't have an edit, just show a message						
							vscode.window.showInformationMessage('No edit or command found for the selected action.');	
							// print the action that was selected
							console.log('Selected action:', actionToApply);
						}
					}
				}
			}
		}
	});

	context.subscriptions.push(fixAllCommand);

	const fixAllOneByOneCommand = vscode.commands.registerCommand('fixall.fixSimilarProblemsOneByOne', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('No active text editor.');
			return;
		}

		const document = editor.document;
		const diagnostics = vscode.languages.getDiagnostics(document.uri);
		// Process each diagnostic
        for (const diagnostic of diagnostics) {
			// Reveal the diagnostic in the editor
			const range = diagnostic.range;
			editor.selection = new vscode.Selection(range.start, range.end);
			editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
		
            // Get code actions for the diagnostic
            const codeActions = await vscode.commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider', document.uri, diagnostic.range);

            if (codeActions && codeActions.length > 0) {
                // Present the quick fix options to the user
                const selectedAction = await vscode.window.showQuickPick(
                    codeActions.map(action => action.title),
                    { placeHolder: `Select a Fix for: ${diagnostic.message}` }
                );

                if (selectedAction) {
                    const actionToApply = codeActions.find(action => action.title === selectedAction);
                    if (!actionToApply) {
                        vscode.window.showErrorMessage('No action found for the selected title.');
                        return;
                    }

                    if (actionToApply?.edit) {
                        // Apply the edit to the diagnostic
                        const edit = new vscode.WorkspaceEdit();
                        for (const [uri, edits] of actionToApply.edit.entries()) {
                            for (const e of edits) {
                                edit.replace(uri, diagnostic.range, e.newText);
                            }
                        }
                        await vscode.workspace.applyEdit(edit);
                    } else if (actionToApply?.command) {
                        // Execute the command
                        await vscode.commands.executeCommand(actionToApply.command.command, ...(actionToApply.command.arguments || []));
                    } else {
                        // If the action doesn't have an edit or command, just show a message
                        vscode.window.showInformationMessage('No edit or command found for the selected action.');
                        // print the action that was selected
                        console.log('Selected action:', actionToApply);
                    }
                }
            }
        }
	});
	context.subscriptions.push(fixAllOneByOneCommand);
}

// This method is called when your extension is deactivated
export function deactivate() { }
