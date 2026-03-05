"use client";

import {
  Briefcase,
  Store,
  User,
  Zap,
  Bot,
  Palette,
  TrendingUp,
  MessageCircle,
  Hammer,
  Rocket,
  type LucideIcon,
} from "lucide-react";

export const serviceIcons: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  store: Store,
  user: User,
};

export const whyUsIcons: Record<string, LucideIcon> = {
  zap: Zap,
  bot: Bot,
  palette: Palette,
  trendingup: TrendingUp,
};

export const howItWorksIcons: Record<string, LucideIcon> = {
  messagecircle: MessageCircle,
  hammer: Hammer,
  rocket: Rocket,
};
