import {
  faInstagram,
  faLinkedin,
  faTelegram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import SentinelStrategyImage from "@/assets/sentinel-strategy-img.png";
import BalancerStrategyImage from "@/assets/balancer-strategy-img.png";
import PredatorStrategyImage from "@/assets/predator-strategy-img.png";

export const loginCarouselData = [
  {
    id: 1,
    title: "Grow your Money",
    desc: "Build long-term wealth with \n crypto smart investing",
  },
  {
    id: 2,
    title: "Safe and High APY",
    desc: "Get Crypto Returns \n controlling market exposure",
  },
  {
    id: 3,
    title: "Withdraws at Any Time",
    desc: "Anytime. No lockups. Your \n money, your rules.​​​​​​​​​​​​​​​​",
  },
];

export const goalsData = [
  { label: "I want to protect my money", value: "1" },
  { label: "I want to grow my money while I protect it", value: "2" },
  { label: "I want to grow my money as much as possible", value: "3" },
];

export const defaultStrategiesCardsData = [
  {
    imgSrc: SentinelStrategyImage,
    content: {
      title: "Sentinel",
      risk: "Low Risk - No Exposure",
      desc: "Watchful protection of your assets with the vigilant eye of a lynx, securing steady growth in safe territory.",
      apy: "5",
    },
  },
  {
    imgSrc: BalancerStrategyImage,
    content: {
      title: "Balancer",
      risk: "Mid Risk - Mixed Exposure",
      desc: "Poised between caution and opportunity, roaming both secure shelters and promising hunting grounds.",
      apy: "8",
    },
  },
  {
    imgSrc: PredatorStrategyImage,
    content: {
      title: "Apex Predator",
      risk: "High Risk - Full Exposure",
      desc: "Commanding the highest terrain with dominant positioning, maximizing potential in the richest territories.",
      apy: "12",
    },
  },
];

export const getInFasterSocialLink = [
  {
    icon: faTelegram,
    targetText: "Telegram",
  },
  {
    icon: faInstagram,
    targetText: "Instagram",
  },
  {
    icon: faXTwitter,
    targetText: "Twitter",
  },
  {
    icon: faLinkedin,
    targetText: "Linkedin",
  },
];
