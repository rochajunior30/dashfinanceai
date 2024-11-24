import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "../_components/ui/scroll-area";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import { TransactionCategory } from "@prisma/client";

interface TransactionsPageProps {
  searchParams: {
    date?: string;
    category?: TransactionCategory;
  };
}

const TransactionsPage = async ({ searchParams }: TransactionsPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const filterDate = searchParams?.date || null;
  const filterCategory = searchParams?.category || null;

  let dateFilter = {};
  if (filterDate) {
    const startDate = new Date(`${filterDate}T00:00:00.000Z`);
    const endDate = new Date(`${filterDate}T23:59:59.999Z`);

    dateFilter = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };
  }

  const categoryFilter = filterCategory ? { category: filterCategory } : {};

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      ...dateFilter,
      ...categoryFilter,
    },
    orderBy: {
      date: "desc",
    },
  });

  const userCanAddTransaction = await canUserAddTransaction();

  const categories = await db.transaction.findMany({
    where: { userId },
    select: { category: true },
    distinct: ["category"],
  });

  return (
    <>
      <Navbar />
      <div className="flex flex-col space-y-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-cente justify-between gap-4">
          <h1 className="text-2xl  font-bold">Transações</h1>
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <form method="get" className="flex flex-col md:flex-row items-center gap-2">
              <input
                type="date"
                name="date"
                defaultValue={filterDate || ""}
                className="rounded-md bg-gray-600 border-gray-400 p-2 text-primary w-full md:w-auto"
                placeholder="Selecione uma data"
              />
              <select
                name="category"
                defaultValue={filterCategory || ""}
                className="rounded-md bg-gray-600 border-gray-400 p-2 text-primary w-full md:w-auto"
              >
                <option value="">Todas as categorias</option>
                {categories.map((c) => (
                  <option key={c.category} value={c.category}>
                    {c.category}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-full font-bold hover:bg-inherit w-full md:w-auto"
              >
                Filtrar
              </button>
            </form>
            <div className="flex justify-center md:justify-end w-full md:w-auto">
              <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
            </div>
          </div>
        </div>
        <ScrollArea className="h-full">
          <DataTable
            columns={transactionColumns}
            data={JSON.parse(JSON.stringify(transactions))}
          />
        </ScrollArea>
      </div>
    </>
  );
};

export default TransactionsPage;
