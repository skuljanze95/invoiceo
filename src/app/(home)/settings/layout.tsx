import { type Metadata } from "next";

import { SidebarNav } from "@/components/settings/sidebar-nav";

export const metadata: Metadata = {
  description: "Manage your settigns and preferences.",
  title: "Invoiceo - Settings",
};

const sidebarNavItems = [
  {
    href: "/settings",
    title: "Organization",
  },
  {
    href: "/settings/appearance",
    title: "Appearance",
  },
];

interface Props {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: Props) {
  return (
    <div className="flex w-full flex-col">
      <h2 className="text-2xl font-bold tracking-tight">Settings</h2>

      <div className="flex flex-col  gap-10 pt-6 lg:flex-row">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="lg:w-4/5 lg:max-w-5xl">{children}</div>
      </div>
    </div>
  );
}
