import React, { useState } from "react";
interface Props {
  children: any;
  activecondition: any;
}

function SidebarLinkGroup({ children, activecondition }: any) {
  console.log(activecondition);
  const [open, setOpen] = useState(activecondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div
      className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
        activecondition && "bg-slate-900"
      }`}
    >
      {children(handleClick, open)}
    </div>
  );
}

export default SidebarLinkGroup;
