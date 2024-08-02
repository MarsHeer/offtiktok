import Image from 'next/image';
import { HomePage } from '../components/HomePage';

export default function Home() {
  return (
    <main className="flex min-h-dvh	 flex-col items-center justify-between py-20">
      <HomePage />
    </main>
  );
}
