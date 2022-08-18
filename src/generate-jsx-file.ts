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
  `type Element = DocumentFragment | HTMLElement;`,
  ``,
  `interface ElementChildrenAttribute {`,
  `readonly children?: {};`,
  `}`,
  ``,
  `interface ElementKeyAttribute {`,
  `readonly key?: ElementKey;`,
  `}`,
  ``,
  `interface ElementKey {`,
  `readonly string?: string;`,
  `}`,
  ``,
  `interface IntrinsicElement extends ElementChildrenAttribute, ElementKeyAttribute {`,
];

for (const [attributeName, [valueType, description]] of Object.entries(
  baseIntrinsicElement,
)) {
  lines.push(
    `/** ${description} */`,
    `readonly "${attributeName}"?: ${valueType};`,
  );
}

lines.push(`}`, ``, `interface IntrinsicElements {`);

for (const [tagName, intrinsicElement] of Object.entries(intrinsicElements)) {
  lines.push(`readonly "${tagName}": IntrinsicElement & {`);

  for (const [attributeName, [valueType, description]] of Object.entries(
    intrinsicElement,
  )) {
    lines.push(
      `/** ${description} */`,
      `readonly "${attributeName}"?: ${valueType};`,
    );
  }

  lines.push(`}`);
}

lines.push(`}`, `}`, `}`);

writeFileSync(`./src/jsx.ts`, lines.join(`\n`), {encoding: `utf-8`});
