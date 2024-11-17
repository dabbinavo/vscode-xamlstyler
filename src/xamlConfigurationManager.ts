import { getXamlStylerConfig } from "./config";
import * as vscode from "vscode";

enum JsonConfigMember {
  AttributesTolerance,
  KeepFirstAttributeOnSameLine,
  MaxAttributeCharactersPerLine,
  MaxAttributesPerLine,
  NewlineExemptionElements,
  SeparateByGroups,
  AttributeIndentation,
  AttributeIndentationStyle,
  RemoveDesignTimeReferences,
  IgnoreDesignTimeReferencePrefix,
  EnableAttributeReordering,
  AttributeOrderingRuleGroups,
  FirstLineAttributes,
  OrderAttributesByName,
  PutEndingBracketOnNewLine,
  RemoveEndingTagOfEmptyElement,
  SpaceBeforeClosingSlash,
  RootElementLineBreakRule,
  ReorderVSM,
  ReorderGridChildren,
  ReorderCanvasChildren,
  ReorderSetters,
  FormatMarkupExtension,
  NoNewLineMarkupExtensions,
  ThicknessSeparator,
  ThicknessAttributes,
  CommentPadding,
}

export class XamlConfigurationManager {
  public static createJsonConfig(
    options: vscode.FormattingOptions,
    uri?: vscode.Uri
  ): string {
    const jsonData = {
      IndentSize: options.tabSize,
      IndentWithTabs: !options.insertSpaces,
      AttributesTolerance: XamlConfigurationManager.resolveConfig<number>(
        JsonConfigMember.AttributesTolerance,
        uri
      ),
      KeepFirstAttributeOnSameLine:
        XamlConfigurationManager.resolveConfig<boolean>(
          JsonConfigMember.KeepFirstAttributeOnSameLine,
          uri
        ),
      MaxAttributeCharactersPerLine:
        XamlConfigurationManager.resolveConfig<number>(
          JsonConfigMember.MaxAttributeCharactersPerLine,
          uri
        ),
      MaxAttributesPerLine: XamlConfigurationManager.resolveConfig<number>(
        JsonConfigMember.MaxAttributesPerLine,
        uri
      ),
      NewlineExemptionElements: XamlConfigurationManager.resolveConfig<
        string[]
      >(JsonConfigMember.NewlineExemptionElements, uri).join(", "),
      SeparateByGroups: XamlConfigurationManager.resolveConfig<boolean>(
        JsonConfigMember.SeparateByGroups,
        uri
      ),
      AttributeIndentation: XamlConfigurationManager.resolveConfig<number>(
        JsonConfigMember.AttributeIndentation,
        uri
      ),
      AttributeIndentationStyle: XamlConfigurationManager.resolveEnumConfig(
        JsonConfigMember.AttributeIndentationStyle,
        ["Mixed", "Spaces"],
        uri
      ),
      RemoveDesignTimeReferences:
        XamlConfigurationManager.resolveConfig<boolean>(
          JsonConfigMember.RemoveDesignTimeReferences,
          uri
        ),
      IgnoreDesignTimeReferencePrefix:
        XamlConfigurationManager.resolveConfig<boolean>(
          JsonConfigMember.IgnoreDesignTimeReferencePrefix,
          uri
        ),
      EnableAttributeReordering:
        XamlConfigurationManager.resolveConfig<boolean>(
          JsonConfigMember.EnableAttributeReordering,
          uri
        ),
      AttributeOrderingRuleGroups: XamlConfigurationManager.resolveConfig<
        string[]
      >(JsonConfigMember.AttributeOrderingRuleGroups, uri),
      FirstLineAttributes: XamlConfigurationManager.resolveConfig<string[]>(
        JsonConfigMember.FirstLineAttributes,
        uri
      ).join(", "),
      OrderAttributesByName: XamlConfigurationManager.resolveConfig<boolean>(
        JsonConfigMember.OrderAttributesByName,
        uri
      ),
      PutEndingBracketOnNewLine:
        XamlConfigurationManager.resolveConfig<boolean>(
          JsonConfigMember.PutEndingBracketOnNewLine,
          uri
        ),
      RemoveEndingTagOfEmptyElement:
        XamlConfigurationManager.resolveConfig<boolean>(
          JsonConfigMember.RemoveEndingTagOfEmptyElement,
          uri
        ),
      SpaceBeforeClosingSlash: XamlConfigurationManager.resolveConfig<boolean>(
        JsonConfigMember.SpaceBeforeClosingSlash,
        uri
      ),
      RootElementLineBreakRule: XamlConfigurationManager.resolveEnumConfig(
        JsonConfigMember.RootElementLineBreakRule,
        ["Default", "Always", "Never"],
        uri
      ),
      ReorderVSM: XamlConfigurationManager.resolveEnumConfig(
        JsonConfigMember.ReorderVSM,
        ["None", "First", "Last"],
        uri
      ),
      ReorderGridChildren: XamlConfigurationManager.resolveConfig<boolean>(
        JsonConfigMember.ReorderGridChildren,
        uri
      ),
      ReorderCanvasChildren: XamlConfigurationManager.resolveConfig<boolean>(
        JsonConfigMember.ReorderCanvasChildren,
        uri
      ),
      ReorderSetters: XamlConfigurationManager.resolveEnumConfig(
        JsonConfigMember.ReorderSetters,
        ["None", "Property", "TargetName", "TargetNameThenProperty"],
        uri
      ),
      FormatMarkupExtension: XamlConfigurationManager.resolveConfig<boolean>(
        JsonConfigMember.FormatMarkupExtension,
        uri
      ),
      NoNewLineMarkupExtensions: XamlConfigurationManager.resolveConfig<
        string[]
      >(JsonConfigMember.NoNewLineMarkupExtensions, uri).join(", "),
      ThicknessSeparator: XamlConfigurationManager.resolveEnumConfig(
        JsonConfigMember.ThicknessSeparator,
        ["None", "Space", "Comma"],
        uri
      ),
      ThicknessAttributes: XamlConfigurationManager.resolveConfig<string[]>(
        JsonConfigMember.ThicknessAttributes,
        uri
      ).join(", "),
      CommentPadding: XamlConfigurationManager.resolveConfig<number>(
        JsonConfigMember.CommentPadding,
        uri
      ),
    };
    return JSON.stringify(jsonData);
  }

