import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { randomBytes } from "crypto";
import { exec } from "child_process";
import { XamlConfigurationManager } from "./xamlConfigurationManager";
import { outputChannel } from "./common";
import { getXamlStylerConfig } from "./config";

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
    document: vscode.TextDocument
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    return this.formatter.formatDocument(document);
  }
}

class Formatter {
  private configurationManager: XamlConfigurationManager;

  public constructor(configurationManager: XamlConfigurationManager) {
    this.configurationManager = configurationManager;
  }

  public formatDocument(
    document: vscode.TextDocument
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
          `xamlstyler-${randomBytes(16).toString("hex")}.${extension}`
        );

        fs.mkdirSync(path.dirname(filename), { recursive: true });

        fs.writeFileSync(filename, text);

        const configurationPath = this.resolveConfigurationPath(
          document.uri
        );

        // process the text with an external tool
        this.runXStyler(filename, configurationPath).then((formattedText) => {
          // remove the temporary file
          fs.unlinkSync(filename);
          resolve([
            vscode.TextEdit.replace(
              new vscode.Range(firstLine.range.start, lastLine.range.end),
              formattedText
            ),
          ]);
        }, reject);
      } catch (e) {
        reject(e);
      }
    });
  }

  private resolveConfigurationPath(
    documentPath: vscode.Uri
  ): string | undefined {
    const externalConfigurationFile = getXamlStylerConfig()
      .get<string>("configurationFile.external")
      ?.trim();

    if (externalConfigurationFile && externalConfigurationFile !== "") {
      if (externalConfigurationFile.startsWith("${workspaceFolder")) {
        return this.resolveWorkspaceFolder(
          externalConfigurationFile,
          documentPath
        );
      } else if (fs.existsSync(externalConfigurationFile)) {
        return externalConfigurationFile;
      }
    }

    let configPath = this.configurationManager.XamlConfigurationPath;
    if (configPath && fs.existsSync(configPath)) {
      return configPath;
    }
    return undefined;
  }

  private resolveWorkspaceFolder(
    configFilePath: string,
    resourceUri: vscode.Uri | undefined
  ): string {
    const workspaceFolderMatch = configFilePath.match(
      /\$\{workspaceFolder(?:\:([^}]+))?\}/
    );

    if (workspaceFolderMatch) {
      const specifiedFolderName = workspaceFolderMatch[1];

      let targetWorkspaceFolder: vscode.WorkspaceFolder | undefined;
      if (specifiedFolderName) {
        // Find the workspace folder with the specific name
        targetWorkspaceFolder = vscode.workspace.workspaceFolders?.find(
          (folder) => folder.name === specifiedFolderName
        );
      } else if (resourceUri) {
        // If no specific name, use the folder associated with the resourceUri
        targetWorkspaceFolder =
          vscode.workspace.getWorkspaceFolder(resourceUri);
      }

      // Default to the first workspace folder if none matched by name or URI
      if (!targetWorkspaceFolder && vscode.workspace.workspaceFolders) {
        targetWorkspaceFolder = vscode.workspace.workspaceFolders[0];
      }

      // Replace the matched `${workspaceFolder}` (or `${workspaceFolder:<name>}`) with the path
      if (targetWorkspaceFolder) {
        configFilePath = configFilePath.replace(
          workspaceFolderMatch[0],
          targetWorkspaceFolder.uri.fsPath
        );
      }
    }

    return configFilePath;
  }

  private runXStyler(
    filePath: string,
    configurationPath: string | undefined
  ): Thenable<string> {
    return new Promise((resolve, reject) => {
      // Construct the xstyler command with necessary parameters
      let command = `xstyler --roll-forward Major --file "${filePath}" --write-to-stdout --ignore`;

      if (configurationPath) {
        command += ` --config "${configurationPath}"`;
      }

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
