import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "../_components/ui/scroll-area";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";

const TransactionsPage = async ({ searchParams }) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  // Obtém a data filtrada do query string
  const filterDate = searchParams?.date || null;

  let dateFilter = {};
  if (filterDate) {
    // Ajusta para UTC para evitar problemas de fuso horário
    const startDate = new Date(`${filterDate}T00:00:00.000Z`); // Início do dia em UTC
    const endDate = new Date(`${filterDate}T23:59:59.999Z`);   // Fim do dia em UTC

    dateFilter = {
      date: {
        gte: startDate, // Maior ou igual ao início do dia
        lte: endDate,   // Menor ou igual ao fim do dia
      },
    };
  }

  // Filtra as transações com base na data
  const transactions = await db.transaction.findMany({
    where: {
      userId,
      ...dateFilter,
    },
    orderBy: {
      date: "desc",
    },
  });

  const userCanAddTransaction = await canUserAddTransaction();

  return (
    <>
      <Navbar />
      <div className="flex flex-col space-y-6 overflow-hidden p-6">
        {/* TÍTULO, BOTÃO E CAMPO DE DATA */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <div className="flex items-center space-x-4">
            <form method="get" className="flex items-center space-x-2">
              <input
                type="date"
                name="date"
                defaultValue={filterDate || ""}
                className="rounded-md  bg-gray-950 border-gray-100 p-2 text-gray-100"
                placeholder="Selecione uma data"
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-full font-bold hover:bg-inherit"
              >
                Filtrar
              </button>
            </form>
            <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
          </div>
        </div>

        {/* TABELA */}
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
