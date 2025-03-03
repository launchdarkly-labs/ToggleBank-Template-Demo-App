import amazonLogo from "@/public/investment/stocks_logo/amazonLogo.png";
import appleLogo from "@/public/investment/stocks_logo/apple_circle_round icon_icon.svg";
import microsoftLogo from "@/public/investment/stocks_logo/microsoftLogo.svg";
import nvidiaLogo from "@/public/investment/stocks_logo/nvidiaLogo.svg";
import salesforceLogo from "@/public/investment/stocks_logo/salesforceLogo.svg";
import teslaLogo from "@/public/investment/stocks_logo/teslaLogo.svg";
import shopifyLogo from "@/public/investment/stocks_logo/shopify.svg";
import walmartLogo from "@/public/investment/stocks_logo/walmart_logo_icon.svg";
import avgoLogo from "@/public/investment/stocks_logo/AVGO.webp";
import frontierCapitalVerticalLogo from "@/public/investment/frontier_capital_logo_vertical.svg";
import launchAirwaysVerticalLogo from "@/public/airline/launch_airways_logo_vertical.svg";
import galaxyMarketplaceVerticalLogo from "@/public/marketplace/galaxy_marketplace_logo_vertical.svg";
import frontierCapitalHorizontalLogo from "@/public/investment/frontier_capital_logo_horitzonal_black.svg";
import launchAirwaysHorizontalLogo from "@/public/airline/launch_airways_logo_horizontal_black.svg";
import galaxyMarketplaceHorizontalLogo from "@/public/marketplace/galaxy_marketplace_logo_horizontal.svg";
import vrgame from "@/public/marketplace/vrgalaxy_image/vrgame.svg";
import vrcamera from "@/public/marketplace/vrgalaxy_image/vrcamera.svg";
import vrheadset from "@/public/marketplace/vrgalaxy_image/vrheadset.svg";
import vrsoftware from "@/public/marketplace/vrgalaxy_image/vrsoftware.svg";
import vrtreadmill from "@/public/marketplace/vrgalaxy_image/vrtreadmill.svg";
import hapticgloves from "@/public/marketplace/vrgalaxy_image/hapticgloves.svg";
import vrheadsetcleaningkit from "@/public/marketplace/vrgalaxy_image/vrheadsetcleaningkit.svg";
import vrcontrollers from "@/public/marketplace/vrgalaxy_image/vrcontrollers.svg";
import { InventoryItem } from "@/utils/typescriptTypesInterfaceIndustry";
import releaseHoverImage from "@/public/homepage/release-card-hovering.svg";
import releaseNoHoverImage from "@/public/homepage/release-card-not-hovering.svg";
import monitorHoverImage from "@/public/homepage/card-demo-desktop-monitorfeatures-hover.svg";
import monitorNoHoverImage from "@/public/homepage/card-demo-desktop-monitorfeatures.svg";
import aiHoverImage from "@/public/homepage/card-demo-desktop-accelerateai-hover.svg";
import aiNoHoverImage from "@/public/homepage/card-demo-desktop-accelerateai.svg";
import experimentHoverImage from "@/public/homepage/card-demo-desktop-experimenteverywhere-hover.svg";
import experimentNoHoverImage from "@/public/homepage/card-demo-desktop-experimenteverywhere.svg";
import toggleBankVerticalLogo from "@/public/banking/toggleBank_logo_vertical.svg";
import toggleBankHorizontalLogo from "@/public/banking/toggleBank_logo_horizontal_black.svg";
import architectureIconCSNAV from "@/public/sidenav/architecture-icon.svg";
import architectureHoverCSNAV from "@/public/sidenav/card-demo-sidenav-architecture-hover.svg";
import architectureNoHoverCSNAV from "@/public/sidenav/card-demo-sidenav-architecture.svg";
import codeexamplesHoverCSNAV from "@/public/sidenav/card-demo-sidenav-codeexamples-hover.svg";
import codeexamplesNoHoverCSNAV from "@/public/sidenav/card-demo-sidenav-codeexamples.svg";
import curlyBrackets from "@/public/sidenav/curly-brackets.svg";

export const ALERT_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

export const PERSONA_TIER_STANARD = "Standard";
export const PERSONA_TIER_PLATINUM = "Platinum";
export const PERSONA_ROLE_BETA = "Beta";
export const PERSONA_ROLE_DEVELOPER = "Developer";
export const PERSONA_ROLE_USER = "User";
export const LAUNCH_CLUB_STANDARD = "standard";
export const LAUNCH_CLUB_PLATINUM = "platinum";
export const LD_CONTEXT_COOKIE_KEY = "ld-context";

export const BANK = "bank";

export const ANTHROPIC = "anthropic";
export const COHERE = "cohere";
export const META = "meta";

export const COMPANY_LOGOS = {
  bank: {
    vertical: toggleBankVerticalLogo,
    horizontal: toggleBankHorizontalLogo,
  },
};

export const DEFAULT_AI_MODEL = {
  messages: [
    {
      content:
        "As an AI bot for a travel airline LaunchAirways your purpose is to answer questions related to flights and traveling. Act as customer representative. Only answer queries related to traveling and airlines. Remove quotation in response. Limit response to 100 characters. Here is the user prompt: ${userInput}.",
      role: "system",
    },
  ],
  model: {
    parameters: { temperature: 0.5, maxTokens: 500 },
    id: "cohere.command-text-v14",
  },
};

export const CSNAV_ITEMS = [
  {
    hoverBackground: codeexamplesHoverCSNAV,
    noHoverBackground: codeexamplesNoHoverCSNAV,
    icon: curlyBrackets,
    type: "resource",
    link: "/examples",
    title: "Code Examples",
  },
  {
    icon: architectureIconCSNAV,
    hoverBackground: architectureHoverCSNAV,
    noHoverBackground: architectureNoHoverCSNAV,
    type: "resource",
    link: "/architecture",
    title: "Architecture",
  },
];

export const NAV_ELEMENTS_VARIANT = {
  bank: {
    navLinks: [
      {
        text: "Summary",
        href: "/bank",
      },
      { text: "Transfers", href: "/bank" },
      { text: "Deposits", href: "/bank" },
      { text: "External Accounts", href: "/bank" },
      { text: "Statements", href: "/bank" },
    ],
    navLinkColor: "gradient-bank",
    popoverMessage: "Thank you for banking with us, ",
    logoImg: COMPANY_LOGOS["bank"].horizontal,
  },
};
