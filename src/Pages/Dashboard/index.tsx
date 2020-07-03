import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  Title, Form, Repositories, Error,
} from './style';
import logo from '../../assets/logo.svg';
import api from '../../services/api';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storedRepositories = localStorage.getItem('@GithubExplorer:repositories');

    if (storedRepositories) {
      return JSON.parse(storedRepositories);
    }

    return [];
  });
  const [inputError, setInputError] = useState('');
  const [newRepo, setNewRepo] = useState('');

  useEffect(() => {
    localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
  }, [repositories]);

  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digiter o autor/nome do repositório');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca pelo repositório informado');
    }
  }

  return (
    <>
      <img src={logo} alt="Github Explorer" />
      <Title>Dashboard</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          placeholder="Digite o nome do repositório"
          onChange={(e) => setNewRepo(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </Form>

      { inputError && <Error>{inputError}</Error> }

      <Repositories>
        {repositories.map(({ owner: { avatar_url }, full_name, description }) => (
          <Link key={full_name} to={`/repository/${full_name}`}>
            <img src={avatar_url} alt="user avatar" />

            <div>
              <strong>{full_name}</strong>
              <p>{description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}

      </Repositories>
    </>
  );
};

export default Dashboard;
