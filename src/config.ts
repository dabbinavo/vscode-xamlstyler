import vscode = require("vscode");

export const getXamlStylerConfig = (uri?: vscode.Uri) => {
  return getConfig("xamlstyler", uri);
};

function getConfig(section: string, uri?: vscode.Uri | null) {
  if (!uri) {
    if (vscode.window.activeTextEditor) {
      uri = vscode.window.activeTextEditor.document.uri;
    } else {
      uri = null;
    }
  }
  return vscode.workspace.getConfiguration(section, uri);
}
