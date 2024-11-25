import * as assert from "assert";
import * as path from "path";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
// import * as myExtension from '../../extension';

// suite("Extension Test Suite", () => {
//   vscode.window.showInformationMessage("Start all tests.");

//   test("Sample test", () => {
//     assert.strictEqual(-1, [1, 2, 3].indexOf(5));
//     assert.strictEqual(-1, [1, 2, 3].indexOf(0));
//   });
// });

suite("Formatter Functionality Tests", () => {
  vscode.window.showInformationMessage("Start formatter tests.");

  const TEST_DATA_DIR = path.join(__dirname, "../../src/test/fixtures/FormatTests/");

  test("Attribute Indentation", async () => {
    
    const directory = path.join(TEST_DATA_DIR, "AttributeFormatting");
    const files = await vscode.workspace.findFiles(`${directory}/*.xaml`);

    await vscode.workspace
      .getConfiguration("xamlstyler.attributes.formatting")
      .update("tolerance", 0, vscode.ConfigurationTarget.WorkspaceFolder);
  });
});
