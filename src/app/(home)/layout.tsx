import { Header } from "@/components/layout/header";
import { SideNav } from "@/components/layout/side-nav";
import { Toaster } from "@/components/ui/toaster";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SideNav />
      <div className="flex flex-col sm:gap-6 sm:pl-14">
        <Header />
        <main className="flex flex-1 p-4 sm:p-6 sm:pt-0 ">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
