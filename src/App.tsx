import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

function App() {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get<Post>('https://jsonplaceholder.typicode.com/posts/1')
        setPost(response.data)
      } catch (err) {
        setError('Ошибка загрузки данных')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [])

  return (
    <section className="post-page">
      {loading && <p className="post-page__status">Загрузка...</p>}
      {error && <p className="post-page__status post-page__status--error">{error}</p>}
      {post && (
        <article className="post-page__post">
          <h1>{post.title}</h1>
          <p>{post.body}</p>
        </article>
      )}
    </section>
  )
}

export default App
