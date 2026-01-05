import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <span className="font-semibold">ADP Chat Component</span>
    ),
  },
  links: [
    {
      text: 'GitHub',
      url: 'https://github.com/ADP/tcadp-system-client',
      external: true,
    },
  ],
};
