import { LoadingSpinner } from '../../../../components/Loading';

export default function Loading() {
  return (
    <div className="w-full h-screen flex flex-col gap-10 items-center justify-center">
      <h1 className="text-2xl seasons">Processing your video</h1>
      <p className="text-regular articulat mt-5 bm-10 text-center">
        Please be patient, this could take a minute...
      </p>
      <LoadingSpinner width={60} height={60} />
    </div>
  );
}
