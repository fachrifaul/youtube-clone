'use client';

import { useSearchParams } from 'next/navigation';

export default function WatchContent() {
  const videoPrefix = 'https://storage.googleapis.com/nc-yt-processed-video/';
  const video = useSearchParams().get('v'); 

  return (
    <div>
      <h1>Watch Page</h1>
      <video controls src={videoPrefix + video} />
    </div>
  );
}
