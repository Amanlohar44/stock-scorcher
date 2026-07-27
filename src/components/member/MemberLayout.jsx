import { useState } from "react";
import MemberSidebar from "./MemberSidebar";
import MemberTopbar from "./MemberTopbar";

export default function MemberLayout({ children }) {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-yellow-400 selection:text-black">
      <div className="flex min-h-screen">

        {/* Responsive Sidebar */}
        <MemberSidebar
          open={openSidebar}
          setOpen={setOpenSidebar}
        />

        {/* Main Content Area */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Topbar Navigation */}
          <MemberTopbar
            toggleSidebar={() => setOpenSidebar(true)}
          />

          {/* Main Workspace Children */}
          <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto w-full">
            {children}
          </main>

        </div>

      </div>
    </div>
  );
}