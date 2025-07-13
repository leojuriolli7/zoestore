import { DashboardHeader } from "./DashboardHeader";

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="w-full max-w-[1800px] mx-auto  md:p-6 p-4">
      <DashboardHeader />

      {children}
    </div>
  );
}
