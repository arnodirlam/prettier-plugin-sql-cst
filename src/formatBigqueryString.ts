import { Doc, Options } from "prettier";
import { StringLiteral } from "sql-parser-cst";
import { AllPrettierOptions } from "./options";
import { hardline, indent, stripTrailingHardline } from "./print_utils";

export const formatBigqueryString = (
  node: StringLiteral,
  options: Partial<AllPrettierOptions>,
) => {
  return async (
    textToDoc: (text: string, options: Options) => Promise<Doc>,
  ) => {
    const quotes = detectQuotes(node.text);
    if (!quotes) {
      return undefined;
    }

    const code = await textToDoc(node.value, options);
    return [
      quotes[0],
      indent([hardline, stripTrailingHardline(code)]),
      hardline,
      quotes[1],
    ];
  };
};

const detectQuotes = (text: string): [string, string] | undefined => {
  const match = text.match(/^[rR]('''|""")/);
  return match ? [match[0], match[1]] : undefined;
};
