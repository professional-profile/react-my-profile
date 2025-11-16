import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { alertError } from "ui-alert"
import { hideLoading, showLoading } from "ui-loading"
import { formatDateTime } from "ui-plus"
import { getDateFormat, handleError, user, useResource } from "uione"
import { Article, getArticleService } from "./service"

interface InternalState {
  article: Article
}
const initialState: InternalState = {
  article: {} as Article,
}

export const ArticleForm = () => {
  const dateFormat = getDateFormat().toUpperCase()
  const resource = useResource()
  const navigate = useNavigate()
  const [state, setState] = useState<InternalState>(initialState)
  const { id } = useParams()

  useEffect(() => {
    if (!id) {
      navigate(-1)
    } else {
      showLoading()
      getArticleService()
        .load(id)
        .then((article) => {
          if (!article) {
            alertError(resource.error_404, () => navigate(-1))
          } else {
            setState({ article })
          }
        })
        .catch(handleError)
        .finally(hideLoading)
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const article = state.article
  const account = user()

  return (
    <article className="article">
      <header className="article-header">
        <button type="button" id="btnBack" name="btnBack" className="btn-back" onClick={() => navigate(-1)} />
        <h2>{article.title}</h2>
      </header>
      <div className="article-body">
        <h4 className="article-description">{article.description}</h4>
        <h4 className="article-meta">
          {formatDateTime(article.publishedAt, dateFormat)}
          {account && article.savedAt && <i className="material-icons">bookmark</i>}
          {account && !article.savedAt && <i className="material-icons">bookmark_border</i>}
        </h4>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }}></div>
      </div>
    </article>
  )
}
