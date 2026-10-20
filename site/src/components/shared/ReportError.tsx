import { repoUrl, siteUrl } from '@/lib/shared';

// Opens a prefilled GitHub issue that names the lesson and its address.
export default function ReportError({ title, url }: { title: string; url: string }) {
  const issue = new URLSearchParams({ title: `Error in: ${title}`, body: `Page: ${siteUrl}${url}\n\nWhat is wrong:\n` });
  return (
    <p className="mt-8 text-sm text-fd-muted-foreground">
      Spotted a mistake or something unclear?{' '}
      <a href={`${repoUrl}/issues/new?${issue}`} target="_blank" rel="noreferrer" className="font-medium text-fd-foreground underline underline-offset-2 max-md:inline-block max-md:py-3">Report it on GitHub</a>.
    </p>
  );
}
