import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../Header";

type RepositorySenatorsExpenses = {
  id: number;
  type: number;
  nomeSenador: string;
  supplier: string; // fornecedor
  year: number; // ano
  month: number; // mês
  day: number; // dia
  valor: number; // valor 
};

export function Expense() {
  const { id } = useParams<{ id: string }>();
  const [repositorySenatorsExpenses, setRepositorySenatorsExpenses] = useState<RepositorySenatorsExpenses[]>([]);
  const [repositoryPolitician, setRepositoryPolitician] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePolitician = await fetch(`http://localhost:3000/senadores/${id}`);
        const politicianData = await responsePolitician.json();
        setRepositoryPolitician(politicianData.nomeSenador);

        const responseExpenses = await fetch(`http://localhost:3000/despesasSenadores?id=${id}`);
        const expensesData = await responseExpenses.json();
        setRepositorySenatorsExpenses(expensesData);
        console.log("expensesData:", expensesData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const calculateTotalByType = (expenses: RepositorySenatorsExpenses[], type: number) => {
    const filteredExpenses = expenses.filter((expense) => expense.type === type);
    const total = filteredExpenses.reduce((acc, expense) => {
      const valor = expense.valor || 0; // Verificação para evitar undefined
      return acc + Number(valor);
    }, 0);
    return parseFloat(total.toFixed(2));
  };


  const typeLabels = [
    "Aluguel de imóveis e despesas concernentes a eles",
    "Divulgação da atividade parlamentar",
    "Aquisição de material de consumo para uso no escritório",
    "Passagens aéreas, aquáticas e terrestres nacionais",
    "Contratação de consultorias, assessorias, pesquisas, trabalhos técnicos e outros serviços",
    "Locomoção, hospedagem, alimentação e combustíveis",
    "Serviços de Segurança Privada"
  ];

  const totalByType: number[] = [];
  for (let i = 0; i < 7; i++) {
    const total = calculateTotalByType(repositorySenatorsExpenses, i + 1);
    totalByType.push(total);
    console.log(`Total type ${i}:`, total);
  }

  console.log("repositorySenatorsExpenses:", repositorySenatorsExpenses);


  const totalGeral = repositorySenatorsExpenses.reduce((total, expense) => {
    const valor = typeof expense.valor === 'number' ? expense.valor : 0; // Verificação adicional
    console.log("Total parcial:", total, "+", valor);
    return total + parseFloat(valor.toFixed(2));
  }, 0);
  console.log("Total geral:", totalGeral);

  return (
    <>
      <Header />

      <h1>Despesas do Senador {repositoryPolitician}</h1>

      <ul>
        {typeLabels.map((label, index) => (
          <li key={index}>
            {label}: R$ {totalByType[index].toFixed(2)}
          </li>
        ))}
      </ul>

      <p>Total Geral: R$ {parseFloat(totalGeral.toFixed(2)).toString()}</p>

    </>
  );
}
