import tokenLusd from "./token-icons/lusd.svg";
import tokenShMon from "./token-icons/shMON.svg";
import tokenUno from "./token-icons/Pinky.svg";
import tokenBinota from "./token-icons/Hand.svg";
import tokenMon from "./token-icons/monad.svg";
import tokenSMon from "./token-icons/sMON.svg";
import tokenGMon from "./token-icons/gMON.svg";

// any external token, without a known symbol
export type ExternalToken = {
  icon: string;
  name: string;
  symbol: string;
};

// a token with a known symbol (TokenSymbol)
export type Token = ExternalToken & {
  icon: string;
  name: string;
  symbol: TokenSymbol;
};

export type TokenSymbol =
  | "UNO"
  | "MON"
  | "shMON"
  | "sMON"
  | "gMON"
  | "BINOTA"
  | "LUSD";

export type CollateralSymbol =
  & TokenSymbol
  & ("MON" | "shMON" | "sMON" | "gMON");

export function isTokenSymbol(symbolOrUrl: string): symbolOrUrl is TokenSymbol {
  return (
    symbolOrUrl === "UNO"
    || symbolOrUrl === "MON"
    || symbolOrUrl === "shMON"
    || symbolOrUrl === "sMON"
    || symbolOrUrl === "gMON"
    || symbolOrUrl === "BINOTA"
    || symbolOrUrl === "LUSD"
  );
}

export function isCollateralSymbol(symbol: string): symbol is CollateralSymbol {
  return (
    symbol === "MON"
    || symbol === "shMON"
    || symbol === "sMON"
    || symbol === "gMON"
  );
}

export type CollateralToken = Token & {
  collateralRatio: number;
  symbol: CollateralSymbol;
};

export const LUSD: Token = {
  icon: tokenLusd,
  name: "LUSD",
  symbol: "LUSD" as const,
} as const;

export const UNO: Token = {
  icon: tokenUno,
  name: "UNO",
  symbol: "UNO" as const,
} as const;

export const BINOTA: Token = {
  icon: tokenBinota,
  name: "BINOTA",
  symbol: "BINOTA" as const,
} as const;

export const MON: CollateralToken = {
  collateralRatio: 1.1,
  icon: tokenMon,
  name: "MON",
  symbol: "MON" as const,
} as const;

export const shMON: CollateralToken = {
  collateralRatio: 1.2,
  icon: tokenShMon,
  name: "shMON",
  symbol: "shMON" as const,
} as const;

export const sMON: CollateralToken = {
  collateralRatio: 1.2,
  icon: tokenSMon,
  name: "sMON",
  symbol: "sMON" as const,
} as const;

export const gMON: CollateralToken = {
  collateralRatio: 1.2,
  icon: tokenGMon,
  name: "gMON",
  symbol: "gMON" as const,
} as const;

export const COLLATERALS: CollateralToken[] = [
  MON,
  shMON,
  sMON,
  gMON,
];

export const TOKENS_BY_SYMBOL = {
  UNO,
  MON,
  shMON,
  sMON,
  gMON,
  BINOTA,
  LUSD,
} as const;
