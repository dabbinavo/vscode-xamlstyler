# Change Log

## [1.6.0]
### Added
- Register formatter for `axaml` language identifier. [#20](https://github.com/dabbinavo/vscode-xamlstyler/issues/20)

## [1.4.0]
### Added
- Added support for `.slnx` solution files as configuration file search roots

## [1.3.1]
### Fixed
- Support spaces in external config file paths (#12)

## [1.3.0]
### Added
- Enable the extension for the `xaml` language and register the formatter accordingly, supporting tools such as [NoesisGUI XAML Tools](https://marketplace.visualstudio.com/items?itemName=NoesisTechnologies.noesisgui-tools).

## [1.2.0]
### Added
- Add option to define how to handle leading and trailing whitespaces in a file (`xamlstyler.miscellaneous.fileWhiteSpaceBehavior`). See [#8](https://github.com/dabbinavo/vscode-xamlstyler/issues/8)

## [1.1.0]
### Added
- Also support .axml files ([AvaloniaTeam.vscode-avalonia](https://marketplace.visualstudio.com/items?itemName=AvaloniaTeam.vscode-avalonia) does note that extension for the AXAML language)

### Changed
- Bump XamlStyler.Console tool to 3.2501.8

## [1.0.0]
### Changed
- First non-pre-release of the extension
- Add some screenshots

## [0.0.10]
### Changed
- Include precompiled xstyler tool in order to remove dependency on XamlStyler to be installed as global tool. Additionally, .NET Runtime 6+ is sufficient now.

## [0.0.9]
### Fixed
- Now hopefully really fix publishing via github workflow

## [0.0.8]
### Fixed
- Fix github workflow for publishing the extension

## [0.0.7]
### Fixed
- Changed scope of configuration `xamlstyler.attributes.formatting.indentation` to resource
- Always pass indent options to xamlstyler tool
- Correctly handle multi-root workspace configurations

## [0.0.6]

### Added
- Respect indentation options of VSCode IDE

### Fixed
- Specify language `json` for `Settings.XamlStyler` files
- Allow trailing commas for `Settings.XamlStyler` files

## [0.0.5]

### Added
- Schema for `Settings.XamlStyler` files
- Implement `xamlstyler.configurationFile.searchToDriveRoot` setting

## [0.0.4]

### Added
- Implement `xamlstyler.configurationFile.external` setting

## [0.0.3]

### Added
- Add extension settings for configuring the axaml formatter

## [0.0.2]

### Added
- Introduce `xamlstyler.format.enable` setting

### Fixed
- Use CHANGELOG.md file
- Remove unnecessary template files
- Add badge for Visual Studio Marketplace version
- Correctly detect the xaml file type based on the extension (`.xaml` or `.axaml`)

## [0.0.1]

- Initial release
