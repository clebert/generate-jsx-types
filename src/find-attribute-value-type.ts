const attributeValueTypes: Record<string, string> = {
  '"module"; a valid MIME type string that is not a JavaScript MIME type essence match': `string`,
  'ASCII case-insensitive match for "UTF-8"': `string`,
  'Autofill field name and related tokens*': `string`,
  'Boolean attribute': `boolean`,
  'CSS <color>': `string`,
  'CSS declarations*': `string`,
  'Comma-separated list of image candidate strings': `string`,
  'ID*': `string`,
  'Ordered set of unique space-separated tokens, none of which are identical to another, each consisting of one code point in length': `string`,
  'Potential destination, for rel="preload"; script-like destination, for rel="modulepreload"': `string`,
  'Referrer policy': `string`,
  'Regular expression matching the JavaScript Pattern production': `string`,
  'Serialized permissions policy': `string`,
  'Set of comma-separated tokens* consisting of valid MIME type strings with no parameters or audio/*, video/*, or image/*': `string`,
  'Set of space-separated tokens': `string`,
  'Set of space-separated tokens consisting of valid non-empty URLs': `string`,
  'Text': `string`,
  'Text*': `string`,
  'The source of an iframe srcdoc document*': `string`,
  'Unordered set of unique space-separated tokens consisting of IDs*': `string`,
  'Unordered set of unique space-separated tokens consisting of valid absolute URLs*': `string`,
  'Unordered set of unique space-separated tokens consisting of valid absolute URLs, defined property names, or text*': `string`,
  'Unordered set of unique space-separated tokens*': `string`,
  'Unordered set of unique space-separated tokens, ASCII case-insensitive, consisting of "allow-downloads""allow-forms""allow-modals""allow-orientation-lock""allow-pointer-lock""allow-popups""allow-popups-to-escape-sandbox""allow-presentation""allow-same-origin""allow-scripts""allow-top-navigation""allow-top-navigation-by-user-activation""allow-top-navigation-to-custom-protocols"': `string`,
  'Unordered set of unique space-separated tokens, ASCII case-insensitive, consisting of sizes*': `string`,
  'Valid BCP 47 language tag': `string`,
  'Valid BCP 47 language tag or the empty string': `string`,
  'Valid MIME type string': `string`,
  'Valid URL potentially surrounded by spaces': `string`,
  'Valid browsing context name or keyword': `string`,
  'Valid custom element name of a defined customized built-in element': `string`,
  'Valid date string with optional time': `string`,
  'Valid floating-point number': `number`,
  'Valid floating-point number greater than zero, or "any"': `number | "any"`,
  'Valid floating-point number*': `number`,
  'Valid hash-name reference*': `string`,
  'Valid integer': `number`,
  'Valid list of floating-point numbers*': `string`,
  'Valid media query list': `string`,
  'Valid month string, valid date string, valid yearless date string, valid time string, valid local date and time string, valid time-zone offset string, valid global date and time string, valid week string, valid non-negative integer, or valid duration string': `string | number`,
  'Valid non-empty URL potentially surrounded by spaces': `string`,
  'Valid non-negative integer': `number`,
  'Valid non-negative integer greater than zero': `number`,
  'Valid source size list': `string`,
  'Varies*': `string`,
  'input type keyword': `string`,
};

export function findAttributeValueType(value: string): string {
  if (/^"[A-Za-z0-9-/]+"(; "[A-Za-z0-9-/]+")*$/.test(value)) {
    return value.replaceAll(`;`, ` |`);
  }

  const attributeValueType = attributeValueTypes[value];

  if (!attributeValueType) {
    throw new Error(`Unknown attribute value: ${JSON.stringify(value)}`);
  }

  return attributeValueType;
}
