export type GuardrailResult = {
  allowed: boolean;
  message?: string;
};

const BLOCKED_PATTERNS = [
  /guarantee.*profit/i,
  /guaranteed.*profit/i,
  /100%.*profit/i,
  /sure.*profit/i,
  /sure.*win/i,
  /cannot lose/i,
  /no risk/i,
  /risk[- ]free/i,
  /double my account/i,
  /triple my account/i,
  /recover.*loss.*quick/i,
  /recover.*loss.*fast/i,
  /revenge trad/i,
  /all[- ]in/i,
  /borrow.*money.*trad/i,
  /loan.*trad/i,
];

const HIGH_RISK_PATTERNS = [
  /increase.*leverage/i,
  /maximum leverage/i,
  /maximum position/i,
  /ignore.*stop loss/i,
  /remove.*stop loss/i,
  /without.*stop loss/i,
  /risk.*10%/i,
  /risk.*20%/i,
  /risk.*50%/i,
];

export function checkAiGuardrails(message: string): GuardrailResult {
  const normalized = message.trim().replace(/\s+/g, ' ');

  if (!normalized) {
    return {
      allowed: false,
      message: 'Please provide a trading question or scenario.',
    };
  }

  if (normalized.length > 4000) {
    return {
      allowed: false,
      message:
        'Your message is too long. Please keep it under 4,000 characters.',
    };
  }

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        allowed: false,
        message:
          'FundGuard AI cannot guarantee profits or recommend reckless trading. I can help you evaluate risk, position sizing, drawdown, and disciplined trading decisions instead.',
      };
    }
  }

  for (const pattern of HIGH_RISK_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        allowed: false,
        message:
          'FundGuard AI does not recommend removing risk controls, using excessive leverage, or taking unusually large risks. Consider protecting capital with a defined stop loss and controlled position size.',
      };
    }
  }

  return {
    allowed: true,
  };
}
