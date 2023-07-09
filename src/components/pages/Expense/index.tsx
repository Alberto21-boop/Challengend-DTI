import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Header } from "../../Header";
import styles from './Expense.module.css'
import { Loading } from "../../Loading";
/* import { Money } from "../../LottieAnimation/Money"; */

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
  const { id } = useParams<{ id: string | undefined }>();
  const [repositorySenatorsExpenses, setRepositorySenatorsExpenses] = useState<RepositorySenatorsExpenses>([]);
  const [repositoryPolitician, setRepositoryPolitician] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);


  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      try {
        if (id) {
          const responsePolitician = await fetch(`http://localhost:3000/senadores/${id}`);
          const politicianData = await responsePolitician.json();
          setRepositoryPolitician(politicianData.nomeSenador);

          const responseExpenses = await fetch(`http://localhost:3000/despesasSenadores`);
          const expensesData = await responseExpenses.json();
          setRepositorySenatorsExpenses(expensesData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();

  }, [id]);

  const calculateTotalByType = (expenses: ExpenseType[], type: number) => {
    const filteredExpenses = expenses.filter((expense) => expense.tipo === type);

    const total = filteredExpenses.reduce((acc, expense) => {
      return acc + (expense.valor || 0);
    }, 0);

    return parseFloat(total.toFixed(2));
  };

  const politicianExpenses = repositorySenatorsExpenses.find((senator) => senator.id === parseInt(id || "", 10));

  const totalByType: number[] = [];
  if (politicianExpenses) {
    for (let i = 0; i < 7; i++) {
      const total = calculateTotalByType(politicianExpenses.despesas, i + 1);
      totalByType.push(total);
      console.log(`Total type ${i}:`, total);
    }
  }

  const totalGeral = politicianExpenses
    ? politicianExpenses.despesas.reduce((total, expense) => {
      return total + expense.valor;
    }, 0)
    : 0;

  return (
    <>
      <Header />
      <div className={styles.expenseSenator}>
        <h1 className={styles.senatorTitle}>Despesas do Senador :  {repositoryPolitician}</h1>
        {politicianExpenses && (
          <ul className={styles.expenseStyle}>
            {typeLabels.map((label, index) => (
              <li key={index}>
                {label}: {totalByType[index]?.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "R$0,00"}
              </li>
            ))}
          </ul>
        )}



        <p className={styles.total}>Total Geral: {totalGeral.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>

        <Link to="/" >
          <button>Voltar para Pagina Anterior</button>
        </Link>


        <h2 className={styles.secondTitle}>Discriminação das despesas</h2>
        <ul>
          {repositorySenatorsExpenses.map((senator) =>
            senator.despesas.map((expense, index) => (
              <li className={styles.detailedExpenseList} key={index}>
                <strong >Fornecedor:</strong> {expense.fornec}<br />
                <strong>Data:</strong> {expense.dia}/{expense.mes}/{expense.ano}<br />
                <strong>Valor:</strong> {expense.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </li>
            ))
          )}
        </ul>
      </div>
      {isLoading && <Loading />}
    </>
  );
}
