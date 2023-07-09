import { Header } from "../../Header";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css"
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import politic from '../../../assets/political-candidate-not-css.svg'



type RepositoryPolitician = {
  id: number;
  nomeSenador: string;
};

export function Home() {
  const [repositoryPolitician, setRepositoryPolitician] = useState<RepositoryPolitician[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/senadores")
      .then((response) => response.json())
      .then((data) => {
        setRepositoryPolitician(data);
      });
  }, []);

  return (
    <div className={styles.homeBackground}>
      <Header />
      <h1 className={styles.homeTitle}>Selecione o Nome do Politico Desejado</h1>
      <div className={styles.subHeaderElements}>
        <ul className={styles.names}>
          {repositoryPolitician.map((repo) => {
            return (
              <li key={repo.id}>
                <div className={styles.card}>
                  <Link to={`/expense/${repo.id}`} className={styles.nameSenador}>
                    {repo.nomeSenador}
                  </Link>
                  <FontAwesomeIcon icon={faMoneyBill} className={styles.moneyIcon} />
                </div>
              </li>
            );
          })}
        </ul>
        <img className={styles.politic} src={politic} alt="" />
      </div>
    </div>
  );
}
