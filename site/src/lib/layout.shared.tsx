import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Home, LayoutGrid } from 'lucide-react';
import GithubIcon from '@/components/shared/GithubIcon';
import { repoUrl } from './shared';

// Both tracks share one shell; `home` is the track's dashboard.
export function baseOptions(home: string, title: string): BaseLayoutProps {
  return {
    links: [
      { type: 'icon', icon: <Home key="home" />, text: 'Dashboard', label: 'Dashboard', url: home },
      { type: 'icon', icon: <LayoutGrid key="tracks" />, text: 'Switch track', label: 'Switch track', url: '/' },
      { type: 'icon', icon: <GithubIcon key="github" />, text: 'GitHub', label: 'View the source on GitHub', url: repoUrl, external: true },
    ],
    nav: { title, url: home },
  };
}
