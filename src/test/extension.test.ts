import * as assert from "assert";
import * as path from "path";
import * as fs from "fs/promises";

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

  const TEST_DATA_DIRECTORY = path.join(
    __dirname,
    "../../src/test/fixtures/FormatTests/"
  );
  const TEST_DATA_URI = vscode.Uri.file(TEST_DATA_DIRECTORY);

  test("Attribute Indentation", async () => {
	const directory = path.join(TEST_DATA_DIRECTORY, "AttributeFormatting");

	let files : string[] = await fs.readdir(directory);

	let unformattedFile = files.find((file) => file.endsWith(".unformatted.xaml"));

	
	

	await vscode.workspace.openTextDocument()
    await vscode.commands.executeCommand('vscode.openFolder', TEST_DATA_URI);

    await vscode.workspace
      .getConfiguration("xamlstyler.attributes.formatting")
      .update("tolerance", 0, vscode.ConfigurationTarget.Workspace);
  });
});
