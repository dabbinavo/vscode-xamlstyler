import * as vscode from "vscode";
import { getXamlStylerConfig } from "./config";
import * as fs from "fs";
import { resolve } from "path";

export class XamlConfigurationResolver {
  public resolveConfiguration(documentPath: vscode.Uri): string | undefined {
    let externalConfigurationFile =
      this.resolveExternalConfigurationFile(documentPath);
    if (externalConfigurationFile && fs.existsSync(externalConfigurationFile)) {
      return externalConfigurationFile;
    }

    let configurationCandidate = this.searchUpDirectoryTree(documentPath);
    if (configurationCandidate) {
      return configurationCandidate;
    }

    return undefined;
  }

  private resolveExternalConfigurationFile(
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

  private searchUpDirectoryTree(document: vscode.Uri): string | undefined {
    let currentDirectory = resolve(document.fsPath, "..");
    let configurationCandidate: string | undefined;
    let foundSolution = false;
    let searchToRoot = getXamlStylerConfig().get<boolean>(
      "configurationFile.searchToDriveRoot"
    );
    do {
      if (!configurationCandidate) {
        let configurationFilePath = resolve(
          currentDirectory,
          "Settings.XamlStyler"
        );
        if (fs.existsSync(configurationFilePath)) {
          configurationCandidate = configurationFilePath;
        }
      }
      if (!foundSolution) {
        let solutionFilePaths = fs
          .readdirSync(currentDirectory)
          .filter((fn) => fn.endsWith(".sln"));
        if (solutionFilePaths.length > 0) {
          foundSolution = true;
        }
      }

      if (foundSolution && !searchToRoot) {
        break;
      }

      if (foundSolution && configurationCandidate) {
        break;
      }

      let newPath = resolve(currentDirectory, "..");
      if (newPath === currentDirectory) {
        break;
      }
      currentDirectory = newPath;
    } while (true);

    if (foundSolution) {
      return configurationCandidate;
    }
    return undefined;
  }
}
