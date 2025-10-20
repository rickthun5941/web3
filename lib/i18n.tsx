"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "en" | "zh" | "ko";

type TranslationDictionary = Record<Locale, Record<string, string>>;

const translations: TranslationDictionary = {
  en: {
    "site.title": "Web3 Lottery Hub",
    "site.baseline": "On-chain draws • instant settlement",
    "site.footer.notice":
      "© {year} Web3 Lottery Hub. All rights reserved.",
    "site.footer.configHint":
      "Configure `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`, `NEXT_PUBLIC_RPC_URL`, and `NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS` before deploying.",
    "footer.social.github": "GitHub",
    "footer.social.x": "X (Twitter)",
    "footer.social.discord": "Discord",
    "footer.columns.products": "Products",
    "footer.links.wallet": "Wallet",
    "footer.columns.protocol": "Protocol",
    "footer.links.governance": "Governance",
    "footer.links.votes": "Votes",
    "footer.links.developers": "Developers",
    "footer.links.brand": "Brand assets",
    "footer.columns.company": "Company",
    "footer.links.about": "About",
    "footer.links.careers": "Careers",
    "footer.links.blog": "Blog",
    "footer.columns.support": "Need help?",
    "footer.links.helpCenter": "Help center",
    "footer.links.contact": "Contact us",
    "language.english": "English",
    "language.chinese": "中文",
    "language.korean": "한국어",
    "shared.loading": "Loading...",
    "converter.title": "Swap ETH to Stablecoins",
    "converter.subtitle":
      "Preview how much USD-pegged liquidity you unlock before buying tickets.",
    "converter.status.loading": "fetching live rate",
    "converter.status.live": "live rate",
    "converter.status.fallback": "sample rate",
    "converter.sell.label": "Sell",
    "converter.sell.caption": "US${amount}",
    "converter.buy.label": "Buy",
    "converter.buy.caption": "≈ {amount} {symbol}",
    "converter.selectToken": "Select token",
    "converter.cta": "Get started",
    "converter.swap": "Swap direction",
    "converter.networks":
      "Buy and sell crypto across 14+ networks including Ethereum, Unichain, and Base.",
    "nav.dashboard": "Dashboard",
    "nav.lotteries": "Lottery Listings",
    "nav.purchase": "Buy Tickets",
    "nav.menu.open": "Open main menu",
    "nav.menu.close": "Close main menu",
    "dashboard.hero.heading": "Product Overview",
    "dashboard.hero.body":
      "The Web3 Lottery Hub is a global on-chain ticket marketplace. Powered by decentralized ledgers and smart contracts, every purchase, drawing, and payout executes transparently on-chain. Connect your wallet, pick your preferred asset, and enjoy low fees with privacy-first participation.",
    "dashboard.title": "Lottery Overview",
    "dashboard.description":
      "Monitor ticket velocity, jackpot growth, and on-chain liquidity in real time. Connect a wallet with the proper network to unlock write actions and live contract reads.",
    "dashboard.status.live": "live data",
    "dashboard.status.loading": "loading",
    "dashboard.status.fallback": "demo data",
    "dashboard.stat.jackpot.title": "Active Jackpot (ETH)",
    "dashboard.stat.jackpot.helper":
      "Total prize pool across current draws.",
    "dashboard.stat.ticketPrice.title": "Ticket Price (USDT)",
    "dashboard.stat.ticketPrice.helper":
      "Each ticket costs a fixed 2.00 USDT stablecoin equivalent.",
    "dashboard.stat.totalSold.title": "Tickets Sold",
    "dashboard.stat.totalSold.helper":
      "Lifecycle volume since the latest reset.",
    "dashboard.config.title": "Contract configuration",
    "dashboard.config.contract": "Lottery contract",
    "dashboard.config.provider": "Read provider",
    "dashboard.features.title": "Why the Web3 Lottery Hub works",
    "dashboard.features.subtitle":
      "Core capabilities that make on-chain ticketing safer, faster, and easier to adopt.",
    "dashboard.features.decentralized.title": "Decentralized execution",
    "dashboard.features.decentralized.body":
      "Ticket purchases, drawings, and payouts run without a central operator. Chain rules define every move.",
    "dashboard.features.secure.title": "Transparent & tamper-proof",
    "dashboard.features.secure.body":
      "Every transaction and drawing record lives on-chain, visible to anyone and shielded from manipulation.",
    "dashboard.features.privacy.title": "Private by design",
    "dashboard.features.privacy.body":
      "Place entries with wallet signatures only—no personal data required, full compliance-ready anonymity.",
    "dashboard.features.contracts.title": "Smart-contract automation",
    "dashboard.features.contracts.body":
      "Self-executing contracts handle ticketing, settlement, and rewards with zero manual intervention.",
    "dashboard.features.assets.title": "Multi-asset payments",
    "dashboard.features.assets.body":
      "Pay with ETH or leading stablecoins like USDT, USDC, and DAI for flexible treasury management.",
    "dashboard.features.global.title": "Borderless participation",
    "dashboard.features.global.body":
      "Anyone with an internet connection can join the draw instantly—no regional lockouts or red tape.",
    "lotteries.title": "Active Lottery Listings",
    "lotteries.description":
      "Browse current draws, evaluate jackpot momentum, and jump to the buy flow to capture entries. Data refreshes automatically when a wallet is connected to an RPC-enabled network.",
    "lotteries.refresh.updated": "Updated {time}",
    "lotteries.refresh.demo":
      "Demo data shown until contract reads are available.",
    "lotteries.card.jackpot": "Jackpot",
    "lotteries.card.ticketPrice": "Ticket price",
    "lotteries.card.closes": "Closes",
    "lotteries.card.button": "Purchase Tickets",
    "purchase.title": "Purchase Tickets",
    "purchase.description":
      "Submit buy orders directly to the lottery contract using your connected wallet. Double-check the target lottery ID, ticket quantity, and total cost before signing.",
    "purchase.network": "Connected network",
    "purchase.form.lotteryId.label": "Lottery ID",
    "purchase.form.lotteryId.placeholder":
      "Enter the on-chain lottery identifier",
    "purchase.form.quantity.label": "Ticket quantity",
    "purchase.form.quantity.placeholder": "Number of tickets",
    "purchase.summary.ticketPrice": "Ticket price (ETH)",
    "purchase.summary.quantity": "Quantity",
    "purchase.summary.total": "Total cost (ETH)",
    "purchase.form.submit": "Submit Transaction",
    "purchase.form.submitting": "Submitting…",
    "purchase.form.info":
      "Contracts will reject the transaction if the lottery ID is invalid or the pool is closed. Gas estimation happens inside your wallet client before signing.",
    "purchase.feedback.connectWallet":
      "Connect a wallet before purchasing.",
    "purchase.feedback.priceUnavailable":
      "Ticket price unavailable. Try again shortly.",
    "purchase.feedback.invalidLotteryId":
      "Enter a valid lottery identifier.",
    "purchase.feedback.invalidQuantity":
      "Quantity must be at least 1.",
    "purchase.feedback.txPending":
      "Transaction submitted. Waiting for confirmation…",
    "purchase.feedback.txSuccess":
      "Success! Tickets purchased and recorded on-chain.",
    "purchase.feedback.txFailed":
      "Purchase failed: {message}",
    "wallet.connect": "Connect Wallet",
    "wallet.disconnect": "Disconnect",
    "wallet.unknownChain": "Unknown",
    "purchase.games.selectionStyle": "Selection style",
    "purchase.games.manual": "Manual pick",
    "purchase.games.random": "Auto pick",
    "purchase.games.randomize": "Shuffle numbers",
    "purchase.games.clear": "Clear selection",
    "purchase.games.manualHelper":
      "Choose each number yourself. Requirements depend on the active play.",
    "purchase.games.randomHelper":
      "Auto pick generates a valid combination for the selected play.",
    "purchase.games.totalCombos": "Total combinations",
    "purchase.games.totalTickets": "{count} tickets",
    "purchase.games.confirm": "Confirm selection",
    "purchase.games.selectedExact": "{count} selected / {required} required",
    "purchase.games.selectedRange":
      "{count} selected (target {min}-{max})",
    "purchase.games.selectorTitle": "Lottery games",
    "purchase.games.selectorPlaceholder": "Select a lottery game",
    "purchase.games.selected": "Selected",
    "purchase.games.preview.title": "Generated ticket IDs",
    "purchase.games.preview.description":
      "Share or bookmark these virtual ticket IDs for your records. IDs refresh whenever you adjust the numbers.",
    "purchase.games.preview.overflow":
      "Showing first {count} tickets out of {total}.",
    "purchase.games.lottoMax.name": "LOTTO MAX",
    "purchase.games.lottoMax.description":
      "Play Canada's biggest jackpot game with 7-number picks or combo packs.",
    "purchase.games.lottoMax.hint":
      "Tap numbers to toggle. Combo plays expand into every eligible 7-number ticket automatically.",
    "purchase.games.lottoMax.pools.main": "Main numbers",
    "purchase.games.lottoMax.modes.standard.label":
      "Standard play (Pick 7)",
    "purchase.games.lottoMax.modes.standard.helper":
      "Choose exactly 7 numbers from 1-50.",
    "purchase.games.lottoMax.modes.standard.error.main":
      "Select exactly 7 numbers.",
    "purchase.games.lottoMax.modes.combo8.label": "Combo 8",
    "purchase.games.lottoMax.modes.combo8.helper":
      "Pick 8 numbers to generate 8 tickets.",
    "purchase.games.lottoMax.modes.combo8.error.main":
      "Select exactly 8 numbers.",
    "purchase.games.lottoMax.modes.combo9.label": "Combo 9",
    "purchase.games.lottoMax.modes.combo9.helper":
      "Pick 9 numbers to generate 36 tickets.",
    "purchase.games.lottoMax.modes.combo9.error.main":
      "Select exactly 9 numbers.",
    "purchase.games.lottoMax.modes.combo10.label": "Combo 10",
    "purchase.games.lottoMax.modes.combo10.helper":
      "Pick 10 numbers to generate 120 tickets.",
    "purchase.games.lottoMax.modes.combo10.error.main":
      "Select exactly 10 numbers.",
    "purchase.games.lotto649.name": "LOTTO 6/49",
    "purchase.games.lotto649.description":
      "Canada's classic 6-number draw with optional combo plays.",
    "purchase.games.lotto649.hint":
      "Choose your numbers from 1-49. Combo entries expand into all 6-number tickets automatically.",
    "purchase.games.lotto649.pools.main": "Main numbers",
    "purchase.games.lotto649.modes.standard.label":
      "Standard play (Pick 6)",
    "purchase.games.lotto649.modes.standard.helper":
      "Choose exactly 6 numbers from 1-49.",
    "purchase.games.lotto649.modes.standard.error.main":
      "Select exactly 6 numbers.",
    "purchase.games.lotto649.modes.combo7.label": "Combo 7",
    "purchase.games.lotto649.modes.combo7.helper":
      "Pick 7 numbers to generate 7 tickets.",
    "purchase.games.lotto649.modes.combo7.error.main":
      "Select exactly 7 numbers.",
    "purchase.games.lotto649.modes.combo8.label": "Combo 8",
    "purchase.games.lotto649.modes.combo8.helper":
      "Pick 8 numbers to generate 28 tickets.",
    "purchase.games.lotto649.modes.combo8.error.main":
      "Select exactly 8 numbers.",
    "purchase.games.lotto649.modes.combo9.label": "Combo 9",
    "purchase.games.lotto649.modes.combo9.helper":
      "Pick 9 numbers to generate 84 tickets.",
    "purchase.games.lotto649.modes.combo9.error.main":
      "Select exactly 9 numbers.",
    "purchase.games.ontario49.name": "Ontario 49",
    "purchase.games.ontario49.description":
      "Provincial 6-number draw with multi-number combo options.",
    "purchase.games.ontario49.hint":
      "Tap to toggle numbers from 1-49. Combo entries expand into every 6-number ticket.",
    "purchase.games.ontario49.pools.main": "Main numbers",
    "purchase.games.ontario49.modes.standard.label":
      "Standard play (Pick 6)",
    "purchase.games.ontario49.modes.standard.helper":
      "Choose exactly 6 numbers.",
    "purchase.games.ontario49.modes.standard.error.main":
      "Select exactly 6 numbers.",
    "purchase.games.ontario49.modes.combo7.label": "Combo 7",
    "purchase.games.ontario49.modes.combo7.helper":
      "Pick 7 numbers to generate 7 tickets.",
    "purchase.games.ontario49.modes.combo7.error.main":
      "Select exactly 7 numbers.",
    "purchase.games.dailyGrand.name": "Daily Grand",
    "purchase.games.dailyGrand.description":
      "Pick five numbers plus a Grand Number for a chance at $1,000 a day for life.",
    "purchase.games.dailyGrand.hint":
      "Choose five numbers from 1-49 and one Grand Number from 1-7.",
    "purchase.games.dailyGrand.pools.main": "Main numbers",
    "purchase.games.dailyGrand.pools.grand": "Grand Number",
    "purchase.games.dailyGrand.modes.standard.label": "Standard play",
    "purchase.games.dailyGrand.modes.standard.helper":
      "Pick 5 main numbers (1-49) and 1 Grand Number (1-7).",
    "purchase.games.dailyGrand.modes.standard.error.main":
      "Select exactly 5 main numbers.",
    "purchase.games.dailyGrand.modes.standard.error.grand":
      "Select exactly 1 Grand Number.",
    "purchase.games.lightningLotto.name": "Lightning Lotto",
    "purchase.games.lightningLotto.description":
      "Fast-paced jackpot with five numbers drawn instantly.",
    "purchase.games.lightningLotto.hint":
      "Choose five unique numbers from 1-49.",
    "purchase.games.lightningLotto.pools.main": "Main numbers",
    "purchase.games.lightningLotto.modes.standard.label": "Standard play",
    "purchase.games.lightningLotto.modes.standard.helper":
      "Pick exactly 5 numbers from 1-49.",
    "purchase.games.lightningLotto.modes.standard.error.main":
      "Select exactly 5 numbers.",
    "purchase.games.lottario.name": "Lottario",
    "purchase.games.lottario.description":
      "Ontario's Saturday draw featuring 6-number tickets and combo options.",
    "purchase.games.lottario.hint":
      "Tap numbers from 1-45. Combo plays expand into every 6-number ticket.",
    "purchase.games.lottario.pools.main": "Main numbers",
    "purchase.games.lottario.modes.standard.label":
      "Standard play (Pick 6)",
    "purchase.games.lottario.modes.standard.helper":
      "Choose exactly 6 numbers from 1-45.",
    "purchase.games.lottario.modes.standard.error.main":
      "Select exactly 6 numbers.",
    "purchase.games.lottario.modes.combo7.label": "Combo 7",
    "purchase.games.lottario.modes.combo7.helper":
      "Pick 7 numbers to generate 7 tickets.",
    "purchase.games.lottario.modes.combo7.error.main":
      "Select exactly 7 numbers.",
    "purchase.games.dailyKeno.name": "Daily Keno",
    "purchase.games.dailyKeno.description":
      "Pick your favourite Keno spot from 2 to 10 numbers.",
    "purchase.games.dailyKeno.hint":
      "Choose the spot size first, then select numbers from 1-70.",
    "purchase.games.dailyKeno.pools.main": "Main numbers",
    "purchase.games.dailyKeno.modes.spot2.label": "Spot 2",
    "purchase.games.dailyKeno.modes.spot2.helper":
      "Select exactly 2 numbers from 1-70.",
    "purchase.games.dailyKeno.modes.spot2.error.main":
      "Select exactly 2 numbers.",
    "purchase.games.dailyKeno.modes.spot3.label": "Spot 3",
    "purchase.games.dailyKeno.modes.spot3.helper":
      "Select exactly 3 numbers from 1-70.",
    "purchase.games.dailyKeno.modes.spot3.error.main":
      "Select exactly 3 numbers.",
    "purchase.games.dailyKeno.modes.spot4.label": "Spot 4",
    "purchase.games.dailyKeno.modes.spot4.helper":
      "Select exactly 4 numbers from 1-70.",
    "purchase.games.dailyKeno.modes.spot4.error.main":
      "Select exactly 4 numbers.",
    "purchase.games.dailyKeno.modes.spot5.label": "Spot 5",
    "purchase.games.dailyKeno.modes.spot5.helper":
      "Select exactly 5 numbers from 1-70.",
    "purchase.games.dailyKeno.modes.spot5.error.main":
      "Select exactly 5 numbers.",
    "purchase.games.dailyKeno.modes.spot6.label": "Spot 6",
    "purchase.games.dailyKeno.modes.spot6.helper":
      "Select exactly 6 numbers from 1-70.",
    "purchase.games.dailyKeno.modes.spot6.error.main":
      "Select exactly 6 numbers.",
    "purchase.games.dailyKeno.modes.spot7.label": "Spot 7",
    "purchase.games.dailyKeno.modes.spot7.helper":
      "Select exactly 7 numbers from 1-70.",
    "purchase.games.dailyKeno.modes.spot7.error.main":
      "Select exactly 7 numbers.",
    "purchase.games.dailyKeno.modes.spot8.label": "Spot 8",
    "purchase.games.dailyKeno.modes.spot8.helper":
      "Select exactly 8 numbers from 1-70.",
    "purchase.games.dailyKeno.modes.spot8.error.main":
      "Select exactly 8 numbers.",
    "purchase.games.dailyKeno.modes.spot9.label": "Spot 9",
    "purchase.games.dailyKeno.modes.spot9.helper":
      "Select exactly 9 numbers from 1-70.",
    "purchase.games.dailyKeno.modes.spot9.error.main":
      "Select exactly 9 numbers.",
    "purchase.games.dailyKeno.modes.spot10.label": "Spot 10",
    "purchase.games.dailyKeno.modes.spot10.helper":
      "Select exactly 10 numbers from 1-70.",
    "purchase.games.dailyKeno.modes.spot10.error.main":
      "Select exactly 10 numbers.",
    "purchase.games.pick4.name": "Pick 4",
    "purchase.games.pick4.description":
      "Daily game with four drawn digits from 0-9.",
    "purchase.games.pick4.hint":
      "Select four digits to build your ticket set.",
    "purchase.games.pick4.pools.digits": "Digits (0-9)",
    "purchase.games.pick4.modes.standard.label": "Standard play",
    "purchase.games.pick4.modes.standard.helper":
      "Choose exactly 4 digits (0-9).",
    "purchase.games.pick4.modes.standard.error.digits":
      "Select exactly 4 digits.",
    "purchase.games.pick3.name": "Pick 3",
    "purchase.games.pick3.description":
      "Daily game with three drawn digits from 0-9.",
    "purchase.games.pick3.hint":
      "Select three digits to build your ticket set.",
    "purchase.games.pick3.pools.digits": "Digits (0-9)",
    "purchase.games.pick3.modes.standard.label": "Standard play",
    "purchase.games.pick3.modes.standard.helper":
      "Choose exactly 3 digits (0-9).",
    "purchase.games.pick3.modes.standard.error.digits":
      "Select exactly 3 digits.",
    "purchase.summary.ticketPriceUsd": "Ticket price (USDT)",
    "purchase.summary.totalUsd": "Total cost (USDT)",
    "purchase.summary.pricePerTicketUsd": "2.00",
    "purchase.feedback.noTickets":
      "Add at least one confirmed ticket before submitting.",
    "purchase.summary.groups": "Ticket groups",
    "purchase.preview.groupLabel": "Group {index}",
    "purchase.preview.remove": "Remove",
    "purchase.preview.clearAll": "Clear all groups",
    "purchase.preview.samples": "Sample tickets",
    "purchase.preview.numbersLabel": "Numbers",
  },
  zh: {
    "site.title": "Web3 彩票平台",
    "site.baseline": "链上开奖 • 即时结算",
    "site.footer.notice": "© {year} Web3 彩票平台。保留所有权利。",
    "site.footer.configHint":
      "上线前请配置 `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`、`NEXT_PUBLIC_RPC_URL` 与 `NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS`。",
    "footer.social.github": "GitHub",
    "footer.social.x": "X",
    "footer.social.discord": "Discord",
    "footer.columns.products": "产品",
    "footer.links.wallet": "钱包",
    "footer.columns.protocol": "协议",
    "footer.links.governance": "治理",
    "footer.links.votes": "投票",
    "footer.links.developers": "开发人员",
    "footer.links.brand": "品牌资产",
    "footer.columns.company": "公司",
    "footer.links.about": "关于",
    "footer.links.careers": "职业",
    "footer.links.blog": "博客",
    "footer.columns.support": "需要帮助？",
    "footer.links.helpCenter": "帮助中心",
    "footer.links.contact": "联系我们",
    "language.english": "English",
    "language.chinese": "中文",
    "language.korean": "한국어",
    "shared.loading": "加载中...",
    "converter.title": "兑换 ETH",
    "converter.subtitle": "预览兑换为稳定币的额度，方便充值后购买彩票。",
    "converter.status.loading": "正在获取实时汇率",
    "converter.status.live": "实时汇率",
    "converter.status.fallback": "示例汇率",
    "converter.sell.label": "出售",
    "converter.sell.caption": "US${amount}",
    "converter.buy.label": "购买",
    "converter.buy.caption": "≈ {amount} {symbol}",
    "converter.selectToken": "选择代币",
    "converter.cta": "开始使用",
    "converter.swap": "切换方向",
    "converter.networks":
      "支持包含以太坊、Unichain、Base 在内的 14+ 条网络。",
    "nav.dashboard": "仪表盘",
    "nav.lotteries": "抽奖列表",
    "nav.purchase": "购买彩票",
    "nav.menu.open": "展开主菜单",
    "nav.menu.close": "收起主菜单",
    "dashboard.hero.heading": "产品概述",
    "dashboard.hero.body":
      "区块链彩票购买中心是一款面向全球玩家的 Web3 彩票交易平台。依托去中心化账本和智能合约，平台将购票、开奖、兑付全链上化，保证流程公开可信。用户只需连接钱包，即可使用喜爱的加密资产参与抽奖，享受更低手续费与更强隐私保护。",
    "dashboard.title": "抽奖概览",
    "dashboard.description":
      "实时关注彩票销量、奖池增长和链上流动性。连接正确网络的钱包即可解锁写入操作和实时合约读取。",
    "dashboard.status.live": "实时数据",
    "dashboard.status.loading": "加载中",
    "dashboard.status.fallback": "演示数据",
    "dashboard.stat.jackpot.title": "当前奖池（ETH）",
    "dashboard.stat.jackpot.helper": "当前所有开奖活动的总奖金额度。",
    "dashboard.stat.ticketPrice.title": "彩票价格（USDT）",
    "dashboard.stat.ticketPrice.helper":
      "每张彩票的固定售价为 2.00 USDT 稳定币。",
    "dashboard.stat.totalSold.title": "已售彩票数量",
    "dashboard.stat.totalSold.helper": "最近一次重置以来的累计销售量。",
    "dashboard.config.title": "合约配置",
    "dashboard.config.contract": "彩票合约地址",
    "dashboard.config.provider": "读取节点",
    "dashboard.features.title": "为什么选择区块链彩票中心",
    "dashboard.features.subtitle":
      "核心能力帮助你快速上手购买彩票，同时保障安全、效率与体验。",
    "dashboard.features.decentralized.title": "去中心化",
    "dashboard.features.decentralized.body":
      "购票、开奖、兑奖全过程无需中心机构干预，完全由链上规则自动执行。",
    "dashboard.features.secure.title": "透明与安全",
    "dashboard.features.secure.body":
      "全部交易与开奖记录永久存储在区块链上，公开可查且不可篡改，确保资金安全。",
    "dashboard.features.privacy.title": "隐私保护",
    "dashboard.features.privacy.body":
      "钱包签名即可下注，无需提交个人信息，在保障隐私的同时兼顾合规要求。",
    "dashboard.features.contracts.title": "智能合约",
    "dashboard.features.contracts.body":
      "购票、结算、派奖均由智能合约自动执行，减少人为操作错误，提高效率。",
    "dashboard.features.assets.title": "多币种支持",
    "dashboard.features.assets.body":
      "支持 ETH、USDT、USDC、DAI 等主流资产，自由选择支付方式。",
    "dashboard.features.global.title": "全球可达",
    "dashboard.features.global.body":
      "没有地域限制，只要连接互联网即可随时参与最新一期抽奖。",
    "lotteries.title": "进行中的抽奖活动",
    "lotteries.description":
      "浏览当前抽奖、评估奖池走势，并快速跳转至购买流程。连接支持 RPC 的钱包后会自动刷新数据。",
    "lotteries.refresh.updated": "{time} 更新",
    "lotteries.refresh.demo": "在合约读取可用前显示演示数据。",
    "lotteries.card.jackpot": "奖池",
    "lotteries.card.ticketPrice": "票价",
    "lotteries.card.closes": "截止时间",
    "lotteries.card.button": "立即购票",
    "purchase.title": "购买彩票",
    "purchase.description":
      "使用已连接的钱包直接向彩票合约提交购买请求。签名前请确认彩票 ID、购票数量与总花费。",
    "purchase.network": "当前网络",
    "purchase.form.lotteryId.label": "彩票 ID",
    "purchase.form.lotteryId.placeholder": "填写链上彩票编号",
    "purchase.form.quantity.label": "购票数量",
    "purchase.form.quantity.placeholder": "填写要购买的票数",
    "purchase.summary.ticketPrice": "单张票价（ETH）",
    "purchase.summary.quantity": "数量",
    "purchase.summary.total": "总花费（ETH）",
    "purchase.form.submit": "提交交易",
    "purchase.form.submitting": "提交中…",
    "purchase.form.info":
      "若彩票 ID 无效或奖池已关闭，合约会拒绝交易。钱包会在签名前估算所需 Gas。",
    "purchase.feedback.connectWallet": "请先连接钱包再进行购买。",
    "purchase.feedback.priceUnavailable":
      "无法获取票价，请稍后重试。",
    "purchase.feedback.invalidLotteryId": "请输入有效的彩票编号。",
    "purchase.feedback.invalidQuantity": "购票数量必须至少为 1。",
    "purchase.feedback.txPending": "交易已提交，等待链上确认…",
    "purchase.feedback.txSuccess": "购票成功，交易已在链上记录。",
    "purchase.feedback.txFailed": "购票失败：{message}",
    "wallet.connect": "连接钱包",
    "wallet.disconnect": "断开连接",
    "wallet.unknownChain": "未知网络",
    "purchase.games.selectionStyle": "选号方式",
    "purchase.games.manual": "手动选号",
    "purchase.games.random": "机选",
    "purchase.games.randomize": "重新机选",
    "purchase.games.clear": "清空选号",
    "purchase.games.manualHelper":
      "手动模式下由你自行挑选所有号码，具体要求取决于当前玩法。",
    "purchase.games.randomHelper":
      "机选会按照当前玩法的规则自动生成符合要求的号码组合。",
    "purchase.games.totalCombos": "组合总数",
    "purchase.games.totalTickets": "{count} 注",
    "purchase.games.confirm": "确认选号",
    "purchase.games.selectedExact": "已选 {count} 个 / 需 {required} 个",
    "purchase.games.selectedRange":
      "已选 {count} 个（目标 {min}-{max} 个）",
    "purchase.games.selectorTitle": "可选彩票",
    "purchase.games.selectorPlaceholder": "请选择彩票玩法",
    "purchase.games.selected": "当前选择",
    "purchase.games.preview.title": "生成的虚拟票号",
    "purchase.games.preview.description":
      "可将这些虚拟票号收藏或分享，调整号码后会重新生成。",
    "purchase.games.preview.overflow":
      "仅展示前 {count} 注，共 {total} 注。",
    "purchase.games.lottoMax.name": "LOTTO MAX",
    "purchase.games.lottoMax.description":
      "加拿大最受欢迎的 7 选乐透，可选择单式或组合投注。",
    "purchase.games.lottoMax.hint":
      "点击切换号码。组合投注会自动覆盖所有符合条件的 7 个号码组合。",
    "purchase.games.lottoMax.pools.main": "主号码",
    "purchase.games.lottoMax.modes.standard.label": "标准玩法（选 7）",
    "purchase.games.lottoMax.modes.standard.helper":
      "从 1-50 中选择 7 个号码。",
    "purchase.games.lottoMax.modes.standard.error.main":
      "需选择 7 个号码。",
    "purchase.games.lottoMax.modes.combo8.label": "组合 8",
    "purchase.games.lottoMax.modes.combo8.helper":
      "选择 8 个号码，可生成 8 注标准投注。",
    "purchase.games.lottoMax.modes.combo8.error.main":
      "需选择 8 个号码。",
    "purchase.games.lottoMax.modes.combo9.label": "组合 9",
    "purchase.games.lottoMax.modes.combo9.helper":
      "选择 9 个号码，可生成 36 注标准投注。",
    "purchase.games.lottoMax.modes.combo9.error.main":
      "需选择 9 个号码。",
    "purchase.games.lottoMax.modes.combo10.label": "组合 10",
    "purchase.games.lottoMax.modes.combo10.helper":
      "选择 10 个号码，可生成 120 注标准投注。",
    "purchase.games.lottoMax.modes.combo10.error.main":
      "需选择 10 个号码。",
    "purchase.games.lotto649.name": "LOTTO 6/49",
    "purchase.games.lotto649.description":
      "经典全国 6 选乐透，可搭配组合玩法。",
    "purchase.games.lotto649.hint":
      "从 1-49 中选择号码。组合投注会自动展开为所有 6 个号码组合。",
    "purchase.games.lotto649.pools.main": "主号码",
    "purchase.games.lotto649.modes.standard.label": "标准玩法（选 6）",
    "purchase.games.lotto649.modes.standard.helper":
      "从 1-49 中选择 6 个号码。",
    "purchase.games.lotto649.modes.standard.error.main":
      "需选择 6 个号码。",
    "purchase.games.lotto649.modes.combo7.label": "组合 7",
    "purchase.games.lotto649.modes.combo7.helper":
      "选择 7 个号码，可生成 7 注。",
    "purchase.games.lotto649.modes.combo7.error.main":
      "需选择 7 个号码。",
    "purchase.games.lotto649.modes.combo8.label": "组合 8",
    "purchase.games.lotto649.modes.combo8.helper":
      "选择 8 个号码，可生成 28 注。",
    "purchase.games.lotto649.modes.combo8.error.main":
      "需选择 8 个号码。",
    "purchase.games.lotto649.modes.combo9.label": "组合 9",
    "purchase.games.lotto649.modes.combo9.helper":
      "选择 9 个号码，可生成 84 注。",
    "purchase.games.lotto649.modes.combo9.error.main":
      "需选择 9 个号码。",
    "purchase.games.ontario49.name": "Ontario 49",
    "purchase.games.ontario49.description":
      "安省 6 选乐透，支持多号码组合。",
    "purchase.games.ontario49.hint":
      "从 1-49 中点击切换号码，组合投注会自动展开为全部 6 个号码组合。",
    "purchase.games.ontario49.pools.main": "主号码",
    "purchase.games.ontario49.modes.standard.label": "标准玩法（选 6）",
    "purchase.games.ontario49.modes.standard.helper":
      "选择 6 个号码。",
    "purchase.games.ontario49.modes.standard.error.main":
      "需选择 6 个号码。",
    "purchase.games.ontario49.modes.combo7.label": "组合 7",
    "purchase.games.ontario49.modes.combo7.helper":
      "选择 7 个号码，可生成 7 注。",
    "purchase.games.ontario49.modes.combo7.error.main":
      "需选择 7 个号码。",
    "purchase.games.dailyGrand.name": "Daily Grand",
    "purchase.games.dailyGrand.description":
      "选择 5 个主号码和 1 个 Grand 号码，有机会赢取终身大奖。",
    "purchase.games.dailyGrand.hint":
      "选择 5 个主号码（1-49）及 1 个 Grand 号码（1-7）。",
    "purchase.games.dailyGrand.pools.main": "主号码",
    "purchase.games.dailyGrand.pools.grand": "Grand 号码",
    "purchase.games.dailyGrand.modes.standard.label": "标准玩法",
    "purchase.games.dailyGrand.modes.standard.helper":
      "选择 5 个主号码和 1 个 Grand 号码。",
    "purchase.games.dailyGrand.modes.standard.error.main":
      "需选择 5 个主号码。",
    "purchase.games.dailyGrand.modes.standard.error.grand":
      "需选择 1 个 Grand 号码。",
    "purchase.games.lightningLotto.name": "Lightning Lotto",
    "purchase.games.lightningLotto.description":
      "极速开奖的五位号码乐透。",
    "purchase.games.lightningLotto.hint":
      "从 1-49 中选择 5 个不重复的号码。",
    "purchase.games.lightningLotto.pools.main": "主号码",
    "purchase.games.lightningLotto.modes.standard.label": "标准玩法",
    "purchase.games.lightningLotto.modes.standard.helper":
      "选择 5 个号码。",
    "purchase.games.lightningLotto.modes.standard.error.main":
      "需选择 5 个号码。",
    "purchase.games.lottario.name": "Lottario",
    "purchase.games.lottario.description":
      "安省周六开奖的 6 选乐透，提供组合玩法。",
    "purchase.games.lottario.hint":
      "从 1-45 中点击号码，组合投注会展开为所有 6 个号码组合。",
    "purchase.games.lottario.pools.main": "主号码",
    "purchase.games.lottario.modes.standard.label": "标准玩法（选 6）",
    "purchase.games.lottario.modes.standard.helper":
      "选择 6 个号码。",
    "purchase.games.lottario.modes.standard.error.main":
      "需选择 6 个号码。",
    "purchase.games.lottario.modes.combo7.label": "组合 7",
    "purchase.games.lottario.modes.combo7.helper":
      "选择 7 个号码，可生成 7 注。",
    "purchase.games.lottario.modes.combo7.error.main":
      "需选择 7 个号码。",
    "purchase.games.dailyKeno.name": "Daily Keno",
    "purchase.games.dailyKeno.description":
      "选择 2-10 个号码的 Keno 玩法。",
    "purchase.games.dailyKeno.hint":
      "先确认 Spot 玩法，再从 1-70 中选择对应数量的号码。",
    "purchase.games.dailyKeno.pools.main": "主号码",
    "purchase.games.dailyKeno.modes.spot2.label": "Spot 2（选 2 个）",
    "purchase.games.dailyKeno.modes.spot2.helper":
      "从 1-70 中选择 2 个号码。",
    "purchase.games.dailyKeno.modes.spot2.error.main":
      "需选择 2 个号码。",
    "purchase.games.dailyKeno.modes.spot3.label": "Spot 3（选 3 个）",
    "purchase.games.dailyKeno.modes.spot3.helper":
      "从 1-70 中选择 3 个号码。",
    "purchase.games.dailyKeno.modes.spot3.error.main":
      "需选择 3 个号码。",
    "purchase.games.dailyKeno.modes.spot4.label": "Spot 4（选 4 个）",
    "purchase.games.dailyKeno.modes.spot4.helper":
      "从 1-70 中选择 4 个号码。",
    "purchase.games.dailyKeno.modes.spot4.error.main":
      "需选择 4 个号码。",
    "purchase.games.dailyKeno.modes.spot5.label": "Spot 5（选 5 个）",
    "purchase.games.dailyKeno.modes.spot5.helper":
      "从 1-70 中选择 5 个号码。",
    "purchase.games.dailyKeno.modes.spot5.error.main":
      "需选择 5 个号码。",
    "purchase.games.dailyKeno.modes.spot6.label": "Spot 6（选 6 个）",
    "purchase.games.dailyKeno.modes.spot6.helper":
      "从 1-70 中选择 6 个号码。",
    "purchase.games.dailyKeno.modes.spot6.error.main":
      "需选择 6 个号码。",
    "purchase.games.dailyKeno.modes.spot7.label": "Spot 7（选 7 个）",
    "purchase.games.dailyKeno.modes.spot7.helper":
      "从 1-70 中选择 7 个号码。",
    "purchase.games.dailyKeno.modes.spot7.error.main":
      "需选择 7 个号码。",
    "purchase.games.dailyKeno.modes.spot8.label": "Spot 8（选 8 个）",
    "purchase.games.dailyKeno.modes.spot8.helper":
      "从 1-70 中选择 8 个号码。",
    "purchase.games.dailyKeno.modes.spot8.error.main":
      "需选择 8 个号码。",
    "purchase.games.dailyKeno.modes.spot9.label": "Spot 9（选 9 个）",
    "purchase.games.dailyKeno.modes.spot9.helper":
      "从 1-70 中选择 9 个号码。",
    "purchase.games.dailyKeno.modes.spot9.error.main":
      "需选择 9 个号码。",
    "purchase.games.dailyKeno.modes.spot10.label": "Spot 10（选 10 个）",
    "purchase.games.dailyKeno.modes.spot10.helper":
      "从 1-70 中选择 10 个号码。",
    "purchase.games.dailyKeno.modes.spot10.error.main":
      "需选择 10 个号码。",
    "purchase.games.pick4.name": "Pick 4",
    "purchase.games.pick4.description": "每日开奖的四位数字游戏。",
    "purchase.games.pick4.hint": "选择 4 个数字组合成投注号码。",
    "purchase.games.pick4.pools.digits": "数字（0-9）",
    "purchase.games.pick4.modes.standard.label": "标准玩法",
    "purchase.games.pick4.modes.standard.helper": "选择 4 个数字。",
    "purchase.games.pick4.modes.standard.error.digits":
      "需选择 4 个数字。",
    "purchase.games.pick3.name": "Pick 3",
    "purchase.games.pick3.description": "每日开奖的三位数字游戏。",
    "purchase.games.pick3.hint": "选择 3 个数字组合成投注号码。",
    "purchase.games.pick3.pools.digits": "数字（0-9）",
    "purchase.games.pick3.modes.standard.label": "标准玩法",
    "purchase.games.pick3.modes.standard.helper": "选择 3 个数字。",
    "purchase.games.pick3.modes.standard.error.digits":
      "需选择 3 个数字。",
    "purchase.summary.ticketPriceUsd": "彩票单价（USDT）",
    "purchase.summary.totalUsd": "总花费（USDT）",
    "purchase.summary.pricePerTicketUsd": "2.00",
    "purchase.feedback.noTickets": "请至少确认一组彩票后再提交。",
    "purchase.summary.groups": "选号组数",
    "purchase.preview.groupLabel": "第 {index} 组",
    "purchase.preview.remove": "移除",
    "purchase.preview.clearAll": "一键移除",
    "purchase.preview.samples": "示例号码",
    "purchase.preview.numbersLabel": "号码",
  },
  ko: {
    "site.title": "Web3 복권 허브",
    "site.baseline": "온체인 추첨 • 즉시 정산",
    "site.footer.notice":
      "© {year} Web3 복권 허브. 모든 권리 보유.",
    "site.footer.configHint":
      "배포 전에 `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`, `NEXT_PUBLIC_RPC_URL`, `NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS` 값을 설정하세요.",
    "footer.social.github": "GitHub",
    "footer.social.x": "X",
    "footer.social.discord": "Discord",
    "footer.columns.products": "제품",
    "footer.links.wallet": "지갑",
    "footer.columns.protocol": "프로토콜",
    "footer.links.governance": "거버넌스",
    "footer.links.votes": "투표",
    "footer.links.developers": "개발자",
    "footer.links.brand": "브랜드 에셋",
    "footer.columns.company": "회사",
    "footer.links.about": "소개",
    "footer.links.careers": "채용",
    "footer.links.blog": "블로그",
    "footer.columns.support": "도움이 필요하신가요?",
    "footer.links.helpCenter": "도움말 센터",
    "footer.links.contact": "문의하기",
    "language.english": "English",
    "language.chinese": "中文",
    "language.korean": "한국어",
    "shared.loading": "불러오는 중...",
    "converter.title": "ETH 교환",
    "converter.subtitle":
      "티켓 구매 전에 달러 연동 자산으로 전환할 금액을 미리 확인하세요.",
    "converter.status.loading": "실시간 환율 불러오는 중",
    "converter.status.live": "실시간 환율",
    "converter.status.fallback": "샘플 환율",
    "converter.sell.label": "매도",
    "converter.sell.caption": "US${amount}",
    "converter.buy.label": "매수",
    "converter.buy.caption": "≈ {amount} {symbol}",
    "converter.selectToken": "토큰 선택",
    "converter.cta": "시작하기",
    "converter.swap": "방향 전환",
    "converter.networks":
      "이더리움, Unichain, Base 등을 포함한 14개 이상의 네트워크를 지원합니다.",
    "nav.dashboard": "대시보드",
    "nav.lotteries": "복권 목록",
    "nav.purchase": "티켓 구매",
    "nav.menu.open": "메인 메뉴 열기",
    "nav.menu.close": "메인 메뉴 닫기",
    "dashboard.hero.heading": "제품 개요",
    "dashboard.hero.body":
      "Web3 복권 허브는 전 세계 사용자를 위한 온체인 복권 거래 플랫폼입니다. 분산 원장과 스마트 컨트랙트에 기반해 구매, 추첨, 지급까지 모든 과정을 온체인으로 처리하여 투명성을 보장합니다. 지갑을 연결하고 선호하는 자산으로 참여하면 낮은 수수료와 향상된 프라이버시를 누릴 수 있습니다.",
    "dashboard.title": "복권 개요",
    "dashboard.description":
      "티켓 판매 속도, 잭팟 성장, 온체인 유동성을 실시간으로 확인하세요. 올바른 네트워크로 지갑을 연결하면 쓰기 작업과 실시간 읽기가 활성화됩니다.",
    "dashboard.status.live": "실시간 데이터",
    "dashboard.status.loading": "불러오는 중",
    "dashboard.status.fallback": "데모 데이터",
    "dashboard.stat.jackpot.title": "현재 잭팟 (ETH)",
    "dashboard.stat.jackpot.helper": "현재 진행 중인 추첨의 총 상금 풀입니다.",
    "dashboard.stat.ticketPrice.title": "티켓 가격 (USDT)",
    "dashboard.stat.ticketPrice.helper":
      "각 티켓은 2.00 USDT 고정가로 판매됩니다.",
    "dashboard.stat.totalSold.title": "판매된 티켓 수",
    "dashboard.stat.totalSold.helper":
      "마지막 초기화 이후 누적 판매량입니다.",
    "dashboard.config.title": "컨트랙트 설정",
    "dashboard.config.contract": "복권 컨트랙트",
    "dashboard.config.provider": "읽기용 프로바이더",
    "dashboard.features.title": "Web3 복권 허브를 선택해야 하는 이유",
    "dashboard.features.subtitle":
      "온체인 티켓 구매를 더 안전하고 신속하며 직관적으로 만드는 핵심 역량입니다.",
    "dashboard.features.decentralized.title": "탈중앙 실행",
    "dashboard.features.decentralized.body":
      "티켓 구매, 추첨, 상금 지급 전 과정이 중앙 운영자 없이 체인 규칙으로 진행됩니다.",
    "dashboard.features.secure.title": "투명성과 보안",
    "dashboard.features.secure.body":
      "모든 거래와 추첨 기록이 온체인에 공개 저장되어 누구나 검증할 수 있고 변조가 불가능합니다.",
    "dashboard.features.privacy.title": "프라이버시 우선",
    "dashboard.features.privacy.body":
      "지갑 서명만으로 참여하며 개인 정보를 제출할 필요가 없어 익명성과 규제 대응을 동시에 확보합니다.",
    "dashboard.features.contracts.title": "스마트 컨트랙트 자동화",
    "dashboard.features.contracts.body":
      "스마트 컨트랙트가 티켓 발권, 정산, 보상 분배를 자동으로 처리해 인적 오류를 제거합니다.",
    "dashboard.features.assets.title": "다중 자산 결제",
    "dashboard.features.assets.body":
      "ETH와 USDT, USDC, DAI 등 주요 스테이블코인으로 유연하게 결제할 수 있습니다.",
    "dashboard.features.global.title": "글로벌 참여",
    "dashboard.features.global.body":
      "인터넷만 연결되면 누구나 즉시 추첨에 참여할 수 있으며, 지역 제한이 없습니다.",
    "lotteries.title": "진행 중인 복권",
    "lotteries.description":
      "현재 추첨을 둘러보고 잭팟 추세를 확인한 뒤 구매 흐름으로 이동하세요. RPC 네트워크에 연결된 지갑이 있으면 데이터가 자동으로 새로고침됩니다.",
    "lotteries.refresh.updated": "{time} 업데이트",
    "lotteries.refresh.demo":
      "컨트랙트 조회가 가능해질 때까지 데모 데이터를 표시합니다.",
    "lotteries.card.jackpot": "잭팟",
    "lotteries.card.ticketPrice": "티켓 가격",
    "lotteries.card.closes": "종료",
    "lotteries.card.button": "티켓 구매",
    "purchase.title": "티켓 구매",
    "purchase.description":
      "연결된 지갑으로 복권 컨트랙트에 직접 구매 주문을 제출하세요. 서명 전에 복권 ID, 수량, 총 비용을 확인하세요.",
    "purchase.network": "연결된 네트워크",
    "purchase.form.lotteryId.label": "복권 ID",
    "purchase.form.lotteryId.placeholder": "온체인 복권 번호를 입력하세요",
    "purchase.form.quantity.label": "티켓 수량",
    "purchase.form.quantity.placeholder": "구매할 티켓 수",
    "purchase.summary.ticketPrice": "티켓 가격 (ETH)",
    "purchase.summary.quantity": "수량",
    "purchase.summary.total": "총 비용 (ETH)",
    "purchase.form.submit": "거래 제출",
    "purchase.form.submitting": "제출 중…",
    "purchase.form.info":
      "복권 ID가 잘못되었거나 풀이 종료된 경우 컨트랙트가 거래를 거부합니다. 서명 전에 지갑에서 Gas를 추산합니다.",
    "purchase.feedback.connectWallet":
      "구매 전에 지갑을 연결하세요.",
    "purchase.feedback.priceUnavailable":
      "티켓 가격을 불러올 수 없습니다. 잠시 후 다시 시도하세요.",
    "purchase.feedback.invalidLotteryId":
      "유효한 복권 ID를 입력하세요.",
    "purchase.feedback.invalidQuantity":
      "티켓 수량은 1 이상이어야 합니다.",
    "purchase.feedback.txPending":
      "거래가 제출되었습니다. 확인을 기다리는 중…",
    "purchase.feedback.txSuccess":
      "구매 완료! 거래가 온체인에 기록되었습니다.",
    "purchase.feedback.txFailed":
      "구매 실패: {message}",
    "wallet.connect": "지갑 연결",
    "wallet.disconnect": "연결 해제",
    "wallet.unknownChain": "알 수 없음",
    "purchase.games.selectionStyle": "번호 선택 방식",
    "purchase.games.manual": "수동 선택",
    "purchase.games.random": "자동 선택",
    "purchase.games.randomize": "번호 다시뽑기",
    "purchase.games.clear": "선택 초기화",
    "purchase.games.manualHelper":
      "수동 모드에서는 선택한 플레이의 규칙에 따라 번호를 직접 고릅니다.",
    "purchase.games.randomHelper":
      "자동 선택은 현재 플레이 조건을 만족하는 조합을 생성합니다.",
    "purchase.games.totalCombos": "조합 수",
    "purchase.games.totalTickets": "{count}장",
    "purchase.games.confirm": "선택 확정",
    "purchase.games.selectedExact": "선택 {count}개 / 필요 {required}개",
    "purchase.games.selectedRange":
      "선택 {count}개 (목표 {min}-{max}개)",
    "purchase.games.selectorTitle": "복권 종류",
    "purchase.games.selectorPlaceholder": "복권을 선택하세요",
    "purchase.games.selected": "선택됨",
    "purchase.games.preview.title": "발급된 티켓 ID",
    "purchase.games.preview.description":
      "번호를 조정하면 새로운 가상 티켓 ID가 생성되며 기록하거나 공유할 수 있습니다.",
    "purchase.games.preview.overflow":
      "총 {total}장 중 앞의 {count}장만 표시합니다.",
    "purchase.games.lottoMax.name": "LOTTO MAX",
    "purchase.games.lottoMax.description":
      "캐나다 최대 잭팟 7선택 복권으로 단식과 콤보 플레이를 제공합니다.",
    "purchase.games.lottoMax.hint":
      "번호를 클릭해 토글하세요. 콤보 플레이는 가능한 모든 7개 조합을 자동으로 확장합니다.",
    "purchase.games.lottoMax.pools.main": "주 번호",
    "purchase.games.lottoMax.modes.standard.label": "표준 플레이 (7선택)",
    "purchase.games.lottoMax.modes.standard.helper":
      "1-50 사이에서 정확히 7개의 번호를 선택합니다.",
    "purchase.games.lottoMax.modes.standard.error.main":
      "정확히 7개의 번호를 선택하세요.",
    "purchase.games.lottoMax.modes.combo8.label": "콤보 8",
    "purchase.games.lottoMax.modes.combo8.helper":
      "8개 번호를 선택하면 8장의 표준 티켓이 생성됩니다.",
    "purchase.games.lottoMax.modes.combo8.error.main":
      "정확히 8개의 번호를 선택하세요.",
    "purchase.games.lottoMax.modes.combo9.label": "콤보 9",
    "purchase.games.lottoMax.modes.combo9.helper":
      "9개 번호를 선택하면 36장의 표준 티켓이 생성됩니다.",
    "purchase.games.lottoMax.modes.combo9.error.main":
      "정확히 9개의 번호를 선택하세요.",
    "purchase.games.lottoMax.modes.combo10.label": "콤보 10",
    "purchase.games.lottoMax.modes.combo10.helper":
      "10개 번호를 선택하면 120장의 표준 티켓이 생성됩니다.",
    "purchase.games.lottoMax.modes.combo10.error.main":
      "정확히 10개의 번호를 선택하세요.",
    "purchase.games.lotto649.name": "LOTTO 6/49",
    "purchase.games.lotto649.description":
      "캐나다 전통 6선택 복권으로 다양한 콤보 옵션을 제공합니다.",
    "purchase.games.lotto649.hint":
      "1-49 사이에서 번호를 선택하세요. 콤보 플레이는 가능한 모든 6번호 조합으로 확장됩니다.",
    "purchase.games.lotto649.pools.main": "주 번호",
    "purchase.games.lotto649.modes.standard.label": "표준 플레이 (6선택)",
    "purchase.games.lotto649.modes.standard.helper":
      "정확히 6개의 번호를 선택합니다.",
    "purchase.games.lotto649.modes.standard.error.main":
      "정확히 6개의 번호를 선택하세요.",
    "purchase.games.lotto649.modes.combo7.label": "콤보 7",
    "purchase.games.lotto649.modes.combo7.helper":
      "7개 번호를 선택하면 7장의 티켓이 생성됩니다.",
    "purchase.games.lotto649.modes.combo7.error.main":
      "정확히 7개의 번호를 선택하세요.",
    "purchase.games.lotto649.modes.combo8.label": "콤보 8",
    "purchase.games.lotto649.modes.combo8.helper":
      "8개 번호를 선택하면 28장의 티켓이 생성됩니다.",
    "purchase.games.lotto649.modes.combo8.error.main":
      "정확히 8개의 번호를 선택하세요.",
    "purchase.games.lotto649.modes.combo9.label": "콤보 9",
    "purchase.games.lotto649.modes.combo9.helper":
      "9개 번호를 선택하면 84장의 티켓이 생성됩니다.",
    "purchase.games.lotto649.modes.combo9.error.main":
      "정확히 9개의 번호를 선택하세요.",
    "purchase.games.ontario49.name": "Ontario 49",
    "purchase.games.ontario49.description":
      "온타리오 주 6선택 복권으로 다중 번호 콤보를 지원합니다.",
    "purchase.games.ontario49.hint":
      "번호를 클릭해 토글하면 모든 6번호 조합이 자동으로 생성됩니다.",
    "purchase.games.ontario49.pools.main": "주 번호",
    "purchase.games.ontario49.modes.standard.label": "표준 플레이 (6선택)",
    "purchase.games.ontario49.modes.standard.helper":
      "정확히 6개의 번호를 선택합니다.",
    "purchase.games.ontario49.modes.standard.error.main":
      "정확히 6개의 번호를 선택하세요.",
    "purchase.games.ontario49.modes.combo7.label": "콤보 7",
    "purchase.games.ontario49.modes.combo7.helper":
      "7개 번호를 선택하면 7장의 티켓이 생성됩니다.",
    "purchase.games.ontario49.modes.combo7.error.main":
      "정확히 7개의 번호를 선택하세요.",
    "purchase.games.dailyGrand.name": "Daily Grand",
    "purchase.games.dailyGrand.description":
      "주 번호 5개와 Grand 번호 1개를 맞추면 하루 1000달러 상금을 노려볼 수 있습니다.",
    "purchase.games.dailyGrand.hint":
      "1-49에서 5개, 1-7에서 1개의 Grand 번호를 선택하세요.",
    "purchase.games.dailyGrand.pools.main": "주 번호",
    "purchase.games.dailyGrand.pools.grand": "Grand 번호",
    "purchase.games.dailyGrand.modes.standard.label": "표준 플레이",
    "purchase.games.dailyGrand.modes.standard.helper":
      "주 번호 5개와 Grand 번호 1개를 선택합니다.",
    "purchase.games.dailyGrand.modes.standard.error.main":
      "주 번호 5개를 선택하세요.",
    "purchase.games.dailyGrand.modes.standard.error.grand":
      "Grand 번호 1개를 선택하세요.",
    "purchase.games.lightningLotto.name": "Lightning Lotto",
    "purchase.games.lightningLotto.description":
      "즉석으로 진행되는 5번호 잭팟 게임입니다.",
    "purchase.games.lightningLotto.hint":
      "1-49에서 중복 없이 5개의 번호를 선택하세요.",
    "purchase.games.lightningLotto.pools.main": "주 번호",
    "purchase.games.lightningLotto.modes.standard.label": "표준 플레이",
    "purchase.games.lightningLotto.modes.standard.helper":
      "정확히 5개의 번호를 선택합니다.",
    "purchase.games.lightningLotto.modes.standard.error.main":
      "정확히 5개의 번호를 선택하세요.",
    "purchase.games.lottario.name": "Lottario",
    "purchase.games.lottario.description":
      "온타리오 주 토요일 추첨 복권으로 콤보 옵션을 제공합니다.",
    "purchase.games.lottario.hint":
      "1-45 사이에서 번호를 선택하면 모든 6번호 조합이 자동으로 생성됩니다.",
    "purchase.games.lottario.pools.main": "주 번호",
    "purchase.games.lottario.modes.standard.label": "표준 플레이 (6선택)",
    "purchase.games.lottario.modes.standard.helper":
      "정확히 6개의 번호를 선택합니다.",
    "purchase.games.lottario.modes.standard.error.main":
      "정확히 6개의 번호를 선택하세요.",
    "purchase.games.lottario.modes.combo7.label": "콤보 7",
    "purchase.games.lottario.modes.combo7.helper":
      "7개 번호를 선택하면 7장의 티켓이 생성됩니다.",
    "purchase.games.lottario.modes.combo7.error.main":
      "정확히 7개의 번호를 선택하세요.",
    "purchase.games.dailyKeno.name": "Daily Keno",
    "purchase.games.dailyKeno.description":
      "2~10개 번호를 선택하는 Keno 플레이입니다.",
    "purchase.games.dailyKeno.hint":
      "먼저 Spot 크기를 고른 뒤 1-70 사이에서 해당 개수만큼 번호를 선택하세요.",
    "purchase.games.dailyKeno.pools.main": "주 번호",
    "purchase.games.dailyKeno.modes.spot2.label": "Spot 2 (2선택)",
    "purchase.games.dailyKeno.modes.spot2.helper":
      "1-70에서 정확히 2개의 번호를 선택합니다.",
    "purchase.games.dailyKeno.modes.spot2.error.main":
      "정확히 2개의 번호를 선택하세요.",
    "purchase.games.dailyKeno.modes.spot3.label": "Spot 3 (3선택)",
    "purchase.games.dailyKeno.modes.spot3.helper":
      "1-70에서 정확히 3개의 번호를 선택합니다.",
    "purchase.games.dailyKeno.modes.spot3.error.main":
      "정확히 3개의 번호를 선택하세요.",
    "purchase.games.dailyKeno.modes.spot4.label": "Spot 4 (4선택)",
    "purchase.games.dailyKeno.modes.spot4.helper":
      "1-70에서 정확히 4개의 번호를 선택합니다.",
    "purchase.games.dailyKeno.modes.spot4.error.main":
      "정확히 4개의 번호를 선택하세요.",
    "purchase.games.dailyKeno.modes.spot5.label": "Spot 5 (5선택)",
    "purchase.games.dailyKeno.modes.spot5.helper":
      "1-70에서 정확히 5개의 번호를 선택합니다.",
    "purchase.games.dailyKeno.modes.spot5.error.main":
      "정확히 5개의 번호를 선택하세요.",
    "purchase.games.dailyKeno.modes.spot6.label": "Spot 6 (6선택)",
    "purchase.games.dailyKeno.modes.spot6.helper":
      "1-70에서 정확히 6개의 번호를 선택합니다.",
    "purchase.games.dailyKeno.modes.spot6.error.main":
      "정확히 6개의 번호를 선택하세요.",
    "purchase.games.dailyKeno.modes.spot7.label": "Spot 7 (7선택)",
    "purchase.games.dailyKeno.modes.spot7.helper":
      "1-70에서 정확히 7개의 번호를 선택합니다.",
    "purchase.games.dailyKeno.modes.spot7.error.main":
      "정확히 7개의 번호를 선택하세요.",
    "purchase.games.dailyKeno.modes.spot8.label": "Spot 8 (8선택)",
    "purchase.games.dailyKeno.modes.spot8.helper":
      "1-70에서 정확히 8개의 번호를 선택합니다.",
    "purchase.games.dailyKeno.modes.spot8.error.main":
      "정확히 8개의 번호를 선택하세요.",
    "purchase.games.dailyKeno.modes.spot9.label": "Spot 9 (9선택)",
    "purchase.games.dailyKeno.modes.spot9.helper":
      "1-70에서 정확히 9개의 번호를 선택합니다.",
    "purchase.games.dailyKeno.modes.spot9.error.main":
      "정확히 9개의 번호를 선택하세요.",
    "purchase.games.dailyKeno.modes.spot10.label": "Spot 10 (10선택)",
    "purchase.games.dailyKeno.modes.spot10.helper":
      "1-70에서 정확히 10개의 번호를 선택합니다.",
    "purchase.games.dailyKeno.modes.spot10.error.main":
      "정확히 10개의 번호를 선택하세요.",
    "purchase.games.pick4.name": "Pick 4",
    "purchase.games.pick4.description":
      "매일 추첨되는 4자리 숫자 게임입니다.",
    "purchase.games.pick4.hint":
      "0-9 사이 숫자 4개를 선택해 번호 세트를 만드세요.",
    "purchase.games.pick4.pools.digits": "숫자 (0-9)",
    "purchase.games.pick4.modes.standard.label": "표준 플레이",
    "purchase.games.pick4.modes.standard.helper":
      "정확히 4개의 숫자를 선택합니다.",
    "purchase.games.pick4.modes.standard.error.digits":
      "정확히 4개의 숫자를 선택하세요.",
    "purchase.games.pick3.name": "Pick 3",
    "purchase.games.pick3.description":
      "매일 추첨되는 3자리 숫자 게임입니다.",
    "purchase.games.pick3.hint":
      "0-9 사이 숫자 3개를 선택해 번호 세트를 만드세요.",
    "purchase.games.pick3.pools.digits": "숫자 (0-9)",
    "purchase.games.pick3.modes.standard.label": "표준 플레이",
    "purchase.games.pick3.modes.standard.helper":
      "정확히 3개의 숫자를 선택합니다.",
    "purchase.games.pick3.modes.standard.error.digits":
      "정확히 3개의 숫자를 선택하세요.",
    "purchase.summary.ticketPriceUsd": "티켓 가격 (USDT)",
    "purchase.summary.totalUsd": "총 비용 (USDT)",
    "purchase.summary.pricePerTicketUsd": "2.00",
    "purchase.feedback.noTickets": "제출 전에 최소 한 개의 티켓을 확정하세요.",
    "purchase.summary.groups": "확정된 조합",
    "purchase.preview.groupLabel": "그룹 {index}",
    "purchase.preview.remove": "삭제",
    "purchase.preview.clearAll": "전체 삭제",
    "purchase.preview.samples": "샘플 티켓",
    "purchase.preview.numbersLabel": "번호",
  },
};

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const translate = useCallback(
    (key: string, replacements?: Record<string, string | number>) => {
      const template =
        translations[locale]?.[key] ??
        translations.en[key] ??
        key;

      if (!replacements) {
        return template;
      }

      return Object.entries(replacements).reduce((acc, [name, value]) => {
        return acc.replaceAll(`{${name}}`, String(value));
      }, template);
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: translate,
    }),
    [locale, translate]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within LanguageProvider");
  }
  return context;
}
