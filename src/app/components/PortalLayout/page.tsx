"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Database,
  LineChart,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { CheckRole } from "@/utils/CheckRole";

type MenuItem = {
  name: string;
  icon: React.ReactNode;
  href: string;
};

type MenuSection = {
  name: string;
  items: MenuItem[];
};

const menuSections: MenuSection[] = [
  {
    name: "Team Database",
    items: [
      {
        name: "Overview",
        icon: <Database className="w-4 h-4" />,
        href: "/team-database",
      },
      {
        name: "Reports",
        icon: <LineChart className="w-4 h-4" />,
        href: "/team-database-report",
      },
    ],
  },
  {
    name: "Business Analysis",
    items: [
      {
        name: "Guide by Speech",
        icon: <LineChart className="w-4 h-4" />,
        href: "/team-ba/guide-by-speech",
      },
      {
        name: "Gen Info Figma",
        icon: <Database className="w-4 h-4" />,
        href: "/team-ba/gen-info-figma",
      },
    ],
  },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(
    menuSections.map((section) => section.name)
  );
  const pathname = usePathname();
  const router = useRouter();
  const toggleSection = (sectionName: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((name) => name !== sectionName)
        : [...prev, sectionName]
    );
  };
  const userName = localStorage
    .getItem("user_NPDSEN")!
    .split("_")[0]
    ?.toUpperCase();
  const SignOut = () => {
    localStorage.removeItem("user_NPDSEN");
    window.location.href = "/login";
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-gray-800 text-white">
          <span className="text-2xl font-semibold">Npd - Sen</span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-6">
          {menuSections.map((section) => (
            <div key={section.name} className="px-4 py-2">
              <button
                onClick={() => toggleSection(section.name)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-sm font-medium text-gray-900">
                  {section.name}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openSections.includes(section.name) ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.includes(section.name) && (
                <ul className="mt-2 space-y-2">
                  {section.items.map((item) => (
                    <li key={item.name} className="">
                      <div
                        onClick={() => {
                          const isAllow = CheckRole(item.href);
                          if (isAllow) {
                            router.push(item.href);
                          }
                        }}
                        className={`${
                          CheckRole(item.href)
                            ? "cursor-pointer"
                            : "cursor-not-allowed"
                        } flex items-center px-4 py-2 text-sm rounded-lg ${
                          pathname === item.href
                            ? "text-white bg-gray-800"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <div
            onClick={() => SignOut()}
            className={`flex justify-center mx-2 cursor-pointer bg-red-500 items-center py-2 px-4 mt-4 text-sm rounded-lg "text-gray-700 `}
          >
            <LogOut className="w-4 h-4 text-white" />
            <span className="text-white ml-3">Đăng xuất</span>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-500 focus:outline-none focus:text-gray-700 lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center ml-auto">
            <span className="text-sm font-medium text-gray-900">
              {userName || "Chưa có tên"}
            </span>
            <User className="w-8 h-8 ml-4 text-gray-400 bg-gray-200 rounded-full p-1" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
