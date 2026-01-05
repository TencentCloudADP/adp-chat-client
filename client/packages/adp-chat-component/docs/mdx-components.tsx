import type { MDXComponents } from 'mdx/types';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { PropsTable, EventsTable, SlotsTable, MethodsTable } from '@/components/api-table';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    PropsTable,
    EventsTable,
    SlotsTable,
    MethodsTable,
    ...components,
  };
}
