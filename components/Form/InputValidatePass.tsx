import { useRef, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
interface Props {
  title: string;
  id: string;
  name: string;
  type: "password";
  defaultValue?: string;
  required?: boolean;
}
const passwordMustContain = [
  "Ít nhất 8 kí tự",
  "Bao gồm chữ thường (a-z)",
  "Bao gồm chữ in hoa (A-Z)",
  "Bao gồm số (0-9)",
];
const InputValidatePass = ({
  title,
  id,
  name,
  type,
  defaultValue,
  required = false,
}: Props) => {
  let [err, setErr] = useState<any>([false, false, false, false]);
  const [render, setRender] = useState(0);
  const [password, setPassword] = useState(0);
  const [inputPass, setInputPass] = useState("password");
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
  const toogleHidden = () => {
    if (inputPass === "password") {
      setInputPass("text");
    } else {
      setInputPass("password");
    }
  };
  return (
    <div>
      <label
        htmlFor={id}
        className={`block font-medium text-sm mb-1 text-slate-600 ${
          required ? "required" : ""
        }`}
      >
        {title}
      </label>
      <div className="relative">
        <input
          type={inputPass}
          id={id}
          name={name}
          className="form-input w-full"
          defaultValue={defaultValue}
          required={true}
          onChange={checkPassword}
        />
        <div className="absolute right-2 top-1.5 z-20 w-6 h-6 cursor-pointer">
          {inputPass === "password" ? (
            <EyeSlashIcon onClick={toogleHidden} />
          ) : (
            <EyeIcon onClick={toogleHidden} />
          )}
        </div>
      </div>
      {required ? (
        <ul className="list-disc my-4 pl-4 grid grid-cols-2">
          {passwordMustContain.map((condition: string, index: number) => {
            return (
              <li
                key={index}
                className={
                  err[index]
                    ? "text-sm mb-1 text-green-600"
                    : "text-sm mb-1 text-slate-600"
                }
              >
                {condition}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};
export default InputValidatePass;
