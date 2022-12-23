import { XCircleIcon } from "@heroicons/react/24/outline";
import { Widget } from "@uploadcare/react-widget";
import convertImg from "../../utils/helpers/convertImg";
interface Props {
  image: string | null;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
  title: string;
  required?: boolean;
  defaultValue?: string;
}
const InputImage = ({
  image,
  setImage,
  title,
  required = false,
  defaultValue,
}: Props) => {
  return (
    <div>
      <label
        htmlFor="cover-photo"
        className={`block font-medium text-sm mb-1 text-slate-600 ${
          required ? "required" : ""
        }`}
      >
        {title}
      </label>
      <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
        {image ? (
          <div className="h-24 relative">
            <img src={image} className="h-full w-full rounded-lg  object-cover" />
            <div
              className="absolute h-7 w-7 -top-4 -right-4"
              onClick={() => setImage(null)}
            >
              <XCircleIcon />
            </div>
          </div>
        ) : (
          <div className="space-y-1 text-center ">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <Widget
              publicKey={process.env.NEXT_PUBLIC_UPLOADCARE as string}
              clearable
              multiple={false}
              onChange={(file) => {
                if (file) {
                  setImage(convertImg(file.uuid!));
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default InputImage;
