// app/navbar/NavbarWrapper.tsx
'use client';

import { useRouter } from 'next/navigation';
import Navbar from './navbar';

export default function NavbarWrapper() {
  const router = useRouter();

  const handleUploadSuccess = () => {
    router.refresh(); // revalidate home page
  };

  return <Navbar onUploadSuccess={handleUploadSuccess} />;
}
