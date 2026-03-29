import { Item } from "onecore"
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react"
import {
  addParametersIntoUrl,
  buildFromUrl,
  buildMessage,
  buildSortFilter,
  checked,
  datetimeToString,
  getFields,
  getOffset,
  mergeFilter,
  onClearQ,
  OnClick,
  onPageChanged,
  onPageSizeChanged,
  onSearch,
  onSort,
  onToggleSearch,
  PageChange,
  pageSizes,
  PageSizeSelect,
  resetSearch,
  setSort,
  Sortable,
  updateState
} from "react-hook-core"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"
import { Pagination } from "reactx-pagination"
import { hideLoading, showLoading } from "ui-loading"
import { addSeconds, formatDateTime } from "ui-plus"
import { toast } from "ui-toast"
import { getDateFormat, handleError, useResource } from "uione"
import { Article, ArticleFilter, getArticleService } from "./service"

interface ArticleSearch extends Sortable {
  statusList: Item[]
  total?: number
  view?: string
  fields?: string[]
}

export const ArticlesForm = () => {
  const now = new Date()
  const articleFilter: ArticleFilter = {
    limit: 24,
    status: [],
    q: "",
    publishedAt: {
      max: addSeconds(now, 300),
    },
  }
  const initialState: ArticleSearch = {
    statusList: [],
  }

  const dateFormat = getDateFormat()
  const resource = useResource()
  const navigate = useNavigate()
  const refForm = useRef<HTMLFormElement>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [list, setList] = useState<Article[]>([])
  const [state, setState] = useState<ArticleSearch>(initialState)
  const [filter, setFilter] = useState<ArticleFilter>(articleFilter)
  const onChange = (e: ChangeEvent<HTMLInputElement>) => updateState(e, filter, setFilter)
  const statusOnChange = (e: ChangeEvent<HTMLInputElement>) => resetSearch(e, filter, setFilter, search)

  useEffect(() => {
    const initFilter = mergeFilter(buildFromUrl<ArticleFilter>(), filter, pageSizes, ["status"])
    setSort(state, filter.sort)
    setFilter(initFilter)
    search() // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearQ = (e: MouseEvent<HTMLButtonElement>) => onClearQ(filter, setFilter)
  const toggleSearch = (e: MouseEvent<HTMLButtonElement>) => onToggleSearch(e, showFilter, setShowFilter)
  const sort = (e: MouseEvent<HTMLButtonElement>) => onSort(e, search, state)
  const pageSizeChanged = (e: ChangeEvent<HTMLSelectElement>) => onPageSizeChanged(e, search, filter, setFilter)
  const pageChanged = (data: PageChange) => onPageChanged(data, search, filter, setFilter)
  const searchOnClick = (e: MouseEvent<HTMLButtonElement>) => onSearch(e, search, filter, state, setFilter, setState)

  const search = (isFirstLoad?: boolean) => {
    showLoading()
    const fields = getFields(refForm.current, state.fields)
    const urlFilter = buildSortFilter(filter, state)
    addParametersIntoUrl(urlFilter, isFirstLoad)
    setFilter(filter)
    const { limit, page } = urlFilter
    getArticleService()
      .search({ ...urlFilter }, limit, page, fields)
      .then((res) => {
        setState({ ...state, total: res.total, fields })
        setList(res.list)
        toast(buildMessage(resource, res.list, limit, page, res.total))
      })
      .catch(handleError)
      .finally(hideLoading)
  }

  const edit = (e: OnClick, id: string) => {
    e.preventDefault()
    navigate(`${id}`)
  }

  const offset = getOffset(filter.limit, filter.page)
  return (
    <div>
      <header>
        <h2>{resource.articles}</h2>
        <div className="btn-group">
          {state.view === "table" && (
            <button type="button" id="listViewBtn" name="listViewBtn" className="btn-list" onClick={(e) => setState({ ...state, view: "" })} />
          )}
          {state.view !== "table" && (
            <button type="button" id="tableBtn" name="tableBtn" className="btn-table" onClick={(e) => setState({ ...state, view: "table" })} />
          )}
          <Link id="newBtn" className="btn-new" to="new" />
        </div>
      </header>
      <div className="main-body">
        <form id="articlesForm" name="articlesForm" className="form" noValidate={true} ref={refForm as any}>
          <section className="row search-group">
            <label className="col s12 m6 l4 search-input">
              <PageSizeSelect id="limit" name="limit" size={filter.limit} sizes={pageSizes} onChange={pageSizeChanged} />
              <input type="text" id="q" name="q" value={filter.q} maxLength={80} onChange={onChange} placeholder={resource.keyword} />
              <button type="button" id="clearQBtn" name="clearQBtn" hidden={!filter.q} className="btn-remove-text" onClick={clearQ} />
              <button type="button" id="toggleSearchBtn" name="toggleSearchBtn" className="btn-filter" onClick={toggleSearch} />
              <button type="submit" id="searchBtn" name="searchBtn" className="btn-search" onClick={searchOnClick} />
            </label>
            <Pagination className="col s12 m6 l4" total={state.total} size={filter.limit} max={7} page={filter.page} onChange={pageChanged} />
          </section>
          <section className="row search-group inline" hidden={!showFilter}>
            <label className="col s12 m6 l4">
              {resource.published_at_from}
              <input
                type="datetime-local"
                step=".010"
                id="publishedAt_min"
                name="publishedAt_min"
                data-field="publishedAt.min"
                value={datetimeToString(filter.publishedAt?.min)}
                onChange={onChange}
              />
            </label>
            <label className="col s12 m6 l4">
              {resource.published_at_to}
              <input
                type="datetime-local"
                step=".010"
                id="publishedAt_max"
                name="publishedAt_max"
                data-field="publishedAt.max"
                value={datetimeToString(filter.publishedAt?.max)}
                onChange={onChange}
              />
            </label>
            <label className="col s12 m12 l4 checkbox-section">
              {resource.status}
              <section className="checkbox-group">
                <label>
                  <input type="checkbox" id="status_published" name="status" value="P" checked={checked(filter.status, "P")} onChange={statusOnChange} />
                  {resource.published}
                </label>
                <label>
                  <input type="checkbox" id="status_draft" name="status" value="D" checked={checked(filter.status, "D")} onChange={statusOnChange} />
                  {resource.draft}
                </label>
              </section>
            </label>
          </section>
        </form>
        {state.view === "table" && (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>{resource.number}</th>
                  <th data-field="id">
                    <button type="button" id="idSort" onClick={sort}>
                      {resource.id}
                    </button>
                  </th>
                  <th data-field="title">
                    <button type="button" id="titleSort" onClick={sort}>
                      {resource.title}
                    </button>
                  </th>
                  <th data-field="publishedAt" className="datetime">
                    <button type="button" id="publishedAtSort" onClick={sort}>
                      {resource.published_at}
                    </button>
                  </th>
                  <th data-field="description">
                    <button type="button" id="descriptionSort" onClick={sort}>
                      {resource.description}
                    </button>
                  </th>
                  <th className="action">{resource.action}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item, i) => {
                  return (
                    <tr key={i} onClick={(e) => edit(e, item.id)}>
                      <td className="text-right">{offset + i + 1}</td>
                      <td>{item.id}</td>
                      <td>
                        <Link to={`${item.id}`}>{item.title}</Link>
                      </td>
                      <td>{formatDateTime(item.publishedAt, dateFormat)}</td>
                      <td>{item.description}</td>
                      <td>
                        <div className="btn-group">
                          <button type="button" className="btn-edit" onClick={(e) => edit(e, item.id)}></button>
                          <button type="button" className="btn-history" onClick={(e) => edit(e, item.id)}></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {state.view !== "table" && (
          <ul className="row list card-grid">
            {list.map((item, i) => {
              return (
                <li key={i} className="col s12 m6 l4 xl3 card" onClick={(e) => edit(e, item.id)}>
                  <section>
                    <div className="cover" style={{ backgroundImage: `url('${item.thumbnail}')` }}></div>
                    <Link to={`${item.id}`}>{item.title}</Link>
                    <p>{formatDateTime(item.publishedAt, dateFormat)}</p>
                    <p>{item.description}</p>
                  </section>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
