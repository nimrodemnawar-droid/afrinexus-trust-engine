import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, X, Maximize2 } from "lucide-react";
import { ChatPanel } from "./ChatPanel";
import nexusMark from "@/assets/nexus-assistant.png";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  if (location.pathname === "/chat") return null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-5 z-50 flex h-[min(70vh,560px)] w-[min(92vw,400px)] flex-col overflow-hidden rounded-xl border bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b bg-primary px-4 py-3 text-primary-foreground">
              <div className="flex items-center gap-2">
                <img src={nexusMark} alt="" width={28} height={28} loading="lazy" className="h-7 w-7" />
                <div>
                  <p className="font-serif text-sm leading-none">Nexus Assistant</p>
                  <p className="mt-1 text-[11px] text-primary-foreground/60">Afrinexus · verified answers</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  to="/chat"
                  aria-label="Open full chat page"
                  className="rounded p-1.5 text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  <Maximize2 className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="rounded p-1.5 text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <ChatPanel className="min-h-0 flex-1" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-gold"
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>
    </>
  );
}
