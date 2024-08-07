'use client';
import clsx from 'clsx';
import Image from 'next/image';
import { FC, UIEventHandler, useCallback, useEffect, useState } from 'react';
import styles from './style.module.scss';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { PostOptions } from '../PostOptions';

gsap.registerPlugin(ScrollToPlugin);

type Props = {
  images?: string[];
  audio?: string;
  username: string;
  handle: string;
  profilePic: string;
  description?: string | null;
  feedEl: HTMLElement | null;
  postId: number;
};

const PlayButton = () => (
  <svg
    width="85"
    height="94"
    viewBox="0 0 85 94"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M79.0558 55.5509C85.7671 51.7107 85.7671 42.0323 79.0558 38.192L15.6863 1.93113C9.01966 -1.88357 0.719733 2.92976 0.719733 10.6106L0.719733 83.1323C0.719733 90.8131 9.01964 95.6265 15.6862 91.8118L79.0558 55.5509Z"
      fill="#D9D9D9"
    />
  </svg>
);

export const Carousel: FC<Props> = ({
  images,
  audio,
  username,
  profilePic,
  handle,
  description,
  feedEl,
  postId,
}) => {
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(audio ? false : true);
  const [activeIndex, setActiveIndex] = useState(0);
  const audioClick = useCallback(() => {
    if (audioEl) {
      audioEl.volume = 1;
      audioEl.paused ? audioEl.play() : audioEl.pause();
    }
  }, [audioEl]);

  const [expandDesc, setExpandDesc] = useState(false);
  const [alert, setAlert] = useState<string | undefined>();
  const [clipboardAlert, setClipboardAlert] = useState<boolean | undefined>();

  const onScroll: UIEventHandler<HTMLDivElement> = useCallback((e) => {
    const crsl = e.target;
    if (crsl instanceof HTMLDivElement) {
      const idx = Math.round(crsl.scrollLeft / crsl.clientWidth);
      setActiveIndex(idx);
    }
  }, []);

  const clickArrow = (dir: 'left' | 'right') => {
    const crsl = document.querySelector(`.${styles.Carousel}`);
    if (crsl instanceof HTMLDivElement) {
      const idx = dir === 'right' ? activeIndex + 1 : activeIndex - 1;
      const scroll = idx * crsl.clientWidth;
      gsap.to(crsl, { scrollTo: { x: scroll }, duration: 0.5 });
    }
  };

  const [wrapperEl, setWrapperEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!wrapperEl || !feedEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            audioEl?.play();
            window.history.replaceState({}, '', `/post/${postId}`);
          } else {
            audioEl?.pause();
          }
        });
      },
      {
        root: feedEl,
        threshold: 0.5, // Adjust this value as needed
      }
    );

    observer.observe(wrapperEl);

    return () => {
      observer.unobserve(wrapperEl);
    };
  }, [feedEl, audioEl, postId, wrapperEl]);

  return (
    <div ref={setWrapperEl} className="relative w-full h-full max-h-dvh">
      <div
        className={clsx(
          'absolute left-0 w-full top-4 z-50 flex justify-center animate-once animate-duration-200 animate-ease-in opacity-0',
          {
            ['animate-fade-left']: clipboardAlert,
            ['animate-fade-right animate-reverse ']: clipboardAlert === false,
          }
        )}
      >
        <div className="px-5 py-1 seasons text-sm bg-white text-black rounded-md">
          {alert}
        </div>
      </div>
      <div
        className={clsx(
          'absolute top-0 left-0 w-full h-full bg-black opacity-50 z-40 flex items-center justify-center',
          styles.Video,
          { [styles.Paused]: !audioPlaying }
        )}
      >
        <PlayButton />
      </div>
      {audio && (
        <audio
          preload="auto"
          ref={setAudioEl}
          controls={false}
          loop
          className="absolute min-h-dvh	 cursor-pointer top-0 left-0 w-full opacity-0 z-10"
          src={audio}
          onPlay={() => setAudioPlaying(true)}
          onPause={() => setAudioPlaying(false)}
          onError={() => setAudioPlaying(false)}
        />
      )}
      <div className="absolute left-0 right-0 bottom-20 z-20 flex justify-center gap-1.5">
        {images?.map((_, idx) => (
          <div
            key={idx}
            className={`rounded-full transition-opacity min-w-2 bg-white aspect-square ${
              idx === activeIndex ? 'opacity-100' : 'opacity-50'
            }`}
          />
        ))}
      </div>
      <div className="absolute left-0 right-0 h-1 px-5 hidden md:flex justify-between z-20 top-1/2">
        <a
          role="button"
          tabIndex={0}
          onClick={() => clickArrow('left')}
          className={clsx('h-5 flex items-center justify-center', styles.Arrow)}
        >
          <svg
            width="31"
            height="55"
            viewBox="0 0 31 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.04453 27.5642L29.9534 52.4731L27.8321 54.5944L0.80189 27.5642L27.8988 0.467295L30.0201 2.58862L5.04453 27.5642Z"
              fill="#EEEEEE"
            />
          </svg>
        </a>
        <a
          role="button"
          tabIndex={0}
          onClick={() => clickArrow('right')}
          className={clsx('h-5 flex items-center justify-center', styles.Arrow)}
        >
          <svg
            width="31"
            height="55"
            viewBox="0 0 31 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M25.7775 27.4975L0.868593 2.58861L2.98991 0.467293L30.0201 27.4975L2.9232 54.5944L0.80188 52.4731L25.7775 27.4975Z"
              fill="#EEEEEE"
            />
          </svg>
        </a>
      </div>
      <div
        onClick={audioClick}
        className={clsx('w-full h-full z-10', styles.Carousel)}
        onScroll={onScroll}
      >
        {images?.map((img, idx) => (
          <div key={idx} className={clsx('relative bg-black', styles.Slide)}>
            <img
              style={{
                position: 'absolute',
                inset: 0,
                objectFit: 'contain',
                objectPosition: 'center',
              }}
              src={img}
              alt="Carousel image"
            />
          </div>
        ))}
      </div>
      <a
        href={`https://tiktok.com/@${handle}`}
        className="absolute bottom-16 right-5 rounded-full overflow-hidden z-50 border-white border-2"
      >
        <div className="relative w-10 h-10">
          <img
            style={{
              position: 'absolute',
              inset: 0,
              objectFit: 'cover',
            }}
            alt="Profile picture"
            src={profilePic}
          />
        </div>
      </a>
      <a className="absolute bottom-5 right-6 z-50">
        <PostOptions setAlert={setAlert} />
      </a>

      <div className="flex flex-col items-start z-40 absolute bottom-5 left-5 right-20">
        <p className="seasons text-white text-xs text-left mb-1.5">
          From{' '}
          <a className="underline" href={`https://tiktok.com/@${handle}`}>
            {username}
          </a>{' '}
          on TikTok
        </p>
        {description ? (
          <p
            onClick={() => setExpandDesc(!expandDesc)}
            className={clsx(
              'articulat text-white text-xs text-left m-0',
              styles.Desc,
              { [styles.DescExpanded]: expandDesc }
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
};
