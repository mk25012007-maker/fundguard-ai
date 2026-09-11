export type FundGuardRiskContext = {
  accountBalance?: number;
  accountEquity?: number;
  dailyLoss?: number;
  dailyLossLimit?: number;
  drawdown?: number;
  maxDrawdown?: number;
  riskPerTrade?: number;
  remainingRisk?: number;
  tradesToday?: number;
  maxTradesPerDay?: number;
  tradingAccountName?: string;
  assetClass?: string;
};

export class FundGuardContextBuilder {
  static buildRiskContext(context: FundGuardRiskContext): string {
    const lines: string[] = [
      'FUNDGUARD AI TRADING RISK CONTEXT',
      '================================',
    ];

    if (context.tradingAccountName) {
      lines.push(`Trading Account: ${context.tradingAccountName}`);
    }

    if (context.assetClass) {
      lines.push(`Asset Class: ${context.assetClass}`);
    }

    if (context.accountBalance !== undefined) {
      lines.push(`Account Balance: $${context.accountBalance.toFixed(2)}`);
    }

    if (context.accountEquity !== undefined) {
      lines.push(`Account Equity: $${context.accountEquity.toFixed(2)}`);
    }

    if (context.dailyLoss !== undefined) {
      lines.push(`Daily Loss: $${context.dailyLoss.toFixed(2)}`);
    }

    if (context.dailyLossLimit !== undefined) {
      lines.push(`Daily Loss Limit: $${context.dailyLossLimit.toFixed(2)}`);
    }

    if (context.drawdown !== undefined) {
      lines.push(`Current Drawdown: ${context.drawdown.toFixed(2)}%`);
    }

    if (context.maxDrawdown !== undefined) {
      lines.push(`Maximum Drawdown: ${context.maxDrawdown.toFixed(2)}%`);
    }

    if (context.riskPerTrade !== undefined) {
      lines.push(`Risk Per Trade: ${context.riskPerTrade.toFixed(2)}%`);
    }

    if (context.remainingRisk !== undefined) {
      lines.push(`Remaining Risk Today: ${context.remainingRisk.toFixed(2)}%`);
    }

    if (context.tradesToday !== undefined) {
      lines.push(`Trades Today: ${context.tradesToday}`);
    }

    if (context.maxTradesPerDay !== undefined) {
      lines.push(`Maximum Trades Per Day: ${context.maxTradesPerDay}`);
    }

    lines.push('');
    lines.push(
      'Use the information above when providing risk-management guidance.',
    );
    lines.push('Do not invent missing account information.');

    return lines.join('\n');
  }

  static buildUserPrompt(
    message: string,
    context?: FundGuardRiskContext,
  ): string {
    const cleanMessage = message.trim();

    if (!context) {
      return cleanMessage;
    }

    return [
      this.buildRiskContext(context),
      '',
      'TRADER QUESTION',
      '===============',
      cleanMessage,
    ].join('\n');
  }
}
