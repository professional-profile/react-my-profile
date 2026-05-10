import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { hideLoading, showLoading } from "ui-loading"
import { getDateFormat, handleError, useResource } from "uione"
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
      <article className="article">
        <header>
          <button type="button" id="backBtn" name="backBtn" className="btn-back" onClick={() => navigate(-1)} />
          <h2>{company.companyName}</h2>
        </header>
        <div className="article-body">
          <h3 className="article-description">
            {resource.location}: {company.industry}
          </h3>
          <div className="company-description" dangerouslySetInnerHTML={{ __html: company.overview }}></div>
        </div>
      </article>)
  )
}
