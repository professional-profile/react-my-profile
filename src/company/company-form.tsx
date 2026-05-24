import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { hideLoading, showLoading } from "ui-loading"
import { getDateFormat, getUser, handleError, useResource } from "uione"
import { Company, getCompanyService } from "./service"

export const CompanyForm = () => {
  const dateFormat = getDateFormat()
  const resource = useResource()
  const navigate = useNavigate()
  const [company, setCompany] = useState<Company>()

  const { slug } = useParams()
  useEffect(() => {
    if (slug) {
      showLoading()
      getCompanyService()
        .load(slug)
        .then((obj) => {
          if (obj) {
            setCompany(obj)
          }
        })
        .catch(handleError)
        .finally(hideLoading)
    }
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  const account = getUser()
  return (
    !company ? (
      <div>
        <header>
          <button type="button" id="backBtn" name="backBtn" className="btn-back" onClick={() => navigate(-1)}></button>
          <h2>{resource.error_404_title}</h2>
        </header>
        <div className="error-body">
          <h4 className="h4">{resource.error_404_message}</h4>
        </div>
      </div>
    ) : (
      <div className="profile">
        <div className="cover" style={{ backgroundImage: `url(${company.coverURL})` }}>
          <button type="button" id="cameraBtn" name="cameraBtn" className="btn-camera"></button>
        </div>
        <div id="headerTrigger" className="header-trigger"></div>
        <header className="profile-header">
          <div className="profile-header-inner">
            <div className="avatar-wrapper">
              <div className="avatar" style={{ backgroundImage: `url(${company.logo || "https://avatars.githubusercontent.com/u/37324393?v=4"})` }}></div>
            </div>
            <div className="profile-info">
              <h1>
                <Link to={`/companies/${slug}`}>{company.companyName}</Link>
                <i className="material-icons highlight">group</i>
              </h1>
              <p>{company.industry}</p>
              <div className="profile-followers">
                <Link to={`/profiles/${slug}/followers`}><i className="material-icons highlight">group</i> {company.followerCount | 0} followers</Link>
                <Link to={`/profiles/${slug}/following`}><i className="material-icons highlight">group_add</i> {company.followingCount | 0} followings</Link>
              </div>
              {account && account.id !== company.id && !company.followingAt && (
                <button
                  type="button"
                  id="followBtn"
                  name="followBtn"
                  className="btn-follow"
                  onClick={(e) => {
                  }}
                >
                  {resource.button_follow}
                </button>
              )}
              {account && account.id !== company.id && company.followingAt && (
                <button
                  type="button"
                  id="unfollowBtn"
                  name="unfollowBtn"
                  className="btn-follow"
                  onClick={(e) => {
                  }}
                >
                  {resource.button_unfollow}
                </button>
              )}
            </div>
          </div>
        </header>
        <nav className="tabs">
          <a className="tab active">Overview</a>
          <a className="tab">Reviews</a>
          <a className="tab">Articles</a>
          <a className="tab">Community</a>
          <a className="tab">About</a>
        </nav>
        <div id="companyBody" className="profile-body">
          <form id="companyForm" name="companyForm">
            <ul className="row list card-grid">
              <li className="col s12 l6">
                <div className="card">
                  <header>
                    <i className="material-icons highlight">account_box</i>
                    Overview
                  </header>
                  <div className="card-body">
                    {company.overview}
                  </div>
                </div>
              </li>
              <li className="col s12 l6">
                <div className="card">
                  <header>
                    <i className="material-icons highlight">account_box</i>
                    Overview
                  </header>
                  <div className="card-body">
                    {company.overview}
                  </div>
                </div>
              </li>
            </ul>
          </form>
        </div>
      </div>)
  )
}
