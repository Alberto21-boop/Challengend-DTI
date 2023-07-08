import { Header } from "../../Header";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    <div>
      <Header />
      <ul>
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
