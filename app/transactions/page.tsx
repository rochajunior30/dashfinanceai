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

  // Obtém os filtros do query string
  const filterDate = searchParams?.date || null;
  const filterCategory = searchParams?.category || null;

  let dateFilter = {};
  if (filterDate) {
    const startDate = new Date(`${filterDate}T00:00:00.000Z`); // Início do dia em UTC
    const endDate = new Date(`${filterDate}T23:59:59.999Z`);   // Fim do dia em UTC

    dateFilter = {
      date: {
        gte: startDate, // Maior ou igual ao início do dia
        lte: endDate,   // Menor ou igual ao fim do dia
      },
    };
  }

  const categoryFilter = filterCategory
    ? { category: filterCategory } // Adiciona o filtro de categoria
    : {};

  // Filtra as transações com base nos filtros
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

  // Obtém todas as categorias para o dropdown
  const categories = await db.transaction.findMany({
    where: { userId },
    select: { category: true },
    distinct: ["category"],
  });

  return (
    <>
      <Navbar />
      <div className="flex flex-col space-y-6 overflow-hidden p-6">
        {/* TÍTULO, BOTÃO E CAMPOS DE FILTRO */}
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <div className="flex items-center space-x-4">
            <form method="get" className="flex items-center space-x-2">
              {/* Campo de Data */}
              <input
                type="date"
                name="date"
                defaultValue={filterDate || ""}
                className="rounded-md bg-gray-950 border-gray-100 p-2 text-gray-100"
                placeholder="Selecione uma data"
              />
              {/* Campo de Categoria */}
              <select
                name="category"
                defaultValue={filterCategory || ""}
                className="rounded-md bg-gray-950 border-gray-100 p-2 text-gray-100"
              >
                <option value="">Todas as categorias</option>
                {categories.map((c) => (
                  <option key={c.category} value={c.category}>
                    {c.category}
                  </option>
                ))}
              </select>
              {/* Botão de Filtro */}
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
