import { Header } from "../../Header";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css"


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
    <div className={styles.homeBackground} >
      <Header />
      <ul className={styles.names}>
        {repositoryPolitician.map((repo) => {
          return (
            <li key={repo.id}>
              <Link to={`/expense/${repo.id}`}>
                <strong>{repo.nomeSenador}</strong>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
