import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type RepositorySenatorsExpenses = {
  id: number;
  supplier: string; // fornecedor
  year: number; // ano
  month: number; // mês
  day: number; // dia
  amount: number; // valor 
};

export function Expense() {
  const { id } = useParams<{ id: string }>();
  const [repositorySenatorsExpenses, setRepositorySenatorsExpenses] = useState<RepositorySenatorsExpenses[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3000/despesasSenadores?id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        setRepositorySenatorsExpenses(data);
      });
  }, [id]);

  const calculateTotalBySupplier = (expenses: RepositorySenatorsExpenses[], supplier: string) => {
    const filteredExpenses = expenses.filter((expense) => expense.supplier === supplier);
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const uniqueSuppliers = [...new Set(repositorySenatorsExpenses.map((expense) => expense.supplier))];

  return (
    <>
      <h1>Despesas</h1>

      {uniqueSuppliers.map((supplier) => {
        const total = calculateTotalBySupplier(repositorySenatorsExpenses, supplier);
        return (
          <div key={supplier}>
            <p>Fornecedor: {supplier}</p>
            <p>Total: {isNaN(total) ? 0 : total}</p>
          </div>
        );
      })}
    </>
  );
}
