import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { alertError, alertWarning } from "ui-alert"
import { hideLoading, showLoading } from "ui-loading"
import { formatDateTime } from "ui-plus"
import { toast } from "ui-toast"
import { getDateFormat, handleError, user, useResource } from "uione"
import { Article, getArticleService } from "./service"

export const ArticleForm = () => {
  const dateFormat = getDateFormat()
  const resource = useResource()
  const navigate = useNavigate()
  const [article, setArticle] = useState<Article>({} as Article)
  const { id } = useParams()
  const service = getArticleService()
  useEffect(() => {
    if (!id) {
      navigate(-1)
    } else {
      showLoading()
      service
        .load(id)
        .then((obj) => {
          if (!obj) {
            alertError(resource.error_404, () => navigate(-1))
          } else {
            setArticle(obj)
          }
        })
        .catch(handleError)
        .finally(hideLoading)
    }
  }, [id, service]) // eslint-disable-line react-hooks/exhaustive-deps

  const saveArticle = (e: React.MouseEvent<HTMLElement, MouseEvent>, item: Article) => {
    e.preventDefault()
    service.save(item.id).then((res) => {
      if (res > 0) {
        item.savedAt = new Date()
        setArticle({ ...item })
        toast(resource.article_save_success)
      } else if (res === 0) {
        toast(resource.article_save_conflict)
      } else {
        alertWarning(resource.article_save_fail)
      }
    })
  }
  const removeArticle = (e: React.MouseEvent<HTMLElement, MouseEvent>, item: Article) => {
    e.preventDefault()
    service.remove(article.id).then((res) => {
      if (res > 0) {
        item.savedAt = undefined
        setArticle({ ...item })
        toast(resource.article_unsave_success)
      } else {
        toast(resource.article_unsave_conflict)
      }
    })
  }

  const account = user()
  return (
    <article className="article">
      <header className="article-header">
        <button type="button" id="btnBack" name="btnBack" className="btn-back" onClick={() => navigate(-1)} />
        <h2>{article.title}</h2>
      </header>
      <div className="article-body">
        <h4 className="article-description">{article.description}</h4>
        <h4 className="article-meta center-align-items">
          {formatDateTime(article.publishedAt, dateFormat)}
          {account && article.savedAt && (
            <i className="material-icons" onClick={(e) => removeArticle(e, article)}>
              bookmark
            </i>
          )}
          {account && !article.savedAt && (
            <i className="material-icons" onClick={(e) => saveArticle(e, article)}>
              bookmark_border
            </i>
          )}
        </h4>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }}></div>
      </div>
    </article>
  )
}
