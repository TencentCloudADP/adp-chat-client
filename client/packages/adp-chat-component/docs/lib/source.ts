import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';
import { createElement, type ReactElement } from 'react';

// 图标处理器函数
const iconHandler = (icon: string | undefined): ReactElement | undefined => {
  if (!icon) return undefined;
  return createElement('i', {
    className: `ri-${icon} ri-lg`,
  });
};

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  icon: iconHandler,
});
