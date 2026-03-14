import { Item } from "onecore"
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react"
import {
  addParametersIntoUrl,
  buildFromUrl,
  buildMessage,
  buildSortFilter,
  getFields,
  mergeFilter,
  onClearQ,
  onPageChanged,
  onPageSizeChanged,
  onSearch,
  onSort,
  onToggleSearch,
  PageChange,
  pageSizes,
  PageSizeSelect,
  resources,
  setSort,
  Sortable,
  updateState
} from "react-hook-core"
import { Link } from "react-router-dom"
import { Pagination } from "reactx-pagination"
import { hideLoading, showLoading } from "ui-loading"
import { toast } from "ui-toast"
import { getStatusName, getUser, handleError, useResource } from "uione"
import femaleIcon from "../assets/images/female.png"
import maleIcon from "../assets/images/male.png"
import { getUserService, User, UserFilter } from "./service"

interface UserSearch extends Sortable {
  statusList: Item[]
  total?: number
  view?: string
  fields?: string[]
}

export const UsersForm = () => {
  const userFilter: UserFilter = {
    limit: resources.defaultLimit,
  }
  const initialState: UserSearch = {
    statusList: [],
  }

  const resource = useResource()
  const refForm = useRef<HTMLFormElement>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [list, setList] = useState<User[]>([])
  const [state, setState] = useState<UserSearch>(initialState)
  const [filter, setFilter] = useState<UserFilter>(userFilter)
  const onChange = (e: ChangeEvent<HTMLInputElement>) => updateState(e, filter, setFilter)

  const service = getUserService()
  useEffect(() => {
    const initFilter = mergeFilter(buildFromUrl<UserFilter>(), filter, pageSizes, ["status"])
    setSort(state, filter.sort)
    setFilter(initFilter)
    search(true) // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const { limit, page } = filter
    getUserService()
      .search({ ...filter }, limit, page, fields)
      .then((res) => {
        setState({ ...state, total: res.total, fields })
        setList(res.list)
        toast(buildMessage(resource, res.list, limit, page, res.total))
      })
      .catch(handleError)
      .finally(hideLoading)
  }

  const follow = (e: MouseEvent<HTMLElement>, user: User) => {
    e.preventDefault()
    service.follow(user.id).then((res) => {
      if (res > 0) {
        user.followingAt = new Date()
        user.followerCount = (user.followerCount | 0) + 1
        setList([...list])
        toast(resource.user_profile_follow_success)
      } else {
        toast(resource.user_profile_follow_conflict)
      }
    })
  }
  const unfollow = (e: MouseEvent<HTMLElement>, user: User) => {
    e.preventDefault()
    service.unfollow(user.id).then((res) => {
      if (res > 0) {
        user.followingAt = undefined
        user.followerCount = (user.followerCount | 0) - 1
        setList([...list])
        toast(resource.user_profile_unfollow_success)
      } else {
        toast(resource.user_profile_unfollow_conflict)
      }
    })
  }
  const account = getUser()
  return (
    <div>
      <header>
        <h2>{resource.users}</h2>
        <div className="btn-group">
          {state.view === "table" && (
            <button type="button" id="btnTable" name="btnTable" className="btn-table" onClick={(e) => setState({ ...state, view: "" })} />
          )}
          {state.view !== "table" && (
            <button type="button" id="btnListView" name="btnListView" className="btn-list" onClick={(e) => setState({ ...state, view: "table" })} />
          )}
        </div>
      </header>
      <div className="search-body">
        <form id="usersForm" name="usersForm" className="form" noValidate={true} ref={refForm as any}>
          <section className="row search-group">
            <label className="col s12 m6 search-input">
              <PageSizeSelect id="limit" name="limit" size={filter.limit} sizes={pageSizes} onChange={pageSizeChanged} />
              <input type="text" id="q" name="q" value={filter.q} maxLength={80} onChange={onChange} placeholder={resource.keyword} />
              <button type="button" id="btnClearQ" hidden={!filter.q} className="btn-remove-text" onClick={clearQ} />
              <button type="button" id="btnToggleSearch" className="btn-filter" onClick={toggleSearch} />
              <button type="submit" id="btnSearch" className="btn-search" onClick={searchOnClick} />
            </label>
            <Pagination className="col s12 m6" total={state.total} size={filter.limit} max={7} page={filter.page} onChange={pageChanged} />
          </section>
          <section className="row search-group inline" hidden={!showFilter}>
            <label className="col s12 m4 l4">
              {resource.email}
              <input
                type="text"
                id="email"
                name="email"
                value={filter.email}
                onChange={(e) => {
                  filter.email = e.target.value
                  setFilter({ ...filter })
                }}
                maxLength={255}
                placeholder={resource.email}
              />
            </label>
          </section>
        </form>
        {state.view === "table" && (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>{resource.number}</th>
                  <th data-field="userId">
                    <button type="button" id="sortUserId" onClick={sort}>
                      {resource.user_id}
                    </button>
                  </th>
                  <th data-field="username">
                    <button type="button" id="sortUserName" onClick={sort}>
                      {resource.username}
                    </button>
                  </th>
                  <th data-field="email">
                    <button type="button" id="sortEmail" onClick={sort}>
                      {resource.email}
                    </button>
                  </th>
                  <th data-field="displayName">
                    <button type="button" id="sortDisplayName" onClick={sort}>
                      {resource.display_name}
                    </button>
                  </th>
                  <th data-field="status">
                    <button type="button" id="sortStatus" onClick={sort}>
                      {resource.status}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((user, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-right">{(user as any).sequenceNo}</td>
                      <td>{user.id}</td>
                      <td>
                        <Link to={`${user.id}`}>{user.username}</Link>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.displayName}</td>
                      <td>{getStatusName(user.status, resource)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {state.view !== "table" && (
          <ul className="row list">
            {list.map((user, i) => {
              return (
                <li key={i} className="col s12 m6 l4 xl3 img-item">
                  <img
                    src={user.imageURL && user.imageURL.length > 0 ? user.imageURL : user.gender === "F" ? femaleIcon : maleIcon}
                    alt="user"
                    className="round-border"
                  />
                  <Link to={`${user.username}`}>{user.displayName}</Link>
                  <button className="btn-detail" />
                  <p className="center-align-items">
                    {user.occupation}
                    {account && !user.followingAt && (
                      <i className="material-icons" onClick={(e) => follow(e, user)}>
                        bookmark_border
                      </i>
                    )}
                    {account && user.followingAt && (
                      <i className="material-icons" onClick={(e) => unfollow(e, user)}>
                        bookmark
                      </i>
                    )}
                  </p>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
