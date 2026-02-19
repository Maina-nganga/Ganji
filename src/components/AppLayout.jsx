import Sidebar from "./Sidebar";
import Topbar from "./TopBar";

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
