import { CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transactions";
import { TotalExpensePerCategory } from "@/app/_data/get-dashboard/types";

interface ExpensesPerCategoryProps {
  expensesPerCategory: TotalExpensePerCategory[];
}

const ExpensesPerCategory = ({
  expensesPerCategory,
}: ExpensesPerCategoryProps) => {
  return (
    <ScrollArea className="h-[400px] md:h-[600px] overflow-y-auto rounded-md border pb-6 md:pb-8 px-4 md:px-6">
      <CardHeader>
        <CardTitle className="text-base md:text-lg font-bold">
          Gastos por Categoria
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {expensesPerCategory.map((category) => (
          <div key={category.category} className="space-y-2">
            <div className="flex w-full justify-between">
              <p className="text-xs md:text-sm font-bold">
                {TRANSACTION_CATEGORY_LABELS[category.category]}
              </p>
              <p className="text-xs md:text-sm font-bold">
                {category.percentageOfTotal}%
              </p>
            </div>
            <Progress value={category.percentageOfTotal} className="h-2 md:h-3" />
          </div>
        ))}
      </CardContent>
    </ScrollArea>
  );
};

export default ExpensesPerCategory;
