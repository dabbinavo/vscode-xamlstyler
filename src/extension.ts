import * as vscode from "vscode";
import { DependencyChecker } from "./dependencyChecker";
import { getXamlStylerConfig } from "./config";
import * as util from "./common";
import { XamlFormatter } from "./xamlFormatter";
import { SettingObserver } from "./settingObserver";

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

  const xamlFormatter = new XamlFormatter(context);
  new SettingObserver(context, xamlFormatter);

  context.subscriptions.push(xamlFormatter);

}

export function deactivate() {}