  private static resolveConfig<T>(
    member: JsonConfigMember,
    uri?: vscode.Uri
  ): T {
    return getXamlStylerConfig(uri).get<T>(
      XamlConfigurationManager.configurationMap.get(member)!
    )!;
  }

  private static resolveEnumConfig(
    member: JsonConfigMember,
    map: string[],
    uri?: vscode.Uri
  ): number | undefined {
    var enumValue = getXamlStylerConfig(uri).get<string>(
      XamlConfigurationManager.configurationMap.get(member)!
    )!;
    var index = map.indexOf(enumValue);
    if (index === -1) {
      return undefined;
    }
    return index;
  }

  public static configurationMap: Map<JsonConfigMember, string> = new Map<
    JsonConfigMember,
    string
  >([
    [JsonConfigMember.AttributesTolerance, "attributes.formatting.tolerance"],
    [
      JsonConfigMember.KeepFirstAttributeOnSameLine,
      "attributes.formatting.keepFirstOnSameLine",
    ],
    [
      JsonConfigMember.MaxAttributeCharactersPerLine,
      "attributes.formatting.maxCharactersPerLine",
    ],
    [JsonConfigMember.MaxAttributesPerLine, "attributes.formatting.maxPerLine"],
    [
      JsonConfigMember.NewlineExemptionElements,
      "attributes.formatting.newlineExemptionElements",
    ],
    [
      JsonConfigMember.SeparateByGroups,
      "attributes.formatting.separateByGroups",
    ],
    [
      JsonConfigMember.AttributeIndentation,
      "attributes.formatting.indentation",
    ],
    [
      JsonConfigMember.AttributeIndentationStyle,
      "attributes.formatting.indentationStyle",
    ],
    [
      JsonConfigMember.RemoveDesignTimeReferences,
      "attributes.formatting.removeDesignTimeReferences",
    ],
    [
      JsonConfigMember.IgnoreDesignTimeReferencePrefix,
      "attributes.reordering.ignoreDesignTimeReferencePrefix",
    ],
    [
      JsonConfigMember.EnableAttributeReordering,
      "attributes.reordering.enable",
    ],
    [
      JsonConfigMember.AttributeOrderingRuleGroups,
      "attributes.reordering.ruleGroups",
    ],
    [
      JsonConfigMember.FirstLineAttributes,
      "attributes.reordering.firstLineAttributes",
    ],
    [JsonConfigMember.OrderAttributesByName, "attributes.reordering.byName"],
    [
      JsonConfigMember.PutEndingBracketOnNewLine,
      "elements.endingBracketOnNewLine",
    ],
    [
      JsonConfigMember.RemoveEndingTagOfEmptyElement,
      "elements.removeEndingTagOfEmptyElement",
    ],
    [
      JsonConfigMember.SpaceBeforeClosingSlash,
      "elements.spaceBeforeClosingSlashInSelfClosingElement",
    ],
    [
      JsonConfigMember.RootElementLineBreakRule,
      "elements.rootElementLineBreaksBetweenAttributes",
    ],
    [
      JsonConfigMember.ReorderVSM,
      "elements.reordering.reorderVisualStateManager",
    ],
    [
      JsonConfigMember.ReorderGridChildren,
      "elements.reordering.reorderGridPanelChildren",
    ],
    [
      JsonConfigMember.ReorderCanvasChildren,
      "elements.reordering.reorderCanvasPanelChildren",
    ],
    [JsonConfigMember.ReorderSetters, "elements.reordering.reorderSetters"],
    [
      JsonConfigMember.FormatMarkupExtension,
      "markupExtension.enableFormatting",
    ],
    [
      JsonConfigMember.NoNewLineMarkupExtensions,
      "markupExtension.KeepOnOneLine",
    ],
    [JsonConfigMember.ThicknessSeparator, "thicknessFormatting.SeparatorStyle"],
    [JsonConfigMember.ThicknessAttributes, "thicknessFormatting.Attributes"],
    [JsonConfigMember.CommentPadding, "miscellaneous.commentPadding"],
  ]);
}
