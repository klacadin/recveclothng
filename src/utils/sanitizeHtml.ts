const ALLOWED_TAGS = new Set([
  'a',
  'b',
  'blockquote',
  'br',
  'code',
  'em',
  'h2',
  'h3',
  'h4',
  'li',
  'ol',
  'p',
  'pre',
  'strong',
  'ul',
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel']),
};

const SAFE_URL_PATTERN = /^(https?:|mailto:|tel:|\/)/i;

function cleanElement(element: Element) {
  const tagName = element.tagName.toLowerCase();

  if (!ALLOWED_TAGS.has(tagName)) {
    const text = element.ownerDocument.createTextNode(element.textContent ?? '');
    element.replaceWith(text);
    return;
  }

  for (const attr of Array.from(element.attributes)) {
    const attrName = attr.name.toLowerCase();
    const allowedForTag = ALLOWED_ATTRS[tagName];

    if (!allowedForTag?.has(attrName)) {
      element.removeAttribute(attr.name);
      continue;
    }

    if (tagName === 'a' && attrName === 'href' && !SAFE_URL_PATTERN.test(attr.value.trim())) {
      element.removeAttribute(attr.name);
    }
  }

  if (tagName === 'a') {
    element.setAttribute('rel', 'noopener noreferrer');
    if (element.getAttribute('target') === '_blank') {
      element.setAttribute('target', '_blank');
    }
  }

  for (const child of Array.from(element.children)) {
    cleanElement(child);
  }
}

export function sanitizeHtml(input: string): string {
  if (typeof window === 'undefined' || !window.DOMParser) {
    return input.replace(/[<>&"']/g, (char) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;',
      };
      return entities[char] ?? char;
    });
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${input}</div>`, 'text/html');
  const wrapper = doc.body.firstElementChild;
  if (!wrapper) return '';

  for (const child of Array.from(wrapper.children)) {
    cleanElement(child);
  }

  return wrapper.innerHTML;
}
