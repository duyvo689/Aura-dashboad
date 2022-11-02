const SIGNUP_FORM = [
  {
    title: "User Name",
    _type: "text",
    _name: "userName",
    placeholder: "User Name",
    index: 1,
    require: true,
  },
  {
    title: "Email",
    _type: "email",
    _name: "email",
    placeholder: "E-mail@example.com",
    index: 2,
    require: true,
  },
  {
    title: "Password",
    _type: "password",
    _name: "password",
    placeholder: "Password",
    index: 3,
    require: true,
  },
];
const SIGNIN_FORM = [
  {
    // title: "Email",
    _type: "email",
    placeholder: "E-mail@gmail.com",
    _name: "email",
  },
  {
    // title: "Password",
    _type: "password",
    _name: "password",
    placeholder: "Password",
  },
];
const FORGOT_PASSWORD_FORM = [
  {
    title: "Email",
    _type: "text",
    _name: "email",
    placeholder: "E-mail@gmail.com",
  },
];
const CONFIRM_EMAIL_FORM = [
  {
    title: "Code",
    _type: "text",
    _name: "code",
    placeholder: "AUba8J",
    require: true,
  },
];
export { SIGNUP_FORM, SIGNIN_FORM, FORGOT_PASSWORD_FORM, CONFIRM_EMAIL_FORM };
