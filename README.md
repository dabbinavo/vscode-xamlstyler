[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/dabbinavo.xamlstyler?include_prereleases&label=Visual%20Studio%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=dabbinavo.xamlstyler)

# xamlstyler README

XAML Styler is a Visual Studio Code extension that formats AXAML/XAML files. It is a wrapper around the [Xavalon/XamlStyler](https://github.com/Xavalon/XamlStyler) Command Line .NET tool, providing seamless integration with VS Code.

## Features

- Format AXAML/XAML files
- Provides schema for Settings.XamlStyler files

## Requirements

- [.NET SDK](https://dotnet.microsoft.com/en-us/download)
- [XamlStyler.Console dotnet global tool](https://github.com/Xavalon/XamlStyler/wiki/Script-Integration#install-as-a-global-tool)

## Extension Settings

### `xamlstyler.configurationFile.external` (default: "")
Specify an external configuration file instead of using the XAML formatter settings specified in the VSCode extension settings.

This setting supports the `${workspaceFolder}` variable.

## Known Issues

Feel free to contribute to the following known issues:

- There are no unit tests at all
- Indendation settings of the VSCode IDE are currently not respected
- The following extension settings are currently not implemented:
  - `xamlstyler.configurationFile.searchToDriveRoot`
