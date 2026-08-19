import type { DirectiveNode } from './types';

export function getNodeText(node: NonNullable<DirectiveNode['children']>[number]): string {
  if (typeof node.value === 'string') return node.value;
  if (!node.children) return '';
  return node.children.map(getNodeText).join('');
}

export const ATTRIBUTION_PREFIX = /^\s*[—–-]{1,2}\s*/u; /* em-dash, en-dash, hyphen(s) */

export function markParagraphsBare(children: NonNullable<DirectiveNode['children']>) {
  for (const child of children) {
    if (child.type === 'paragraph') {
      const childNode = child as DirectiveNode;
      const data = childNode.data || (childNode.data = {});
      data.hName = 'directive-p';
    }
  }
}

export function findFirstImage(
  children: NonNullable<DirectiveNode['children']>
): { url?: string; alt?: string; title?: string | null } | null {
  for (const child of children) {
    if (child.type === 'image') return child;
    if (child.children) {
      const nested = findFirstImage(child.children);
      if (nested) return nested;
    }
  }
  return null;
}

/** Parsing del `title` markdown immagine: `Caption | Foto: Rodrigo` → split. */
export function parseImageTitle(title?: string | null): { caption?: string; credit?: string } {
  if (!title) return {};
  const trimmed = title.trim();
  if (!trimmed) return {};
  const pipeIdx = trimmed.indexOf(' | ');
  if (pipeIdx === -1) return { caption: trimmed };
  return {
    caption: trimmed.slice(0, pipeIdx).trim() || undefined,
    credit: trimmed.slice(pipeIdx + 3).trim() || undefined,
  };
}
