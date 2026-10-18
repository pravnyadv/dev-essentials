import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Home, LayoutGrid } from 'lucide-react';

// Both tracks share one shell; `home` is the track's dashboard.
export function baseOptions(home: string, title: string): BaseLayoutProps {
  return {
    links: [
      { type: 'icon', icon: <Home key="home" />, text: 'Dashboard', label: 'Dashboard', url: home },
      { type: 'icon', icon: <LayoutGrid key="tracks" />, text: 'Switch track', label: 'Switch track', url: '/' },
    ],
    nav: { title, url: home },
  };
}
