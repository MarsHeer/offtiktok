'use client';
import gsap from 'gsap';
import Image from 'next/image';
import { FC, useCallback, useState } from 'react';

type Props = {
  downloadURL?: string;
  setAlert: (message: string) => void;
};

export const PostOptions: FC<Props> = ({ downloadURL, setAlert }) => {
  const [expandableEl, setExpandableEl] = useState<HTMLElement | null>(null);

  const downloadVideo = useCallback(
    async (e: React.SyntheticEvent<HTMLElement>) => {
      if ((e instanceof KeyboardEvent && e.key !== 'Enter') || !downloadURL) {
        return;
      }
      try {
        const response = await fetch(downloadURL);
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
    [downloadURL]
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
        setAlert('Link copied to clipboard');
        setTimeout(() => {
          setAlert('');
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
    [setAlert]
  );

  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    if (expandableEl) {
      gsap.to(expandableEl, { width: isOpen ? 0 : 'auto', duration: 0.5 });
      setIsOpen((prev) => !prev);
    }
  }, [isOpen, expandableEl]);

  return (
    <>
      <div
        ref={setExpandableEl}
        className="absolute right-5 top-0 bottom-0 w-0 overflow-hidden flex -z-10"
      >
        <div className=" bg-stone-800 flex items-center justify-center rounded-l-full">
          <div className="p-5 pr-7 flex gap-4">
            <button
              onClick={shareVideo}
              className="flex text-gray-800 items-center cursor-pointer"
            >
              <div className="relative w-4 h-4 opacity-80">
                <Image
                  src="/share-white.png"
                  alt="Share"
                  fill
                  objectFit="contain"
                />
              </div>
            </button>
            {downloadURL && (
              <button
                onClick={downloadVideo}
                className="flex text-gray-800 items-center cursor-pointer"
              >
                <div className="relative w-4 h-4 opacity-80">
                  <Image
                    src="/download-white.png"
                    alt="Share"
                    fill
                    objectFit="contain"
                  />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={toggle}
        className=" drop-shadow-md min-w-8 min-h-8 rounded-full bg-white flex items-center justify-center  cursor-pointer"
      >
        <div className="grid grid-flow-col gap-1">
          <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
        </div>
      </button>
    </>
  );
};
