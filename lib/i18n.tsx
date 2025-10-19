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
    "purchase.mode.sectionTitle": "Double Color Ball Options",
    "purchase.mode.description":
      "Pick ticket style inspired by the Double Color Ball (双色球). Choose how you want to select numbers, then confirm your combination before purchase.",
    "purchase.mode.manual": "Manual pick",
    "purchase.mode.random": "Auto pick",
    "purchase.mode.single": "Single entry",
    "purchase.mode.redMulti": "Red ball multi",
    "purchase.mode.blueMulti": "Blue ball multi",
    "purchase.mode.fullMulti": "Full multi",
    "purchase.mode.rules.manual":
      "Manual pick lets you choose each number yourself.",
    "purchase.mode.rules.random":
      "Auto pick asks the system to generate a combination for you.",
    "purchase.mode.rules.single":
      "Select exactly 6 red balls (1-33) and 1 blue ball (1-16).",
    "purchase.mode.rules.redMulti":
      "Select 7-20 red balls and 1 blue ball to cover multiple entries.",
    "purchase.mode.rules.blueMulti":
      "Select 6 red balls and 2-16 blue balls.",
    "purchase.mode.rules.fullMulti":
      "Select 7-20 red balls and 2-16 blue balls.",
    "purchase.mode.redCount": "{count} red balls selected",
    "purchase.mode.blueCount": "{count} blue balls selected",
    "purchase.mode.randomize": "Shuffle numbers",
    "purchase.mode.clear": "Clear selection",
    "purchase.mode.totalCombos": "Total combinations",
    "purchase.mode.totalTickets": "{count} tickets",
    "purchase.mode.ticketPreviewTitle": "Generated ticket IDs",
    "purchase.mode.ticketPreviewDescription":
      "Share or bookmark these virtual ticket IDs for your records. IDs refresh whenever you adjust the balls.",
    "purchase.mode.ticketPreviewOverflow":
      "Showing first {count} tickets out of {total}.",
    "purchase.mode.error.red.single": "Single entry requires 6 red balls.",
    "purchase.mode.error.blue.single": "Single entry requires 1 blue ball.",
    "purchase.mode.error.red.redMulti":
      "Red multi requires 7-20 red balls and 1 blue ball.",
    "purchase.mode.error.blue.redMulti":
      "Red multi requires exactly 1 blue ball.",
    "purchase.mode.error.red.blueMulti":
      "Blue multi requires exactly 6 red balls.",
    "purchase.mode.error.blue.blueMulti":
      "Blue multi requires 2-16 blue balls.",
    "purchase.mode.error.red.fullMulti":
      "Full multi requires 7-20 red balls.",
    "purchase.mode.error.blue.fullMulti":
      "Full multi requires 2-16 blue balls.",
    "purchase.mode.error.invalidSelection":
      "Pick a valid combination before submitting.",
    "purchase.mode.overlay.title": "Select your balls",
    "purchase.mode.column.red": "Red Balls",
    "purchase.mode.column.blue": "Blue Balls",
    "purchase.mode.hint":
      "Tap to toggle numbers. Hover to see requirements. Auto pick will respect the rules for each mode.",
    "purchase.summary.ticketPriceUsd": "Ticket price (USDT)",
    "purchase.summary.totalUsd": "Total cost (USDT)",
    "purchase.summary.pricePerTicketUsd": "2.00",
    "purchase.mode.confirm": "Confirm selection",
    "purchase.feedback.noTickets":
      "Add at least one confirmed ticket before submitting.",
    "purchase.summary.groups": "Ticket groups",
    "purchase.preview.groupLabel": "Group {index}",
    "purchase.preview.remove": "Remove",
    "purchase.preview.samples": "Sample tickets",
  },
  zh: {
    "site.title": "Web3 彩票平台",
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
    "purchase.mode.sectionTitle": "双色球投注选项",
    "purchase.mode.description":
      "按照中国福利彩票“双色球”的玩法设计，选择自选或机选，并确定单式或复式组合，然后再提交购买。",
    "purchase.mode.manual": "自选号码",
    "purchase.mode.random": "机选号码",
    "purchase.mode.single": "单式投注",
    "purchase.mode.redMulti": "红球复式",
    "purchase.mode.blueMulti": "蓝球复式",
    "purchase.mode.fullMulti": "全复式",
    "purchase.mode.rules.manual": "自选模式下，所有号码由您自行挑选。",
    "purchase.mode.rules.random": "机选模式下，系统会随机生成符合条件的号码。",
    "purchase.mode.rules.single":
      "单式投注需选择6个红球（1-33）加1个蓝球（1-16）。",
    "purchase.mode.rules.redMulti":
      "红球复式需选择7-20个红球以及1个蓝球，可组合出多注号码。",
    "purchase.mode.rules.blueMulti":
      "蓝球复式需选择6个红球以及2-16个蓝球。",
    "purchase.mode.rules.fullMulti":
      "全复式需选择7-20个红球以及2-16个蓝球。",
    "purchase.mode.redCount": "已选红球 {count} 个",
    "purchase.mode.blueCount": "已选蓝球 {count} 个",
    "purchase.mode.randomize": "重新机选",
    "purchase.mode.clear": "清空选号",
    "purchase.mode.totalCombos": "组合数量",
    "purchase.mode.totalTickets": "{count} 注",
    "purchase.mode.ticketPreviewTitle": "生成的彩票编号",
    "purchase.mode.ticketPreviewDescription":
      "您可以保存或分享这些虚拟彩票编号，调整号码会重新生成编号。",
    "purchase.mode.ticketPreviewOverflow":
      "仅展示前 {count} 注，总计 {total} 注。",
    "purchase.mode.error.red.single": "单式投注必须选择6个红球。",
    "purchase.mode.error.blue.single": "单式投注必须选择1个蓝球。",
    "purchase.mode.error.red.redMulti":
      "红球复式需选择7-20个红球，同时蓝球为1个。",
    "purchase.mode.error.blue.redMulti": "红球复式蓝球需恰好1个。",
    "purchase.mode.error.red.blueMulti": "蓝球复式需选择6个红球。",
    "purchase.mode.error.blue.blueMulti":
      "蓝球复式需选择2-16个蓝球。",
    "purchase.mode.error.red.fullMulti":
      "全复式需选择7-20个红球。",
    "purchase.mode.error.blue.fullMulti":
      "全复式需选择2-16个蓝球。",
    "purchase.mode.error.invalidSelection": "请先完成符合规则的选号组合。",
    "purchase.mode.overlay.title": "选择号码",
    "purchase.mode.column.red": "红球",
    "purchase.mode.column.blue": "蓝球",
    "purchase.mode.hint":
      "点击切换选中状态，悬停查看要求。机选会自动满足所选玩法的规则。",
    "purchase.summary.ticketPriceUsd": "彩票单价（USDT）",
    "purchase.summary.totalUsd": "总花费（USDT）",
    "purchase.summary.pricePerTicketUsd": "2.00",
    "purchase.mode.confirm": "确认选号",
    "purchase.feedback.noTickets": "请至少确认一组彩票后再提交。",
    "purchase.summary.groups": "选号组数",
    "purchase.preview.groupLabel": "第 {index} 组",
    "purchase.preview.remove": "移除",
    "purchase.preview.samples": "示例号码",
  },
  ko: {
    "site.title": "Web3 복권 허브",
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
    "purchase.mode.sectionTitle": "쌍색구 선택",
    "purchase.mode.description":
      "중국 복권 ‘쌍색구’ 규칙을 바탕으로 수동/자동, 단식/복식 조합을 선택하세요.",
    "purchase.mode.manual": "수동 선택",
    "purchase.mode.random": "자동 선택",
    "purchase.mode.single": "단식",
    "purchase.mode.redMulti": "적색 복식",
    "purchase.mode.blueMulti": "청색 복식",
    "purchase.mode.fullMulti": "전체 복식",
    "purchase.mode.rules.manual": "수동 모드에서는 모든 번호를 직접 고릅니다.",
    "purchase.mode.rules.random":
      "자동 모드는 규칙을 만족하는 번호 조합을 무작위로 생성합니다.",
    "purchase.mode.rules.single":
      "단식은 빨간 공 6개(1-33)와 파란 공 1개(1-16)를 선택합니다.",
    "purchase.mode.rules.redMulti":
      "적색 복식은 빨간 공 7-20개와 파란 공 1개를 선택해 다중 조합을 만듭니다.",
    "purchase.mode.rules.blueMulti":
      "청색 복식은 빨간 공 6개와 파란 공 2-16개를 선택합니다.",
    "purchase.mode.rules.fullMulti":
      "전체 복식은 빨간 공 7-20개와 파란 공 2-16개를 선택합니다.",
    "purchase.mode.redCount": "선택한 빨간 공 {count}개",
    "purchase.mode.blueCount": "선택한 파란 공 {count}개",
    "purchase.mode.randomize": "번호 다시뽑기",
    "purchase.mode.clear": "선택 초기화",
    "purchase.mode.totalCombos": "조합 수",
    "purchase.mode.totalTickets": "{count}장",
    "purchase.mode.ticketPreviewTitle": "발급된 티켓 ID",
    "purchase.mode.ticketPreviewDescription":
      "이 가상 티켓 ID를 기록하거나 공유하세요. 번호를 조정하면 새로 생성됩니다.",
    "purchase.mode.ticketPreviewOverflow":
      "최초 {count}장만 표시합니다 (총 {total}장).",
    "purchase.mode.error.red.single": "단식은 빨간 공 6개가 필요합니다.",
    "purchase.mode.error.blue.single": "단식은 파란 공 1개가 필요합니다.",
    "purchase.mode.error.red.redMulti":
      "적색 복식은 빨간 공 7-20개와 파란 공 1개가 필요합니다.",
    "purchase.mode.error.blue.redMulti":
      "적색 복식은 파란 공이 정확히 1개여야 합니다.",
    "purchase.mode.error.red.blueMulti":
      "청색 복식은 빨간 공 6개가 필요합니다.",
    "purchase.mode.error.blue.blueMulti":
      "청색 복식은 파란 공 2-16개가 필요합니다.",
    "purchase.mode.error.red.fullMulti":
      "전체 복식은 빨간 공 7-20개가 필요합니다.",
    "purchase.mode.error.blue.fullMulti":
      "전체 복식은 파란 공 2-16개가 필요합니다.",
    "purchase.mode.error.invalidSelection":
      "규칙에 맞는 번호 조합을 먼저 선택하세요.",
    "purchase.mode.overlay.title": "번호 선택",
    "purchase.mode.column.red": "빨간 공",
    "purchase.mode.column.blue": "파란 공",
    "purchase.mode.hint":
      "클릭하면 선택이 전환됩니다. 자동 선택은 각 모드 요구 조건을 자동으로 충족합니다.",
    "purchase.summary.ticketPriceUsd": "티켓 가격 (USDT)",
    "purchase.summary.totalUsd": "총 비용 (USDT)",
    "purchase.summary.pricePerTicketUsd": "2.00",
    "purchase.mode.confirm": "선택 확정",
    "purchase.feedback.noTickets": "제출 전에 최소 한 개의 티켓을 확정하세요.",
    "purchase.summary.groups": "확정된 조합",
    "purchase.preview.groupLabel": "그룹 {index}",
    "purchase.preview.remove": "삭제",
    "purchase.preview.samples": "샘플 티켓",
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
