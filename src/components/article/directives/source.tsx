import type { ReactNode } from 'react';
import SourceBlock from '../editorial/SourceBlock';
import type { DirectiveConfig, DirectiveNode } from './types';
import { markParagraphsBare } from './utils';

function toProps(directive: DirectiveNode): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  const attrs = directive.attributes || {};
  if (attrs.href) props['data-href'] = attrs.href;
  if (attrs.author) props['data-author'] = attrs.author;
  if (attrs.verified) props['data-verified'] = attrs.verified;
  if (attrs.date) props['data-date'] = attrs.date;
  markParagraphsBare(directive.children || []);
  return props;
}

function SourceDirective({
  children,
  'data-href': href,
  'data-author': author,
  'data-verified': verified,
  'data-date': date,
}: {
  children?: ReactNode;
  'data-href'?: string;
  'data-author'?: string;
  'data-verified'?: string;
  'data-date'?: string;
}) {
  return (
    <SourceBlock href={href} author={author} verified={verified === 'true'} date={date}>
      {children}
    </SourceBlock>
  );
}

export const sourceDirective: DirectiveConfig = {
  name: 'source',
  hName: 'source-directive',
  toProps,
  component: SourceDirective,
};
