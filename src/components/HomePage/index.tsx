'use client';
import { FormEventHandler, useCallback, useState } from 'react';
import styles from './style.module.scss';
import clsx from 'clsx';
import { Logo } from '../Logo';
import { LoadingSpinner } from '../Loading';
import { checkURL } from '../../../utils/strings/check-url';
import Image from 'next/image';

export const HomePage = () => {
  const [videoURL, setVideoURL] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const getVideo: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        const isValidURL = checkURL(videoURL);

        if (!isValidURL) {
          setError('Please enter a valid TikTok video URL');
          return;
        }
        setLoading(true);
        setError('');
        const videoData = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/by_url/${encodeURIComponent(
            videoURL
          )}`
        ).then((res) => res.json());
        setLoading(false);

        if (videoData.error) {
          setLoading(false);
          setError(videoData.error);
          return;
        }
        window.location.href = `/post/${videoData.id}`;
      } catch (err) {
        if (err instanceof Error) {
          setLoading(false);
          setError(
            process.env.NODE_ENV === 'production'
              ? 'Woops... Something went wrong. Please try again.'
              : err.message
          );
        }
      }
    },
    [videoURL]
  );

  return (
    <div className="w-full px-5 container md:max-w-lg mx-auto flex flex-col items-center">
      <Logo />

      <form
        className={`w-full flex rounded-xl border-b-2 items-stretch mt-10 mb-0 ${
          error || loading ? 'mb-0' : ''
        } ${styles.InputHolder}`}
        onSubmit={getVideo}
      >
        <input
          className={`seasons  w-full rounded-lg pl-5 py-2 pr-2 ${styles.Input}`}
          value={videoURL}
          placeholder="Paste a TikTok video URL to get started"
          onChange={(e) => setVideoURL(e.target.value)}
        />
        <button
          disabled={loading}
          type="submit"
          className="px-4 py-2 rounded-lg flex items-center justify-center w-15"
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            <svg
              width="18"
              height="15"
              viewBox="0 0 18 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.98672 0.528914L17.4435 6.48383C17.9247 6.8681 17.9475 7.59181 17.4915 8.00569L10.0668 14.745C9.4251 15.3275 8.39685 14.8737 8.39467 14.0071L8.38837 11.5066L1.33593 10.8745C0.820309 10.8283 0.425201 10.3962 0.425201 9.87849V5.59404C0.425201 5.07845 0.817197 4.64738 1.33046 4.59854L8.36929 3.92868L8.3627 1.31284C8.36059 0.473561 9.3309 0.00518283 9.98672 0.528914Z"
                fill="#424242"
              />
            </svg>
          )}
        </button>
      </form>
      <p className="articulat text-sm my-5 text-gray-500">
        {loading
          ? 'Processing video, this could take a minute...'
          : [
              `Or add "off" before "tiktok.com" in your URL (e.g. vm.`,
              <b key="bold-off">off</b>,
              `tiktok.com/7m4Kxl)`,
            ]}
      </p>
      {error && <p className="text-red-500 text-sm my-5">{error}</p>}

      <div className={clsx('w-full mb-10', styles.Divider)}></div>
      <div className="w-full flex flex-col items-center mb-14">
        <h2 className="seasons text-xl text-slate-600 mb-3">
          Your open TikTok Client
        </h2>
        <div className="grid grid-flow-col gap-5 w-full px-2">
          <div className="articulat text-black text-sm text-gray-500 text-left">
            Ad-free
          </div>
          <div className="articulat text-black text-sm text-gray-500 text-center">
            Algorithm-free
          </div>
          <div className="articulat text-black text-sm text-gray-500 text-right">
            App-free
          </div>
        </div>
        <button
          onClick={async () => {
            const latestPost = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/latest`
            ).then((res) => res.json());
            if (latestPost) {
              window.location.href = `/post/${latestPost.id}`;
            }
          }}
          className="articulat text-slate-100 font-semibold bg-gradient-to-t from-green-900 to-green-700 border-green-800 border-2 py-2 w-full rounded-full mt-5"
        >
          Start Watching
        </button>
      </div>
      <p className="seasons text-md w-full text-center mb-2">
        If you like this project, consider supporting it
      </p>
      <a
        href="https://patreon.com/off_tiktok"
        className="articulat text-slate-700 font-semibold bg-gradient-to-t text-center from-amber-300 to-amber-200 border-amber-200 border-2 py-2 w-full rounded-full mb-10"
      >
        Sponsor on Patreon
      </a>

      <p className="seasons text-md w-full text-center mb-2">
        Sharing on iOS made easy
      </p>
      <button
        onClick={() => setShowPopUp(true)}
        className="articulat text-slate-700 font-semibold bg-gradient-to-t from-gray-300 to-gray-200 border-gray-200 border-2 py-2 w-full rounded-full mb-2"
      >
        Get the shortcut
      </button>
      <p className="text-xs">
        Shortcut by{' '}
        <a className="underline" href="https://m.twitch.tv/codelytv">
          CodelyTV
        </a>{' '}
        ❤️
      </p>

      <div
        style={{
          opacity: showPopUp ? 1 : 0,
          pointerEvents: showPopUp ? 'all' : 'none',
        }}
        className="fixed inset-0 transition-opacity bg-black/50 flex items-center justify-center p-5"
      >
        <div className="bg-white rounded-lg w-full p-5 flex flex-col">
          <div
            className={clsx(
              'border-2 border-gray-200 grid grid-flow-col snap-x snap-mandatory overflow-scroll w-full rounded-2xl',
              styles.Carousel
            )}
          >
            <div className="snap-start relative flex flex-col h-full">
              <div className="relative w-full h-full">
                <Image
                  fill
                  objectFit="cover"
                  objectPosition="bottom"
                  src="/carousel_1.png"
                  alt="An image showing you should first click on the More share option inside TikTok"
                />
              </div>
              <p className="m-0 articulat text-xs text-center text-black py-5">
                Inside the app: Click share, and scroll right until you reach{' '}
                {'"More"'}
              </p>
            </div>
            <div className="snap-start relative  flex flex-col h-full">
              <div className="relative w-full h-full">
                <Image
                  fill
                  objectFit="cover"
                  objectPosition="bottom"
                  src="/carousel_2.png"
                  alt="An image showing you should first click on the More share option inside TikTok"
                />
              </div>
              <p className="m-0 articulat text-xs text-center text-black py-5">
                Scroll down until you reach {'"Share OffTikTok"'}
              </p>
            </div>
          </div>
          <a
            href="https://www.icloud.com/shortcuts/728b1aa386df40cc80e50da89eb52033"
            className="w-full text-center articulat text-slate-700 font-semibold bg-gradient-to-t from-gray-300 to-gray-200 border-gray-200 border-2 py-2 w-full rounded-full my-5"
          >
            Download the shortcut
          </a>

          <button
            onClick={() => setShowPopUp(false)}
            className="articulat text-gray-500 underline text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
