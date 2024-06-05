"use client";

import { useTheme } from "next-themes";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";

export function AppearanceForm() {
  const { setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Theme</CardTitle>
        <CardDescription className=" text-secondary-foreground">
          Select the theme for the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full gap-2 sm:gap-8">
          <div className="flex w-full flex-col sm:max-w-40">
            <div
              className="cursor-pointer items-center rounded-md border-2 border-black p-1 hover:bg-accent hover:text-accent-foreground"
              onClick={() => setTheme("light")}
            >
              <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-2 max-w-[80px] rounded-lg bg-[#ecedef]" />
                  <div className="h-2 max-w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-4 max-w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 max-w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-4 max-w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 max-w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
              </div>
            </div>
            <span className="block w-full p-2 text-center font-normal">
              Light
            </span>
          </div>

          <div className="flex w-full flex-col sm:max-w-40">
            <div
              className="cursor-pointer items-center rounded-md border-2 border-white bg-popover p-1 hover:bg-accent hover:text-accent-foreground"
              onClick={() => setTheme("dark")}
            >
              <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-2 w-full max-w-[80px] rounded-lg bg-slate-400" />
                  <div className="h-2 w-full max-w-[100px] rounded-lg bg-slate-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-4 w-full max-w-4 rounded-full bg-slate-400" />
                  <div className="h-2 w-full max-w-[100px] rounded-lg bg-slate-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-4 w-full max-w-4 rounded-full bg-slate-400" />
                  <div className="h-2 w-full max-w-[100px] rounded-lg bg-slate-400" />
                </div>
              </div>
            </div>
            <span className="block  p-2 text-center font-normal">Dark</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
