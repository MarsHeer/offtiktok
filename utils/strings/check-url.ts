export const checkURL = (url: string): boolean => {
  try {
    const parseUrl = new URL(url);
    return (
      parseUrl.hostname.includes('.tiktok.com') ||
      parseUrl.hostname.includes('tiktok.com')
    );
  } catch {
    return false;
  }
};
