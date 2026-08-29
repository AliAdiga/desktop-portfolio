"use client";

import React, { useState, useRef, useEffect } from "react";
import { PortfolioData } from "@/types/portfolio";

interface CommandHistory {
  type: "input" | "output";
  content: string | React.ReactNode;
}

export function TerminalWindow({ data }: { data: PortfolioData }) {
  const promptName = `visitor@${data.profile.name.toLowerCase().replace(/\s+/g, '')}`;
  const promptSymbol = ":~$";

  const [history, setHistory] = useState<CommandHistory[]>([
    { type: "output", content: `Welcome to ${data.profile.name}'s Terminal!` },
    { type: "output", content: 'Type "help" to see available commands.' },
  ]);
  const [input, setInput] = useState("");
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Focus input on click anywhere
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    // Add input to history
    const newHistory = [...history, { type: "input" as const, content: `${promptName}${promptSymbol} ${cmd}` }];
    
    // Parse command
    const args = cmd.split(" ");
    const mainCmd = args[0].toLowerCase();
    
    let output: React.ReactNode = "";

    switch (mainCmd) {
      case "help":
        output = (
          <div className="grid grid-cols-[100px_1fr] gap-2">
            <span className="text-green-400">help</span><span>Shows this message</span>
            <span className="text-green-400">whoami</span><span>Displays my name and role</span>
            <span className="text-green-400">about</span><span>Shows my bio</span>
            <span className="text-green-400">skills</span><span>Lists my technical skills</span>
            <span className="text-green-400">projects</span><span>Lists my latest projects</span>
            <span className="text-green-400">contact</span><span>Shows contact info and social links</span>
            <span className="text-green-400">clear</span><span>Clears the terminal</span>
            <span className="text-green-400">date</span><span>Shows current date and time</span>
            <span className="text-green-400">echo</span><span>Prints text back to screen</span>
          </div>
        );
        break;
      
      case "whoami":
        output = `${data.profile.name} — ${data.profile.role}`;
        break;

      case "about":
        output = data.profile.bio;
        break;

      case "skills":
        output = (
          <div className="flex flex-col gap-2">
            {Object.entries(
              data.skills.reduce<Record<string, string[]>>((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill.name);
                return acc;
              }, {})
            ).map(([category, names]) => (
              <div key={category}>
                <span className="text-blue-400 font-bold">{category}: </span>
                <span>{names.join(", ")}</span>
              </div>
            ))}
          </div>
        );
        break;

      case "projects":
        output = (
          <ul className="list-disc list-inside">
            {data.projects.map(p => (
              <li key={p.id}>
                <span className="font-bold text-yellow-400">{p.title}</span> - {p.client} ({p.year})
              </li>
            ))}
          </ul>
        );
        break;

      case "contact":
        output = (
          <div className="flex flex-col">
            <span><span className="text-purple-400">Email:</span> {data.profile.email}</span>
            <span><span className="text-purple-400">Location:</span> {data.profile.location}</span>
            {data.socialLinks.map(link => (
              <span key={link.platform}><span className="text-purple-400">{link.platform}:</span> {link.url}</span>
            ))}
          </div>
        );
        break;

      case "clear":
        setHistory([]);
        setInput("");
        return; // Early return to avoid adding to newHistory

      case "date":
        output = new Date().toString();
        break;

      case "echo":
        output = args.slice(1).join(" ");
        break;

      default:
        output = <span className="text-red-400">Command not found: {mainCmd}. Type &quot;help&quot; for a list of commands.</span>;
    }

    setHistory([...newHistory, { type: "output", content: output }]);
    setInput("");
  };

  return (
    <div 
      className="flex flex-col h-[calc(100%+3rem)] bg-[#1e1e1e] text-slate-300 font-mono text-sm -m-6 rounded-b-xl overflow-hidden p-4 cursor-text"
      onClick={handleContainerClick}
    >
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 pb-4">
        {history.map((item, i) => (
          <div key={i} className="whitespace-pre-wrap break-words leading-relaxed">
            {item.content}
          </div>
        ))}
        
        {/* Active Input Line */}
        <form onSubmit={handleCommand} className="flex items-center gap-2 mt-1">
          <span className="text-green-400 shrink-0">{promptName}</span>
          <span className="text-blue-400 shrink-0">{promptSymbol}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-slate-300 focus:ring-0 p-0"
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
