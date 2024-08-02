'use client';
import clsx from 'clsx';
import { FC, TouchEventHandler, useCallback, useEffect, useState } from 'react';
import styles from './style.module.scss';
import Image from 'next/image';
import Hls from 'hls.js';

type Props = {
  mp4URL: string;
  hlsURL?: string;
  thumbnail?: string;
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

export const VideoPlayer: FC<Props> = ({
  mp4URL,
  hlsURL,
  thumbnail,
  username,
  profilePic,
  handle,
  description,
  feedEl,
  postId,
}) => {
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const onVideoClick = useCallback(() => {
    if (videoEl) {
      videoEl.paused ? videoEl.play() : videoEl.pause();
    }
  }, [videoEl]);
  const updateVideoProgress = useCallback(() => {
    if (videoEl) {
      setVideoProgress((videoEl.currentTime / videoEl.duration) * 100);
    }
  }, [videoEl]);

  const [touchPos, setTouchpos] = useState(-999);

  const [alert, setAlert] = useState<string | undefined>();
  const [clipboardAlert, setClipboardAlert] = useState<boolean | undefined>();

  const onTouchmove: TouchEventHandler<HTMLElement> = useCallback(
    (e) => {
      if (videoEl) {
        const touch = e.touches[0];
        const pos = touch.clientX;
        const diff = pos - touchPos;
        const sensitivityFactor = 0.025; // Adjust this value to control sensitivity
        const newTime = videoEl.currentTime + diff * sensitivityFactor;
        videoEl.pause();
        videoEl.currentTime = newTime;
        setTouchpos(pos);
      }
    },
    [videoEl, touchPos]
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const abortController = new AbortController();

    const handleTouchStart = (e: Event) => {
      timer = setTimeout(() => {
        if (videoEl) {
          videoEl.playbackRate = 2;
          navigator.vibrate(100);
        }
      }, 500);
    };

    const handleTouchEnd = (e: Event) => {
      e.preventDefault();
      clearTimeout(timer);
      if (videoEl) {
        videoEl.playbackRate = 1;
        navigator.vibrate(50);
      }
    };

    const speedupEls = document.querySelectorAll('.js-speed-up');

    speedupEls.forEach((el) => {
      if (el) {
        el.addEventListener('touchstart', handleTouchStart, {
          signal: abortController.signal,
        });
        el.addEventListener('touchend', handleTouchEnd, {
          signal: abortController.signal,
        });
        el.addEventListener('touchcancel', handleTouchEnd, {
          signal: abortController.signal,
        });
        el.addEventListener('mousedown', handleTouchStart, {
          signal: abortController.signal,
        });
        el.addEventListener('mouseup', handleTouchEnd, {
          signal: abortController.signal,
        });
      }
    });

    return () => {
      abortController.abort();
    };
  }, [videoEl]);

  const [expandDesc, setExpandDesc] = useState(false);

  useEffect(() => {
    if (!videoEl) {
      return;
    }

    if (!hlsURL) {
      videoEl.src = mp4URL;
      return;
    }

    if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = hlsURL;
    } else if (Hls.isSupported()) {
      var hls = new Hls();
      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
      hls.loadSource(hlsURL);
      hls.attachMedia(videoEl);
    } else {
      videoEl.src = mp4URL;
    }
  }, [videoEl, mp4URL, hlsURL]);

  const downloadVideo = useCallback(
    async (e: React.SyntheticEvent<HTMLElement>) => {
      if (e instanceof KeyboardEvent && e.key !== 'Enter') {
        return;
      }
      try {
        const response = await fetch(mp4URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'video.mp4'; // The name of the downloaded file
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    },
    [mp4URL]
  );

  const shareVideo = useCallback(
    async (e: React.SyntheticEvent<HTMLElement>) => {
      if (
        (e instanceof KeyboardEvent && e.key !== 'Enter') ||
        typeof window == 'undefined'
      ) {
        return;
      }

      const copyURL = () => {
        navigator.clipboard.writeText(window.location.toString());
        setClipboardAlert(true);
        setAlert('Link copied to clipboard');
        setTimeout(() => {
          setClipboardAlert(false);
        }, 2000);
      };

      try {
        if (navigator.share) {
          await navigator.share({
            title: 'Check out this video!',
            text: 'I found this video and thought you might like it!',
            url: window.location.toString(),
          });
        } else {
          copyURL();
        }
      } catch (error) {
        setAlert("Couldn't share video");
      }
    },
    []
  );

  useEffect(() => {
    if (!videoEl || !feedEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoEl.play();
            window.history.replaceState({}, '', `/post/${postId}`);
          } else {
            videoEl.pause();
          }
        });
      },
      {
        root: feedEl,
        threshold: 0.5, // Adjust this value as needed
      }
    );

    observer.observe(videoEl);

    return () => {
      observer.unobserve(videoEl);
    };
  }, [feedEl, videoEl, postId]);

  return (
    <div className={clsx('relative max-h-dvh w-full', styles.Container)}>
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
          { [styles.Paused]: !videoPlaying }
        )}
      >
        <PlayButton />
      </div>
      <video
        onClick={onVideoClick}
        ref={setVideoEl}
        preload="auto"
        controls={false}
        loop
        onTimeUpdate={updateVideoProgress}
        className="relative min-h-full max-h-full cursor-pointer object-cover z-10 w-full"
        playsInline
        poster={thumbnail}
        onPlay={() => setVideoPlaying(true)}
        onPause={() => setVideoPlaying(false)}
        onError={() => setVideoPlaying(false)}
      />
      <div
        onClick={onVideoClick}
        className="absolute left-2/3 right-0 top-0 bottom-0 z-20 js-speed-up"
      ></div>
      <div
        onClick={onVideoClick}
        className="absolute right-2/3 left-0 top-0 bottom-0 z-20 js-speed-up"
      ></div>
      <div
        onTouchStart={(e) => setTouchpos(e.touches[0].clientX)}
        onTouchEnd={() => {
          videoEl?.play();
          setTouchpos(-999);
        }}
        onTouchCancel={() => {
          videoEl?.play();
          setTouchpos(-999);
        }}
        onTouchMove={onTouchmove}
        className={clsx(
          'absolute bottom-0 left-0 w-full z-20 flex pt-5',
          styles.Timeline,
          { [styles.Paused]: !videoPlaying }
        )}
      >
        <div
          style={{
            width: `${videoProgress}%`,
          }}
          className={clsx('bg-white opacity-80', styles.TimelineProgress, {
            'h-1': touchPos === -999,
            'h-2': touchPos !== -999,
          })}
        ></div>
      </div>
      <a
        href={`https://tiktok.com/@${handle}`}
        className="absolute bottom-5 right-5 rounded-full overflow-hidden z-50 border-white border-2"
      >
        <div className="relative w-10 h-10">
          <Image alt="Profile picture" fill src={profilePic} />
        </div>
      </a>
      <div className="absolute bottom-20 right-7 flex flex-col gap-3">
        <a
          role="button"
          tabIndex={0}
          onClick={shareVideo}
          onKeyDown={shareVideo}
          className="relative w-6 h-6  overflow-hidden z-50 opacity-75"
        >
          <Image alt="Share video" fill src="/share.png" objectFit="contain" />
        </a>
        <a
          tabIndex={0}
          role="button"
          onClick={downloadVideo}
          onKeyDown={downloadVideo}
          className="relative w-6 h-6 overflow-hidden z-50 opacity-75"
        >
          <Image
            alt="Download video"
            fill
            src="/download.png"
            objectFit="contain"
          />
        </a>
      </div>
      <div className="flex flex-col items-start z-50 absolute bottom-5 left-5 right-20">
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
