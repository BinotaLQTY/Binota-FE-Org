import tokenLusd from "./token-icons/lusd.svg";
import tokenShMon from "./token-icons/shMON.svg";
import tokenB1 from "./token-icons/b1.svg";
import tokenBinota from "./token-icons/bnt.svg";
import tokenMon from "./token-icons/monad.svg";
import tokenSMon from "./token-icons/sMON.svg";
import tokenGMon from "./token-icons/gMON.svg";
import tokenBnb from "./token-icons/bnb.svg";

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
  | "B1"
  | "MON"
  | "shMON"
  | "sMON"
  | "gMON"
  | "BNB"
  | "BINOTA"
  | "LUSD";

export type CollateralSymbol =
  & TokenSymbol
  & "BNB";

export function isTokenSymbol(symbolOrUrl: string): symbolOrUrl is TokenSymbol {
  return (
    symbolOrUrl === "B1"
    || symbolOrUrl === "MON"
    || symbolOrUrl === "shMON"
    || symbolOrUrl === "sMON"
    || symbolOrUrl === "gMON"
    || symbolOrUrl === "BNB"
    || symbolOrUrl === "BINOTA"
    || symbolOrUrl === "LUSD"
  );
}

export function isCollateralSymbol(symbol: string): symbol is CollateralSymbol {
  return symbol === "BNB";
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

export const B1: Token = {
  icon: tokenB1,
  name: "B1",
  symbol: "B1" as const,
} as const;

export const BINOTA: Token = {
  icon: tokenBinota,
  name: "BINOTA",
  symbol: "BINOTA" as const,
} as const;

export const MON: Token = {
  icon: tokenMon,
  name: "MON",
  symbol: "MON" as const,
} as const;

export const shMON: Token = {
  icon: tokenShMon,
  name: "shMON",
  symbol: "shMON" as const,
} as const;

export const sMON: Token = {
  icon: tokenSMon,
  name: "sMON",
  symbol: "sMON" as const,
} as const;

export const gMON: Token = {
  icon: tokenGMon,
  name: "gMON",
  symbol: "gMON" as const,
} as const;

export const BNB: CollateralToken = {
  collateralRatio: 1.1,
  icon: tokenBnb,
  name: "BNB",
  symbol: "BNB" as const,
} as const;

export const COLLATERALS: CollateralToken[] = [
  BNB,
];

export const TOKENS_BY_SYMBOL = {
  B1,
  MON,
  shMON,
  sMON,
  gMON,
  BNB,
  BINOTA,
  LUSD,
} as const;
