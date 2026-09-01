"use client";

import React, { useMemo, useState } from "react";
import { PortfolioData } from "@/types/portfolio";
import Image from "next/image";
import { cn } from "@/lib/utils";

type SectionId = "intro" | "offer" | "awards" | "clients";

export function AboutWindow({ data }: { data: PortfolioData }) {
  const { profile, socialLinks, about } = data;
  const offerings = about?.offerings || [];
  const awards = about?.awards || [];
  const clients = about?.clients || [];
  const images = about?.images || [];

  const sections = useMemo(() => {
    const list: { id: SectionId; label: string }[] = [{ id: "intro", label: `I'm ${profile.name.split(" ")[0]}` }];
    if (offerings.length) list.push({ id: "offer", label: "What I Offer" });
    if (awards.length) list.push({ id: "awards", label: "Awards & Press" });
    if (clients.length) list.push({ id: "clients", label: "Clients" });
    return list;
  }, [profile.name, offerings.length, awards.length, clients.length]);

  const [active, setActive] = useState<SectionId>("intro");
  const current = sections.find((s) => s.id === active) ? active : "intro";

  return (
    <div className="flex h-[calc(100%+3rem)] bg-[var(--win-bg)] -m-6 rounded-b-xl overflow-hidden font-sans text-[color:rgb(var(--win-fg))]">
      {/* Sidebar */}
      <div className="w-44 shrink-0 bg-[var(--win-sidebar)] border-r border-[color:rgb(var(--win-fg)_/_0.1)] py-4 px-2 overflow-y-auto">
        <p className="text-[11px] font-semibold text-[color:rgb(var(--win-fg)_/_0.35)] uppercase tracking-wide px-2.5 mb-1.5">About me</p>
        <nav className="flex flex-col gap-0.5 mb-4">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              className={cn(
                "text-left text-[13px] px-2.5 py-1.5 rounded-md transition-colors",
                current === s.id ? "bg-[color:rgb(var(--win-fg)_/_0.15)] text-[color:rgb(var(--win-fg))] font-medium" : "text-[color:rgb(var(--win-fg)_/_0.6)] hover:bg-[color:rgb(var(--win-fg)_/_0.1)]"
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {(profile.email || profile.phone) && (
          <>
            <p className="text-[11px] font-semibold text-[color:rgb(var(--win-fg)_/_0.35)] uppercase tracking-wide px-2.5 mb-1.5">Contact</p>
            <nav className="flex flex-col gap-0.5">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="text-left text-[13px] px-2.5 py-1.5 rounded-md text-[color:rgb(var(--win-fg)_/_0.6)] hover:bg-[color:rgb(var(--win-fg)_/_0.1)]"
                >
                  Email me
                </a>
              )}
              {profile.phone && (
                <a
                  href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                  className="text-left text-[13px] px-2.5 py-1.5 rounded-md text-[color:rgb(var(--win-fg)_/_0.6)] hover:bg-[color:rgb(var(--win-fg)_/_0.1)]"
                >
                  Call me
                </a>
              )}
            </nav>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {current === "intro" && (
          <div>
            <h1 className="text-2xl font-bold leading-snug mb-6">
              Hello, my name is <span className="text-[color:rgb(var(--win-fg))]">{profile.name}</span> — I&apos;m a{" "}
              <span className="text-[color:rgb(var(--win-fg)_/_0.7)] border-b border-[color:rgb(var(--win-fg)_/_0.25)]">{profile.role.toLowerCase()}</span>.
            </h1>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {images.slice(0, 3).map((src) => (
                  <div key={src} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[color:rgb(var(--win-fg)_/_0.05)]">
                    <Image src={src} alt="" fill sizes="200px" className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            {about?.whatIDo && (
              <div className="mb-6">
                <h2 className="font-semibold text-sm mb-1.5">What I Do</h2>
                <p className="text-[color:rgb(var(--win-fg)_/_0.6)] text-sm leading-relaxed">{about.whatIDo}</p>
              </div>
            )}

            {about?.approach && (
              <div className="mb-6">
                <h2 className="font-semibold text-sm mb-1.5">My Approach</h2>
                <p className="text-[color:rgb(var(--win-fg)_/_0.6)] text-sm leading-relaxed">{about.approach}</p>
              </div>
            )}

            {socialLinks.length > 0 && (
              <div>
                <h2 className="font-semibold text-sm mb-1.5">Social</h2>
                <div className="flex flex-col gap-1">
                  {socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[color:rgb(var(--win-fg)_/_0.85)] text-sm underline decoration-white/30 underline-offset-2 hover:decoration-white transition-colors w-fit"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {current === "offer" && (
          <div>
            <h1 className="text-xl font-bold mb-5">What I Offer</h1>
            <ul className="flex flex-col gap-2">
              {offerings.map((item) => (
                <li key={item} className="text-sm text-[color:rgb(var(--win-fg)_/_0.7)] bg-[color:rgb(var(--win-fg)_/_0.03)] border border-[color:rgb(var(--win-fg)_/_0.1)] rounded-lg px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {current === "awards" && (
          <div>
            <h1 className="text-xl font-bold mb-5">Awards &amp; Press</h1>
            <ul className="flex flex-col gap-2">
              {awards.map((item) => (
                <li key={item} className="text-sm text-[color:rgb(var(--win-fg)_/_0.7)] bg-[color:rgb(var(--win-fg)_/_0.03)] border border-[color:rgb(var(--win-fg)_/_0.1)] rounded-lg px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {current === "clients" && (
          <div>
            <h1 className="text-xl font-bold mb-5">Clients</h1>
            <ul className="flex flex-col gap-2">
              {clients.map((item) => (
                <li key={item} className="text-sm text-[color:rgb(var(--win-fg)_/_0.7)] bg-[color:rgb(var(--win-fg)_/_0.03)] border border-[color:rgb(var(--win-fg)_/_0.1)] rounded-lg px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
