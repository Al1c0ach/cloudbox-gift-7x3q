/* =========================================================
   云朵抽盒社 · Cloud Box Club
   A private little blind-box machine. No build step, no APIs.
   ========================================================= */

(() => {
  "use strict";

  const CONFIG = Object.freeze({
    dailyChances: 5,
    boxCount: 10,
    hiddenChance: 0.05,
    timeZone: "Asia/Shanghai",
    storageKey: "cloudbox.gift.v1",
    openingDuration: 1680,
    reducedOpeningDuration: 120,
  });

  const BOX_COLORS = [
    { box: "#d9c9e8", lid: "#eee3f6", ribbon: "#b49ccd", ink: "#5a4769" },
    { box: "#f0cfcc", lid: "#fbe5e1", ribbon: "#d3a29f", ink: "#694b4c" },
    { box: "#d7e2cd", lid: "#ebf1e0", ribbon: "#a7b991", ink: "#4e5b41" },
    { box: "#d2deea", lid: "#e8f0f6", ribbon: "#9db3c8", ink: "#435365" },
    { box: "#ebdcbe", lid: "#f7ecda", ribbon: "#c9af87", ink: "#615037" },
    { box: "#e4d3e9", lid: "#f5eaf7", ribbon: "#c0a6c9", ink: "#5f4b68" },
    { box: "#f3d7d2", lid: "#fbeae6", ribbon: "#d9aaa4", ink: "#6b4b4a" },
    { box: "#cee1d8", lid: "#e9f2ed", ribbon: "#9ebcaf", ink: "#445c50" },
    { box: "#d6e2ee", lid: "#edf3f9", ribbon: "#a6b9cf", ink: "#455669" },
    { box: "#f1e6c9", lid: "#faf2e1", ribbon: "#cfb98b", ink: "#62543a" },
  ];

  // A case holds ten boxes and no empty boxes. Exactly two boxes contain DIMOO
  // products selected randomly from DIMOO_STYLES; the other eight boxes contain
  // the fixed OTHER_STYLES line-up. Every case is shuffled before play.
  // DIMOO result photos are official product reference images, used only as a
  // private visual index; the app itself is a fan-made gift and sells nothing.
  const DIMOO_STYLES = [
    {
      id: "packed-spring",
      no: "01",
      name: "打包春天",
      en: "PACKED WITH SPRING",
      ip: "DIMOO",
      seriesLabel: "瞬间的奇遇系列",
      seriesShort: "瞬间的奇遇",
      redeemable: true,
      quote: "把一整个春天，打包送给你。",
      prop: "cloud",
      palette: {
        hair: "#d9cdec",
        hairDeep: "#baa9d7",
        outfit: "#a99acd",
        outfitDeep: "#8d7bb4",
        accent: "#efd8a6",
        cardA: "#eee5f5",
        cardB: "#ddcfec",
      },
    },
    {
      id: "blossom",
      no: "02",
      name: "吹一口花香",
      en: "A BREATH OF BLOSSOMS",
      ip: "DIMOO",
      seriesLabel: "瞬间的奇遇系列",
      seriesShort: "瞬间的奇遇",
      redeemable: true,
      quote: "今天路过春天，替你带了一朵花。",
      prop: "flower",
      palette: {
        hair: "#f0d0d4",
        hairDeep: "#dbb0b7",
        outfit: "#d6a2a8",
        outfitDeep: "#b9848d",
        accent: "#f5e4a7",
        cardA: "#f8e8e8",
        cardB: "#eed4d8",
      },
    },
    {
      id: "flying-spring",
      no: "03",
      name: "飞过春天",
      en: "FLYING THROUGH SPRING",
      ip: "DIMOO",
      seriesLabel: "瞬间的奇遇系列",
      seriesShort: "瞬间的奇遇",
      redeemable: true,
      quote: "飞过春天，也飞向你。",
      prop: "paper",
      palette: {
        hair: "#d1e0d4",
        hairDeep: "#b2c8b9",
        outfit: "#93b7a6",
        outfitDeep: "#759a8a",
        accent: "#f3e4c6",
        cardA: "#eaf1e8",
        cardB: "#d7e6dc",
      },
    },
    {
      id: "spring-overhead",
      no: "04",
      name: "头顶春天",
      en: "SPRING OVERHEAD",
      ip: "DIMOO",
      seriesLabel: "瞬间的奇遇系列",
      seriesShort: "瞬间的奇遇",
      redeemable: true,
      quote: "把春天顶在头上，走到哪里都是花期。",
      prop: "sunset",
      palette: {
        hair: "#f1d2b4",
        hairDeep: "#dbb18d",
        outfit: "#d89a76",
        outfitDeep: "#bb7b5a",
        accent: "#f5c86e",
        cardA: "#f8eadc",
        cardB: "#eed4bd",
      },
    },
    {
      id: "sleepy-bunny",
      no: "05",
      name: "哄睡兔宝",
      en: "SLEEPING BUNNY",
      ip: "DIMOO",
      seriesLabel: "动物王国系列",
      seriesShort: "动物王国",
      redeemable: true,
      quote: "晚安，明天再一起玩。",
      prop: "rabbit",
      palette: {
        hair: "#ead9da",
        hairDeep: "#d2babd",
        outfit: "#b7c7d8",
        outfitDeep: "#93a8bd",
        accent: "#f4dfc0",
        cardA: "#f4edef",
        cardB: "#e2d6de",
      },
    },
    {
      id: "duck-leader",
      no: "06",
      name: "小鸭领队",
      en: "DUCKLING LEADER",
      ip: "DIMOO",
      seriesLabel: "动物王国系列",
      seriesShort: "动物王国",
      redeemable: true,
      quote: "排好队，春天要出发啦。",
      prop: "duck",
      palette: {
        hair: "#f2e5c8",
        hairDeep: "#d8c59b",
        outfit: "#ddc06f",
        outfitDeep: "#b99a4f",
        accent: "#e89a64",
        cardA: "#faf0d9",
        cardB: "#efdfb8",
      },
    },
    {
      id: "light-up",
      no: "07",
      name: "为你点灯",
      en: "LIGHT UP",
      ip: "DIMOO",
      seriesLabel: "在你身边系列",
      seriesShort: "在你身边",
      redeemable: true,
      quote: "天黑了也没关系，我为你留一盏灯。",
      prop: "lantern",
      palette: {
        hair: "#cdd9d2",
        hairDeep: "#aebfb5",
        outfit: "#789487",
        outfitDeep: "#5c7a6c",
        accent: "#e8c17c",
        cardA: "#eaf1ec",
        cardB: "#d6e3da",
      },
    },
    {
      id: "candy-for-you",
      no: "08",
      name: "送你糖果",
      en: "CANDY FOR YOU",
      ip: "DIMOO",
      seriesLabel: "在你身边系列",
      seriesShort: "在你身边",
      redeemable: true,
      quote: "今天的甜，先给你。",
      prop: "candy",
      palette: {
        hair: "#ecd2de",
        hairDeep: "#d5afc0",
        outfit: "#d4a0b9",
        outfitDeep: "#b67c97",
        accent: "#f1d89b",
        cardA: "#f8e9f0",
        cardB: "#eed8e3",
      },
    },
  ];

  DIMOO_STYLES.push(
    {
      id: "hugging-spring",
      no: "09",
      name: "抱紧春天",
      en: "HUGGING SPRING",
      ip: "DIMOO",
      seriesLabel: "瞬间的奇遇系列",
      seriesShort: "瞬间的奇遇",
      redeemable: true,
      quote: "把整个春天，抱进怀里。",
      prop: "flower",
      palette: {
        hair: "#f3d6dc",
        hairDeep: "#d9b0bb",
        outfit: "#c9b8d9",
        outfitDeep: "#a997bd",
        accent: "#f4d98d",
        cardA: "#fbeff4",
        cardB: "#ecd9e5",
      },
    },
    {
      id: "spring-recoil",
      no: "10",
      name: "春天的后坐力",
      en: "SPRING RECOIL",
      ip: "DIMOO",
      seriesLabel: "瞬间的奇遇系列",
      seriesShort: "瞬间的奇遇",
      redeemable: true,
      quote: "被春天推了一下，就飞起来了。",
      prop: "sunset",
      palette: {
        hair: "#c9e3df",
        hairDeep: "#9fc7c2",
        outfit: "#8fbfc0",
        outfitDeep: "#6fa2a5",
        accent: "#f3c778",
        cardA: "#eaf7f4",
        cardB: "#d5ece7",
      },
    },
    {
      id: "caught-by-spring",
      no: "11",
      name: "被春天接住",
      en: "CAUGHT BY SPRING",
      ip: "DIMOO",
      seriesLabel: "瞬间的奇遇系列",
      seriesShort: "瞬间的奇遇",
      redeemable: true,
      quote: "别怕落下，春天会接住你。",
      prop: "flower",
      palette: {
        hair: "#e8dfc3",
        hairDeep: "#cabf9c",
        outfit: "#a9c2a0",
        outfitDeep: "#86a47e",
        accent: "#f5e1a7",
        cardA: "#f1f7e8",
        cardB: "#dfeccf",
      },
    },
    {
      id: "boot",
      no: "12",
      name: "它住在靴子里",
      en: "IT LIVES IN MY BOOT!",
      ip: "DIMOO",
      seriesLabel: "瞬间的奇遇系列",
      seriesShort: "瞬间的奇遇",
      redeemable: true,
      quote: "把春天藏在靴子里，走很远的路。",
      prop: "bear",
      palette: {
        hair: "#efd9a7",
        hairDeep: "#d2b879",
        outfit: "#b8c98c",
        outfitDeep: "#95aa69",
        accent: "#e4b45f",
        cardA: "#fbf5df",
        cardB: "#ece1bb",
      },
    },
    {
      id: "catching-spring",
      no: "13",
      name: "捕捉春天",
      en: "CATCHING SPRING",
      ip: "DIMOO",
      seriesLabel: "瞬间的奇遇系列",
      seriesShort: "瞬间的奇遇",
      redeemable: true,
      quote: "轻轻一网，抓住春天的翅膀。",
      prop: "paper",
      palette: {
        hair: "#f0d8a9",
        hairDeep: "#d3b77f",
        outfit: "#c9c27d",
        outfitDeep: "#a8a05e",
        accent: "#e9c46a",
        cardA: "#fbf4dc",
        cardB: "#eee0b0",
      },
    },
    {
      id: "take-me-to-spring",
      no: "14",
      name: "带我去远方",
      en: "TAKE ME TO SPRING",
      ip: "DIMOO",
      seriesLabel: "瞬间的奇遇系列",
      seriesShort: "瞬间的奇遇",
      redeemable: true,
      quote: "带着春天，去更远的地方。",
      prop: "paper",
      palette: {
        hair: "#c9d9ec",
        hairDeep: "#a4b8d2",
        outfit: "#a9b9d4",
        outfitDeep: "#8798b7",
        accent: "#f0d39a",
        cardA: "#edf4fb",
        cardB: "#d9e4f2",
      },
    },
    {
      id: "spring-trumpet",
      no: "15",
      name: "吹响春天",
      en: "SPRING'S TRUMPET",
      ip: "DIMOO",
      seriesLabel: "瞬间的奇遇系列",
      seriesShort: "瞬间的奇遇",
      redeemable: true,
      quote: "吹响一朵喇叭花，春天就醒了。",
      prop: "flower",
      palette: {
        hair: "#efcdd5",
        hairDeep: "#d2aab5",
        outfit: "#c7a9cf",
        outfitDeep: "#a98bb4",
        accent: "#f4d27a",
        cardA: "#fceff3",
        cardB: "#eed8e5",
      },
    },
    {
      id: "falling-into-flowers",
      no: "16",
      name: "坠入花海",
      en: "FALLING INTO FLOWERS",
      ip: "DIMOO",
      seriesLabel: "瞬间的奇遇系列",
      seriesShort: "瞬间的奇遇",
      redeemable: true,
      quote: "坠入花海，被春天温柔包围。",
      prop: "flower",
      palette: {
        hair: "#e7c9d8",
        hairDeep: "#cba5b8",
        outfit: "#c7a3ba",
        outfitDeep: "#a77f96",
        accent: "#f2d59b",
        cardA: "#fbeff7",
        cardB: "#ecd7e7",
      },
    }
  );

  const HIDDEN_DIMOO_STYLE = {
    id: "spring-lights-up",
    no: "H1",
    name: "春天亮起来",
    en: "SPRING LIGHTS UP",
    ip: "DIMOO",
    seriesLabel: "瞬间的奇遇系列",
    seriesShort: "瞬间的奇遇 · 隐藏",
    hidden: true,
    redeemable: true,
    quote: "春天亮起来的时候，所有云都变成了金色。",
    prop: "aurora",
    palette: {
      hair: "#f3e2bd",
      hairDeep: "#ddc18a",
      outfit: "#e9d2a1",
      outfitDeep: "#c7a766",
      accent: "#d9aa52",
      cardA: "#fbf0d7",
      cardB: "#ecd5a8",
    },
  };

  const OTHER_STYLES = [
    {
      id: "molly-classic",
      no: "09",
      name: "花花世界",
      en: "WORLD OF BLOOMS",
      ip: "MOLLY",
      seriesLabel: "20 周年系列·沿途的风景",
      seriesShort: "20 周年·沿途的风景",
      redeemable: false,
      quote: "不是 DIMOO。不过花开得正好，也值得被看见。",
      label: "MOLLY",
      sublabel: "20TH ANNIVERSARY",
      palette: {
        box: "#e8c9d2",
        lid: "#f7e4e9",
        ribbon: "#c798a5",
        ink: "#6a4954",
        labelInk: "#6a4954",
        accent: "#e4bf79",
        cardA: "#f8e8ed",
        cardB: "#eed4dc",
        halo: "#f1d6de",
      },
    },
    {
      id: "molly-little-moon",
      no: "10",
      name: "月球小星星",
      en: "LITTLE MOON",
      ip: "MOLLY",
      seriesLabel: "周年雕塑经典回归系列",
      seriesShort: "周年雕塑经典回归",
      redeemable: false,
      quote: "不着急，月亮也在慢慢变圆。",
      label: "MOLLY",
      sublabel: "ANNIVERSARY STATUES",
      palette: {
        box: "#d8d5e8",
        lid: "#efecf7",
        ribbon: "#b8b2d1",
        ink: "#4d4765",
        labelInk: "#4d4765",
        accent: "#e6c77e",
        cardA: "#f0edf7",
        cardB: "#e2dcee",
        halo: "#e9e2f3",
      },
    },
    {
      id: "skullpanda-warmth",
      no: "11",
      name: "下雨天",
      en: "THE RAINING DAY",
      ip: "SKULLPANDA",
      seriesLabel: "温度系列",
      seriesShort: "温度系列",
      redeemable: false,
      quote: "下雨天也有它的浪漫。按约定，这一只只收藏。",
      label: "SKULLPANDA",
      sublabel: "THE WARMTH",
      palette: {
        box: "#685873",
        lid: "#8a7592",
        ribbon: "#d8c1dd",
        ink: "#fff8f0",
        labelInk: "#4c3c56",
        accent: "#c9a5c7",
        cardA: "#e9e0ec",
        cardB: "#d6c7dd",
        halo: "#d9c8e2",
      },
    },
    {
      id: "skullpanda-day-off",
      no: "12",
      name: "放轻松",
      en: "THE DAY OFF",
      ip: "SKULLPANDA",
      seriesLabel: "温度系列",
      seriesShort: "温度系列",
      redeemable: false,
      quote: "今天不赶路，坐着发一会儿呆。",
      label: "SKULLPANDA",
      sublabel: "THE WARMTH",
      palette: {
        box: "#c3cec5",
        lid: "#e8eee7",
        ribbon: "#a2b2a6",
        ink: "#435147",
        labelInk: "#435147",
        accent: "#d8ba82",
        cardA: "#eaf0e9",
        cardB: "#d8e3da",
        halo: "#e1eae2",
      },
    },
    {
      id: "crybaby-bunny",
      no: "13",
      name: "哭哭兔",
      en: "ALL MY LOVE",
      ip: "CRYBABY",
      seriesLabel: "Crying Again 系列",
      seriesShort: "Crying Again",
      redeemable: false,
      quote: "今天不哭，把眼泪留给值得的事。",
      label: "CRYBABY",
      sublabel: "CRYING AGAIN",
      palette: {
        box: "#d6dbe9",
        lid: "#edf0f8",
        ribbon: "#b0b9d2",
        ink: "#4a4e65",
        labelInk: "#4a4e65",
        accent: "#e6c0c8",
        cardA: "#eff2f8",
        cardB: "#dfe4ef",
        halo: "#e7eaf4",
      },
    },
    {
      id: "crybaby-bear",
      no: "14",
      name: "哭哭熊",
      en: "LOVE MAKE US CRY",
      ip: "CRYBABY",
      seriesLabel: "Crying Again 系列",
      seriesShort: "Crying Again",
      redeemable: false,
      quote: "抱一下，眼泪就变甜了。",
      label: "CRYBABY",
      sublabel: "CRYING AGAIN",
      palette: {
        box: "#e6ced5",
        lid: "#f6e7ec",
        ribbon: "#cda6b2",
        ink: "#5b4550",
        labelInk: "#5b4550",
        accent: "#dfc081",
        cardA: "#f7e9ee",
        cardB: "#ecd5dd",
        halo: "#f0dce3",
      },
    },
    {
      id: "crybaby-stolen-heart",
      no: "15",
      name: "偷心大盗",
      en: "STOLEN HEART",
      ip: "CRYBABY",
      seriesLabel: "Crying For Love 系列",
      seriesShort: "Crying For Love",
      redeemable: false,
      quote: "心被偷走了，还笑着说谢谢。",
      label: "CRYBABY",
      sublabel: "CRYING FOR LOVE",
      palette: {
        box: "#b97583",
        lid: "#e9c7cc",
        ribbon: "#8d4b58",
        ink: "#fff8f1",
        labelInk: "#63333c",
        accent: "#e9c47f",
        cardA: "#f2e0e4",
        cardB: "#e3c7ce",
        halo: "#e8cbd2",
      },
    },
    {
      id: "crybaby-rose",
      no: "16",
      name: "等爱的玫瑰红",
      en: "CLASSIC ROSE",
      ip: "CRYBABY",
      seriesLabel: "Crying For Love 系列",
      seriesShort: "Crying For Love",
      redeemable: false,
      quote: "等一朵玫瑰，也等一句喜欢你。",
      label: "CRYBABY",
      sublabel: "CRYING FOR LOVE",
      palette: {
        box: "#c98a92",
        lid: "#f0d8d9",
        ribbon: "#a45f69",
        ink: "#5a3b41",
        labelInk: "#5a3b41",
        accent: "#e5c48d",
        cardA: "#f6e7e7",
        cardB: "#e8d0d1",
        halo: "#f0dada",
      },
    },
  ];

  const DIMOO_IMAGES = {
    "packed-spring": "./assets/dimoo/packed-spring.webp",
    blossom: "./assets/dimoo/blossom.webp",
    "flying-spring": "./assets/dimoo/flying-spring.webp",
    "spring-overhead": "./assets/dimoo/spring-overhead.webp",
    "hugging-spring": "./assets/dimoo/hugging-spring.webp",
    "spring-recoil": "./assets/dimoo/spring-recoil.webp",
    "caught-by-spring": "./assets/dimoo/caught-by-spring.webp",
    boot: "./assets/dimoo/boot.webp",
    "catching-spring": "./assets/dimoo/catching-spring.webp",
    "take-me-to-spring": "./assets/dimoo/take-me-to-spring.webp",
    "spring-trumpet": "./assets/dimoo/spring-trumpet.webp",
    "falling-into-flowers": "./assets/dimoo/falling-into-flowers.webp",
    "sleepy-bunny": "./assets/dimoo/sleepy-bunny.webp",
    "duck-leader": "./assets/dimoo/duck-leader.webp",
    "light-up": "./assets/dimoo/light-up.webp",
    "candy-for-you": "./assets/dimoo/candy-for-you.webp",
    "spring-lights-up": "./assets/dimoo/spring-lights-up.webp",
  };

  for (const style of [...DIMOO_STYLES, HIDDEN_DIMOO_STYLE]) {
    if (DIMOO_IMAGES[style.id]) style.image = DIMOO_IMAGES[style.id];
  }

  const STYLES = [...DIMOO_STYLES, HIDDEN_DIMOO_STYLE, ...OTHER_STYLES];

  const DIALOG_OPEN_CLASS = "modal-open";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const els = {
    chanceNum: $("#chanceNum"),
    countdown: $("#countdown"),
    capsuleRow: $("#capsuleRow"),
    boxGrid: $("#boxGrid"),
    drawButton: $("#drawButton"),
    drawButtonLabel: $("#drawButtonLabel"),
    drawButtonSub: $("#drawButtonSub"),
    drawNote: $("#drawNote"),
    shelfProgress: $("#shelfProgress"),
    reshuffleButton: $("#reshuffleButton"),
    hintCard: $("#hintCard"),
    hintEyebrow: $("#hintEyebrow"),
    hintCounter: $("#hintCounter"),
    hintSlips: $("#hintSlips"),
    hintButton: $("#hintButton"),
    hintButtonLabel: $("#hintButtonLabel"),
    hintButtonSub: $("#hintButtonSub"),
    hintBadge: $("#hintBadge"),
    albumBadge: $("#albumBadge"),
    albumFeatureMeta: $("#albumFeatureMeta"),
    soundButton: $("#soundButton"),
    openAlbumButton: $("#openAlbumButton"),
    albumFeature: $("#albumFeature"),
    oddsFeature: $("#oddsFeature"),
    drawDialog: $("#drawDialog"),
    drawViewport: $("#drawViewport"),
    drawCard: $("#drawCard"),
    fxLayer: $("#fxLayer"),
    albumDialog: $("#albumDialog"),
    oddsDialog: $("#oddsDialog"),
    collectionGrid: $("#collectionGrid"),
    statDimoo: $("#statDimoo"),
    statOther: $("#statOther"),
    statDraws: $("#statDraws"),
    machineRoster: $("#machineRoster"),
    liveRegion: $("#liveRegion"),
    toast: $("#toast"),
  };

  let state = null;
  let selectedBox = 0;
  let isDrawing = false;
  let isRevealed = false;
  let isHinting = false;
  let currentRecord = null;
  let revealTimer = null;
  let hintTimer = null;
  let fxClearTimer = null;
  let toastTimer = null;
  let pendingCaseToast = false;
  let storageAvailable = true;
  let audioContext = null;
  let lastDayCheck = "";

  /* -------------------------------------------------------
     Small utilities
     ------------------------------------------------------- */

  const randomUnit = () => {
    try {
      const values = new Uint32Array(1);
      crypto.getRandomValues(values);
      return values[0] / 4294967296;
    } catch {
      return Math.random();
    }
  };

  const randomInt = (max) => Math.min(max - 1, Math.floor(randomUnit() * max));

  const shuffle = (list) => {
    const result = [...list];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = randomInt(index + 1);
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  };

  const pad = (value) => String(value).padStart(2, "0");

  const formatDateKey = (date = new Date()) => {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: CONFIG.timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(date);
      const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
      return `${map.year}-${map.month}-${map.day}`;
    } catch {
      const shifted = new Date(date.getTime() + 8 * 60 * 60 * 1000);
      return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}`;
    }
  };

  const millisecondsUntilReset = () => {
    // China Standard Time has no daylight saving time, so a fixed +08:00 shift
    // gives the local wall clock and the next local midnight reliably.
    const now = Date.now();
    const shanghaiWallClock = new Date(now + 8 * 60 * 60 * 1000);
    const nextMidnight = Date.UTC(
      shanghaiWallClock.getUTCFullYear(),
      shanghaiWallClock.getUTCMonth(),
      shanghaiWallClock.getUTCDate() + 1
    );
    return Math.max(0, nextMidnight - shanghaiWallClock.getTime());
  };

  const getRemaining = () => Math.max(0, CONFIG.dailyChances - state.dayDraws.length);

  const getOwnedStyleIds = () => STYLES.filter((style) => (state.collection[style.id] || 0) > 0);

  const getOwnedDimooIds = () => getOwnedStyleIds().filter((style) => style.redeemable);

  const getOwnedOtherIds = () => getOwnedStyleIds().filter((style) => !style.redeemable);

  const getStyleById = (id) => STYLES.find((style) => style.id === id) || null;

  /* -------------------------------------------------------
     Persistence
     ------------------------------------------------------- */

  const makeCaseItems = (previousItems = null) => {
    // Every batch has exactly two DIMOO. With CONFIG.hiddenChance the batch
    // contains one hidden DIMOO plus one normal DIMOO; otherwise it has two
    // normal DIMOO. The eight other-IP products stay fixed, but all ten box
    // positions are shuffled again. When a previous batch is supplied, the
    // DIMOO pair is regenerated until it differs from that batch, so switching
    // batches never repeats the same DIMOO combination.
    const build = () => {
      const dimooPicks = [];
      if (randomUnit() < CONFIG.hiddenChance) {
        dimooPicks.push(HIDDEN_DIMOO_STYLE.id);
        dimooPicks.push(shuffle(DIMOO_STYLES)[0].id);
      } else {
        dimooPicks.push(...shuffle(DIMOO_STYLES).slice(0, 2).map((style) => style.id));
      }
      const otherPicks = OTHER_STYLES.map((style) => style.id);
      return shuffle([...dimooPicks, ...otherPicks]);
    };

    const dimooKey = (list) =>
      list
        .map((id) => getStyleById(id))
        .filter((style) => style && style.ip === "DIMOO")
        .map((style) => style.id)
        .sort()
        .join("|");

    let next = build();
    if (previousItems && previousItems.length) {
      const previousKey = dimooKey(previousItems);
      for (let attempt = 0; attempt < 30 && dimooKey(next) === previousKey; attempt += 1) {
        next = build();
      }
    }
    return next;
  };

  const makeHints = () =>
    Array.from({ length: CONFIG.boxCount }, () => []);

  const makeDefaultState = () => ({
    version: 3,
    day: formatDateKey(),
    dayDraws: [],
    collection: {},
    stats: { draws: 0, prizes: 0 },
    items: makeCaseItems(),
    hints: makeHints(),
    caseOpened: [],
    lastBox: 0,
    sound: true,
  });

  const normaliseCollection = (candidate) => {
    const collection = {};
    if (candidate && typeof candidate === "object") {
      for (const style of STYLES) {
        const count = Number(candidate[style.id]);
        if (Number.isFinite(count) && count > 0) collection[style.id] = Math.floor(count);
      }
    }
    return collection;
  };

  const normaliseStats = (candidate) => {
    const source = candidate && typeof candidate === "object" ? candidate : {};
    return {
      draws: Math.max(0, Math.floor(Number(source.draws) || 0)),
      prizes: Math.max(0, Math.floor(Number(source.prizes) || 0)),
    };
  };

  const sanitiseState = (candidate) => {
    const fallback = makeDefaultState();
    if (!candidate || typeof candidate !== "object") return fallback;

    // Version 1/2 had empty boxes and a different catalogue. Keep the
    // permanent collection/stats, but start a fresh ten-product case.
    if (candidate.version !== 3) {
      return {
        ...fallback,
        collection: normaliseCollection(candidate.collection),
        stats: normaliseStats(candidate.stats),
        sound: candidate.sound !== false,
      };
    }

    const seenBoxes = new Set();
    const dayDraws = Array.isArray(candidate.dayDraws)
      ? candidate.dayDraws
          .filter((record) => {
            if (
              !record ||
              !Number.isInteger(record.box) ||
              record.box < 0 ||
              record.box >= CONFIG.boxCount
            ) {
              return false;
            }
            if (seenBoxes.has(record.box)) return false;
            seenBoxes.add(record.box);
            return true;
          })
          .slice(0, CONFIG.dailyChances)
          .map((record) => ({
            box: record.box,
            styleId: typeof record.styleId === "string" ? record.styleId : null,
            at: Number(record.at) || Date.now(),
          }))
      : [];

    const collection = normaliseCollection(candidate.collection);
    const stats = normaliseStats(candidate.stats);

    const savedItems = Array.isArray(candidate.items) ? candidate.items : [];
    const items = savedItems.map((id) => getStyleById(id));
    const itemsValid =
      savedItems.length === CONFIG.boxCount &&
      items.every(Boolean) &&
      new Set(savedItems).size === CONFIG.boxCount &&
      items.filter((style) => style.ip === "DIMOO").length === 2 &&
      items.filter((style) => style.ip !== "DIMOO").length === 8 &&
      items.filter((style) => style.hidden).length <= 1;

    let caseItems = itemsValid ? [...savedItems] : makeCaseItems();
    let caseOpened = [];
    let hints = makeHints();

    if (itemsValid) {
      const savedOpened = Array.isArray(candidate.caseOpened) ? candidate.caseOpened : [];
      caseOpened = [...new Set(
        savedOpened.filter(
          (box) => Number.isInteger(box) && box >= 0 && box < CONFIG.boxCount
        )
      )];

      const savedHints = Array.isArray(candidate.hints) ? candidate.hints : [];
      const caseIdSet = new Set(caseItems);
      hints = Array.from({ length: CONFIG.boxCount }, (_, index) => {
        const list = Array.isArray(savedHints[index]) ? savedHints[index] : [];
        const itemStyleId = caseItems[index];
        const cleaned = [];
        for (const id of list) {
          if (caseIdSet.has(id) && id !== itemStyleId && !cleaned.includes(id)) cleaned.push(id);
        }
        return cleaned.slice(0, 2);
      });
    }

    // A completed case starts over cleanly.
    if (caseOpened.length >= CONFIG.boxCount) {
      caseItems = makeCaseItems(caseItems);
      hints = makeHints();
      caseOpened = [];
    }

    return {
      version: 3,
      day: typeof candidate.day === "string" ? candidate.day : fallback.day,
      dayDraws,
      collection,
      stats,
      items: caseItems,
      hints,
      caseOpened,
      lastBox:
        Number.isInteger(candidate.lastBox) &&
        candidate.lastBox >= 0 &&
        candidate.lastBox < CONFIG.boxCount
          ? candidate.lastBox
          : 0,
      sound: candidate.sound !== false,
    };
  };

  const loadState = () => {
    try {
      const stored = localStorage.getItem(CONFIG.storageKey);
      if (!stored) return makeDefaultState();
      return sanitiseState(JSON.parse(stored));
    } catch {
      storageAvailable = false;
      return makeDefaultState();
    }
  };

  const saveState = () => {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
    } catch {
      storageAvailable = false;
    }
  };

  /* -------------------------------------------------------
     Artwork
     ------------------------------------------------------- */

  const cloudIconMarkup = (className = "") =>
    `<svg class="${className}" viewBox="0 0 32 24" aria-hidden="true" focusable="false"><use href="#i-cloud"></use></svg>`;

  const starMarkup = (className = "") =>
    `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-spark"></use></svg>`;

  const characterSVG = (style, instance = "art") => {
    const p = style.palette;
    const uid = `${style.id}-${instance}`.replace(/[^a-zA-Z0-9_-]/g, "");
    const bodyGradient = `body-${uid}`;
    const skinGradient = `skin-${uid}`;
    const hairGradient = `hair-${uid}`;

    const propBackdrops = {
      cloud: `
        <g opacity=".9">
          <path d="M40 79h38c7 0 12-5 12-11s-6-11-12-10c-2-8-9-13-17-13-9 0-16 6-18 14-7 0-12 4-12 10s4 10 11 10Z" fill="#fffaf2" stroke="${p.hairDeep}" stroke-width="1.2" opacity=".7"/>
          <path d="M58 69c0 2 2 4 4 4s4-2 4-4m10 0c0 2 2 4 4 4s4-2 4-4" fill="none" stroke="${p.outfitDeep}" stroke-width="1.2" stroke-linecap="round" opacity=".55"/>
          <path d="M73 80c3-2 7-2 10 0" fill="none" stroke="${p.outfitDeep}" stroke-width="1.2" stroke-linecap="round" opacity=".5"/>
          <path d="M225 42v12M219 48h12" stroke="${p.hairDeep}" stroke-width="1.2" stroke-linecap="round" opacity=".65"/>
        </g>`,
      moon: `
        <g>
          <path d="M222 50c-19 5-27 29-12 43 8 7 17 7 25 3-19-9-23-32-13-46Z" fill="${p.accent}" opacity=".72"/>
          <path d="M215 31v9M210.5 35.5h9" stroke="${p.accent}" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>
          <circle cx="236" cy="103" r="2" fill="${p.accent}" opacity=".7"/>
          <circle cx="49" cy="82" r="1.6" fill="${p.accent}" opacity=".6"/>
        </g>`,
      flower: `
        <g opacity=".7">
          <path d="M47 100c11-9 17-18 18-31M200 103c-8-13-11-23-11-35" fill="none" stroke="${p.hairDeep}" stroke-width="1.2" stroke-linecap="round"/>
          <path d="M57 80c8-1 12 3 13 10-8 1-12-3-13-10Zm128-4c-8 1-12 5-12 12 8 1 11-4 12-12Z" fill="${p.hairDeep}" opacity=".6"/>
          <circle cx="228" cy="57" r="2" fill="${p.accent}"/>
          <circle cx="37" cy="131" r="1.6" fill="${p.accent}"/>
        </g>`,
      radio: `
        <g>
          <path d="M30 65h45c7 0 12-5 12-11s-6-11-12-10c-2-8-9-12-17-12-9 0-15 5-17 13-8 0-13 4-13 10s4 10 12 10Z" fill="#eef0f6" stroke="${p.hairDeep}" stroke-width="1.1" opacity=".8"/>
          <path d="M44 85v8m14-8v8m14-8v8" stroke="${p.hairDeep}" stroke-width="1.6" stroke-linecap="round" opacity=".55"/>
          <path d="M216 70v9m0 4v2" stroke="${p.outfitDeep}" stroke-width="1.4" stroke-linecap="round" opacity=".65"/>
          <path d="M231 62c4 2 7 7 7 12s-3 10-7 12" fill="none" stroke="${p.outfitDeep}" stroke-width="1.2" stroke-linecap="round" opacity=".4"/>
        </g>`,
      paper: `
        <g>
          <path d="M174 66c15-10 30-15 45-18" fill="none" stroke="${p.outfitDeep}" stroke-width="1.1" stroke-dasharray="3 5" stroke-linecap="round" opacity=".5"/>
          <g transform="translate(196 46) rotate(16)">
            <path d="M0 17 52 0 29 37 24 23Z" fill="#fffaf1" stroke="${p.outfitDeep}" stroke-width="1.2" stroke-linejoin="round"/>
            <path d="M24 23 52 0" fill="none" stroke="${p.outfitDeep}" stroke-width="1.1" opacity=".55"/>
            <path d="M23 23 18 41 30 27Z" fill="${p.accent}" opacity=".85"/>
          </g>
          <path d="M40 121c6-3 12-3 18 0" fill="none" stroke="${p.hairDeep}" stroke-width="1.1" stroke-linecap="round" opacity=".45"/>
        </g>`,
      bear: `
        <g>
          <path d="M36 104c-7 5-8 14-2 18 5 4 12 2 15-3" fill="none" stroke="${p.hairDeep}" stroke-width="1.2" stroke-linecap="round" opacity=".55"/>
          <path d="M225 116c8 2 12 9 9 15" fill="none" stroke="${p.hairDeep}" stroke-width="1.2" stroke-linecap="round" opacity=".55"/>
          <path d="M55 51v10M50 56h10M211 49v8M207 53h8" stroke="${p.accent}" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>
        </g>`,
      soda: `
        <g>
          <circle cx="42" cy="112" r="10" fill="none" stroke="${p.hairDeep}" stroke-width="1" opacity=".4"/>
          <circle cx="29" cy="82" r="5" fill="none" stroke="${p.hairDeep}" stroke-width="1" opacity=".42"/>
          <circle cx="219" cy="91" r="4" fill="none" stroke="${p.hairDeep}" stroke-width="1" opacity=".5"/>
          <circle cx="232" cy="58" r="7" fill="none" stroke="${p.accent}" stroke-width="1.1" opacity=".55"/>
          <path d="M32 144c8-3 15-3 22 0" fill="none" stroke="${p.hairDeep}" stroke-width="1.1" stroke-linecap="round" opacity=".4"/>
        </g>`,
      sunset: `
        <g>
          <g opacity=".8">
            <circle cx="217" cy="70" r="31" fill="${p.accent}" opacity=".55"/>
            <circle cx="217" cy="70" r="40" fill="none" stroke="${p.accent}" stroke-width="1.1" stroke-dasharray="2 8" opacity=".7"/>
          </g>
          <path d="M34 80c7-5 15-4 20 2" fill="none" stroke="${p.hairDeep}" stroke-width="1.1" stroke-linecap="round" opacity=".45"/>
          <path d="M40 112h18M208 127h16" stroke="${p.hairDeep}" stroke-width="1.1" stroke-linecap="round" opacity=".42"/>
        </g>`,
      rabbit: `
        <g opacity=".82">
          <path d="M218 53a30 30 0 1 0 14 39 35 35 0 0 1-14-39Z" fill="${p.accent}" opacity=".6"/>
          <path d="M210 35v9M205.5 39.5h9" stroke="${p.accent}" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>
          <path d="M41 92c7-4 14-3 19 3M36 136c7-3 14-2 20 2" fill="none" stroke="${p.hairDeep}" stroke-width="1.1" stroke-linecap="round" opacity=".42"/>
          <circle cx="49" cy="116" r="1.8" fill="${p.accent}" opacity=".6"/>
        </g>`,
      duck: `
        <g opacity=".75">
          <circle cx="44" cy="108" r="9" fill="none" stroke="${p.hairDeep}" stroke-width="1" opacity=".45"/>
          <circle cx="30" cy="84" r="4.5" fill="none" stroke="${p.hairDeep}" stroke-width="1" opacity=".42"/>
          <circle cx="222" cy="89" r="4" fill="none" stroke="${p.accent}" stroke-width="1" opacity=".55"/>
          <path d="M33 142c8-3 15-3 22 0" fill="none" stroke="${p.hairDeep}" stroke-width="1.1" stroke-linecap="round" opacity=".4"/>
        </g>`,
      lantern: `
        <g opacity=".86">
          <circle cx="215" cy="77" r="34" fill="${p.accent}" opacity=".2"/>
          <path d="M210 38v10M205 43h10" stroke="${p.accent}" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>
          <circle cx="44" cy="96" r="2" fill="${p.accent}" opacity=".75"/>
          <path d="M35 136c8-3 15-3 22 0M200 135h16" stroke="${p.hairDeep}" stroke-width="1.1" stroke-linecap="round" opacity=".38"/>
        </g>`,
      candy: `
        <g opacity=".8">
          <path d="M39 81c5-3 10-2 14 2M211 91c5-3 10-2 14 2" fill="none" stroke="${p.hairDeep}" stroke-width="1.1" stroke-linecap="round" opacity=".45"/>
          <circle cx="45" cy="116" r="7" fill="none" stroke="${p.hairDeep}" stroke-width="1" opacity=".4"/>
          <circle cx="222" cy="61" r="2" fill="${p.accent}" opacity=".65"/>
          <path d="M43 137c4-3 8-3 12-2" fill="none" stroke="${p.hairDeep}" stroke-width="1" stroke-linecap="round" opacity=".38"/>
        </g>`,
      aurora: `
        <g opacity=".95">
          <circle cx="216" cy="73" r="41" fill="${p.accent}" opacity=".2"/>
          <circle cx="216" cy="73" r="52" fill="none" stroke="${p.accent}" stroke-width="1" stroke-dasharray="2 8" opacity=".62"/>
          <path d="M216 8v18M216 120v18M151 73h18M263 73h18M170 27l13 13M249 106l13 13M262 27l-13 13M183 106l-13 13" stroke="${p.accent}" stroke-width="1.2" stroke-linecap="round" opacity=".6"/>
          <path d="M43 82c6-4 12-3 17 2M36 130c8-3 15-2 21 3" fill="none" stroke="${p.hairDeep}" stroke-width="1.1" stroke-linecap="round" opacity=".42"/>
          <path d="M54 46v10M49 51h10" stroke="${p.accent}" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>
          <circle cx="229" cy="140" r="2" fill="${p.accent}" opacity=".7"/>
        </g>`,
    };

    const headAccessories = {
      moon: `
        <g transform="rotate(-3 130 62)">
          <path d="M82 79C89 54 108 39 133 39c25 0 44 14 51 40Z" fill="${p.outfitDeep}"/>
          <path d="M100 78c18-6 51-6 69 0" fill="none" stroke="${p.accent}" stroke-width="1.5" opacity=".65"/>
          <ellipse cx="132" cy="79" rx="56" ry="8" fill="${p.outfit}"/>
          <circle cx="132" cy="59" r="7" fill="${p.accent}"/>
          <path d="M128 57c2-2 5-2 7 0" fill="none" stroke="${p.outfitDeep}" stroke-width="1.1" stroke-linecap="round" opacity=".55"/>
        </g>`,
      flower: `
        <g>
          <g transform="translate(130 38)">
            <g fill="#fffaf1" opacity=".96">
              <ellipse cx="0" cy="-12" rx="6" ry="10"/>
              <ellipse cx="12" cy="-4" rx="10" ry="6"/>
              <ellipse cx="8" cy="10" rx="6" ry="10"/>
              <ellipse cx="-8" cy="10" rx="6" ry="10"/>
              <ellipse cx="-12" cy="-4" rx="10" ry="6"/>
            </g>
            <circle r="7" fill="${p.accent}"/>
            <circle r="2.5" fill="#d8b46c" opacity=".8"/>
          </g>
          <g transform="translate(94 51) rotate(-18) scale(.72)">
            <g fill="#fffaf1" opacity=".86">
              <ellipse cx="0" cy="-12" rx="6" ry="10"/>
              <ellipse cx="12" cy="-4" rx="10" ry="6"/>
              <ellipse cx="8" cy="10" rx="6" ry="10"/>
              <ellipse cx="-8" cy="10" rx="6" ry="10"/>
              <ellipse cx="-12" cy="-4" rx="10" ry="6"/>
            </g>
            <circle r="7" fill="${p.accent}" opacity=".86"/>
          </g>
          <g transform="translate(166 50) rotate(16) scale(.66)">
            <g fill="#fffaf1" opacity=".82">
              <ellipse cx="0" cy="-12" rx="6" ry="10"/>
              <ellipse cx="12" cy="-4" rx="10" ry="6"/>
              <ellipse cx="8" cy="10" rx="6" ry="10"/>
              <ellipse cx="-8" cy="10" rx="6" ry="10"/>
              <ellipse cx="-12" cy="-4" rx="10" ry="6"/>
            </g>
            <circle r="7" fill="${p.accent}" opacity=".86"/>
          </g>
        </g>`,
      radio: `
        <g>
          <path d="M78 109C71 50 101 29 130 29c30 0 58 21 52 80" fill="none" stroke="${p.outfitDeep}" stroke-width="9" stroke-linecap="round"/>
          <rect x="64" y="99" width="25" height="40" rx="12.5" fill="${p.outfitDeep}"/>
          <rect x="172" y="99" width="25" height="40" rx="12.5" fill="${p.outfitDeep}"/>
          <rect x="69" y="106" width="7" height="26" rx="3.5" fill="${p.accent}" opacity=".8"/>
          <rect x="185" y="106" width="7" height="26" rx="3.5" fill="${p.accent}" opacity=".8"/>
        </g>`,
      bear: `
        <g>
          <circle cx="78" cy="47" r="26" fill="${p.hairDeep}"/>
          <circle cx="182" cy="47" r="26" fill="${p.hairDeep}"/>
          <circle cx="78" cy="47" r="13" fill="#f2d2c9" opacity=".68"/>
          <circle cx="182" cy="47" r="13" fill="#f2d2c9" opacity=".68"/>
        </g>`,
      sunset: `
        <g opacity=".9">
          <path d="M73 94C67 55 92 34 130 34c40 0 62 22 57 61" fill="none" stroke="${p.outfitDeep}" stroke-width="1.1" stroke-dasharray="3 6" opacity=".4"/>
          <path d="M89 66c8-3 14-8 19-16M174 72c-8-3-14-9-17-17" fill="none" stroke="${p.accent}" stroke-width="1.2" stroke-linecap="round" opacity=".65"/>
        </g>`,
      rabbit: `
        <g>
          <path d="M91 64C71 33 74 4 92 3c15-1 20 25 16 57Z" fill="${p.hair}" stroke="${p.hairDeep}" stroke-width="1.2"/>
          <path d="M92 52C84 31 86 13 93 13c8 0 10 18 6 38Z" fill="#f2c9cd" opacity=".6"/>
          <path d="M169 63c-4-28 5-49 21-46 14 3 11 29-4 53Z" fill="${p.hair}" stroke="${p.hairDeep}" stroke-width="1.2" transform="rotate(8 178 40)"/>
          <path d="M173 51c3-18 10-30 17-28 7 2 3 21-5 33Z" fill="#f2c9cd" opacity=".58"/>
          <path d="M96 82c7 5 15 8 25 10" fill="none" stroke="${p.hairDeep}" stroke-width="1.4" stroke-linecap="round" opacity=".3"/>
          <circle cx="119" cy="52" r="4" fill="${p.accent}" opacity=".9"/>
          <path d="M113 52h12" stroke="${p.outfitDeep}" stroke-width="1" opacity=".4"/>
        </g>`,
      duck: `
        <g transform="rotate(-2 130 57)">
          <path d="M83 66C88 41 106 28 131 28c28 0 45 13 50 38Z" fill="${p.outfitDeep}"/>
          <ellipse cx="131" cy="66" rx="48" ry="8" fill="${p.outfit}"/>
          <path d="M105 56h52" stroke="${p.accent}" stroke-width="1.6" opacity=".7"/>
          <circle cx="131" cy="43" r="7" fill="${p.accent}"/>
          <path d="M127 41c2-2 5-2 7 0" fill="none" stroke="${p.outfitDeep}" stroke-width="1" stroke-linecap="round" opacity=".5"/>
          <path d="M123 67c4 4 11 5 17 1" fill="none" stroke="${p.accent}" stroke-width="1.4" stroke-linecap="round" opacity=".65"/>
        </g>`,
      lantern: `
        <g>
          <circle cx="130" cy="33" r="22" fill="${p.accent}" opacity=".18"/>
          <path d="M130 17c1.4 6.8 4.4 9.8 11.2 11.2-6.8 1.4-9.8 4.4-11.2 11.2-1.4-6.8-4.4-9.8-11.2-11.2 6.8-1.4 9.8-4.4 11.2-11.2Z" fill="${p.accent}" opacity=".9"/>
          <path d="M90 87c10 5 20 8 31 9" fill="none" stroke="${p.hairDeep}" stroke-width="1.2" stroke-linecap="round" opacity=".35"/>
        </g>`,
      candy: `
        <g>
          <path d="M118 42c-9-9-22-7-20 4 2 8 10 9 20 5Z" fill="${p.accent}" opacity=".9"/>
          <path d="M142 42c9-9 22-7 20 4-2 8-10 9-20 5Z" fill="${p.accent}" opacity=".9"/>
          <circle cx="130" cy="46" r="9" fill="${p.hairDeep}"/>
          <circle cx="130" cy="46" r="3.5" fill="#fff6e6" opacity=".7"/>
          <path d="M92 82c6 5 13 8 21 10" fill="none" stroke="${p.hairDeep}" stroke-width="1.2" stroke-linecap="round" opacity=".32"/>
        </g>`,
      aurora: `
        <g>
          <path d="M76 92C69 54 94 31 130 31c38 0 61 23 54 61" fill="none" stroke="${p.accent}" stroke-width="1.2" stroke-dasharray="3 6" opacity=".5"/>
          <g transform="translate(130 32)">
            <path d="M-36 16 -28-8 -13 7 0-20 13 7 28-8 36 16Z" fill="${p.accent}" opacity=".95"/>
            <circle cx="0" cy="-20" r="4" fill="#fff6dc"/>
            <circle cx="-28" cy="-8" r="2.6" fill="#fff6dc" opacity=".9"/>
            <circle cx="28" cy="-8" r="2.6" fill="#fff6dc" opacity=".9"/>
            <path d="M-36 16h72" stroke="#fff6dc" stroke-width="1.2" opacity=".6"/>
          </g>
          <path d="M91 78c8 4 16 6 25 6M144 84c8 0 15-2 23-6" fill="none" stroke="${p.hairDeep}" stroke-width="1.2" stroke-linecap="round" opacity=".35"/>
        </g>`,
    };

    const handProps = {
      cloud: `
        <g transform="translate(192 218) rotate(8)">
          <path d="M0 17 6 32 22 33 10 43 14 59 0 50 -14 59 -10 43 -22 33 -6 32Z" fill="${p.accent}" stroke="#fff5df" stroke-width="1" transform="translate(12 -14)"/>
          <path d="M4 7 7 13 13 14 8 18 10 24 4 20 0 24 2 18 -4 14 2 13Z" fill="#fff8e8" opacity=".6"/>
        </g>`,
      moon: `
        <g transform="translate(183 219) rotate(-8)">
          <rect x="0" y="0" width="47" height="33" rx="4" fill="#fffaf0" stroke="${p.outfitDeep}" stroke-width="1.1" opacity=".96"/>
          <path d="M1 3 23.5 21 46 3M1 30l14-14M46 30 32 16" fill="none" stroke="${p.outfitDeep}" stroke-width="1" opacity=".55"/>
          <circle cx="23.5" cy="18" r="3" fill="${p.accent}" opacity=".7"/>
        </g>`,
      flower: `
        <g transform="translate(195 219) rotate(14)">
          <path d="M0 35C4 25 11 17 20 9" fill="none" stroke="${p.outfitDeep}" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M10 23c-8 0-12-4-13-10 8-1 12 3 13 10Zm6-8c1-8 5-11 12-11 0 7-4 11-12 11Z" fill="${p.hairDeep}"/>
          <g transform="translate(20 7)">
            <g fill="#fffaf1">
              <ellipse cx="0" cy="-7" rx="3.5" ry="6"/>
              <ellipse cx="7" cy="0" rx="6" ry="3.5"/>
              <ellipse cx="0" cy="7" rx="3.5" ry="6"/>
              <ellipse cx="-7" cy="0" rx="6" ry="3.5"/>
            </g>
            <circle r="4" fill="${p.accent}"/>
          </g>
        </g>`,
      radio: `
        <g transform="translate(195 218) rotate(-8)">
          <rect x="0" y="0" width="34" height="51" rx="13" fill="${p.accent}" opacity=".9"/>
          <path d="M8 12h18M8 18h12" stroke="${p.outfitDeep}" stroke-width="1.2" stroke-linecap="round" opacity=".55"/>
          <path d="M17 0v-12" stroke="${p.outfitDeep}" stroke-width="1.4" stroke-linecap="round" opacity=".65"/>
          <circle cx="17" cy="-15" r="4" fill="${p.hair}" stroke="${p.outfitDeep}" stroke-width="1"/>
        </g>`,
      paper: `
        <g transform="translate(192 220) rotate(18) scale(.7)">
          <path d="M0 17 52 0 29 37 24 23Z" fill="#fffaf1" stroke="${p.outfitDeep}" stroke-width="1.4" stroke-linejoin="round"/>
          <path d="M24 23 52 0M23 23 18 41 30 27" fill="none" stroke="${p.outfitDeep}" stroke-width="1.1" opacity=".55"/>
        </g>`,
      bear: `
        <g transform="translate(193 218) rotate(5)">
          <circle cx="15" cy="15" r="17" fill="${p.hairDeep}"/>
          <circle cx="9" cy="9" r="6" fill="#f2d2c9" opacity=".72"/>
          <circle cx="21" cy="9" r="6" fill="#f2d2c9" opacity=".72"/>
          <circle cx="9" cy="9" r="2" fill="${p.outfitDeep}" opacity=".5"/>
          <circle cx="21" cy="9" r="2" fill="${p.outfitDeep}" opacity=".5"/>
          <path d="M9 22c4 3 8 3 12 0" fill="none" stroke="${p.outfitDeep}" stroke-width="1.2" stroke-linecap="round" opacity=".5"/>
        </g>`,
      soda: `
        <g transform="translate(190 199) rotate(-7)">
          <path d="M15 0c-4 0-6 3-6 6v7c0 2-2 3-2 5v29c0 4 3 6 8 6h8c5 0 8-2 8-6V18c0-2-2-3-2-5V6c0-3-2-6-6-6Z" fill="#f9f1dc" stroke="${p.outfitDeep}" stroke-width="1.2" opacity=".96"/>
          <path d="M9 25h28v22H9Z" fill="${p.accent}" opacity=".9"/>
          <path d="M23 17c5-7 10-9 16-7" fill="none" stroke="${p.outfitDeep}" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="34" cy="12" r="5" fill="none" stroke="${p.hairDeep}" stroke-width="1" opacity=".6"/>
          <circle cx="43" cy="20" r="3.5" fill="none" stroke="${p.hairDeep}" stroke-width="1" opacity=".48"/>
          <path d="M12 47h22" stroke="${p.outfitDeep}" stroke-width="1" opacity=".3"/>
        </g>`,
      sunset: `
        <g transform="translate(195 216)">
          <circle cx="17" cy="17" r="17" fill="${p.accent}" opacity=".92"/>
          <circle cx="17" cy="17" r="11" fill="none" stroke="#fff5dd" stroke-width="1" opacity=".7"/>
          <path d="M17 -3v-8M17 37v8M-3 17h-8M37 17h8M3 3 2 -4M31 31l5 6M31 3l5-6M3 31l-5 6" stroke="${p.accent}" stroke-width="1.8" stroke-linecap="round" opacity=".65"/>
          <circle cx="12" cy="15" r="1.8" fill="${p.outfitDeep}" opacity=".7"/>
          <circle cx="22" cy="15" r="1.8" fill="${p.outfitDeep}" opacity=".7"/>
          <path d="M13 22c3 2 6 2 8 0" fill="none" stroke="${p.outfitDeep}" stroke-width="1.2" stroke-linecap="round" opacity=".6"/>
        </g>`,
      rabbit: `
        <g transform="translate(192 218) rotate(12)">
          <path d="M7 0h19l-9 45Z" fill="${p.accent}" stroke="${p.outfitDeep}" stroke-width="1.1" stroke-linejoin="round"/>
          <path d="M9 18c4-1 8-1 12 0" stroke="#fff5df" stroke-width="1" opacity=".4"/>
          <path d="M9 3C6-7 9-14 16-17M19 2c1-9 5-13 12-14" fill="none" stroke="${p.outfitDeep}" stroke-width="1.8" stroke-linecap="round"/>
        </g>`,
      duck: `
        <g transform="translate(190 215)">
          <ellipse cx="17" cy="27" rx="20" ry="15" fill="#f3d477"/>
          <circle cx="17" cy="10" r="13" fill="#f6e09a"/>
          <path d="M28 13h11l-8 6Z" fill="#e49a5b"/>
          <circle cx="12" cy="8" r="1.8" fill="#4a3f4b"/>
          <circle cx="21" cy="8" r="1.8" fill="#4a3f4b"/>
          <path d="M0 28c1 8 7 12 17 12" fill="none" stroke="${p.outfitDeep}" stroke-width="1.2" stroke-linecap="round" opacity=".35"/>
          <path d="M7 23c3 2 6 2 9 0" fill="none" stroke="${p.outfitDeep}" stroke-width="1" stroke-linecap="round" opacity=".35"/>
        </g>`,
      lantern: `
        <g transform="translate(192 204)">
          <path d="M15 0v-8" stroke="${p.outfitDeep}" stroke-width="1.4" stroke-linecap="round" opacity=".6"/>
          <path d="M4 0h22l6 7v29l-6 7H4l-6-7V7Z" fill="${p.outfitDeep}"/>
          <rect x="5" y="7" width="20" height="29" rx="5" fill="#fff5d7" opacity=".9"/>
          <path d="M4 0h22M4 43h22" stroke="${p.accent}" stroke-width="2" stroke-linecap="round"/>
          <circle cx="15" cy="21" r="6" fill="#fffdf5" opacity=".75"/>
          <circle cx="15" cy="21" r="11" fill="${p.accent}" opacity=".18"/>
        </g>`,
      candy: `
        <g transform="translate(188 216) rotate(-8)">
          <rect x="14" y="8" width="30" height="25" rx="6" fill="${p.accent}" stroke="${p.outfitDeep}" stroke-width="1.1"/>
          <path d="M14 20 0 9v23Z" fill="${p.hairDeep}" stroke="${p.outfitDeep}" stroke-width="1" stroke-linejoin="round"/>
          <path d="M44 20 58 9v23Z" fill="${p.hairDeep}" stroke="${p.outfitDeep}" stroke-width="1" stroke-linejoin="round"/>
          <path d="M21 15c5 3 10 3 15 0M21 26c5 2 10 2 15 0" fill="none" stroke="#fff8e8" stroke-width="1" stroke-linecap="round" opacity=".55"/>
        </g>`,
      aurora: `
        <g transform="translate(190 204)">
          <circle cx="19" cy="20" r="21" fill="${p.accent}" opacity=".2"/>
          <path d="M19-6 25 12 44 19 25 26 19 44 13 26-6 19 13 12Z" fill="#fff3ca" stroke="${p.accent}" stroke-width="1.3" stroke-linejoin="round"/>
          <circle cx="19" cy="19" r="4.5" fill="#fffdf4" opacity=".8"/>
          <path d="M38 2v7M34.5 5.5h7M0 38v6M-3 41h6" stroke="${p.accent}" stroke-width="1.3" stroke-linecap="round" opacity=".75"/>
        </g>`,
    };

    return `<svg viewBox="0 0 260 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="${bodyGradient}" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stop-color="${p.outfit}"/>
          <stop offset="1" stop-color="${p.outfitDeep}"/>
        </linearGradient>
        <radialGradient id="${skinGradient}" cx="42%" cy="30%" r="78%">
          <stop offset="0" stop-color="#ffe9d9"/>
          <stop offset=".68" stop-color="#f6d4be"/>
          <stop offset="1" stop-color="#ecc5ac"/>
        </radialGradient>
        <linearGradient id="${hairGradient}" x1="0.1" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="${p.hair}"/>
          <stop offset="1" stop-color="${p.hairDeep}"/>
        </linearGradient>
      </defs>

      <ellipse cx="130" cy="283" rx="55" ry="8" fill="#4b354b" opacity=".14"/>

      ${propBackdrops[style.prop] || ""}

      <g>
        <!-- legs + shoes -->
        <rect x="98" y="238" width="24" height="34" rx="12" fill="${p.outfitDeep}"/>
        <rect x="138" y="238" width="24" height="34" rx="12" fill="${p.outfitDeep}"/>
        <ellipse cx="108" cy="271" rx="18" ry="11" fill="${p.accent}"/>
        <ellipse cx="152" cy="271" rx="18" ry="11" fill="${p.accent}"/>
        <path d="M94 268c4 5 12 7 24 5M142 268c4 5 12 7 24 5" fill="none" stroke="#fffaf1" stroke-width="1.2" stroke-linecap="round" opacity=".34"/>

        <!-- arms behind body -->
        <g>
          <rect x="63" y="194" width="25" height="61" rx="12.5" fill="url(#${bodyGradient})" transform="rotate(14 75 224)"/>
          <rect x="172" y="194" width="25" height="61" rx="12.5" fill="url(#${bodyGradient})" transform="rotate(-17 184 224)"/>
          <circle cx="76" cy="252" r="11.5" fill="url(#${skinGradient})"/>
          <circle cx="193" cy="251" r="11.5" fill="url(#${skinGradient})"/>
        </g>

        <!-- body -->
        <path d="M88 194C92 181 106 175 130 175s38 6 42 19l5 42c2 15-14 22-47 22s-49-7-47-22Z" fill="url(#${bodyGradient})"/>
        <path d="M130 196v57" stroke="#fffaf1" stroke-width="1" stroke-dasharray="2 5" opacity=".2"/>
        <path d="M112 175c4 7 11 11 18 11s14-4 18-11l3 12c-5 8-13 12-21 12s-16-4-21-12Z" fill="#fff9ee" opacity=".9"/>
        <path d="M130 202c3-5 7-6 11-3 4 3 4 7 0 10l-11 8-11-8c-4-3-4-7 0-10 4-3 8-2 11 3Z" fill="${p.accent}" opacity=".9"/>
        <circle cx="130" cy="207" r="2" fill="#fff6e6" opacity=".7"/>
        <path d="M92 235c10 7 23 10 38 10s28-3 38-10" fill="none" stroke="#fffaf1" stroke-width="1" opacity=".12"/>

        <!-- head -->
        <g>
          <path d="M74 142c-20-5-27-28-13-42-9-21 6-41 27-40 3-24 26-38 46-28 17-17 47-9 54 13 23 0 36 21 27 40 17 14 11 40-7 49-2 22-21 36-41 29-12 18-41 22-56 7-18 13-36 2-33-15-2-3-3-8-4-13Z" fill="url(#${hairGradient})"/>
          <path d="M74 142c-20-5-27-28-13-42-9-21 6-41 27-40 3-24 26-38 46-28 17-17 47-9 54 13 23 0 36 21 27 40 17 14 11 40-7 49-2 22-21 36-41 29-12 18-41 22-56 7-18 13-36 2-33-15-2-3-3-8-4-13Z" stroke="#fffaf1" stroke-width="1" opacity=".26"/>

          <circle cx="130" cy="122" r="58" fill="url(#${skinGradient})"/>
          <path d="M75 111c3-31 24-53 56-53 31 0 52 20 56 51-12-15-22-23-32-25-5 14-15 21-27 20-14-1-24-9-29-22-8 10-16 17-24 29Z" fill="url(#${hairGradient})"/>
          <path d="M99 62c-8 9-13 18-16 29M159 56c11 6 18 15 21 25" stroke="#fffaf1" stroke-width="1.5" stroke-linecap="round" opacity=".24"/>
          <path d="M73 108c-5-2-9-7-10-12" stroke="${p.hairDeep}" stroke-width="1.6" stroke-linecap="round" opacity=".45"/>
          <path d="M187 108c5-2 9-7 10-12" stroke="${p.hairDeep}" stroke-width="1.6" stroke-linecap="round" opacity=".45"/>

          <ellipse cx="108" cy="135" rx="9" ry="11.5" fill="#352c3d"/>
          <ellipse cx="152" cy="135" rx="9" ry="11.5" fill="#352c3d"/>
          <circle cx="105" cy="131" r="3" fill="#fff" opacity=".93"/>
          <circle cx="149" cy="131" r="3" fill="#fff" opacity=".93"/>
          <circle cx="112" cy="140" r="1.5" fill="#fff" opacity=".46"/>
          <circle cx="156" cy="140" r="1.5" fill="#fff" opacity=".46"/>
          <path d="M97 132c-2 2-2 5 0 7M163 132c2 2 2 5 0 7" stroke="#352c3d" stroke-width="1.1" stroke-linecap="round" opacity=".6"/>

          <ellipse cx="93" cy="154" rx="11" ry="5.5" fill="#e9a6a5" opacity=".33"/>
          <ellipse cx="167" cy="154" rx="11" ry="5.5" fill="#e9a6a5" opacity=".33"/>
          <circle cx="130" cy="148" r="1.4" fill="#d6a088" opacity=".62"/>
          <path d="M124 157c4 4 8 4 12 0" stroke="#8e5e60" stroke-width="1.6" stroke-linecap="round"/>

          <path d="M85 118c-5-1-8 2-8 6M175 118c5-1 8 2 8 6" fill="none" stroke="${p.hairDeep}" stroke-width="1.2" stroke-linecap="round" opacity=".38"/>
        </g>

        ${headAccessories[style.prop] || ""}
        ${handProps[style.prop] || ""}
      </g>
    </svg>`;
  };

  const emptyArtSVG = () => `
    <svg viewBox="0 0 260 190" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="empty-cloud" x1="70" y1="55" x2="189" y2="129" gradientUnits="userSpaceOnUse">
          <stop stop-color="#fdfbff"/>
          <stop offset="1" stop-color="#e9e1f0"/>
        </linearGradient>
      </defs>

      <path d="M42 88c6-5 13-5 19-1M218 58c5-3 10-3 14 0M31 56v10M26 61h10M224 105v8M220 109h8" stroke="#a18bb0" stroke-width="1.1" stroke-linecap="round" opacity=".4"/>

      <g>
        <path d="M86 126c-9-7-9-20 1-26-4-13 6-24 18-23 4-13 19-19 29-11 10-10 27-6 31 7 13 1 21 12 18 23 9 8 5 22-6 25-3 12-16 18-26 12-9 9-25 9-33 0-12 5-24-1-32-7Z" fill="url(#empty-cloud)" stroke="#c9bcd8" stroke-width="1.1"/>
        <path d="M109 96c1 3 4 5 7 4M143 96c1 3 4 5 7 4" stroke="#66566d" stroke-width="2.1" stroke-linecap="round"/>
        <path d="M127 108c3 2 6 2 9 0" stroke="#8e6b70" stroke-width="1.5" stroke-linecap="round"/>
        <ellipse cx="101" cy="107" rx="7" ry="3.4" fill="#dea5a8" opacity=".38"/>
        <ellipse cx="158" cy="107" rx="7" ry="3.4" fill="#dea5a8" opacity=".38"/>
        <path d="M96 84c-5-1-8 1-9 5M163 84c5-1 8 1 9 5" stroke="#b7a7c5" stroke-width="1.1" stroke-linecap="round" opacity=".55"/>
      </g>

      <g opacity=".7" stroke="#887397" stroke-width="1" stroke-linecap="round">
        <path d="M195 70c4-5 9-5 13-1M204 59c3-3 6-3 9 0"/>
      </g>

      <path d="M116 181c8-5 19-5 27 0" stroke="#b6a7c2" stroke-width="1.2" stroke-linecap="round" opacity=".45"/>

      <g>
        <path d="M91 132 111 112h35l20 20Z" fill="#d9cce6" stroke="#b9a9c9" stroke-width="1"/>
        <path d="M72 134 91 120v51l-14-9Z" fill="#cbbcdb" stroke="#b3a3c5" stroke-width="1"/>
        <path d="M188 134 169 120v51l14-9Z" fill="#cbbcdb" stroke="#b3a3c5" stroke-width="1"/>
        <path d="M83 132h94l-9 48H92Z" fill="#f3ecf7" stroke="#bbaac9" stroke-width="1.1"/>
        <path d="M95 144h70l-5 26H100Z" fill="#e7dcef" opacity=".8"/>
        <path d="M92 179c17 5 59 5 76 0" stroke="#b7a7c5" stroke-width="1" stroke-linecap="round" opacity=".55"/>
        <path d="M116 150h28M121 157h18" stroke="#b7a7c5" stroke-width="1.2" stroke-linecap="round" opacity=".6"/>
      </g>

      <g transform="translate(181 137)">
        <path d="M0 0h28" stroke="#a790b5" stroke-width="1" stroke-dasharray="2 4" opacity=".5"/>
        <rect x="26" y="-7" width="25" height="15" rx="3" fill="#fffaf1" stroke="#cbbbd7" stroke-width="1"/>
        <text x="38.5" y="3" text-anchor="middle" font-size="5.5" fill="#8f789e" font-family="Georgia, serif" letter-spacing="1">EMPTY</text>
      </g>

      <path d="M64 65c3 1 5 4 4 7" stroke="#b19cc2" stroke-width="1.1" stroke-linecap="round" opacity=".5"/>
    </svg>`;

  const otherProductSVG = (style, instance = "art") => {
    const p = style.palette;
    const uid = `${style.id}-${instance}`.replace(/[^a-zA-Z0-9_-]/g, "");
    const isMolly = style.ip === "MOLLY";
    const isSkullpanda = style.ip === "SKULLPANDA";
    const labelSize = isMolly ? 14 : style.ip === "CRYBABY" ? 10 : 9;
    const labelSpacing = isMolly ? 2.2 : 0.9;
    const labelInk = p.labelInk || p.ink;

    const emblem = isMolly
      ? `<g transform="translate(130 79)">
          <path d="M-26 4-20-19l13 11L0-27l7 19 13-11 6 23Z" fill="${p.accent}" opacity=".95"/>
          <rect x="-27" y="4" width="54" height="8" rx="4" fill="${p.accent}" opacity=".95"/>
          <circle cx="0" cy="8" r="2.5" fill="#fff8ea" opacity=".6"/>
        </g>`
      : isSkullpanda
        ? `<g transform="translate(130 78)">
          <circle cx="-18" cy="-17" r="8" fill="#5b4c65"/>
          <circle cx="18" cy="-17" r="8" fill="#5b4c65"/>
          <circle r="20" fill="#f6ece5"/>
          <ellipse cx="-8" cy="-2" rx="6" ry="8" fill="#4b3d56" transform="rotate(-15 -8 -2)"/>
          <ellipse cx="8" cy="-2" rx="6" ry="8" fill="#4b3d56" transform="rotate(15 8 -2)"/>
          <circle cx="-8" cy="-2" r="2" fill="#e8dbe9"/>
          <circle cx="8" cy="-2" r="2" fill="#e8dbe9"/>
          <path d="M-2 8h4l-2 4Z" fill="#8f6c80"/>
          <path d="M-5 14c3 2 7 2 10 0" fill="none" stroke="#8b6573" stroke-width="1.2" stroke-linecap="round"/>
          <path d="M0 19v6" stroke="${p.accent}" stroke-width="1.2" stroke-linecap="round" opacity=".65"/>
        </g>`
        : `<g transform="translate(130 79)">
          <path d="M0-23C10-8 19 2 19 12A19 19 0 0 1-19 12C-19 2-10-8 0-23Z" fill="${p.ribbon}" opacity=".92"/>
          <circle cx="-6" cy="7" r="2.1" fill="#fff8f2"/>
          <circle cx="6" cy="7" r="2.1" fill="#fff8f2"/>
          <path d="M-6 15c4 3 8 3 12 0" fill="none" stroke="#8f6573" stroke-width="1.2" stroke-linecap="round"/>
          <path d="M-24 26c16 8 32 8 48 0" fill="none" stroke="${p.accent}" stroke-width="1.3" stroke-linecap="round" opacity=".65"/>
          <path d="M-17 4c-3-7 2-12 8-10M17 4c3-7-2-12-8-10" fill="none" stroke="${p.accent}" stroke-width="1.1" stroke-linecap="round" opacity=".55"/>
        </g>`;

    return `<svg viewBox="0 0 260 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="box-${uid}" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stop-color="${p.lid}"/>
          <stop offset=".45" stop-color="${p.box}"/>
          <stop offset="1" stop-color="${p.box}"/>
        </linearGradient>
        <linearGradient id="lid-${uid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${p.lid}"/>
          <stop offset="1" stop-color="${p.box}"/>
        </linearGradient>
        <radialGradient id="halo-${uid}" cx="50%" cy="45%" r="55%">
          <stop offset="0" stop-color="${p.halo}" stop-opacity=".8"/>
          <stop offset=".7" stop-color="${p.halo}" stop-opacity=".25"/>
          <stop offset="1" stop-color="${p.halo}" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <ellipse cx="130" cy="279" rx="62" ry="8" fill="#4b354b" opacity=".14"/>
      <circle cx="130" cy="152" r="112" fill="url(#halo-${uid})"/>
      <circle cx="130" cy="152" r="96" stroke="${p.accent}" stroke-width="1" stroke-dasharray="2 8" opacity=".4"/>

      <g opacity=".55" stroke="${p.accent}" stroke-width="1.1" stroke-linecap="round">
        <path d="M39 86v11M33.5 91.5h11M218 61v9M213.5 65.5h9M224 147v7M220.5 150.5h7"/>
        <circle cx="52" cy="134" r="2" fill="${p.accent}" stroke="none"/>
        <circle cx="207" cy="112" r="1.6" fill="${p.accent}" stroke="none"/>
      </g>

      <g transform="translate(43 213) rotate(-12)" opacity=".62">
        <rect x="-19" y="-24" width="38" height="51" rx="4" fill="${p.lid}" stroke="${p.ribbon}" stroke-width="1"/>
        <rect x="-23" y="-30" width="46" height="11" rx="3" fill="${p.box}" stroke="${p.ribbon}" stroke-width=".8"/>
        <rect x="-3" y="-30" width="6" height="57" fill="${p.ribbon}" opacity=".6"/>
      </g>

      <g transform="translate(220 207) rotate(11)" opacity=".5">
        <rect x="-17" y="-21" width="34" height="45" rx="4" fill="${p.lid}" stroke="${p.ribbon}" stroke-width="1"/>
        <rect x="-21" y="-27" width="42" height="10" rx="3" fill="${p.box}" stroke="${p.ribbon}" stroke-width=".8"/>
        <rect x="-3" y="-27" width="6" height="51" fill="${p.ribbon}" opacity=".6"/>
      </g>

      ${emblem}

      <g>
        <rect x="73" y="130" width="114" height="130" rx="10" fill="url(#box-${uid})" stroke="${p.ribbon}" stroke-width="1.1"/>
        <path d="M73 153v97c0 5 4 10 10 10h9V153Z" fill="#fffaf1" opacity=".13"/>
        <rect x="63" y="112" width="134" height="29" rx="8" fill="url(#lid-${uid})" stroke="${p.ribbon}" stroke-width="1.1"/>
        <path d="M64 137h132" stroke="${p.box}" stroke-width="1" opacity=".25"/>
        <rect x="121" y="112" width="18" height="148" fill="${p.ribbon}" opacity=".62"/>
        <path d="M122 116h16M122 253h16" stroke="#fffaf1" stroke-width=".8" opacity=".25"/>

        <g transform="translate(130 106)">
          <path d="M0 9C-19 0-33 2-33 14c0 10 15 13 33 3Z" fill="${p.ribbon}"/>
          <path d="M0 9C19 0 33 2 33 14c0 10-15 13-33 3Z" fill="${p.ribbon}"/>
          <circle cx="0" cy="11" r="6" fill="${p.accent}"/>
          <circle cx="-2" cy="9" r="2" fill="#fff8ea" opacity=".55"/>
        </g>

        <rect x="85" y="156" width="90" height="82" rx="6" fill="#fffaf2" stroke="${p.ribbon}" stroke-width=".8"/>
        <rect x="91" y="162" width="78" height="70" rx="3" stroke="${p.ribbon}" stroke-width=".7" stroke-dasharray="2 3" opacity=".38"/>
        <text x="130" y="188" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${labelSize}" font-weight="600" letter-spacing="${labelSpacing}" fill="${labelInk}">${style.label}</text>
        <text x="130" y="201" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="4.1" letter-spacing="1.2" fill="${labelInk}" opacity=".58">${style.sublabel}</text>
        <path d="M112 208h36" stroke="${p.ribbon}" stroke-width=".8" opacity=".45"/>
        <text x="130" y="220" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="3.7" letter-spacing=".65" fill="${labelInk}" opacity=".48">${style.en}</text>

        <text x="59" y="270" font-family="Georgia, 'Times New Roman', serif" font-size="4.2" letter-spacing=".7" fill="${p.ink}" opacity=".42">BLIND BOX</text>
        <text x="201" y="270" text-anchor="end" font-family="Georgia, 'Times New Roman', serif" font-size="4.2" letter-spacing=".7" fill="${p.ink}" opacity=".42">1 PIECE</text>
      </g>

    </svg>`;
  };

  const styleArtwork = (style, instance) => {
    if (style.image) {
      return `<img class="style-photo" src="${style.image}" alt="${style.name}，${style.seriesLabel}" loading="${
        instance.startsWith("result") ? "eager" : "lazy"
      }" decoding="async" />`;
    }
    return style.redeemable ? characterSVG(style, instance) : otherProductSVG(style, instance);
  };

  const boxVisualMarkup = (index) => {
    const color = BOX_COLORS[index % BOX_COLORS.length];
    const number = pad(index + 1);
    return `<span class="box-float" style="--box:${color.box};--lid:${color.lid};--ribbon:${color.ribbon};--box-ink:${color.ink}">
      <span class="box-gloss"></span>
      <span class="box-no">No.${number}</span>
      <span class="box-bow"><i></i></span>
      <span class="box-ribbon"></span>
      <span class="box-label">
        ${cloudIconMarkup("")}
        <b>DIMOO</b>
        <small>CLOUD SERIES</small>
      </span>
      <span class="box-footnote"><span>BLIND BOX</span><span>1 PIECE</span></span>
      <span class="box-opened-seal">${cloudIconMarkup("")}<b>已拆</b></span>
      <span class="box-shadow"></span>
    </span>`;
  };

  const blindBoxMarkup = (index) => {
    const number = pad(index + 1);
    return `<button class="blind-box" type="button" data-box="${index}" aria-label="第 ${number} 盒盲盒，点击选择" aria-pressed="false">
      ${boxVisualMarkup(index)}
    </button>`;
  };

  /* -------------------------------------------------------
     Rendering the home screen
     ------------------------------------------------------- */

  const renderBoxes = () => {
    els.boxGrid.innerHTML = Array.from({ length: CONFIG.boxCount }, (_, index) => blindBoxMarkup(index)).join("");
    applyBoxState();
  };

  const isBoxOpened = (index) => state.caseOpened.includes(index);

  const applyBoxState = () => {
    const boxes = $$(".blind-box", els.boxGrid);
    boxes.forEach((box, index) => {
      const opened = isBoxOpened(index);
      const selected = !opened && index === selectedBox;
      box.classList.toggle("is-opened", opened);
      box.classList.toggle("is-selected", selected);
      box.setAttribute("aria-pressed", selected ? "true" : "false");
      box.setAttribute(
        "aria-label",
        opened
          ? `第 ${pad(index + 1)} 盒，已经拆开`
          : `第 ${pad(index + 1)} 盒盲盒，${selected ? "已选中" : "点击选择"}`
      );
      if (opened) {
        box.setAttribute("aria-disabled", "true");
      } else {
        box.removeAttribute("aria-disabled");
      }
    });
  };

  const selectFirstAvailableBox = () => {
    const available = Array.from({ length: CONFIG.boxCount }, (_, index) => index).filter(
      (index) => !isBoxOpened(index)
    );
    selectedBox = available.length ? available[0] : null;
  };

  const selectBox = (index) => {
    if (isDrawing || isHinting || isBoxOpened(index)) return;
    selectedBox = index;
    state.lastBox = index;
    saveState();
    applyBoxState();
    updateDrawArea();
    updateHintPanel();
    playTick();
    els.liveRegion.textContent = `已选中第 ${pad(index + 1)} 盒`;
  };

  const selectPreferredBox = () => {
    const preferred = state.lastBox;
    if (
      Number.isInteger(preferred) &&
      preferred >= 0 &&
      preferred < CONFIG.boxCount &&
      !isBoxOpened(preferred)
    ) {
      selectedBox = preferred;
      return;
    }
    selectFirstAvailableBox();
  };

  const renderCapsules = () => {
    const remaining = getRemaining();
    els.capsuleRow.innerHTML = Array.from({ length: CONFIG.dailyChances }, (_, index) => {
      return `<span class="capsule${index >= remaining ? " is-used" : ""}"></span>`;
    }).join("");
  };

  const updateCountdown = () => {
    const remainingMs = millisecondsUntilReset();
    const totalSeconds = Math.floor(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    els.countdown.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    return { hours, minutes, seconds };
  };

  const updateDrawArea = () => {
    const remaining = getRemaining();
    const hasSelection = selectedBox !== null && !isBoxOpened(selectedBox);
    const boxesLeft = Math.max(0, CONFIG.boxCount - state.caseOpened.length);
    const dailyDone = remaining <= 0;
    const caseDone = boxesLeft <= 0;

    els.drawButton.disabled = dailyDone || caseDone || !hasSelection || isDrawing || isHinting;
    els.drawButton.classList.toggle("is-used-all", dailyDone || caseDone);

    if (dailyDone) {
      els.drawButtonLabel.textContent = `今天的 ${CONFIG.dailyChances} 次机会用完啦`;
      els.drawButtonSub.textContent = `明天 00:00 补满 · 这箱还剩 ${boxesLeft} 盒`;
      els.drawNote.textContent =
        boxesLeft > 0
          ? "这一箱会留到明天，不着急，明天继续拆。"
          : "新的一箱已经在等你啦，明天再来。";
      return;
    }

    if (caseDone || !hasSelection) {
      els.drawButtonLabel.textContent = "这一箱已经拆完啦";
      els.drawButtonSub.textContent = "明天 00:00 会补上全新的一箱";
      els.drawNote.textContent = "十盒都拆完了，云朵会记得这一箱。";
      return;
    }

    const remainingText = `还剩 ${remaining} 次`;
    els.drawButtonLabel.textContent = "拆开这一盒";
    els.drawButtonSub.textContent = `已选 No.${pad(selectedBox + 1)} · ${remainingText}`;

    if (remaining === 1) {
      els.drawNote.textContent = "今天最后一次啦，选一个最像好运的。";
    } else if (remaining >= CONFIG.dailyChances) {
      els.drawNote.textContent = "一箱十盒，每天五次；选最顺眼的那一个。";
    } else if (remaining === 2) {
      els.drawNote.textContent = "不着急，喜欢的才拆。";
    } else {
      els.drawNote.textContent = "慢慢挑，盒子里的时间走得很慢。";
    }
  };

  const updateShelfProgress = () => {
    const opened = state.caseOpened.length;
    els.shelfProgress.textContent = `一箱 ${CONFIG.boxCount} 盒 · 已拆 ${opened} / ${CONFIG.boxCount}`;
  };

  const updateHintPanel = () => {
    const hasSelection = selectedBox !== null && !isBoxOpened(selectedBox);
    if (!hasSelection || getRemaining() <= 0) {
      els.hintCard.hidden = true;
      return;
    }

    els.hintCard.hidden = false;
    const boxNumber = pad(selectedBox + 1);
    const hints = state.hints[selectedBox] || [];
    const hintsLeft = Math.max(0, 2 - hints.length);

    els.hintEyebrow.textContent = `BOX WHISPER · No.${boxNumber}`;
    els.hintCounter.textContent = hintsLeft > 0 ? `剩 ${hintsLeft} 次` : "已用完";

    els.hintSlips.innerHTML = hints.length
      ? hints
          .map((styleId, index) => {
            const style = getStyleById(styleId);
            if (!style) return "";
            return `<span class="hint-slip" style="--tilt:${index % 2 === 0 ? "-1.3deg" : "1.2deg"}">
              ${starMarkup("icon")} 不是 <b>「${style.ip} · ${style.seriesShort} · ${style.name}」</b>
            </span>`;
          })
          .join("")
      : `<span class="hint-placeholder">每个盒子有 2 次提示，每次排除一个产品</span>`;

    els.hintCard.classList.toggle("is-thinking", isHinting);

    if (isHinting) {
      els.hintButton.disabled = true;
      els.hintButtonLabel.textContent = "盒子正在想…";
      els.hintButtonSub.textContent = "沙沙沙，你听见了吗";
      els.hintBadge.textContent = "…";
      return;
    }

    if (hintsLeft > 0) {
      els.hintButton.disabled = false;
      els.hintButtonLabel.textContent = "摇一摇，问盒子";
      els.hintButtonSub.textContent = "提示只排除本箱产品";
      els.hintBadge.textContent = String(hintsLeft);
    } else {
      els.hintButton.disabled = true;
      els.hintButtonLabel.textContent = "本盒提示已用完";
      els.hintButtonSub.textContent = "两个款式已经被排除啦";
      els.hintBadge.textContent = "0";
    }
  };

  const renderAlbum = () => {
    const ownedDimoo = getOwnedDimooIds();
    const ownedOther = getOwnedOtherIds();
    const ownedCount = ownedDimoo.length + ownedOther.length;
    els.albumBadge.textContent = String(ownedCount);
    els.albumFeatureMeta.textContent = `${ownedDimoo.length} / 17 DIMOO`;
    els.statDimoo.textContent = String(ownedDimoo.length);
    els.statOther.textContent = String(ownedOther.length);
    els.statDraws.textContent = String(state.stats.draws);

    els.collectionGrid.innerHTML = STYLES.map((style, index) => {
      const count = state.collection[style.id] || 0;
      const unlocked = count > 0;
      const isOther = !style.redeemable;
      const isHidden = Boolean(style.hidden);
      const metaLine = unlocked
        ? isOther
          ? `${style.ip} · ${style.seriesShort}`
          : `DIMOO · ${style.seriesShort}`
        : "还没遇见";
      const cardName = unlocked ? style.name : "？？？";
      const collectNo = isHidden ? "HIDDEN · 隐藏款" : `No.${style.no}${isOther ? " · OTHER" : ""}`;
      return `<div class="collect-card${unlocked ? "" : " is-locked"}${isOther ? " is-other" : ""}${isHidden ? " is-hidden" : ""}" style="--card-a:${style.palette.cardA};--card-b:${style.palette.cardB};--i:${index}">
        <div class="collect-art">
          ${
            unlocked
              ? styleArtwork(style, `album-${index}`)
              : `<svg class="lock-mark" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-lock"></use></svg>`
          }
        </div>
        <div class="collect-meta">
          <span class="collect-no">${collectNo}</span>
          <b>${cardName}</b>
          <small>${metaLine}</small>
        </div>
        ${unlocked && count > 1 ? `<span class="collect-count">×${count}</span>` : ""}
      </div>`;
    }).join("");
  };

  const renderRoster = () => {
    if (!els.machineRoster) return;
    const caseStyles = state.items
      .map((id) => getStyleById(id))
      .filter(Boolean)
      .sort(
        (a, b) =>
          Number(b.hidden) - Number(a.hidden) ||
          Number(b.redeemable) - Number(a.redeemable) ||
          a.ip.localeCompare(b.ip) ||
          a.seriesLabel.localeCompare(b.seriesLabel, "zh")
      );

    els.machineRoster.innerHTML = caseStyles
      .map(
        (style) => `<div class="roster-row${style.hidden ? " roster-row--hidden" : ""}">
          <span class="roster-ip">${style.ip}</span>
          <div class="roster-detail">
            <b>${style.seriesLabel}</b>
            <p>${style.name}</p>
          </div>
          <span class="roster-flag${style.hidden ? " roster-flag--hidden" : style.redeemable ? "" : " roster-flag--no"}">${style.hidden ? "隐藏 · 可兑换" : style.redeemable ? "可兑换" : "不兑换"}</span>
        </div>`
      )
      .join("");
  };

  const updateSoundButton = () => {
    const enabled = state.sound;
    els.soundButton.classList.toggle("is-muted", !enabled);
    els.soundButton.setAttribute("aria-pressed", String(enabled));
    els.soundButton.setAttribute("aria-label", enabled ? "关闭音效" : "打开音效");
  };

  const updateAll = () => {
    els.chanceNum.textContent = String(getRemaining());
    renderCapsules();
    updateShelfProgress();
    updateDrawArea();
    updateHintPanel();
    renderAlbum();
    renderRoster();
    updateSoundButton();
  };

  /* -------------------------------------------------------
     Daily reset
     ------------------------------------------------------- */

  const resetForNewDay = (notify) => {
    state.day = formatDateKey();
    state.dayDraws = [];
    if (selectedBox === null || isBoxOpened(selectedBox)) selectFirstAvailableBox();
    saveState();
    updateAll();
    if (notify) {
      const boxesLeft = Math.max(0, CONFIG.boxCount - state.caseOpened.length);
      showToast(
        boxesLeft > 0
          ? `新的一天，${CONFIG.dailyChances} 次机会补满啦 · 这箱还剩 ${boxesLeft} 盒`
          : `新的一天，${CONFIG.dailyChances} 次机会补满啦 · 新的一箱在等你`
      );
    }
  };

  const ensureCurrentDay = () => {
    const today = formatDateKey();
    lastDayCheck = today;
    if (state.day !== today) {
      resetForNewDay(false);
      return true;
    }
    return false;
  };

  const tick = () => {
    updateCountdown();
    const today = formatDateKey();
    if (today !== lastDayCheck) {
      lastDayCheck = today;
      if (state.day !== today) {
        resetForNewDay(true);
      }
    }
  };

  /* -------------------------------------------------------
     Drawing
     ------------------------------------------------------- */

  const beginDraw = () => {
    if (isDrawing || isHinting) return;
    ensureCurrentDay();
    if (getRemaining() <= 0) {
      showToast("今天的机会用完了，明天再来吧");
      return;
    }
    if (selectedBox === null || isBoxOpened(selectedBox)) {
      selectFirstAvailableBox();
      if (selectedBox === null) {
        showToast("先挑一盒喜欢的吧");
        return;
      }
    }

    const boxIndex = selectedBox;
    const style = getStyleById(state.items[boxIndex]);
    if (!style) {
      showToast("这盒的数据有点问题，换一盒试试");
      return;
    }

    const record = {
      box: boxIndex,
      styleId: style.id,
      at: Date.now(),
    };

    state.dayDraws.push(record);
    state.caseOpened.push(boxIndex);
    state.day = formatDateKey();
    state.stats.draws += 1;
    state.stats.prizes += 1;
    state.collection[style.id] = (state.collection[style.id] || 0) + 1;

    const completedCase = state.caseOpened.length >= CONFIG.boxCount;
    if (completedCase) {
      // Seal a fresh case for the next draw. Daily chances are untouched.
      state.items = makeCaseItems(state.items);
      state.hints = makeHints();
      state.caseOpened = [];
      selectedBox = 0;
      state.lastBox = 0;
      pendingCaseToast = true;
    } else {
      selectFirstAvailableBox();
      state.lastBox = selectedBox ?? 0;
    }

    saveState();
    currentRecord = record;
    isDrawing = true;
    isRevealed = false;

    applyBoxState();
    updateAll();

    playShake();
    window.setTimeout(() => playRustle(), 430);
    openDrawDialog(record);
  };

  const useHint = () => {
    if (isHinting || isDrawing || selectedBox === null || isBoxOpened(selectedBox)) return;
    ensureCurrentDay();

    const boxIndex = selectedBox;
    const hints = state.hints[boxIndex] || [];
    if (hints.length >= 2) {
      showToast("这个盒子的两次提示都用完了");
      return;
    }

    const boxStyleId = state.items[boxIndex];
    if (!boxStyleId) return;
    const caseStyles = state.items.map((id) => getStyleById(id)).filter(Boolean);
    const candidates = caseStyles.filter(
      (style) => style.id !== boxStyleId && !hints.includes(style.id)
    );
    if (!candidates.length) return;

    const picked = candidates[randomInt(candidates.length)];
    const boxElement = els.boxGrid.querySelector(`.blind-box[data-box="${boxIndex}"]`);

    isHinting = true;
    boxElement?.classList.add("is-hinting");
    updateHintPanel();
    updateDrawArea();
    playHint();
    if (typeof navigator.vibrate === "function") {
      try {
        navigator.vibrate([12, 40, 12]);
      } catch {
        // Vibration is a bonus, not a requirement.
      }
    }

    window.clearTimeout(hintTimer);
    hintTimer = window.setTimeout(() => {
      boxElement?.classList.remove("is-hinting");
      isHinting = false;

      if (!isBoxOpened(boxIndex)) {
        state.hints[boxIndex] = [...hints, picked.id];
        saveState();
        playHintReveal();
        els.liveRegion.textContent = `第 ${pad(boxIndex + 1)} 盒的提示：肯定不是 ${picked.ip} ${picked.seriesShort} ${picked.name}`;
      }

      updateHintPanel();
      updateDrawArea();
    }, 820);
  };

  const reshuffleBatch = () => {
    if (isDrawing || isHinting) {
      showToast("等这一盒拆完再换批");
      return;
    }

    const hadOpened = state.caseOpened.length > 0;
    // Free batch switch: the daily chances, collection and stats stay intact.
    // Only this case's unopened boxes, hints and positions are replaced.
    state.items = makeCaseItems(state.items);
    state.hints = makeHints();
    state.caseOpened = [];
    selectedBox = 0;
    state.lastBox = 0;
    pendingCaseToast = false;
    saveState();
    applyBoxState();
    updateAll();
    playShuffle();
    showToast(
      hadOpened
        ? "换了一批新的十盒 · 已经拆到的都留在图鉴里"
        : "换了一批新的十盒 · 今日次数不变"
    );
  };

  const openDrawDialog = (record) => {
    const boxNumber = pad(record.box + 1);
    els.drawCard.className = "draw-card is-opening";
    els.drawCard.innerHTML = `<div class="opening">
      <p class="opening-kicker">UNBOXING · No.${boxNumber}</p>
      <div class="opening-stage" aria-hidden="true">
        <span class="opening-halo"></span>
        <span class="opening-rings"></span>
        <span class="opening-spark opening-spark--one">✦</span>
        <span class="opening-spark opening-spark--two">✦</span>
        <span class="opening-spark opening-spark--three">✧</span>
        <div class="opening-box" style="--delay:none">${boxVisualMarkup(record.box)}</div>
      </div>
      <h2 class="opening-title">正在拆开你的盒子…</h2>
      <p class="opening-copy">深呼吸，好运正在路上。</p>
      <div class="opening-progress" aria-hidden="true"><span></span></div>
    </div>`;

    els.fxLayer.innerHTML = "";
    if (!els.drawDialog.open) {
      els.drawDialog.showModal();
      syncBodyLock();
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.clearTimeout(revealTimer);
    revealTimer = window.setTimeout(
      () => revealResult(record),
      reduced ? CONFIG.reducedOpeningDuration : CONFIG.openingDuration
    );
  };

  const renderProductResult = (record) => {
    const style = getStyleById(record.styleId);
    if (!style) return;

    const isDimoo = style.redeemable;
    const remaining = getRemaining();
    const ownedDimoo = getOwnedDimooIds().length;
    const ownedOther = getOwnedOtherIds().length;
    const countForStyle = state.collection[style.id] || 0;
    const primaryLabel =
      remaining > 0 ? `再挑一盒 · 还剩 ${remaining} 次` : "收好，回盒架";
    const repeatLine = countForStyle > 1 ? ` · 第 ${countForStyle} 次遇见` : "";
    const ownedLine = isDimoo
      ? `已收进图鉴 · DIMOO ${ownedDimoo}/17${repeatLine}`
      : `已收进图鉴 · 其他 IP ${ownedOther}/8${repeatLine}`;

    const body = isDimoo
      ? {
          cardClass: "draw-card is-prize",
          resultClass: "result result--prize",
          kicker: "YOU GOT A DIMOO · 可兑换",
          title: "是 DIMOO 呀。",
          sub: "这箱 10 个产品里，你抽到了 DIMOO。<br>截图发给我，我去买这一只。",
          art: styleArtwork(style, `result-${record.at}`),
          badgeClass: "result-badge",
          badge: "DIMOO 常规款 · 可兑换",
          series: `${style.ip} · ${style.seriesLabel}`,
          ownClass: "result-own is-redeemable",
          live: `抽到了 ${style.ip} ${style.seriesLabel}的 ${style.name}，可以兑换，已收进图鉴`,
        }
      : {
          cardClass: "draw-card is-other",
          resultClass: "result result--other",
          kicker: "ANOTHER POP MART · 不兑换",
          title: "是别的泡泡玛特呀。",
          sub: "这次不是 DIMOO。<br>按约定，这一只不买，只收进图鉴。",
          art: otherProductSVG(style, `result-${record.at}`),
          badgeClass: "result-badge result-badge--other",
          badge: "其他泡泡玛特 · 不兑换",
          series: `${style.ip} · ${style.seriesLabel}`,
          ownClass: "result-own is-not-redeemable",
          live: `抽到了 ${style.ip} ${style.seriesLabel}的 ${style.name}，其他泡泡玛特产品，按约定不兑换，已收进图鉴`,
        };

    if (style.hidden) {
      body.cardClass = "draw-card is-hidden";
      body.resultClass = "result result--hidden";
      body.kicker = "HIDDEN FOUND · 隐藏款";
      body.title = "是隐藏款 DIMOO！";
      body.sub = "这一批的隐藏，被你找到了。<br>截图发给我，我去把它带回来。";
      body.badgeClass = "result-badge result-badge--hidden";
      body.badge = "DIMOO 隐藏款 · 可兑换";
      body.series = `DIMOO · ${style.seriesLabel} · 隐藏款`;
      body.live = `抽到了隐藏款 DIMOO ${style.name}，可以兑换，已收进图鉴`;
    }

    els.drawCard.className = body.cardClass;
    els.drawCard.innerHTML = `<div class="${body.resultClass}">
      <button class="draw-close" type="button" data-close-draw aria-label="关闭拆盒结果">
        <svg class="icon"><use href="#i-close"></use></svg>
      </button>
      <p class="result-kicker">${body.kicker}</p>
      <h2>${body.title}</h2>
      <p class="result-sub">${body.sub}</p>
      <div class="result-art${style.image ? " result-art--photo" : ""}">
        <span class="art-orbit" aria-hidden="true"></span>
        ${body.art}
      </div>
      <span class="${body.badgeClass}">${body.badge}</span>
      <h3 class="result-name">${style.name}</h3>
      <p class="result-series">${body.series}</p>
      <p class="result-quote">“${style.quote}”</p>
      <span class="${body.ownClass}">${starMarkup("")} ${ownedLine}</span>
      <div class="result-actions">
        <button class="result-primary" type="button" data-close-draw>
          ${primaryLabel}
          ${remaining > 0 ? '<svg class="icon"><use href="#i-arrow"></use></svg>' : ""}
        </button>
        <button class="result-secondary" type="button" data-open-album>
          看看我的图鉴
          <svg class="icon"><use href="#i-grid"></use></svg>
        </button>
      </div>
      <p class="result-count">今天第 ${state.dayDraws.length} 次拆盒 · 还剩 ${remaining} 次机会</p>
    </div>`;
    els.liveRegion.textContent = body.live;
  };

  const revealResult = (record) => {
    if (!els.drawDialog.open || currentRecord !== record) return;
    const style = getStyleById(record.styleId);
    if (!style) return;
    isRevealed = true;
    renderProductResult(record);
    if (style.hidden) {
      playHidden();
      launchConfetti();
    } else if (style.redeemable) {
      playPrize();
      launchConfetti();
    } else {
      playOther();
      launchBubbles();
    }
  };

  const closeDrawDialog = () => {
    if (!isRevealed) return;
    els.drawDialog.close();
  };

  const handleDrawDialogClosed = () => {
    window.clearTimeout(revealTimer);
    revealTimer = null;
    window.clearTimeout(fxClearTimer);
    els.fxLayer.innerHTML = "";
    isRevealed = false;
    isDrawing = false;
    currentRecord = null;
    updateAll();
    syncBodyLock();
    if (pendingCaseToast) {
      pendingCaseToast = false;
      showToast(
        getRemaining() > 0
          ? "一箱 10 盒拆完啦，新的一箱已经补上"
          : "一箱 10 盒拆完啦，明天来拆新的一箱"
      );
    }
  };

  /* -------------------------------------------------------
     Dialogs
     ------------------------------------------------------- */

  const syncBodyLock = () => {
    const hasOpenDialog = Boolean(document.querySelector("dialog[open]"));
    document.body.classList.toggle(DIALOG_OPEN_CLASS, hasOpenDialog);
  };

  const openSheet = (dialog) => {
    if (dialog.open) return;
    if (dialog === els.albumDialog) renderAlbum();
    if (dialog === els.oddsDialog) renderRoster();
    dialog.showModal();
    syncBodyLock();
  };

  const closeSheet = (dialog) => {
    if (dialog.open) dialog.close();
  };

  const openAlbumFromResult = () => {
    closeDrawDialog();
    window.setTimeout(() => openSheet(els.albumDialog), 120);
  };

  /* -------------------------------------------------------
     Toast
     ------------------------------------------------------- */

  const showToast = (message) => {
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      els.toast.classList.remove("is-visible");
    }, 2300);
  };

  /* -------------------------------------------------------
     Audio — tiny synthesised sounds, no files needed
     ------------------------------------------------------- */

  const getAudioContext = () => {
    if (!state.sound) return null;
    try {
      if (!audioContext) {
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) return null;
        audioContext = new AudioCtor();
      }
      if (audioContext.state === "suspended") audioContext.resume();
      return audioContext;
    } catch {
      return null;
    }
  };

  const tone = (frequency, duration = 0.25, options = {}) => {
    const context = getAudioContext();
    if (!context) return;
    const {
      type = "sine",
      gain = 0.035,
      delay = 0,
      slideTo = null,
      attack = 0.012,
    } = options;

    const startAt = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const volume = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startAt);
    if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), startAt + duration);
    volume.gain.setValueAtTime(0.0001, startAt);
    volume.gain.exponentialRampToValueAtTime(gain, startAt + attack);
    volume.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(volume);
    volume.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.03);
  };

  const noiseBurst = (duration = 0.16, gain = 0.045, delay = 0) => {
    const context = getAudioContext();
    if (!context) return;
    try {
      const frameCount = Math.floor(context.sampleRate * duration);
      const buffer = context.createBuffer(1, frameCount, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < frameCount; index += 1) {
        const fade = 1 - index / frameCount;
        data[index] = (Math.random() * 2 - 1) * fade * fade;
      }
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const volume = context.createGain();
      const startAt = context.currentTime + delay;
      source.buffer = buffer;
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1700, startAt);
      filter.Q.setValueAtTime(0.8, startAt);
      volume.gain.setValueAtTime(gain, startAt);
      volume.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
      source.connect(filter);
      filter.connect(volume);
      volume.connect(context.destination);
      source.start(startAt);
    } catch {
      // Sound is a nicety, never a requirement.
    }
  };

  const playTick = () => tone(660, 0.075, { type: "sine", gain: 0.018, slideTo: 720 });
  const playShake = () => {
    tone(260, 0.16, { type: "triangle", gain: 0.025, slideTo: 380 });
    noiseBurst(0.09, 0.018, 0.04);
  };
  const playRustle = () => noiseBurst(0.2, 0.035, 0);
  const playShuffle = () => {
    noiseBurst(0.24, 0.032, 0);
    tone(392, 0.16, { type: "triangle", gain: 0.021, slideTo: 523.25 });
    tone(659.25, 0.22, { type: "sine", gain: 0.014, delay: 0.08 });
  };
  const playHint = () => {
    noiseBurst(0.2, 0.028, 0);
    tone(330, 0.16, { type: "triangle", gain: 0.021, slideTo: 280 });
  };
  const playHintReveal = () => {
    tone(783.99, 0.16, { type: "sine", gain: 0.024 });
    tone(1046.5, 0.32, { type: "sine", gain: 0.018, delay: 0.1 });
    noiseBurst(0.08, 0.01, 0.01);
  };
  const playPrize = () => {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((frequency, index) => {
      tone(frequency, 0.55, { type: "triangle", gain: 0.033, delay: index * 0.095 });
      tone(frequency * 2, 0.4, { type: "sine", gain: 0.011, delay: index * 0.095 + 0.02 });
    });
    tone(1567.98, 0.7, { type: "sine", gain: 0.014, delay: 0.43 });
    noiseBurst(0.25, 0.018, 0.5);
  };
  const playHidden = () => {
    const notes = [659.25, 783.99, 987.77, 1318.51, 1567.98, 2093];
    notes.forEach((frequency, index) => {
      tone(frequency, 0.5, { type: "sine", gain: 0.026, delay: index * 0.085 });
      tone(frequency * 2, 0.38, { type: "sine", gain: 0.008, delay: index * 0.085 + 0.02 });
    });
    noiseBurst(0.22, 0.02, 0.42);
    tone(1046.5, 0.9, { type: "sine", gain: 0.012, delay: 0.58 });
  };
  const playOther = () => {
    tone(523.25, 0.4, { type: "sine", gain: 0.022 });
    tone(659.25, 0.5, { type: "sine", gain: 0.017, delay: 0.12 });
    tone(783.99, 0.55, { type: "sine", gain: 0.011, delay: 0.24 });
    noiseBurst(0.09, 0.009, 0.12);
  };
  const playEmpty = () => {
    tone(440, 0.5, { type: "sine", gain: 0.026, slideTo: 392 });
    tone(329.63, 0.65, { type: "sine", gain: 0.021, delay: 0.18 });
    noiseBurst(0.12, 0.012, 0.05);
  };

  /* -------------------------------------------------------
     Confetti + bubbles
     ------------------------------------------------------- */

  const launchConfetti = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#c9b6df", "#e6cda4", "#f6e7cf", "#d8a9ad", "#a9c1bd", "#fffaf2", "#b9935d"];
    const pieces = [];
    for (let index = 0; index < 44; index += 1) {
      const size = 5 + randomUnit() * 6;
      const shapeRoll = randomUnit();
      const radius = shapeRoll > 0.76 ? "50%" : shapeRoll > 0.4 ? "2px" : "0";
      pieces.push(
        `<i class="confetti" style="--x:${(randomUnit() * 100).toFixed(1)}%;--w:${size.toFixed(1)}px;--h:${(
          size * (0.55 + randomUnit() * 0.9)
        ).toFixed(1)}px;--c:${colors[randomInt(colors.length)]};--r:${radius};--rot:${(
          randomUnit() * 180
        ).toFixed(0)}deg;--drift:${((randomUnit() - 0.5) * 24).toFixed(1)}vw;--dur:${(
          1.8 +
          randomUnit() * 1.4
        ).toFixed(2)}s;--delay:${(randomUnit() * 0.38).toFixed(2)}s"></i>`
      );
    }
    els.fxLayer.innerHTML = pieces.join("");
    window.clearTimeout(fxClearTimer);
    fxClearTimer = window.setTimeout(() => {
      els.fxLayer.innerHTML = "";
    }, 4200);
  };

  const launchBubbles = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bubbles = [];
    for (let index = 0; index < 14; index += 1) {
      const size = 7 + randomUnit() * 18;
      bubbles.push(
        `<i class="bubble" style="--x:${(randomUnit() * 100).toFixed(1)}%;--s:${size.toFixed(
          1
        )}px;--drift:${((randomUnit() - 0.5) * 12).toFixed(1)}vw;--dur:${(
          3.8 +
          randomUnit() * 2.4
        ).toFixed(2)}s;--delay:${(randomUnit() * 0.5).toFixed(2)}s"></i>`
      );
    }
    els.fxLayer.innerHTML = bubbles.join("");
    window.clearTimeout(fxClearTimer);
    fxClearTimer = window.setTimeout(() => {
      els.fxLayer.innerHTML = "";
    }, 7000);
  };

  /* -------------------------------------------------------
     Event wiring
     ------------------------------------------------------- */

  const bindEvents = () => {
    els.boxGrid.addEventListener("click", (event) => {
      const box = event.target.closest(".blind-box");
      if (!box || box.classList.contains("is-opened")) return;
      selectBox(Number(box.dataset.box));
    });

    els.drawButton.addEventListener("click", beginDraw);
    els.hintButton.addEventListener("click", useHint);
    els.reshuffleButton?.addEventListener("click", reshuffleBatch);

    els.soundButton.addEventListener("click", () => {
      state.sound = !state.sound;
      saveState();
      updateSoundButton();
      if (state.sound) {
        tone(660, 0.12, { type: "sine", gain: 0.025, slideTo: 880 });
        showToast("音效已打开");
      } else {
        showToast("音效已关闭");
      }
    });

    els.openAlbumButton.addEventListener("click", () => openSheet(els.albumDialog));
    els.albumFeature.addEventListener("click", () => openSheet(els.albumDialog));
    els.oddsFeature.addEventListener("click", () => openSheet(els.oddsDialog));

    $$("[data-close-dialog]").forEach((button) => {
      button.addEventListener("click", () => {
        const dialog = button.closest("dialog");
        if (dialog) closeSheet(dialog);
      });
    });

    [els.albumDialog, els.oddsDialog].forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) closeSheet(dialog);
      });
      dialog.addEventListener("close", syncBodyLock);
    });

    els.drawCard.addEventListener("click", (event) => {
      const closeButton = event.target.closest("[data-close-draw]");
      if (closeButton) {
        if (closeButton.classList.contains("draw-close") || isRevealed) closeDrawDialog();
        return;
      }
      if (event.target.closest("[data-open-album]")) {
        openAlbumFromResult();
      }
    });

    els.drawDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      if (isRevealed) closeDrawDialog();
    });

    els.drawDialog.addEventListener("click", (event) => {
      if (event.target === els.drawViewport && isRevealed) closeDrawDialog();
    });

    els.drawDialog.addEventListener("close", handleDrawDialogClosed);

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        ensureCurrentDay();
        updateCountdown();
        updateAll();
      }
    });

    window.addEventListener("storage", (event) => {
      if (event.key === CONFIG.storageKey && !els.drawDialog.open) {
        state = loadState();
        if (state.day !== formatDateKey()) resetForNewDay(false);
        selectFirstAvailableBox();
        renderBoxes();
        updateAll();
      }
    });
  };

  /* -------------------------------------------------------
     PWA
     ------------------------------------------------------- */

  const registerServiceWorker = () => {
    if (!("serviceWorker" in navigator) || !/^https?:$/.test(window.location.protocol)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        // Offline support is optional; the page works without it.
      });
    });
  };

  /* -------------------------------------------------------
     Start
     ------------------------------------------------------- */

  const init = () => {
    state = loadState();
    const today = formatDateKey();
    lastDayCheck = today;
    if (state.day !== today) {
      state.day = today;
      state.dayDraws = [];
    }
    saveState();

    selectPreferredBox();
    renderBoxes();
    updateAll();
    updateCountdown();
    bindEvents();
    registerServiceWorker();

    if (!storageAvailable) {
      showToast("浏览器没有开启本地存储，记录可能无法保存");
    }

    window.setInterval(tick, 1000);
  };

  init();
})();
