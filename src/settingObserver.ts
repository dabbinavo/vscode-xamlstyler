import * as vscode from "vscode";
import { XamlFormatter } from "./xamlFormatter";
import { getXamlStylerConfig } from "./config";
import * as util from "./common";
import { XamlConfigurationManager } from "./xamlConfigurationManager";

export class SettingObserver {
  private _formatter: XamlFormatter;
  private _configurationManager: XamlConfigurationManager;
  private _disposables: vscode.Disposable[] = [];

  constructor(
    context: vscode.ExtensionContext,
    formatter: XamlFormatter,
    configurationManager: XamlConfigurationManager
  ) {
    this._formatter = formatter;
    this._configurationManager = configurationManager;

    this._updateFormatter();
    this._configurationManager.updateConfig();

    vscode.workspace.onDidChangeConfiguration(
      this._onConfigChange,
      this,
      this._disposables
    );
  }

  private _onConfigChange = (e: vscode.ConfigurationChangeEvent): void => {
    if (e.affectsConfiguration("xamlstyler.format.enable")) {
      this._updateFormatter();
    }
    if (e.affectsConfiguration("xamlstyler")) {
      XamlConfigurationManager.configurationMap.forEach((value: string) => {
        if (e.affectsConfiguration(`xamlstyler.${value}`)) {
          this._configurationManager.updateConfig();
        }
      });
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

  dispose(): void {
    this._disposables.forEach((d) => d.dispose());
  }
}
