import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { randomBytes } from "crypto";
import { exec } from "child_process";
import { XamlConfigurationManager } from "./xamlConfigurationManager";
import { outputChannel, extensionPath } from "./common";
import { XamlConfigurationResolver } from "./xamlConfigurationResolver";
import { getXamlStylerConfig } from "./config";

export class XamlFormatter {
  private _disposable: vscode.Disposable | undefined;

  register(selector: vscode.DocumentFilter[]): void {
    console.log("Registering XamlFormatter");
    const provider = new XamlDocumentFormattingEditProvider();
    this._disposable = vscode.languages.registerDocumentFormattingEditProvider(
      selector,
      provider
    );
  }

  dispose(): void {
    if (this._disposable) {
      console.log("Disposing XamlFormatter");
      this._disposable.dispose();
    }
  }
}

class XamlDocumentFormattingEditProvider
  implements vscode.DocumentFormattingEditProvider
{
  private formatter: Formatter;

  constructor() {
    this.formatter = new Formatter();
  }

  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    return this.formatter.formatDocument(document, options);
  }
}

class Formatter {
  public formatDocument(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions
  ): Thenable<vscode.TextEdit[]> {
    return new Promise((resolve, reject) => {
      const firstLine = document.lineAt(0);
      const lastLine = document.lineAt(document.lineCount - 1);

      let text = document.getText();
      let extension = path.extname(document.fileName);
      let filesToDelete: fs.PathLike[] = [];

      // The XAML Styler tool does not support .axml extension, so we need to convert them to .axaml
      if (extension === ".axml") {
        extension = ".axaml";
      }

      try {
        // store the text into a temporary file of the vscode extension in order to process it with an external tool in the next step
        const tempDir = os.tmpdir();
        const tempBaseName = path.join(
          tempDir,
          `xamlstyler-${randomBytes(16).toString("hex")}`
        );
        const filename = `${tempBaseName}${extension}`;

        fs.mkdirSync(path.dirname(filename), { recursive: true });

        fs.writeFileSync(filename, text);
        filesToDelete.push(filename);

        var configurationResolver = new XamlConfigurationResolver();
        let configurationPath = configurationResolver.resolveConfiguration(
          document.uri
        );

        if (!configurationPath) {
          configurationPath = this.createJsonConfigFromVsCodeSettings(
            document.uri,
            `${tempBaseName}.Settings.XamlStyler`
          );
          filesToDelete.push(configurationPath);
        }

        // process the text with an external tool
        this.runXStyler(filename, configurationPath, options).then(
          (formattedText) => {
            filesToDelete.forEach((file) => {
              fs.unlinkSync(file);
            });
            resolve([
              vscode.TextEdit.replace(
                new vscode.Range(firstLine.range.start, lastLine.range.end),
                formattedText
              ),
            ]);
          },
          reject
        );
      } catch (e) {
        filesToDelete.forEach((file) => {
          fs.unlinkSync(file);
        });
        reject(e);
      }
    });
  }

  private createJsonConfigFromVsCodeSettings(
    documentPath: vscode.Uri,
    outputPath: string
  ): string {
    let jsonString = XamlConfigurationManager.createJsonConfig(documentPath);
    fs.writeFileSync(outputPath!, jsonString);
    return outputPath!;
  }

  private runXStyler(
    filePath: string,
    configurationPath: string,
    options: vscode.FormattingOptions
  ): Thenable<string> {
    return new Promise((resolve, reject) => {
      const useGlobalTool = getXamlStylerConfig().get<boolean>("useGlobalTool");

      const executable = useGlobalTool ? "xstyler" : "dotnet";

      const parameters: string[] = [];
      if (useGlobalTool) {
        parameters.push("--roll-forward", "Major");
      } else {
        const xstyler = path.join(
          extensionPath!,
          "tools",
          "xstyler",
          "xstyler.dll"
        );
        parameters.push(xstyler);
      }
      parameters.push("--file", filePath);
      parameters.push("--write-to-stdout");
      parameters.push("--config", configurationPath);
      parameters.push("--indent-size", options.tabSize.toString());
      parameters.push("--indent-tabs", options.insertSpaces ? "false" : "true");

      const command = `${executable} ${parameters.join(" ")}`;

      outputChannel.appendLine(`Running command: ${command}`);

      // Run the command using child_process
      exec(command, (error, stdout, stderr) => {
        if (error) {
          outputChannel.appendLine(`${error}`);
          let traces = stderr.split("\n");
          vscode.window.showErrorMessage(traces[1]);
          reject(error);
        }
        // parse x of y from "Processed 0 of 1 files" using regex
        let processedFiles = stderr.match(/Processed (\d+) of (\d+) files/);
        if (processedFiles && processedFiles[1] !== processedFiles[2]) {
          outputChannel.appendLine(`${stderr}`);
          vscode.window.showErrorMessage(stderr);
          reject(stderr);
        }
        else {
          outputChannel.appendLine(stderr);
        }
        let formattedText = stdout.trim() + "\n";
        resolve(formattedText);
      });
    });
  }
}
