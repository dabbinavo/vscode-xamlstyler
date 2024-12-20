# Change Log

All notable changes to the "xamlstyler" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.0.8]
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
