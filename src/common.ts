import { DocumentFilter } from "vscode";

export const documentSelector: DocumentFilter[] = [
  { scheme: "file", language: "AXAML", pattern: "**/*.axaml" },
  { scheme: "file", language: "xml", pattern: "**/*.axaml" },
  { scheme: "file", language: "xml", pattern: "**/*.xaml" },
];
