"use client";

import React from "react";
import { PortfolioData } from "@/types/portfolio";
import { MapPin, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export function AboutApp({ data }: { data: PortfolioData }) {
  const { profile, socialLinks, about } = data;
  const images = about?.images || [];
  const offerings = about?.offerings || [];
  const awards = about?.awards || [];
  const clients = about?.clients || [];

  return (
    <div className="flex flex-col items-center text-center pt-6 pb-12">
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-[110px] h-[110px] rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-[3px] mb-6 shadow-[0_0_40px_rgba(168,85,247,0.25)]"
      >
        <div className="relative w-full h-full rounded-full bg-black/60 overflow-hidden flex items-center justify-center">
          {profile.avatar && profile.avatar !== "/avatar.svg" ? (
            <Image src={profile.avatar} alt={profile.name} fill sizes="110px" className="object-cover" />
          ) : (
            <span className="text-4xl font-bold text-white/80">{profile.name[0]}</span>
          )}
        </div>
      </motion.div>

      {/* Name & Role */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h1 className="text-[28px] font-bold text-white tracking-tight mb-1">{profile.name}</h1>
        <p className="text-white/60 font-medium text-sm mb-2">{profile.role}</p>
        {profile.location && (
          <p className="text-white/40 text-xs flex items-center justify-center gap-1.5 mb-1">
            <MapPin size={12} /> {profile.location}
          </p>
        )}
        <div className="flex items-center justify-center gap-4 mb-5">
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="text-white/40 text-xs flex items-center gap-1.5">
              <Mail size={12} /> Email
            </a>
          )}
          {profile.phone && (
            <a href={`tel:${profile.phone.replace(/\s+/g, "")}`} className="text-white/40 text-xs flex items-center gap-1.5">
              <Phone size={12} /> Call
            </a>
          )}
        </div>
      </motion.div>

      <div className="w-12 h-px bg-white/15 mb-5" />

      {/* Bio */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-white/75 text-sm leading-relaxed mb-8 max-w-[300px]"
      >
        {profile.bio}
      </motion.p>

      {/* Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 w-full px-5 mb-8">
          {images.slice(0, 3).map((src) => (
            <div key={src} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-white/5">
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* What I Do / Approach */}
      <div className="w-full px-5 flex flex-col gap-6 text-left mb-8">
        {about?.whatIDo && (
          <div>
            <h2 className="font-semibold text-white text-sm mb-1.5">What I Do</h2>
            <p className="text-white/60 text-sm leading-relaxed">{about.whatIDo}</p>
          </div>
        )}
        {about?.approach && (
          <div>
            <h2 className="font-semibold text-white text-sm mb-1.5">My Approach</h2>
            <p className="text-white/60 text-sm leading-relaxed">{about.approach}</p>
          </div>
        )}
      </div>

      {/* Offerings / Awards / Clients */}
      {offerings.length > 0 && (
        <div className="w-full px-5 mb-8 text-left">
          <h2 className="font-semibold text-white text-sm mb-2">What I Offer</h2>
          <div className="flex flex-col gap-2">
            {offerings.map((item) => (
              <div key={item} className="text-sm text-white/70 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
      {awards.length > 0 && (
        <div className="w-full px-5 mb-8 text-left">
          <h2 className="font-semibold text-white text-sm mb-2">Awards &amp; Press</h2>
          <div className="flex flex-col gap-2">
            {awards.map((item) => (
              <div key={item} className="text-sm text-white/70 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
      {clients.length > 0 && (
        <div className="w-full px-5 mb-8 text-left">
          <h2 className="font-semibold text-white text-sm mb-2">Clients</h2>
          <div className="flex flex-col gap-2">
            {clients.map((item) => (
              <div key={item} className="text-sm text-white/70 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social */}
      {socialLinks.length > 0 && (
        <div className="w-full px-5 text-left">
          <h2 className="font-semibold text-white text-sm mb-2">Social</h2>
          <div className="flex flex-col gap-1">
            {socialLinks.map((link) => (
              <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm">
                {link.platform}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
