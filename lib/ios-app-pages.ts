/**
 * Support and privacy copy for individual iOS apps.
 * Sourced from each app's support / privacy pages.
 */

export type IosAppPageContent = {
  restorePurchasesNote: string;
  privacy: {
    lastUpdated: string;
    intro: string;
    sections: Array<{
      title: string;
      paragraphs: string[];
      links?: Array<{ href: string; label: string }>;
    }>;
  };
};

export const iosAppPageContent: Record<string, IosAppPageContent> = {
  loopnik: {
    restorePurchasesNote:
      'If you bought "Remove Ads" and ads are still showing (for example, on a new phone), open LoopNik! and tap Restore Purchases on the menu screen.',
    privacy: {
      lastUpdated: "June 2026",
      intro:
        'LoopNik! is a free arcade game developed by John Rochie ("we", "us"). This policy explains what data is handled when you play LoopNik!.',
      sections: [
        {
          title: "Data we collect directly",
          paragraphs: [
            "None. LoopNik! has no accounts, no sign-in, and we operate no servers. Your best score and settings are stored only on your device.",
          ],
        },
        {
          title: "Advertising (Google AdMob)",
          paragraphs: [
            "The free version of LoopNik! shows ads served by Google AdMob. To serve and measure ads, Google may collect device information including device identifiers (such as the advertising identifier), IP address, and ad interaction data. This data is collected and processed by Google, not by us.",
          ],
          links: [
            {
              href: "https://policies.google.com/privacy",
              label: "Google's Privacy Policy",
            },
            {
              href: "https://support.google.com/admob/answer/6128543",
              label: "how Google uses data from AdMob",
            },
          ],
        },
        {
          title: "In-app purchase",
          paragraphs: [
            'The "Remove Ads" purchase is processed entirely by Apple through your App Store account. We never see your payment details. After purchase, no ads are shown and no advertising data is collected by the app.',
          ],
        },
        {
          title: "Children",
          paragraphs: [
            "LoopNik! is not directed at children. We do not knowingly collect personal information from children.",
          ],
        },
        {
          title: "Your choices",
          paragraphs: [
            'You can reset your device\'s advertising identifier or limit ad tracking in iOS Settings > Privacy & Security. Purchasing "Remove Ads" disables advertising entirely.',
          ],
        },
        {
          title: "Changes",
          paragraphs: [
            "If this policy changes, the updated version will be posted at this address.",
          ],
        },
      ],
    },
  },
};

export function getIosAppPageContent(id: string): IosAppPageContent | undefined {
  return iosAppPageContent[id];
}
