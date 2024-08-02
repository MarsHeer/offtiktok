import { redirect } from 'next/navigation';
import { postSchema } from '../../../../../utils/types/posts';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  {
    params: { subdomain, path },
  }: {
    params: {
      subdomain: string;
      path: string[];
    };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    // read route params
    const controller = new AbortController();

    const constructedURL = `https://${
      subdomain ? `${subdomain}.` : ''
    }tiktok.com/${decodeURIComponent(path.join('/'))}`;

    setTimeout(() => {
      controller.abort();
    }, 1000 * 5);

    const fetchData = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/by_url/${encodeURIComponent(
        constructedURL
      )}`,
      {
        signal: controller.signal,
      }
    );

    const jsonData = await fetchData.json();

    const parsedData = postSchema.safeParse(jsonData);
    if (parsedData.success) {
      const { data } = parsedData;

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

const fetchPostData = async (url: string): Promise<void> => {
  let id: number | null = null;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/by_url/${encodeURIComponent(url)}`
    );
    if (!response.ok) {
      console.error('Network response was not ok:', response.statusText);
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const jsonData = await response.json();
    const parsedData = postSchema.safeParse(jsonData);
    if (parsedData.success) {
      id = parsedData.data.id;
      console.log('Data is good, go to: ', `/post/${parsedData.data.id}`);
    } else {
      console.error('Data validation failed', parsedData.error);
    }
  } catch (error) {
    console.error('Failed to fetch post data:', error);
    redirect('/');
  } finally {
    if (id) {
      redirect(`/post/${id}`);
    } else {
      redirect('/');
    }
  }
};

const CatchAll = async ({
  params: { subdomain, path },
}: {
  params: {
    subdomain: string;
    path: string[];
  };
}) => {
  const constructedURL = `https://${
    subdomain ? `${subdomain}.` : ''
  }tiktok.com/${decodeURIComponent(path.join('/'))}`;

  await fetchPostData(constructedURL);

  return null;
};

export default CatchAll;
