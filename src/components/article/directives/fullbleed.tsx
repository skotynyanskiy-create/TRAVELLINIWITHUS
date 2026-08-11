import FullBleedFigure from '../editorial/FullBleedFigure';
import type { DirectiveConfig, DirectiveNode } from './types';
import { findFirstImage, parseImageTitle } from './utils';

function toProps(directive: DirectiveNode): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  const imageNode = findFirstImage(directive.children || []);
  if (imageNode) {
    if (imageNode.url) props['data-src'] = imageNode.url;
    if (imageNode.alt) props['data-alt'] = imageNode.alt;
    if (imageNode.title) props['data-title'] = imageNode.title;
  }
  const attrs = directive.attributes || {};
  if (attrs.ratio) props['data-ratio'] = attrs.ratio;
  directive.children = []; /* children scartati: la figure rendera' solo via props */
  return props;
}

function FullBleedDirective({
  'data-src': src,
  'data-alt': alt,
  'data-title': title,
  'data-ratio': ratio,
}: {
  'data-src'?: string;
  'data-alt'?: string;
  'data-title'?: string;
  'data-ratio'?: string;
}) {
  const { caption, credit } = parseImageTitle(title);
  return (
    <FullBleedFigure
      src={src || ''}
      alt={alt || ''}
      ratio={ratio}
      caption={caption}
      credit={credit}
    />
  );
}

export const fullbleedDirective: DirectiveConfig = {
  name: 'fullbleed',
  hName: 'fullbleed-directive',
  toProps,
  component: FullBleedDirective,
};
