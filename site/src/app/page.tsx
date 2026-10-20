import TrackPicker from '@/components/shared/TrackPicker';
import { repoUrl } from '@/lib/shared';
import { tracks } from '@/lib/tracks';

export default function Home() {
  return <TrackPicker tracks={tracks} repoUrl={repoUrl} />;
}
