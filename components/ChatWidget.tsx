"use client";

import { useEffect, useRef } from "react";
import { Crisp, ChatboxColors, ChatboxPosition, EventsColors } from "crisp-sdk-web";

const WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

const TRIGGERS = {
  after30s: {
    message: "Need help with your website project?",
    shownKey: "evomedia_trigger_30s",
  },
  pricingSection: {
    message: "Questions about our pricing?",
    shownKey: "evomedia_trigger_pricing",
  },
  exitIntent: {
    message: "Wait! Get 10% off your first project",
    shownKey: "evomedia_trigger_exit",
  },
} as const;

function showProactiveMessage(message: string) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { $crisp?: unknown[] };
  if (Array.isArray(w.$crisp)) {
    w.$crisp.push(["do", "message:show", ["text", message]]);
  }
}

function openChatWithMessage(message: string) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { $crisp?: unknown[] };
  if (Array.isArray(w.$crisp)) {
    w.$crisp.push(["do", "chat:open"]);
    setTimeout(() => showProactiveMessage(message), 300);
  }
}

function hasTriggerShown(key: string): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(key) === "1";
}

function markTriggerShown(key: string) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(key, "1");
}

export default function ChatWidget() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!WEBSITE_ID || initialized.current) return;
    initialized.current = true;

    Crisp.configure(WEBSITE_ID, {
      autoload: true,
    });

    Crisp.setColorTheme(ChatboxColors.Cyan);
    Crisp.setPosition(ChatboxPosition.Right);

    Crisp.session.onLoaded(() => {
      Crisp.session.setData({
        project_type: "",
        budget_range: "",
      });
    });

    Crisp.chat.onChatOpened(() => {
      if (!hasTriggerShown("evomedia_greeting")) {
        showProactiveMessage(
          "Hi! I'm from Evolution Media. How can I help you today?"
        );
        markTriggerShown("evomedia_greeting");
      }
    });

    Crisp.message.onMessageSent(() => {
      Crisp.session.pushEvent("chat_message_sent", { source: "evomedia" }, EventsColors.Green);
    });

    const thirtySecondTimer = setTimeout(() => {
      if (!hasTriggerShown(TRIGGERS.after30s.shownKey)) {
        openChatWithMessage(TRIGGERS.after30s.message);
        markTriggerShown(TRIGGERS.after30s.shownKey);
      }
    }, 30_000);

    const pricingObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || hasTriggerShown(TRIGGERS.pricingSection.shownKey))
          return;
        openChatWithMessage(TRIGGERS.pricingSection.message);
        markTriggerShown(TRIGGERS.pricingSection.shownKey);
      },
      { threshold: 0.2 }
    );
    const pricingEl = document.getElementById("pricing");
    if (pricingEl) pricingObserver.observe(pricingEl);

    let exitIntentFired = false;
    function handleExitIntent(e: MouseEvent) {
      if (exitIntentFired || hasTriggerShown(TRIGGERS.exitIntent.shownKey)) return;
      if (e.clientY <= 0) {
        exitIntentFired = true;
        openChatWithMessage(TRIGGERS.exitIntent.message);
        markTriggerShown(TRIGGERS.exitIntent.shownKey);
      }
    }
    document.addEventListener("mouseleave", handleExitIntent);

    return () => {
      clearTimeout(thirtySecondTimer);
      if (pricingEl) pricingObserver.unobserve(pricingEl);
      document.removeEventListener("mouseleave", handleExitIntent);
    };
  }, []);

  if (!WEBSITE_ID) return null;
  return null;
}
