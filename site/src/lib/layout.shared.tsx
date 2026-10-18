import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Home } from 'lucide-react';
import { appName } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    links: [{ type: 'icon', icon: <Home key="home" />, text: 'Dashboard', label: 'Dashboard', url: '/' }],
    nav: {
      // JSX supported
      title: appName,
    },
  };
}
