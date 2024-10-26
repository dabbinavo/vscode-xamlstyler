import * as vscode from "vscode";
import { DependencyChecker } from "./dependencyChecker";
import { XamlDocumentFormattingEditProvider } from "./xamlFormat";

// This method is called when your extension is activated
export async function activate(context: vscode.ExtensionContext) {
  console.info("Extension activated");
  var result = await DependencyChecker.checkMissingDependencies();

  if (!result) {
    vscode.window.showErrorMessage(
      "There were missing dependencies. Please install them and restart vscode."
    );
    return;
  }

  const disposable = vscode.languages.registerDocumentFormattingEditProvider(
    [
      { scheme: "file", language: "AXAML", pattern: "**/*.axaml" },
      { scheme: "file", language: "xml", pattern: "**/*.axaml" },
      { scheme: "file", language: "xml", pattern: "**/*.xaml" },
    ],
    new XamlDocumentFormattingEditProvider()
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
