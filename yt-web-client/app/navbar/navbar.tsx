'use client';

import { User } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChangedHelper } from '../firebase/firebase';
import styles from './navbar.module.css';
import SignIn from './sign-in';
import Upload from './uploaded';

export default function Navbar() {
  // init user state
  const [user, setUser] = useState<User | null>(null);

  // Hook
  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  });

  return (
    <nav className={styles.nav}>
      <Link href='/'>
        <Image
          width={90}
          height={20}
          src='/youtube-logo.svg'
          alt='Youtube Logo'
        />
      </Link>
      {user && <Upload v1Enabeld={true} />}
      {user && <Upload  v1Enabeld={false} />}
      <SignIn user={user} />
    </nav>
  );
}
