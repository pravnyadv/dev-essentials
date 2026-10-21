'use client';
import type { Separator } from 'fumadocs-core/page-tree';
import { SidebarSeparator } from 'fumadocs-ui/components/sidebar/base';

// A sidebar section title such as "1. Must Know" or "Reference": the default separator, in bold.
export default function SectionSeparator({ item }: { item: Separator }) {
  return (
    <SidebarSeparator className="mb-1 px-2 font-bold text-fd-foreground [&_svg]:size-4 [&_svg]:shrink-0">
      {item.icon}
      {item.name}
    </SidebarSeparator>
  );
}
