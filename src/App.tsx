import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import './App.css';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

function usePostFetcher(postId: number) {
  const [data, setData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true); // Установка состояния загрузки
      setError(null); // Сброс ошибки перед новым запросом
      try {
        const response = await axios.get<Post>(
          `https://jsonplaceholder.typicode.com/posts/${postId}`,
        ); // Явное указание типа ответа
        setData(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError;
          setError(`Ошибка загрузки данных: ${axiosError.message}`);
        } else {
          setError('Произошла непредвиденная ошибка');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return { data, loading, error };
}

function App() {
  const { data: post, loading, error } = usePostFetcher(1);

  return (
    <section className="post-page">
      {loading && <p className="post-page__status">Загрузка поста...</p>}
      {error && <p className="post-page__status post-page__status--error">{error}</p>}
      {!loading && !error && !post && <p className="post-page__status">Пост не найден.</p>}{' '}
      {post && (
        <article className="post-page__post">
          <h1>{post.title}</h1>
          <p>{post.body}</p>
        </article>
      )}
    </section>
  );
}

export default App;

/*

Кастомный хук usePostFetcher:

    Разделение ответственности: Компонент App теперь отвечает только за рендеринг, а usePostFetcher — за всю логику получения данных, обработки состояний загрузки и ошибок. Это делает App чище и легче для понимания.

    Переиспользуемость: Вы можете легко использовать usePostFetcher в других компонентах, если вам понадобится получить пост по ID.

    Тестируемость: Логику хука легче тестировать изолированно от компонента UI.

    Сброс ошибок: setError(null) в начале fetchPost гарантирует, что сообщение об ошибке сбросится, если пользователь, например, попытается повторно загрузить данные.

Более точная обработка ошибок с AxiosError:

    Использование axios.isAxiosError(err) и приведение к типу AxiosError позволяет получить доступ к специфическим свойствам ошибки Axios (например, message), делая сообщения об ошибках более информативными.

Явное условие для "Пост не найден":

    {!loading && !error && !post && <p className="post-page__status">Пост не найден.</p>} добавляет обработку случая, когда загрузка завершена, нет ошибок, но при этом post все равно null. Это может произойти, если API вернул пустой ответ (хотя для jsonplaceholder это маловероятно для /posts/1).

Улучшенное сообщение о загрузке:

    "Загрузка поста..." более специфично.

*/
