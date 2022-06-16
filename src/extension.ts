// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "angular-inline-jumper" is now active!');

  let jumpToTemplate = vscode.commands.registerCommand(
    "angular-inline-jumper.jumpToTemplate",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const lineNumber = getLineNumberFor(editor.document, "template");
      goToLine(lineNumber);
    }
  );

  let jumpToStyles = vscode.commands.registerCommand("angular-inline-jumper.jumpToStyles", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const lineNumber = getLineNumberFor(editor.document, "styles");
    goToLine(lineNumber);
  });

  let jumpToClass = vscode.commands.registerCommand("angular-inline-jumper.jumpToClass", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const lineNumber = getLineNumberFor(editor.document, "class");
    goToLine(lineNumber);
  });

  context.subscriptions.push(jumpToTemplate);
  context.subscriptions.push(jumpToStyles);
  context.subscriptions.push(jumpToClass);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function goToLine(line: number) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    console.error(`Editor not active`);
    return;
  }
  const range = editor.document.lineAt(line).range;
  editor.selection = new vscode.Selection(range.start, range.start);
  editor.revealRange(range);
}

function getLineNumberFor(
  document: vscode.TextDocument,
  inlinePart: "template" | "styles" | "class"
) {
  let regex = /template:/;

  switch (inlinePart) {
    case "template":
      regex = /template:/;
      break;
    case "styles":
      regex = /styles:/;
      break;
    case "class":
      regex = /export class/;
      break;
  }

  const lineCount = document.lineCount;

  for (let lineNumber = 0; lineNumber < lineCount; lineNumber++) {
    const lineText = document.lineAt(lineNumber);
    const isMatch = lineText.text.match(regex);

    if (isMatch) {
      return lineNumber;
    }
  }

  console.error(`Could not find ${inlinePart}`);
  return 0;
}
