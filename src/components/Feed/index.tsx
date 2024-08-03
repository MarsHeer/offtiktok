'use client';
import { z } from 'zod';
import { postSchema } from '../../../utils/types/posts';
import {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Carousel } from '../Carousel';
import { VideoPlayer } from '../VideoPlayer';
import styles from './style.module.scss';
import clsx from 'clsx';

type Props = {
  rootPost: z.infer<typeof postSchema>;
  token?: string;
};

export const Feed: FC<Props> = ({ rootPost, token }) => {
  const [posts, setPosts] = useState<z.infer<typeof postSchema>[]>([rootPost]);
  const [feedEl, setFeedEl] = useState<HTMLDivElement | null>(null);
  const [sessionToken, setSessionToken] = useState<string | undefined>(token);
  const [nextLoaded, setNextLoaded] = useState(false);
  const [shownAnim, setShownAnim] = useState(true);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    // Check if sessiontoken cookie exists in document
    const sessionTokenCookie = document.cookie
      .split(';')
      .find((cookie) => cookie.toLowerCase().includes('sessiontoken'))
      ?.split('=')[1];
    if (sessionTokenCookie) {
      setSessionToken(sessionTokenCookie);
    } else {
      // If not, save token as sessiontoken cookie
      document.cookie = `sessiontoken=${token}`;
    }
  }, [token]);

  const getNextPost = useCallback(
    async (url: string) => {
      try {
        if (!sessionToken || fetching) {
          return;
        }

        const fetchData = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/get_related/${encodeURIComponent(
            url
          )}`,
          {
            headers: {
              sessiontoken: sessionToken,
            },
          }
        );

        if (!fetchData.ok) {
          const errorText = await fetchData.text();
          throw new Error(
            `HTTP error! status: ${fetchData.status}, message: ${errorText}`
          );
        }

        const jsonData = await fetchData.json();
        const parsedData = postSchema.safeParse(jsonData);

        if (parsedData.success) {
          setPosts((prev) => {
            const arr = [...prev, parsedData.data];
            const uniquePosts = Array.from(
              new Map(arr.map((post) => [post.id, post])).values()
            );
            return uniquePosts;
          });
          if (!nextLoaded) {
            setNextLoaded(true);

            setTimeout(() => {
              setShownAnim(false);
            }, 1200);
          }
        } else {
          console.error('Failed to parse post data:', parsedData.error);
        }
      } catch (err) {
        console.error('Failed to fetch post data:', err);
      }
    },
    [sessionToken, fetching, nextLoaded]
  );

  const startedScrolling = useRef(false);
  const scrollingTimer = useRef<NodeJS.Timeout | null>(null);

  const onScroll = useCallback(async () => {
    if (startedScrolling.current) {
      if (scrollingTimer.current) {
        clearTimeout(scrollingTimer.current);
      }
      scrollingTimer.current = setTimeout(() => {
        startedScrolling.current = false;
        scrollingTimer.current = null;
      }, 250);
      return;
    }
    if (feedEl) {
      startedScrolling.current = true;
      const feedHeight = feedEl.getBoundingClientRect().height;
      const currInd = Math.ceil(feedEl.scrollTop / feedHeight);
      const lastPost = posts[posts.length - 1];

      if (currInd === posts.length - 1 && lastPost.originalURL) {
        setFetching(true);
        await getNextPost(lastPost.originalURL);
        setFetching(false);
      }
    }
  }, [feedEl, getNextPost, posts]);

  useLayoutEffect(() => {
    if (rootPost.originalURL) {
      getNextPost(rootPost.originalURL);
    }
  }, [rootPost, getNextPost]);

  if (!rootPost) {
    return;
  }

  return (
    <div
      ref={setFeedEl}
      onScroll={onScroll}
      className={clsx(
        'grid grid-flow-row overflow-y-scroll w-full snap-y snap-mandatory',
        styles.Feed
      )}
    >
      {posts.map((post) => (
        <div
          key={post.id}
          className={clsx('flex relative w-full h-full snap-start', {
            [styles.ShowNext]: nextLoaded && shownAnim,
          })}
        >
          {post.video ? (
            <VideoPlayer
              mp4URL={`${process.env.NEXT_PUBLIC_API_URL}${post.video?.mp4URL}`}
              hlsURL={
                post.video?.hlsURL
                  ? `${process.env.NEXT_PUBLIC_API_URL}${post.video?.hlsURL}`
                  : undefined
              }
              thumbnail={
                post.video?.thumbnail
                  ? `${process.env.NEXT_PUBLIC_API_URL}${post.video?.thumbnail}`
                  : undefined
              }
              username={post.author.name}
              handle={post.author.handle}
              profilePic={`${process.env.NEXT_PUBLIC_API_URL}${post.author.image}`}
              description={post.postDescription}
              feedEl={feedEl}
              postId={post.id}
            />
          ) : (
            <Carousel
              feedEl={feedEl}
              audio={`${process.env.NEXT_PUBLIC_API_URL}${post.carousel?.audio}`}
              username={post.author.name}
              handle={post.author.handle}
              profilePic={`${process.env.NEXT_PUBLIC_API_URL}${post.author.image}`}
              description={post.postDescription}
              postId={post.id}
              images={post.carousel?.images
                .split(',')
                .map((img) => `${process.env.NEXT_PUBLIC_API_URL}${img}`)}
            />
          )}
        </div>
      ))}
    </div>
  );
};
