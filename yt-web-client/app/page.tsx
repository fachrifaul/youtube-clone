import Image from 'next/image';
import Link from 'next/link';
import { getVideos } from './firebase/functions';
import styles from './page.module.css';

export default async function Home() {
  const videos = await getVideos();

  console.log(videos);

  return (
    <main className={styles.horizontalList}>
      {videos.map((video) => (
        <Link key={video.id} href={`/watch?v=${video.filename}`}>
          <div>
            <Image
              src={`/thumbnail.png`}
              alt='video'
              width={120}
              height={80}
              className={styles.thumbnail}
            />
            <p className={styles.caption}>{video.id}</p>
          </div>
        </Link>
      ))}
    </main>
  );
}

export const revalidate = 30;
