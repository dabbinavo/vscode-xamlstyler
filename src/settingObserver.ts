import * as vscode from "vscode";
import { XamlFormatter } from "./xamlFormatter";
import { getXamlStylerConfig } from "./config";
import * as util from "./common";

export class SettingObserver {
  private _formatter: XamlFormatter;

  constructor(context: vscode.ExtensionContext, formatter: XamlFormatter) {
    this._formatter = formatter;

    this._updateFormatter();

    let disposable = vscode.workspace.onDidChangeConfiguration(
      this._onConfigChange,
      this
    );
    context.subscriptions.push(disposable);
  }

  private _onConfigChange = (e: vscode.ConfigurationChangeEvent): void => {
    if (e.affectsConfiguration("xamlstyler.format.enable")) {
      this._updateFormatter();
    }
  };

  private _updateFormatter(): void {
    const config = getXamlStylerConfig();
    const enable = config.get<boolean>("format.enable", true);

    if (enable) {
      this._formatter.register(util.documentSelector);
    } else {
      this._formatter.dispose();
    }
  }
}
