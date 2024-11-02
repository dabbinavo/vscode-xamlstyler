import { XamlFormatter } from "./xamlFormatter";
import * as fs from "fs";
import * as path from "path";
import { randomBytes } from "crypto";
import * as os from "os";
import { getXamlStylerConfig } from "./config";

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
  public XamlConfigurationPath: string | undefined;

  public updateConfig(): void {
    const jsonConfig = this.createJsonConfig();

    const tempDir = os.tmpdir();
    const xamlConfigurationPath = path.join(
      tempDir,
      `xamlstyler-${randomBytes(16).toString("hex")}.XamlSettings`
    );

    fs.mkdirSync(path.dirname(xamlConfigurationPath), { recursive: true });

    fs.writeFileSync(xamlConfigurationPath, jsonConfig);

    if (this.XamlConfigurationPath) {
      let oldPath = this.XamlConfigurationPath;
      this.XamlConfigurationPath = xamlConfigurationPath;
      fs.unlinkSync(oldPath);
    } else {
      this.XamlConfigurationPath = xamlConfigurationPath;
    }
  }

  private createJsonConfig(): string {
    const jsonData = {
      AttributesTolerance: this.resolveConfig<number>(
        JsonConfigMember.AttributesTolerance
      ),
      KeepFirstAttributeOnSameLine: this.resolveConfig<boolean>(
        JsonConfigMember.KeepFirstAttributeOnSameLine
      ),
      MaxAttributeCharactersPerLine: this.resolveConfig<number>(
        JsonConfigMember.MaxAttributeCharactersPerLine
      ),
      MaxAttributesPerLine: this.resolveConfig<number>(
        JsonConfigMember.MaxAttributesPerLine
      ),
      NewlineExemptionElements: this.resolveConfig<string[]>(
        JsonConfigMember.NewlineExemptionElements
      ).join(", "),
      SeparateByGroups: this.resolveConfig<boolean>(
        JsonConfigMember.SeparateByGroups
      ),
      AttributeIndentation: this.resolveConfig<number>(
        JsonConfigMember.AttributeIndentation
      ),
      AttributeIndentationStyle: this.resolveEnumConfig(
        JsonConfigMember.AttributeIndentationStyle,
        ["Mixed", "Spaces"]
      ),
      RemoveDesignTimeReferences: this.resolveConfig<boolean>(
        JsonConfigMember.RemoveDesignTimeReferences
      ),
      IgnoreDesignTimeReferencePrefix: this.resolveConfig<boolean>(
        JsonConfigMember.IgnoreDesignTimeReferencePrefix
      ),
      EnableAttributeReordering: this.resolveConfig<boolean>(
        JsonConfigMember.EnableAttributeReordering
      ),
      AttributeOrderingRuleGroups: this.resolveConfig<string[]>(
        JsonConfigMember.AttributeOrderingRuleGroups
      ),
      FirstLineAttributes: this.resolveConfig<string[]>(
        JsonConfigMember.FirstLineAttributes
      ).join(", "),
      OrderAttributesByName: this.resolveConfig<boolean>(
        JsonConfigMember.OrderAttributesByName
      ),
      PutEndingBracketOnNewLine: this.resolveConfig<boolean>(
        JsonConfigMember.PutEndingBracketOnNewLine
      ),
      RemoveEndingTagOfEmptyElement: this.resolveConfig<boolean>(
        JsonConfigMember.RemoveEndingTagOfEmptyElement
      ),
      SpaceBeforeClosingSlash: this.resolveConfig<boolean>(
        JsonConfigMember.SpaceBeforeClosingSlash
      ),
      RootElementLineBreakRule: this.resolveEnumConfig(
        JsonConfigMember.RootElementLineBreakRule,
        ["Default", "Always", "Never"]
      ),
      ReorderVSM: this.resolveEnumConfig(JsonConfigMember.ReorderVSM, [
        "None",
        "First",
        "Last",
      ]),
      ReorderGridChildren: this.resolveConfig<boolean>(
        JsonConfigMember.ReorderGridChildren
      ),
      ReorderCanvasChildren: this.resolveConfig<boolean>(
        JsonConfigMember.ReorderCanvasChildren
      ),
      ReorderSetters: this.resolveEnumConfig(JsonConfigMember.ReorderSetters, [
        "None",
        "Property",
        "TargetName",
        "TargetNameThenProperty",
      ]),
      FormatMarkupExtension: this.resolveConfig<boolean>(
        JsonConfigMember.FormatMarkupExtension
      ),
      NoNewLineMarkupExtensions: this.resolveConfig<string[]>(
        JsonConfigMember.NoNewLineMarkupExtensions
      ).join(", "),
      ThicknessSeparator: this.resolveEnumConfig(
        JsonConfigMember.ThicknessSeparator,
        ["None", "Space", "Comma"]
      ),
      ThicknessAttributes: this.resolveConfig<string[]>(
        JsonConfigMember.ThicknessAttributes
      ).join(", "),
      CommentPadding: this.resolveConfig<number>(
        JsonConfigMember.CommentPadding
      ),
    };
    return JSON.stringify(jsonData);
  }

  private resolveConfig<T>(member: JsonConfigMember): T {
    return getXamlStylerConfig().get<T>(
      XamlConfigurationManager.configurationMap.get(member)!
    )!;
  }

  private resolveEnumConfig(
    member: JsonConfigMember,
    map: string[]
  ): number | undefined {
    var enumValue = getXamlStylerConfig().get<string>(
      XamlConfigurationManager.configurationMap.get(member)!
    )!;
    var index = map.indexOf(enumValue);
    if (index === -1) {
      return undefined;
    }
    return index;
  }

  dispose(): void {
    if (this.XamlConfigurationPath) {
      fs.unlinkSync(this.XamlConfigurationPath);
    }
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
