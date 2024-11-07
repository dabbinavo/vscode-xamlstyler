import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { randomBytes } from "crypto";
import { exec } from "child_process";
import { XamlConfigurationManager } from "./xamlConfigurationManager";
import { outputChannel } from "./common";
import { getXamlStylerConfig } from "./config";
import { XamlConfigurationResolver } from "./xamlConfigurationResolver";

export class XamlFormatter {
  private _disposable: vscode.Disposable | undefined;
  private _configurationManager: XamlConfigurationManager;

  constructor(configurationManager: XamlConfigurationManager) {
    this._configurationManager = configurationManager;
  }

  register(selector: vscode.DocumentFilter[]): void {
    console.log("Registering XamlFormatter");
    const provider = new XamlDocumentFormattingEditProvider(
      this._configurationManager
    );
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

  constructor(configurationManager: XamlConfigurationManager) {
    this.formatter = new Formatter(configurationManager);
  }

  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    return this.formatter.formatDocument(document, options);
  }
}

class Formatter {
  private configurationManager: XamlConfigurationManager;

  public constructor(configurationManager: XamlConfigurationManager) {
    this.configurationManager = configurationManager;
  }

  public formatDocument(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions
  ): Thenable<vscode.TextEdit[]> {
    return new Promise((resolve, reject) => {
      const firstLine = document.lineAt(0);
      const lastLine = document.lineAt(document.lineCount - 1);

      let text = document.getText();
      let extension = path.extname(document.fileName);

      try {
        // store the text into a temporary file of the vscode extension in order to process it with an external tool in the next step
        const tempDir = os.tmpdir();
        const filename = path.join(
          tempDir,
          `xamlstyler-${randomBytes(16).toString("hex")}${extension}`
        );

        fs.mkdirSync(path.dirname(filename), { recursive: true });

        fs.writeFileSync(filename, text);

        var configurationResolver = new XamlConfigurationResolver(
          this.configurationManager.XamlConfigurationPath
        );
        const configurationPath = configurationResolver.resolveConfiguration(
          document.uri
        );

        // process the text with an external tool
        this.runXStyler(filename, configurationPath, options).then(
          (formattedText) => {
            // remove the temporary file
            fs.unlinkSync(filename);
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
        reject(e);
      }
    });
  }

  private runXStyler(
    filePath: string,
    configurationPath: string | undefined,
    options: vscode.FormattingOptions,
  ): Thenable<string> {
    return new Promise((resolve, reject) => {
      // Construct the xstyler command with necessary parameters
      const executable = `xstyler`;

      const parameters : string[] = [];
      parameters.push('--roll-forward', 'Major');
      parameters.push('--file', filePath);
      parameters.push('--write-to-stdout');
      parameters.push('--indent-size', options.tabSize.toString());
      parameters.push('--indent-tabs', (!options.insertSpaces).toString());

      if (configurationPath) {
        parameters.push('--config', configurationPath);
      }

      const command = `${executable} ${parameters.join(" ")}`;

      outputChannel.appendLine(`Running command: ${command}`);

      // Run the command using child_process
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error} ${stderr}`);
          reject(error);
        }
        // if (stderr) {
        //   console.info(`xstyler: ${stderr}`);
        // }
        let formattedText = stdout.trim() + "\n";
        resolve(formattedText);
      });
    });
  }
}
