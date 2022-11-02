import react, { useEffect, useState } from "react";

interface InputProps {
  input: {
    title: string;
    _type: string;
    _name: string;
    placeholder: string;
    require?: boolean;
  };
}
const passwordMustContain = [
  "At least 8 characters",
  "Lower case letters (a-z)",
  "Upper case letters (A-Z)",
  "Numbers (0-9)",
];
function Input({ input }: InputProps) {
  let [err, setErr] = useState<any>([false, false, false, false]);
  const [render, setRender] = useState(0);
  const [password, setPassword] = useState(0);
  const checkPassword = (e: any) => {
    setPassword(e.target.value.length);
    setRender(render + 1);
    if (e.target.value.length >= 8) {
      err[0] = true;
      setErr(err);
    } else {
      err[0] = false;
      setErr(err);
    }
    for (var i = 0; i < e.target.value.length; i++) {
      if (/[a-z]/.test(e.target.value[i])) {
        err[1] = true;
        setErr(err);
        break;
      } else {
        err[1] = false;
        setErr(err);
      }
    }
    for (var i = 0; i < e.target.value.length; i++) {
      if (/[A-Z]/.test(e.target.value[i])) {
        err[2] = true;
        setErr(err);
        break;
      } else {
        err[2] = false;
        setErr(err);
      }
    }
    for (var i = 0; i < e.target.value.length; i++) {
      if (/[0-9]/.test(e.target.value[i])) {
        err[3] = true;
        setErr(err);
        break;
      } else {
        err[3] = false;
        setErr(err);
      }
    }
    if (e.target.value.length === 0) {
      setErr([false, false, false, false]);
    }
  };

  useEffect(() => {}, [render]);
  return (
    <div
      className={
        input.title === "First name" || input.title === "Last name"
          ? ""
          : "col-span-2"
      }
    >
      <label
        htmlFor={input._name}
        className={
          input.require
            ? "text-black mb-1 sign-label required"
            : "text-black mb-1 sign-label"
        }
      >
        {input.title}
      </label>
      <input
        type={input._type}
        id={input._name}
        name={input._name}
        className={
          input._type === "password"
            ? "py-3 px-4  w-full sign-input rounded-lg "
            : "py-3 px-4  w-full sign-input rounded-lg "
        }
        onChange={input._type === "password" ? checkPassword : () => {}}
        placeholder={input.placeholder}
        required={input.require}
      />
      {input._type === "password" && input.require ? (
        <ul className="list-disc mb-4 pl-4 grid grid-cols-2">
          {passwordMustContain.map((condition: string, index: number) => {
            return (
              <>
                <li
                  key={index}
                  className={
                    err[index] ? "text-sm mb-1 text-green-600" : "text-sm mb-1"
                  }
                >
                  {condition}
                </li>
              </>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function InputMess() {
  return (
    <div className="w-full">
      <div className="relative w-full mes-input bg-white">
        <textarea
          name="message"
          className="w-full outline-0 pt-4 pb-5 mes-textarea"
          placeholder="Compose your message..."
        />
        <span className="mes-icon-emoji absolute cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
        <span className="mes-icon-upload absolute cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
export { Input, InputMess };
