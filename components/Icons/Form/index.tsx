const EditIcon = () => {
  return (
    <svg className="shrink-0 h-8 w-8 fill-current text-slate-400" viewBox="0 0 32 32">
      <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z"></path>
    </svg>
  );
};
const DeleteIcon = () => {
  return (
    <svg className="shrink-0 h-8 w-8 fill-current text-red-500" viewBox="0 0 32 32">
      <path d="M13 15h2v6h-2zM17 15h2v6h-2z"></path>
      <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z">
        <path d="M13 15h2v6h-2zM17 15h2v6h-2z"></path>
      </path>
    </svg>
  );
};
export { EditIcon, DeleteIcon };
