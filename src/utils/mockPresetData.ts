/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SampleChartPreset } from "../types";

export const SAMPLE_CHARTS: SampleChartPreset[] = [
  {
    id: "aapl-bullish",
    name: "Apple (AAPL) - 4H Breakdown Retest",
    category: "Stock",
    ticker: "AAPL",
    timeframe: "4 Hour",
    description: "Strong consolidation retest at $198-$200 structural support with declining seller volume.",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    presetReport: {
      asset: "AAPL (Apple Inc.)",
      timeframe: "4 Hour",
      trend: "Bullish",
      confidenceScore: 82,
      confidenceLevel: "Strong",
      scores: {
        trend: 85,
        volume: 75,
        pattern: 80,
        indicator: 90,
        momentum: 80
      },
      probabilities: {
        bullish: 78,
        bearish: 14,
        neutral: 8
      },
      marketStructure: [
        "Higher Highs observed on the daily parent trend",
        "Higher Lows firmly established at $198",
        "Ascending support structure holding on 4-hour timeframe"
      ],
      patterns: [
        "Bull Flag consolidation breakout retest",
        "Hammer Candlestick rejection at the key $198 level"
      ],
      supportLevels: ["$198.00", "$194.50", "$190.00"],
      resistanceLevels: ["$210.00", "$218.00", "$225.00"],
      risk: "Medium",
      entryZone: "$200.00 - $202.00",
      stopLoss: "$196.00",
      targets: ["$208.00", "$215.00", "$225.00"],
      riskRewardRatio: "1:3.5",
      indicators: {
        rsi: "RSI is currently at 52, heading upwards from oversold territory (30) indicating recovering bullish sentiment without being overbought.",
        macd: "MACD line is crossing over the Signal line from below, generating a classic Bullish Divergence signal.",
        emas: "Price is trading above the EMA 20 ($201) and EMA 50 ($199), with the EMA 100 & 200 behaving as long-term dynamic floors.",
        bollinger: "Slight Bollinger Band contraction indicating an upcoming volatility squeeze. Price is bouncing off the median basis.",
        volume: "Declining seller-volume during consolidation followed by a volume spike on the initial $202 breakout green candle."
      },
      recommendationText: "Bullish Setup Detected. Consider potential long entries on any confirmation pullback towards $200-$202, targeting the previous cycle high.",
      analysisExplanation: "The AAPL 4H chart demonstrates a classic asset accumulation phase. Visual analysis reveals that after hitting a peak at $210, the asset corrected in a controlled descending channel (Bull Flag scheme). The crucial horizontal demand block at $198.00 has rejected sellers multiple times, leaving prominent bottom shadows (Hammer indicators). This suggests strong buying interest from institutional pools. Paired with an impending bullish MACD crossover and a safe mid-range RSI reading, the technical backdrop heavily favors buyers.",
      coachAdvice: "Traders should look to scale into positions near the $200 level. Do not chase the price if it gaps up aggressively past $205. Waiting for a retest is the safer play. Keep the stop loss disciplined at $196.00 to account for potential sweep of the liquidity pool below $198."
    }
  },
  {
    id: "btc-shoulder-breakout",
    name: "Bitcoin (BTC) - Daily Massive Breakout",
    category: "Crypto",
    ticker: "BTC",
    timeframe: "Daily",
    description: "Clean Inverse Head & Shoulders bottom completion followed by successful volume breakout.",
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80",
    presetReport: {
      asset: "BTC (Bitcoin)",
      timeframe: "Daily",
      trend: "Bullish",
      confidenceScore: 89,
      confidenceLevel: "Very Strong",
      scores: {
        trend: 95,
        volume: 90,
        pattern: 95,
        indicator: 80,
        momentum: 85
      },
      probabilities: {
        bullish: 84,
        bearish: 10,
        neutral: 6
      },
      marketStructure: [
        "Transition from bearish lower highs to clear structural bullish breakouts",
        "Double bottom support holding at $59,000",
        "Daily candles closing consistently above the $64,000 previous range high"
      ],
      patterns: [
        "Inverse Head & Shoulders (Neckline broken on high volume)",
        "Cup and Handle expansion pattern on the daily macro"
      ],
      supportLevels: ["$64,000", "$61,500", "$59,000"],
      resistanceLevels: ["$69,000", "$72,500", "$76,000"],
      risk: "Medium",
      entryZone: "$64,200 - $65,000",
      stopLoss: "$61,500",
      targets: ["$68,500", "$72,000", "$76,000"],
      riskRewardRatio: "1:4.1",
      indicators: {
        rsi: "RSI is currently at 65. Strongly bullish momentum, with space remaining before hitting the overbought boundary at 75-80.",
        macd: "Strong bullish MACD histogram extension with both lines wide apart and drifting higher above the zero baseline.",
        emas: "Perfect Golden Cross: EMA 50 crossed above EMA 200, signaling a long-term cyclical trend transition. Price utilizes Daily EMA 20 as support.",
        bollinger: "Bollinger Bands are expanding rapidly (opening mouth), confirming the start of a strong directional trend extension.",
        volume: "Volume shows ultra-high spikes on breakout days, with below-average levels on defensive red days (highly bullish characteristic)."
      },
      recommendationText: "Highly Promising Breakout Setup. Buying pressure is fully validated by high breakout volume above critical supply levels.",
      analysisExplanation: "Bitcoin has completed its multi-month accumulation cycle. The daily screenshot depicts a profound Inverse Head & Shoulders formation, with the Left Shoulder at $61,500, the Head sweeping down to $59,000, and the Right Shoulder stabilizing at $61,800. The Neckline at $64,000 has been bypassed by a definitive bullish breakout candle backed by massive system volume. This is a very reliable macro reversal structure that typically results in multi-week expansions.",
      coachAdvice: "This set represents a high-probability breakout model. Your entry is best placed during intraday micro-pullbacks toward the $64K retest zone. Ensure you don't use high leverage here as daily volatility can easily prompt quick $1k-$2k shakes. Target 1 is a psychological resistance at $68,500, with $72,000 being the primary target."
    }
  },
  {
    id: "tsla-doubledrop",
    name: "Tesla (TSLA) - 1H Bearish Double Top",
    category: "Stock",
    ticker: "TSLA",
    timeframe: "1 Hour",
    description: "Rejection at the $245 major psychological resistance displaying a bearish crossover.",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    presetReport: {
      asset: "TSLA (Tesla Inc.)",
      timeframe: "1 Hour",
      trend: "Bearish",
      confidenceScore: 76,
      confidenceLevel: "Strong",
      scores: {
        trend: 80,
        volume: 70,
        pattern: 85,
        indicator: 75,
        momentum: 70
      },
      probabilities: {
        bullish: 12,
        bearish: 74,
        neutral: 14
      },
      marketStructure: [
        "Lower Highs starting to build on the intraday scale",
        "Failure to hold the $242 structural mid-range floor",
        "Distribution phase identified near the peak"
      ],
      patterns: [
        "Double Top bearish pattern completed",
        "Bearish Engulfing candle confirming breakdown of the neckline"
      ],
      supportLevels: ["$235.00", "$230.00", "$224.00"],
      resistanceLevels: ["$245.00", "$248.00", "$252.00"],
      risk: "High",
      entryZone: "$238.00 - $240.00",
      stopLoss: "$243.50",
      targets: ["$230.00", "$224.00", "$215.00"],
      riskRewardRatio: "1:2.8",
      indicators: {
        rsi: "RSI peaked deep in the overbought zone (78) and is now diving fast towards 42, showing rapid loss of immediate buyer power.",
        macd: "A bearish death cross has locked in on the MACD. Histogram bars have slipped into negative territory.",
        emas: "Price broke down below both the EMA 20 ($241.20) and EMA 50 ($240.10) with an assertive high-volume 1-hour close.",
        bollinger: "Price is riding the lower Bollinger Band line, which is expanding downwards, signaling a high-momentum push down.",
        volume: "Substantial cell volume spikes at the $245 double taps confirm institutional sellers distribution."
      },
      recommendationText: "Bearish Setup Detected. Consider avoiding any new long entries. Look for potential short entries as dynamic support has ruptured.",
      analysisExplanation: "TSLA's intraday uptrend has exhausted. After testing $245.00 twice, the buyers faced aggressive limit-sell blocks, forming a neat Double Top. The subsequent drop broke the local key neckline at $241.00 with a severe 1-hour bearish engulfing bar. Moving averages are entering a dynamic death crossover locally. Short-term charts point directly toward a gap fill and liquidity hunt at the $230 demand pool.",
      coachAdvice: "For short-biased active day-traders, look for light pullback entries into the $239-$241 range. Set a robust stop loss at $243.50. Under no circumstances should you hold onto a short position if price breaks back above $245.00 on heavy volume, as that invalidates the double top and shifts context to a short squeeze."
    }
  }
];
