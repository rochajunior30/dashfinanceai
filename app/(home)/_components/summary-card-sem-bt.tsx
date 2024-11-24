
import { Card, CardContent } from "@/app/_components/ui/card";
import { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  size?: "small" | "large";
  userCanAddTransaction?: boolean;
}

const SummaryCard = ({
  icon,
  title,
  amount,
  size = "small",
}: SummaryCardProps) => {
  return (
    <Card className="  md:p-6">

      <CardContent>
        <div className="flex justify-between  items-center">

          {icon}
          <p
            className={`${size === "small"
              ? "text-muted-foreground  text-sm md:text-base"
              : "text-white opacity-70 text-sm md:text-xl"
              }`}
          >
            {title}
          </p>
          <p
            className={`font-bold ${size === "small"
              ? "text-xl md:text-1xl"
              : "text-1xl "
              }`}
          >
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(amount)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
