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
        <div id="rateSummaryContainer" className="rating-summary-container">
          <RatingSummary />
        </div>
        <div className="rate-header">
          <button className="btn-review">Write a review</button>
        </div>
        <form id="reviewsForm" name="reviewsForm" className="form" noValidate data-part="reviewBody">
          <section className="row search-group">
            <div className="col s12 m6 sort">
              <button id="sortBtn" type="button" className="btn-sort">Sort</button>
              <div id="sortDropdown" className="dropdown">
                <a href="#" data-sort="recent">Most Recent</a>
                <a href="#" data-sort="high">Highest Rating</a>
                <a href="#" data-sort="low">Lowest Rating</a>
              </div>
            </div>
          </section>
        </form>
        <ul className="row list">
          <li className="col s12 m6 review-item">
            <header>
              <strong>Lam Thi Tien</strong>
              <div className="review-item-stars" style={{ "--percent": "80%" } as React.CSSProperties}></div>
            </header>
            <p className="center-align-items">9/30/2024 16:45</p>
            <p>Good Good Good Good Good Good Good Good</p>
          </li>
          <li className="col s12 m6 review-item">
            <header>
              <strong>Duc Nguyen</strong>
              <span className="review-item-stars" style={{ "--percent": "70%" } as React.CSSProperties}></span>
            </header>
            <p className="center-align-items">9/30/2024 16:45</p>
            <p>Good article</p>
          </li>
          <li className="col s12 m6 review-item">
            <header>
              <strong>Minh Ha</strong>
              <span className="review-item-stars" style={{ "--percent": "90%" } as React.CSSProperties}></span>
            </header>
            <p className="center-align-items">9/30/2024 16:45</p>
            <p>Excellent article</p>
          </li>
          <li className="col s12 m6 review-item">
            <header>
              <strong>Triet Nguyen</strong>
              <span className="review-item-stars" style={{ "--percent": "90%" } as React.CSSProperties}></span>
            </header>
            <p className="center-align-items">9/30/2024 16:45</p>
            <p>Excellent article</p>
          </li>
        </ul>
      </div>
    </div>
  )
}
