import * as vscode from "vscode";

export const documentSelector: vscode.DocumentFilter[] = [
  { scheme: "file", language: "AXAML", pattern: "**/*.axaml" },
  { scheme: "file", language: "AXAML", pattern: "**/*.axml" },
  { scheme: "file", language: "xml", pattern: "**/*.axaml" },
  { scheme: "file", language: "xml", pattern: "**/*.axml" },
  { scheme: "file", language: "xml", pattern: "**/*.xaml" },
];

export const outputChannel = vscode.window.createOutputChannel("XAML Formatter");

export const extensionId = "dabbinavo.xamlstyler";

export const extensionPath = vscode.extensions.getExtension(extensionId)?.extensionPath;