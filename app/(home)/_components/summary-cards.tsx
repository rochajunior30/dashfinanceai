import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import SummaryCard from "./summary-card";
import SummaryCardBt from "./summary-card-sem-bt";

interface SummaryCards {
  month: string;
  balance: number;
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
  userCanAddTransaction?: boolean;
}

const SummaryCards = async ({
  balance,
  depositsTotal,
  expensesTotal,
  investmentsTotal,
  userCanAddTransaction,
}: SummaryCards) => {
  return (
    <div className="space-y-5">
      {/* PRIMEIRO CARD */}
      <SummaryCard
        icon={<WalletIcon size={25} />}
        title="Saldo"
        amount={balance}
        size="large"
        userCanAddTransaction={userCanAddTransaction}
        textColor={balance < 0 ? "text-red-500" : "text-green-500"}
      />

      {/* OUTROS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <SummaryCardBt
          icon={<PiggyBankIcon size={20} />}
          title="Investido"
          amount={investmentsTotal}
        />
        <SummaryCardBt
          icon={<TrendingUpIcon size={20} />}
          title="Receita"
          amount={depositsTotal}
        />
        <SummaryCardBt
          icon={<TrendingDownIcon size={20} className="text-red-500" />}
          title="Despesas"
          amount={expensesTotal}
        />
      </div>
    </div>
  );
};

export default SummaryCards;
