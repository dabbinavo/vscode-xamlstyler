// dependencyChecker.ts
import * as vscode from "vscode";
import { exec } from "child_process";

enum Dependencies {
  DotnetSdk,
}

export class DependencyChecker {
  public static async checkMissingDependencies(): Promise<boolean> {
    return new Promise(async (resolve) => {
      let missingDependencies = await this.resolveMissingDependencies();

      if (missingDependencies.length > 0) {
        let result = await this.showInstallPopup(missingDependencies);
        resolve(result);
      }
      resolve(true);
    });
  }

  private static resolveMissingDependencies(): Promise<Dependencies[]> {
    const dependencies: Dependencies[] = [];

    return new Promise((resolve) => {
      exec("dotnet --version", (error, stdout) => {
        if (error) {
          dependencies.push(Dependencies.DotnetSdk);
          resolve(dependencies);
        } else {
          console.log(`Dotnet SDK is already installed: ${stdout}`);
          resolve(dependencies);
        }
      });
    });
  }

  private static showInstallPopup(
    missingDependencies: Dependencies[]
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (missingDependencies.includes(Dependencies.DotnetSdk)) {
        let message =
          "XAML Styler requires .NET SDK or Runtime to be installed.";
        vscode.window
          .showInformationMessage(message, "Install", "Cancel")
          .then((selection) => {
            if (selection === "Install") {
              return vscode.env.openExternal(
                vscode.Uri.parse("https://dotnet.microsoft.com/download")
              );
            } else if (selection === "Cancel") {
              vscode.window.showErrorMessage(
                "XAML Styler will not work without .NET SDK or Runtime."
              );
            }
          });
        resolve(false);
      }
    });
  }
}
