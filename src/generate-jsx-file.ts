import {writeFileSync} from 'node:fs';
import {findAttributeValueType} from './find-attribute-value-type.js';
import {HtmlStandard} from './html-standard.js';

const htmlStandard = await HtmlStandard.fetch();

const intrinsicElements: Record<
  string,
  Record<string, [string, string]>
> = Object.fromEntries(
  htmlStandard.parseTagNames().map((tagName) => [tagName, {}]),
);

const baseIntrinsicElement: Record<string, [string, string]> = {};

for (const attribute of htmlStandard.parseAttributes()) {
  if (attribute.tagNames.length === 0) {
    baseIntrinsicElement[attribute.attributeName] = [
      findAttributeValueType(attribute.value),
      attribute.description,
    ];
  } else {
    for (const tagName of attribute.tagNames) {
      const intrinsicElement = intrinsicElements[tagName];

      if (!intrinsicElement) {
        throw new Error(`Unknown tag name: ${JSON.stringify(tagName)}`);
      }

      intrinsicElement[attribute.attributeName] = [
        findAttributeValueType(attribute.value),
        attribute.description,
      ];
    }
  }
}

const lines = [
  `declare global {`,
  `namespace JSX {`,
  `type Element = any;`,
  `type ElementChild = Element;`,
  ``,
  `interface ElementChildrenAttribute {`,
  `children?: ElementChild | ElementChild[];`,
  `}`,
  ``,
  `interface IntrinsicElement extends ElementChildrenAttribute {`,
];

for (const [attributeName, [valueType, description]] of Object.entries(
  baseIntrinsicElement,
)) {
  lines.push(`/** ${description} */`, `"${attributeName}"?: ${valueType};`);
}

lines.push(`}`, ``, `interface IntrinsicElements {`);

for (const [tagName, intrinsicElement] of Object.entries(intrinsicElements)) {
  lines.push(`"${tagName}": IntrinsicElement & {`);

  for (const [attributeName, [valueType, description]] of Object.entries(
    intrinsicElement,
  )) {
    lines.push(`/** ${description} */`, `"${attributeName}"?: ${valueType};`);
  }

  lines.push(`}`);
}

lines.push(`}`, `}`, `}`);

writeFileSync(`./src/jsx.ts`, lines.join(`\n`), {encoding: `utf-8`});
