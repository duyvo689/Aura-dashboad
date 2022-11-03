interface Props {
  setImage: any;
  setFileImage: any;
  title: string;
}
function InputFileImage({ title, setImage, setFileImage }: Props) {
  const changeBackGround = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const i = e.target.files[0];
      setFileImage(i);
      setImage(URL.createObjectURL(i));
    } else {
      window.alert("day khong phai video");
    }
  };
  return (
    <div
      className="flex justify-center items-center w-full relative"
      style={{
        paddingTop: "56.25%",
      }}
    >
      <label
        htmlFor="backGround"
        className="required flex flex-col justify-center items-center absolute top-0 h-full w-full bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer"
      >
        <div className="flex flex-col justify-center items-center pt-5 pb-6">
          <svg
            aria-hidden="true"
            className="mb-3 w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload {title}</span>
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, JPEG,... (recommend: 1600x900 (16:9))
          </p>
        </div>
        <input
          id="backGround"
          name="backGround"
          type="file"
          className="hidden"
          onChange={changeBackGround}
          accept="image/png, image/jpeg, image/jpg, image/webp"
          required
        />
      </label>
    </div>
  );
}
export { InputFileImage };
