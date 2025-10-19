type PoolRequirements = {
  min: number;
  max: number;
};

export type LotterySelection = Record<string, number[]>;

export type LotteryPoolDefinition = {
  id: string;
  labelKey: string;
  start: number;
  end: number;
  allowDuplicates?: boolean;
  padTo?: number;
};

export type LotteryModeDefinition = {
  id: string;
  labelKey: string;
  helperKey: string;
  poolRequirements: Record<string, PoolRequirements>;
  errorKeys: Record<string, string>;
  totalErrorKey?: string;
};

export type LotteryGameDefinition = {
  id: string;
  ticketPrefix: string;
  nameKey: string;
  descriptionKey: string;
  hintKey: string;
  defaultModeId: string;
  pools: LotteryPoolDefinition[];
  modes: LotteryModeDefinition[];
};

export const LOTTERY_GAMES: LotteryGameDefinition[] = [
  {
    id: "lottoMax",
    ticketPrefix: "LMX",
    nameKey: "purchase.games.lottoMax.name",
    descriptionKey: "purchase.games.lottoMax.description",
    hintKey: "purchase.games.lottoMax.hint",
    defaultModeId: "standard",
    pools: [
      {
        id: "main",
        labelKey: "purchase.games.lottoMax.pools.main",
        start: 1,
        end: 50,
        padTo: 2,
      },
    ],
    modes: [
      {
        id: "standard",
        labelKey: "purchase.games.lottoMax.modes.standard.label",
        helperKey: "purchase.games.lottoMax.modes.standard.helper",
        poolRequirements: {
          main: { min: 7, max: 7 },
        },
        errorKeys: {
          main: "purchase.games.lottoMax.modes.standard.error.main",
        },
      },
      {
        id: "combo8",
        labelKey: "purchase.games.lottoMax.modes.combo8.label",
        helperKey: "purchase.games.lottoMax.modes.combo8.helper",
        poolRequirements: {
          main: { min: 8, max: 8 },
        },
        errorKeys: {
          main: "purchase.games.lottoMax.modes.combo8.error.main",
        },
      },
      {
        id: "combo9",
        labelKey: "purchase.games.lottoMax.modes.combo9.label",
        helperKey: "purchase.games.lottoMax.modes.combo9.helper",
        poolRequirements: {
          main: { min: 9, max: 9 },
        },
        errorKeys: {
          main: "purchase.games.lottoMax.modes.combo9.error.main",
        },
      },
      {
        id: "combo10",
        labelKey: "purchase.games.lottoMax.modes.combo10.label",
        helperKey: "purchase.games.lottoMax.modes.combo10.helper",
        poolRequirements: {
          main: { min: 10, max: 10 },
        },
        errorKeys: {
          main: "purchase.games.lottoMax.modes.combo10.error.main",
        },
      },
    ],
  },
  {
    id: "lotto649",
    ticketPrefix: "L649",
    nameKey: "purchase.games.lotto649.name",
    descriptionKey: "purchase.games.lotto649.description",
    hintKey: "purchase.games.lotto649.hint",
    defaultModeId: "standard",
    pools: [
      {
        id: "main",
        labelKey: "purchase.games.lotto649.pools.main",
        start: 1,
        end: 49,
        padTo: 2,
      },
    ],
    modes: [
      {
        id: "standard",
        labelKey: "purchase.games.lotto649.modes.standard.label",
        helperKey: "purchase.games.lotto649.modes.standard.helper",
        poolRequirements: {
          main: { min: 6, max: 6 },
        },
        errorKeys: {
          main: "purchase.games.lotto649.modes.standard.error.main",
        },
      },
      {
        id: "combo7",
        labelKey: "purchase.games.lotto649.modes.combo7.label",
        helperKey: "purchase.games.lotto649.modes.combo7.helper",
        poolRequirements: {
          main: { min: 7, max: 7 },
        },
        errorKeys: {
          main: "purchase.games.lotto649.modes.combo7.error.main",
        },
      },
      {
        id: "combo8",
        labelKey: "purchase.games.lotto649.modes.combo8.label",
        helperKey: "purchase.games.lotto649.modes.combo8.helper",
        poolRequirements: {
          main: { min: 8, max: 8 },
        },
        errorKeys: {
          main: "purchase.games.lotto649.modes.combo8.error.main",
        },
      },
      {
        id: "combo9",
        labelKey: "purchase.games.lotto649.modes.combo9.label",
        helperKey: "purchase.games.lotto649.modes.combo9.helper",
        poolRequirements: {
          main: { min: 9, max: 9 },
        },
        errorKeys: {
          main: "purchase.games.lotto649.modes.combo9.error.main",
        },
      },
    ],
  },
  {
    id: "ontario49",
    ticketPrefix: "O49",
    nameKey: "purchase.games.ontario49.name",
    descriptionKey: "purchase.games.ontario49.description",
    hintKey: "purchase.games.ontario49.hint",
    defaultModeId: "standard",
    pools: [
      {
        id: "main",
        labelKey: "purchase.games.ontario49.pools.main",
        start: 1,
        end: 49,
        padTo: 2,
      },
    ],
    modes: [
      {
        id: "standard",
        labelKey: "purchase.games.ontario49.modes.standard.label",
        helperKey: "purchase.games.ontario49.modes.standard.helper",
        poolRequirements: {
          main: { min: 6, max: 6 },
        },
        errorKeys: {
          main: "purchase.games.ontario49.modes.standard.error.main",
        },
      },
      {
        id: "combo7",
        labelKey: "purchase.games.ontario49.modes.combo7.label",
        helperKey: "purchase.games.ontario49.modes.combo7.helper",
        poolRequirements: {
          main: { min: 7, max: 7 },
        },
        errorKeys: {
          main: "purchase.games.ontario49.modes.combo7.error.main",
        },
      },
    ],
  },
  {
    id: "dailyGrand",
    ticketPrefix: "DG",
    nameKey: "purchase.games.dailyGrand.name",
    descriptionKey: "purchase.games.dailyGrand.description",
    hintKey: "purchase.games.dailyGrand.hint",
    defaultModeId: "standard",
    pools: [
      {
        id: "main",
        labelKey: "purchase.games.dailyGrand.pools.main",
        start: 1,
        end: 49,
        padTo: 2,
      },
      {
        id: "grand",
        labelKey: "purchase.games.dailyGrand.pools.grand",
        start: 1,
        end: 7,
        padTo: 1,
      },
    ],
    modes: [
      {
        id: "standard",
        labelKey: "purchase.games.dailyGrand.modes.standard.label",
        helperKey: "purchase.games.dailyGrand.modes.standard.helper",
        poolRequirements: {
          main: { min: 5, max: 5 },
          grand: { min: 1, max: 1 },
        },
        errorKeys: {
          main: "purchase.games.dailyGrand.modes.standard.error.main",
          grand: "purchase.games.dailyGrand.modes.standard.error.grand",
        },
      },
    ],
  },
  {
    id: "lightningLotto",
    ticketPrefix: "LL",
    nameKey: "purchase.games.lightningLotto.name",
    descriptionKey: "purchase.games.lightningLotto.description",
    hintKey: "purchase.games.lightningLotto.hint",
    defaultModeId: "standard",
    pools: [
      {
        id: "main",
        labelKey: "purchase.games.lightningLotto.pools.main",
        start: 1,
        end: 49,
        padTo: 2,
      },
    ],
    modes: [
      {
        id: "standard",
        labelKey: "purchase.games.lightningLotto.modes.standard.label",
        helperKey: "purchase.games.lightningLotto.modes.standard.helper",
        poolRequirements: {
          main: { min: 5, max: 5 },
        },
        errorKeys: {
          main: "purchase.games.lightningLotto.modes.standard.error.main",
        },
      },
    ],
  },
  {
    id: "lottario",
    ticketPrefix: "LTR",
    nameKey: "purchase.games.lottario.name",
    descriptionKey: "purchase.games.lottario.description",
    hintKey: "purchase.games.lottario.hint",
    defaultModeId: "standard",
    pools: [
      {
        id: "main",
        labelKey: "purchase.games.lottario.pools.main",
        start: 1,
        end: 45,
        padTo: 2,
      },
    ],
    modes: [
      {
        id: "standard",
        labelKey: "purchase.games.lottario.modes.standard.label",
        helperKey: "purchase.games.lottario.modes.standard.helper",
        poolRequirements: {
          main: { min: 6, max: 6 },
        },
        errorKeys: {
          main: "purchase.games.lottario.modes.standard.error.main",
        },
      },
      {
        id: "combo7",
        labelKey: "purchase.games.lottario.modes.combo7.label",
        helperKey: "purchase.games.lottario.modes.combo7.helper",
        poolRequirements: {
          main: { min: 7, max: 7 },
        },
        errorKeys: {
          main: "purchase.games.lottario.modes.combo7.error.main",
        },
      },
    ],
  },
  {
    id: "dailyKeno",
    ticketPrefix: "DK",
    nameKey: "purchase.games.dailyKeno.name",
    descriptionKey: "purchase.games.dailyKeno.description",
    hintKey: "purchase.games.dailyKeno.hint",
    defaultModeId: "spot10",
    pools: [
      {
        id: "main",
        labelKey: "purchase.games.dailyKeno.pools.main",
        start: 1,
        end: 70,
        padTo: 2,
      },
    ],
    modes: [
      ...Array.from({ length: 9 }, (_, index) => {
        const size = index + 2;
        const id = `spot${size}` as const;
        return {
          id,
          labelKey: `purchase.games.dailyKeno.modes.${id}.label`,
          helperKey: `purchase.games.dailyKeno.modes.${id}.helper`,
          poolRequirements: {
            main: { min: size, max: size },
          },
          errorKeys: {
            main: `purchase.games.dailyKeno.modes.${id}.error.main`,
          },
        } satisfies LotteryModeDefinition;
      }),
    ],
  },
  {
    id: "pick4",
    ticketPrefix: "P4",
    nameKey: "purchase.games.pick4.name",
    descriptionKey: "purchase.games.pick4.description",
    hintKey: "purchase.games.pick4.hint",
    defaultModeId: "standard",
    pools: [
      {
        id: "digits",
        labelKey: "purchase.games.pick4.pools.digits",
        start: 0,
        end: 9,
        padTo: 1,
      },
    ],
    modes: [
      {
        id: "standard",
        labelKey: "purchase.games.pick4.modes.standard.label",
        helperKey: "purchase.games.pick4.modes.standard.helper",
        poolRequirements: {
          digits: { min: 4, max: 4 },
        },
        errorKeys: {
          digits: "purchase.games.pick4.modes.standard.error.digits",
        },
      },
    ],
  },
  {
    id: "pick3",
    ticketPrefix: "P3",
    nameKey: "purchase.games.pick3.name",
    descriptionKey: "purchase.games.pick3.description",
    hintKey: "purchase.games.pick3.hint",
    defaultModeId: "standard",
    pools: [
      {
        id: "digits",
        labelKey: "purchase.games.pick3.pools.digits",
        start: 0,
        end: 9,
        padTo: 1,
      },
    ],
    modes: [
      {
        id: "standard",
        labelKey: "purchase.games.pick3.modes.standard.label",
        helperKey: "purchase.games.pick3.modes.standard.helper",
        poolRequirements: {
          digits: { min: 3, max: 3 },
        },
        errorKeys: {
          digits: "purchase.games.pick3.modes.standard.error.digits",
        },
      },
    ],
  },
];

export const LOTTERY_GAME_MAP = Object.fromEntries(
  LOTTERY_GAMES.map((game) => [game.id, game])
);

export type LotteryGameId = (typeof LOTTERY_GAMES)[number]["id"];
