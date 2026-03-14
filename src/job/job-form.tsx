import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { hideLoading, showLoading } from "ui-loading"
import { formatDateTime } from "ui-plus"
import { getDateFormat, handleError, useResource } from "uione"
import { getJobService, Job } from "./service"

export const JobForm = () => {
  const dateFormat = getDateFormat()
  const resource = useResource()
  const navigate = useNavigate()
  const [job, setJob] = useState<Job>()

  const { id } = useParams()
  useEffect(() => {
    if (id) {
      showLoading()
      getJobService()
        .load(id)
        .then((obj) => {
          if (obj) {
            setJob(obj)
          }
        })
        .catch(handleError)
        .finally(hideLoading)
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    !job ? (
      <div>
        <header>
          <button type="button" id="btnBack" name="btnBack" className="btn-back" onClick={() => navigate(-1)}></button>
          <h2>{resource.error_404_title}</h2>
        </header>
        <div className="error-body">
          <h4 className="h4">{resource.error_404_message}</h4>
        </div>
      </div>
    ) : (
      <article className="article">
        <header>
          <button type="button" id="btnBack" name="btnBack" className="btn-back" onClick={() => navigate(-1)} />
          <h2>{job.title}</h2>
        </header>
        <div className="article-body">
          <h3 className="article-description">
            {resource.location}: {job.location}
          </h3>
          <h4 className="article-meta">{formatDateTime(job.publishedAt, dateFormat)}</h4>
          <h4 className="article-meta">
            {resource.quantity}: {job.quantity}
          </h4>
          <div className="job-description" dangerouslySetInnerHTML={{ __html: job.description }}></div>
        </div>
      </article>)
  )
}
