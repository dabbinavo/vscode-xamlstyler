import * as vscode from "vscode";
import { DependencyChecker } from "./dependencyChecker";
import { XamlDocumentFormattingEditProvider } from "./xamlFormat";
import { getXamlStylerConfig } from "./config";
import * as util from "./common";

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

  if (getXamlStylerConfig().format.enable) {
    console.info("Registering XAML document formatting provider");
    const disposable = vscode.languages.registerDocumentFormattingEditProvider(
      util.documentSelector,
      new XamlDocumentFormattingEditProvider()
    );
    context.subscriptions.push(disposable);
  }
}

export function deactivate() {}
