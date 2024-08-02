// app/posts/[id]/page.tsx
import clsx from 'clsx';
import { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';
import { postSchema } from '../../../../utils/types/posts';
import { Feed } from '../../../components/Feed';
import { Logo } from '../../../components/Logo';
import styles from './page.module.scss';

const fetchPostData = async (id: string) => {
  const fetchData = await fetch(
    `${process.env.NEXT_INTERNAL_API_URL}/api/post/${id}`
  );
  const jsonData = await fetchData.json();
  const parsedData = postSchema.safeParse(jsonData);

  const cookies = fetchData.headers.get('set-cookie');
  const cookiesArray = cookies?.split(';');
  const sessionToken = cookiesArray
    ?.find((cookie) => cookie.toLowerCase().includes('sessiontoken'))
    ?.split('=')[1];
  console.log({
    data: jsonData,
  });
  return {
    data: parsedData.data,
    sessionToken: sessionToken,
  };
};

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    // read route params
    const controller = new AbortController();

    setTimeout(() => {
      controller.abort();
    }, 1000 * 5);

    const fetchData = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/by_id/${params.id}`,
      {
        signal: controller.signal,
      }
    );
    const jsonData = await fetchData.json();

    const { data } = postSchema.safeParse(jsonData);
    if (data && ('video' in data || 'carousel' in data) && 'author' in data) {
      const image =
        data?.video?.thumbnail || data?.carousel?.images.split(',')[0];

      return {
        title: `Watch ${data?.author.name}'s video off TikTok`,
        description: data?.postDescription || undefined,
        openGraph: image
          ? {
              images: [`${process.env.NEXT_PUBLIC_API_URL}${image}`],
            }
          : undefined,
        creator: data?.author.handle,
        twitter: {
          card: 'summary_large_image',
        },
      };
    } else {
      return {
        title:
          "OffTikTok | Share TikToks with anyone, even if they don't have the app.",
        description:
          "OffTikTok lets you share TikToks with anyone, even if they don't have the app. Just paste the link and share it with your friends. Watch Tiktoks without ads, apps or geo-restrictions",
      };
    }
  } catch {
    return {
      title:
        "OffTikTok | Share TikToks with anyone, even if they don't have the app.",
      description:
        "OffTikTok lets you share TikToks with anyone, even if they don't have the app. Just paste the link and share it with your friends. Watch Tiktoks without ads, apps or geo-restrictions",
    };
  }
}

const PostPage = async ({ params }: { params: { id: string } }) => {
  const { data: postData, sessionToken } = await fetchPostData(params.id);

  if (!postData && process.env.NODE_ENV === 'production') {
    redirect('/404');
  } else if (!postData) {
    console.log('No post data found');
    return;
  }

  return (
    <main className="flex min-h-dvh	 flex-col items-center justify-between">
      <a
        href="/"
        className={clsx(
          'flex md:hidden absolute top-2 left-2 h-8 z-20',
          styles.Logo
        )}
      >
        <Logo fill="white" />
      </a>
      <a
        href="/"
        className={clsx(
          'hidden md:flex absolute top-2 left-2 h-8 z-20',
          styles.Logo
        )}
      >
        <Logo />
      </a>
      <div
        className={clsx(
          'container md:rounded-2xl md:m-auto h-full relative overflow-hidden flex',
          styles.Player
        )}
      >
        <Feed rootPost={postData} token={sessionToken} />
      </div>
    </main>
  );
};

export default PostPage;
