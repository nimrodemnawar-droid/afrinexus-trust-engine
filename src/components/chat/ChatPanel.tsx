import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { supabase } from "@/integrations/supabase/client";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import nexusMark from "@/assets/nexus-assistant.png";

const SUGGESTIONS = [
  "How does Afrinexus verify parties?",
  "What does escrow cost per deal?",
  "I'm exporting avocados to Dubai — what do I need?",
  "How do I apply for early access?",
];

const transport = new DefaultChatTransport({
  api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
  },
});

function textOf(message: UIMessage) {
  return message.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { text: string }).text)
    .join("");
}

export function ChatPanel({ className = "" }: { className?: string }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [initial, setInitial] = useState<UIMessage[] | null>(null);
  const userIdRef = useRef<string | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);
  const focusComposer = () => composerRef.current?.querySelector("textarea")?.focus();
  const [input, setInput] = useState("");

  // Load the signed-in visitor's saved conversation once.
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user.id ?? null;
      if (!active) return;
      setUserId(uid);
      userIdRef.current = uid;
      if (!uid) {
        setInitial([]);
        return;
      }
      const { data: rows } = await supabase
        .from("chat_messages")
        .select("id, role, content")
        .order("created_at", { ascending: true });
      if (!active) return;
      setInitial(
        (rows ?? []).map((r) => ({
          id: r.id,
          role: r.role as "user" | "assistant",
          parts: [{ type: "text", text: r.content }],
        })) as UIMessage[],
      );
    })();
    return () => {
      active = false;
    };
  }, []);

  const save = async (role: "user" | "assistant", content: string) => {
    const uid = userIdRef.current;
    if (!uid || !content.trim()) return;
    const { error } = await supabase.from("chat_messages").insert({ user_id: uid, role, content });
    if (error) console.error("chat save failed", error);
  };

  const { messages, sendMessage, status, setMessages } = useChat({
    id: "afrinexus-assistant",
    messages: initial ?? [],
    transport,
    onFinish: ({ message }) => void save("assistant", textOf(message)),
    onError: () => toast.error("The assistant is unavailable right now. Please try again."),
  });

  // Apply saved history once it has loaded.
  useEffect(() => {
    if (initial && initial.length) setMessages(initial);
  }, [initial, setMessages]);

  const busy = status === "submitted" || status === "streaming";

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    setInput("");
    void save("user", value);
    void sendMessage({ text: value });
    textareaRef.current?.focus();
  };

  useEffect(() => {
    if (!busy) textareaRef.current?.focus();
  }, [busy]);

  const clear = async () => {
    setMessages([]);
    if (userIdRef.current) {
      await supabase.from("chat_messages").delete().eq("user_id", userIdRef.current);
    }
  };

  return (
    <div className={`flex h-full min-h-0 flex-col ${className}`}>
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="gap-6">
          {messages.length === 0 ? (
            <ConversationEmptyState>
              <img src={nexusMark} alt="Afrinexus assistant" width={72} height={72} loading="lazy" className="h-16 w-16" />
              <div className="space-y-1">
                <h3 className="font-serif text-lg text-foreground">Nexus Assistant</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Ask about verification, documented deals, escrow, pricing — or get guidance on a cross-border deal.
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="rounded-full border border-accent/30 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((m) => (
              <Message from={m.role} key={m.id}>
                <MessageContent>
                  <MessageResponse>{textOf(m)}</MessageResponse>
                </MessageContent>
              </Message>
            ))
          )}
          {status === "submitted" && <Shimmer>Thinking…</Shimmer>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t p-3">
        <PromptInput
          onSubmit={(_, e) => {
            e.preventDefault();
            submit(input);
          }}
        >
          <PromptInputTextarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Nexus about trust, deals or the platform…"
          />
          <PromptInputFooter className="justify-between">
            <div className="flex items-center gap-2 pl-1 text-[11px] text-muted-foreground">
              {userId ? "History saved to your account" : "Sign in to save this conversation"}
              {messages.length > 0 && (
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px]" onClick={clear} type="button">
                  Clear
                </Button>
              )}
            </div>
            <PromptInputSubmit status={status} disabled={!input.trim() && !busy} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
