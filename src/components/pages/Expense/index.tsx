import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../Header";

type ExpenseType = {
  tipo: number;
  fornec: string;
  ano: number;
  mes: number;
  dia: number;
  valor: number;
};

type SenatorExpense = {
  id: number;
  nomeSenador: string;
  despesas: ExpenseType[];
};

type RepositorySenatorsExpenses = SenatorExpense[];

const typeLabels: string[] = [
  "Aluguel de imóveis e despesas concernentes a eles",
  "Divulgação da atividade parlamentar",
  "Aquisição de material de consumo para uso no escritório",
  "Passagens aéreas, aquáticas e terrestres nacionais",
  "Contratação de consultorias, assessorias, pesquisas, trabalhos técnicos e outros serviços",
  "Locomoção, hospedagem, alimentação e combustíveis",
  "Serviços de Segurança Privada"
];

export function Expense() {
  const { id } = useParams<{ id: string }>();
  const [repositorySenatorsExpenses, setRepositorySenatorsExpenses] = useState<RepositorySenatorsExpenses>([]);
  const [repositoryPolitician, setRepositoryPolitician] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePolitician = await fetch(`http://localhost:3000/senadores/${id}`);
        const politicianData = await responsePolitician.json();
        setRepositoryPolitician(politicianData.nomeSenador);

        const responseExpenses = await fetch(`http://localhost:3000/despesasSenadores`);
        const expensesData = await responseExpenses.json();
        setRepositorySenatorsExpenses(expensesData);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const calculateTotalByType = (expenses: ExpenseType[], type: number) => {
    const filteredExpenses = expenses.filter((expense) => expense.tipo === type);
    const total = filteredExpenses.reduce((acc, expense) => {
      return acc + expense.valor;
    }, 0);
    return parseFloat(total.toFixed(2));
  };

  const totalByType: number[] = [];
  for (let i = 0; i < 7; i++) {
    const total = calculateTotalByType(repositorySenatorsExpenses[0]?.despesas || [], i + 1);
    totalByType.push(total);
    console.log(`Total type ${i}:`, total);
  }

  const totalGeral = repositorySenatorsExpenses.reduce((total, senator) => {
    const senatorTotal = senator.despesas.reduce((acc, expense) => {
      return acc + expense.valor;
    }, 0);
    return total + senatorTotal;
  }, 0);

  return (
    <>
      <Header />

      <h1>Despesas do Senador {repositoryPolitician}</h1>

      <ul>
        {typeLabels.map((label, index) => (
          <li key={index}>
            {label}: R$ {totalByType[index]?.toFixed(2) || "0.00"}
          </li>
        ))}
      </ul>

      <p>Total Geral: R$ {totalGeral.toFixed(2)}</p>
    </>
  );
}
