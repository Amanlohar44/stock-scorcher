import { useState } from "react";

import MemberSidebar from "./MemberSidebar";
import MemberTopbar from "./MemberTopbar";

export default function MemberLayout({ children }) {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">

      <div className="flex min-h-screen">

        {/* Sidebar */}
        <MemberSidebar
          open={openSidebar}
          setOpen={setOpenSidebar}
        />

        {/* Main Area */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Topbar */}
          <MemberTopbar
            toggleSidebar={() =>
              setOpenSidebar(true)
            }
          />

          {/* Page Content */}
          <main className="min-w-0 flex-1">
            {children}
          </main>

        </div>

      </div>

    </div>
  );
}