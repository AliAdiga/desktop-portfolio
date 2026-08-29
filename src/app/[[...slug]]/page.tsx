import React from "react";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { DesktopView } from "@/components/desktop/DesktopView";
import { MobileView } from "@/components/mobile/MobileView";
import { portfolioData } from "@/data/portfolio";
import { appRegistry } from "@/data/appRegistry";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Home({ params }: PageProps) {
  const { slug } = await params;
  const requestedApp = slug?.[0] || null;

  // Validate that the requested app exists in the registry
  const validApp = requestedApp
    ? appRegistry.find((app) => app.id === requestedApp)
      ? requestedApp
      : null
    : null;

  return (
    <ResponsiveLayout
      desktopView={<DesktopView data={portfolioData} initialApp={validApp} />}
      mobileView={<MobileView data={portfolioData} initialApp={validApp} />}
    />
  );
}
