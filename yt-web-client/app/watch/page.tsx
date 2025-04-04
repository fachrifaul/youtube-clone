import { Suspense } from 'react';
import WatchContent from './watch';

export default function WatchPage() {
  return (
    <Suspense fallback={<div>Loading video...</div>}>
      <WatchContent />
    </Suspense>
  );
}
