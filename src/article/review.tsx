import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { alertError } from "ui-alert"
import { hideLoading, showLoading } from "ui-loading"
import { getUser, handleError, useResource } from "uione"
import { RatingSummary } from "../components/rating-summary"
import { Article, getArticleService } from "./service"

export const Review = () => {
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

  const account = getUser()
  return (
    <div>
      <header>
        <button type="button" id="backBtn" name="backBtn" className="btn-back" onClick={() => navigate(-1)} />
        <h2>{resource.ratings_and_reviews}</h2>
      </header>
      <div className="main-body">
        <RatingSummary />
        <div className="rate-header">
          <button>Write a review</button>
        </div>
      </div>
    </div>
  )
}
