"use client"; // This makes it a Client Component

import { usePathname } from "next/navigation";
import PortalLayout from "../components/PortalLayout/page";
import { useEffect, useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [userNPDSEN, setUserNPDSEN] = useState<string | null>(null);

  useEffect(() => {
    // Access localStorage only in the client
    const storedUser = localStorage.getItem("user_NPDSEN");
    setUserNPDSEN(storedUser);
  }, []);

  const isLoginPage = pathname === "/login";

  if (userNPDSEN) {
    const team = userNPDSEN.split("_")[0];
    if (team === "teamba" && !pathname.startsWith("/team-ba")) {
      window.location.href = "/team-ba/guide-by-speech";
      return null;
    }
    return <PortalLayout>{children}</PortalLayout>;
  } else {
    return isLoginPage ? <>{children}</> : null;
  }
}
