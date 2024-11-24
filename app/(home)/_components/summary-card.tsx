import AddTransactionButton from "@/app/_components/add-transaction-button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  size?: "small" | "large";
  userCanAddTransaction?: boolean;
  textColor?: string; // Nova prop para controlar a cor do texto
}

const SummaryCard = ({
  icon,
  title,
  amount,
  size = "small",
  userCanAddTransaction,
  textColor = "text-white", // Valor padrão
}: SummaryCardProps) => {
  return (
    <Card className="p-6 md:p-10">
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {icon}
            <p
              className={`${
                size === "small"
                  ? "text-muted-foreground text-sm md:text-base"
                  : "text-white opacity-70 text-lg md:text-xl"
              }`}
            >
              {title}
            </p>
          </div>
          <p
            className={`font-bold ${textColor} ${
              size === "small"
                ? "text-xl md:text-2xl"
                : "text-2xl md:text-4xl"
            }`}
          >
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(amount)}
          </p>
        </div>

        {size === "large" && (
          <div className="mt-6 flex justify-center md:justify-end">
            <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
