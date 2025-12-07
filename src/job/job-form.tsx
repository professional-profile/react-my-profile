import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { alertError } from "ui-alert"
import { hideLoading, showLoading } from "ui-loading"
import { formatDateTime } from "ui-plus"
import { getDateFormat, handleError, useResource } from "uione"
import { getJobService, Job } from "./service"

export const JobForm = () => {
  const dateFormat = getDateFormat().toUpperCase()
  const resource = useResource()
  const navigate = useNavigate()
  const [job, setJob] = useState<Job>({} as Job)
  const { id } = useParams()
  useEffect(() => {
    if (id) {
      showLoading()
      getJobService()
        .load(id)
        .then((obj) => {
          if (!obj) {
            alertError(resource.error_404, () => navigate(-1))
          } else {
            setJob(obj)
          }
        })
        .catch(handleError)
        .finally(hideLoading)
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
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
    </article>
  )
}
