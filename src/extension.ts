import * as vscode from "vscode";
import { DependencyChecker } from "./dependencyChecker";
import { XamlFormatter } from "./xamlFormatter";
import { SettingObserver } from "./settingObserver";
import { XamlConfigurationManager } from "./xamlConfigurationManager";

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

  const xamlConfigurationManager = new XamlConfigurationManager();
  const xamlFormatter = new XamlFormatter(xamlConfigurationManager);
  const settingsObserver = new SettingObserver(
    context,
    xamlFormatter,
    xamlConfigurationManager
  );

  context.subscriptions.push(xamlFormatter);
  context.subscriptions.push(xamlConfigurationManager);
  context.subscriptions.push(settingsObserver);
}

export function deactivate() {}
