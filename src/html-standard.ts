import {JSDOM} from 'jsdom';

export interface HtmlStandardAttribute {
  readonly attributeName: string;
  readonly tagNames: readonly string[];
  readonly description: string;
  readonly value: string;
}

export class HtmlStandard {
  static async fetch(): Promise<HtmlStandard> {
    const response = await fetch(
      `https://html.spec.whatwg.org/multipage/indices.html`,
    );

    const dom = new JSDOM(await response.text());

    return new HtmlStandard(dom);
  }

  readonly #dom: JSDOM;

  constructor(dom: JSDOM) {
    this.#dom = dom;
  }

  parseTagNames(): string[] {
    const tableCellElements = this.#dom.window.document
      .querySelector(`#element-interfaces ~ table`)!
      .querySelectorAll(`tbody tr td:first-child`);

    const tagNames = new Set<string>();

    for (const tableCellElement of tableCellElements) {
      const tagName = tableCellElement.textContent?.trim();

      if (tagName && tagName !== `custom elements`) {
        tagNames.add(tagName);
      }
    }

    return [...tagNames];
  }

  parseAttributes(): HtmlStandardAttribute[] {
    const tableRowElements = this.#dom.window.document.querySelectorAll(
      `table#attributes-1 tbody tr`,
    );

    const attributes: HtmlStandardAttribute[] = [];

    for (const tableRowElement of tableRowElements) {
      attributes.push({
        attributeName: this.#parseAttributeName(tableRowElement),
        tagNames: this.#parseTagNames(tableRowElement),
        description: this.#parseDescription(tableRowElement),
        value: this.#parseValue(tableRowElement),
      });
    }

    return attributes;
  }

  #parseAttributeName(tableRowElement: Element): string {
    return (
      tableRowElement.querySelector(`th:nth-child(1)`)?.textContent?.trim() ??
      ``
    );
  }

  #parseTagNames(tableRowElement: Element): string[] {
    const text = tableRowElement
      .querySelector(`td:nth-child(2)`)
      ?.textContent?.split(`\n`)
      .map((line) => line.trim())
      .filter(Boolean)
      .join(``);

    return (
      text
        ?.split(`;`)
        .filter(
          (tagName) =>
            tagName !== `HTML elements` &&
            tagName !== `form-associated custom elements`,
        )
        .map((tagName) =>
          tagName.startsWith(`source`) ? `source` : tagName,
        ) ?? []
    );
  }

  #parseDescription(tableRowElement: Element): string {
    return (
      tableRowElement
        .querySelector(`td:nth-child(3)`)
        ?.textContent?.split(`\n`)
        .map((line) => line.trim())
        .filter(Boolean)
        .join(` `) ?? ``
    );
  }

  #parseValue(tableRowElement: Element): string {
    return (
      tableRowElement
        .querySelector(`td:nth-child(4)`)
        ?.textContent?.split(`\n`)
        .map((line) => line.trim())
        .filter(Boolean)
        .join(` `) ?? ``
    );
  }
}
