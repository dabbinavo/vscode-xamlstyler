// dependencyChecker.ts
import * as vscode from "vscode";
import { exec } from "child_process";

enum Dependencies {
  DotnetSdk,
  XamlStylerDotnetTool,
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
          dependencies.push(Dependencies.XamlStylerDotnetTool);
          resolve(dependencies);
        } else {
          console.log(`Dotnet SDK is already installed: ${stdout}`);

          exec("xstyler --roll-forward Major --version", (error) => {
            let code = error?.code;
            if (error !== null && error.message.includes("not recognized")) {
              dependencies.push(Dependencies.XamlStylerDotnetTool);
            } else {
              let version = error?.message.split("\nxstyler")[1].trim();
              console.log(
                `XamlStyler .NET Tool is already installed: ${version}`
              );
            }
            resolve(dependencies);
          });
        }
      });
    });
  }

  private static showInstallPopup(
    missingDependencies: Dependencies[]
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (missingDependencies.includes(Dependencies.DotnetSdk)) {
        let message = "XAML Styler requires .NET SDK to be installed.";
        vscode.window
          .showInformationMessage(message, "Install", "Cancel")
          .then((selection) => {
            if (selection === "Install") {
              return vscode.env.openExternal(
                vscode.Uri.parse("https://dotnet.microsoft.com/download")
              );
            } else if (selection === "Cancel") {
              vscode.window.showErrorMessage(
                "XAML Styler will not work without .NET SDK."
              );
            }
          });
        resolve(false);
      }

      let dependencies: string[] = missingDependencies.map((dep) =>
        this.beautify(dep)
      );
      let message = `In order to use the XAML Styler, the following dependencies are required: ${dependencies.join(
        ", "
      )}. Do you want them to be installed now?`;

      vscode.window
        .showInformationMessage(message, "Install", "Cancel")
        .then((selection) => {
          if (selection === "Install") {
            var result = this.installAdditionalDependencies(missingDependencies);
            resolve(result);
          } else if (selection === "Cancel") {
            vscode.window.showInformationMessage(
              "XAML Styler will not work without the dependencies."
            );
            resolve(false);
          }
        });
    });
  }

  private static beautify(dep: Dependencies): string {
    switch (dep) {
      case Dependencies.DotnetSdk:
        return "'.NET SDK'";
      case Dependencies.XamlStylerDotnetTool:
        return "'XamlStyler .NET Tool'";
    }
  }

  private static installAdditionalDependencies(
    missingDependencies: Dependencies[]
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (missingDependencies.includes(Dependencies.XamlStylerDotnetTool)) {
        exec("dotnet tool install -g XamlStyler.Console", (error) => {
          if (error) {
            vscode.window.showErrorMessage(
              "Failed to install XamlStyler .NET Tool."
            );
            resolve(false);
          } else {
            vscode.window.showInformationMessage(
              "XamlStyler .NET Tool has been successfully installed."
            );
            resolve(true);
          }
        });
      }
    });
  }
}
