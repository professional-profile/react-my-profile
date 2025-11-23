import { Item } from "onecore"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import {
  addParametersIntoUrl,
  buildFromUrl,
  buildMessage,
  buildSortFilter,
  getFields,
  getNumber,
  getSortElement,
  handleSort,
  handleToggle,
  mergeFilter,
  OnClick,
  PageChange,
  pageSizes,
  removeSortStatus,
  setSort,
  Sortable,
} from "react-hook-core"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"
import { Pagination } from "reactx-pagination"
import { hideLoading, showLoading } from "ui-loading"
import { toast } from "ui-toast"
import { getStatusName, handleError, user, useResource } from "uione"
import femaleIcon from "../assets/images/female.png"
import maleIcon from "../assets/images/male.png"
import { getUserService, User, UserFilter } from "./service"

interface UserSearch extends Sortable {
  statusList: Item[]
  filter: UserFilter
  list: User[]
  total?: number
  view?: string
  hideFilter?: boolean
  fields?: string[]
}
const userFilter: UserFilter = {
  limit: 24,
  id: "",
  username: "",
  email: "",
  q: "",
}
const sizes = pageSizes
const initialState: UserSearch = {
  statusList: [],
  list: [],
  filter: userFilter,
}
export const UsersForm = () => {
  const resource = useResource()
  const navigate = useNavigate()
  const refForm = useRef<HTMLFormElement>(null)
  const [state, setState] = useState<UserSearch>(initialState)
  const service = getUserService()
  useEffect(() => {
    const filter = mergeFilter(buildFromUrl<UserFilter>(), state.filter, sizes, ["status", "userType"])
    setSort(state, filter.sort)
    search() // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const view = (e: OnClick, id: string) => {
    e.preventDefault()
    navigate(`${id}`)
  }
  const sort = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = getSortElement(event.target as HTMLElement)
    const sort = handleSort(target, state.sortTarget, state.sortField, state.sortType)
    state.sortField = sort.field
    state.sortType = sort.type
    state.sortTarget = target
    search()
  }
  const pageSizeChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    state.filter.page = 1
    state.filter.limit = getNumber(event)
    search()
  }
  const pageChanged = (data: PageChange) => {
    const { page, size } = data
    state.filter.page = page
    state.filter.limit = size
    search()
  }
  const searchOnClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault()
    removeSortStatus(state.sortTarget)
    state.filter.page = 1
    state.sortTarget = undefined
    state.sortField = undefined
    search()
  }
  const limit = state.filter.limit
  const page = state.filter.page
  const search = (isFirstLoad?: boolean) => {
    showLoading()
    const filter = buildSortFilter(state.filter, state)
    addParametersIntoUrl(filter, isFirstLoad)
    const fields = getFields(refForm.current, state.fields)
    service
      .search(filter, limit, page, fields)
      .then((res) => {
        setState({ ...state, filter: state.filter, list: res.list, total: res.total, fields })
        toast(buildMessage(resource, res.list, limit, page, res.total))
      })
      .catch(handleError)
      .finally(hideLoading)
  }

  const { list } = state
  const follow = (e: React.MouseEvent<HTMLElement, MouseEvent>, user: User) => {
    e.preventDefault()
    service.follow(user.id).then((res) => {
      if (res > 0) {
        user.followingAt = new Date()
        user.followerCount = (user.followerCount | 0) + 1
        setState({ ...state, list })
        toast("Follow successfully")
      } else {
        toast("No change. You already follow this user before.")
      }
    })
  }
  const unfollow = (e: React.MouseEvent<HTMLElement, MouseEvent>, user: User) => {
    e.preventDefault()
    service.unfollow(user.id).then((res) => {
      if (res > 0) {
        user.followingAt = undefined
        user.followerCount = (user.followerCount | 0) - 1
        setState({ ...state, list })
        toast("Unfollow successfully")
      } else {
        toast("No change. You already unfollow this user before.")
      }
    })
  }
  const filter = state.filter
  const account = user()
  return (
    <div>
      <header>
        <h2>{resource.users}</h2>
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
      <div>
        <form id="usersForm" name="usersForm" className="form" noValidate={true} ref={refForm as any}>
          <section className="row search-group section">
            <label className="col s12 m6 search-input">
              <select id="limit" name="limit" onChange={pageSizeChanged} defaultValue={filter.limit}>
                {sizes.map((item, i) => {
                  return (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  )
                })}
              </select>
              <input
                type="text"
                id="q"
                name="q"
                value={filter.q || ""}
                maxLength={255}
                onChange={(e) => {
                  filter.q = e.target.value
                  setState({ ...state, filter })
                }}
                placeholder={resource.keyword}
              />
              <button
                type="button"
                hidden={!filter.q}
                className="btn-remove-text"
                onClick={(e) => {
                  filter.q = ""
                  setState({ ...state, filter })
                }}
              />
              <button
                type="button"
                className="btn-filter"
                onClick={(e) => {
                  const hideFilter = handleToggle(e.target as HTMLElement, state.hideFilter)
                  setState({ ...state, hideFilter })
                }}
              />
              <button type="submit" className="btn-search" onClick={searchOnClick} />
            </label>
            <Pagination className="col s12 m6" total={state.total} size={state.filter.limit} max={7} page={state.filter.page} onChange={pageChanged} />
          </section>
          <section className="row search-group inline" hidden={state.hideFilter}>
            <label className="col s12 m4 l4">
              {resource.username}
              <input
                type="text"
                id="username"
                name="username"
                value={filter.username || ""}
                onChange={(e) => {
                  filter.username = e.target.value
                  setState({ ...state, filter })
                }}
                maxLength={255}
                placeholder={resource.username}
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
                {list &&
                  list.length > 0 &&
                  list.map((user, i) => {
                    return (
                      <tr key={i} onClick={(e) => view(e, user.id)}>
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
            {list &&
              list.length > 0 &&
              list.map((user, i) => {
                return (
                  <li key={i} className="col s12 m6 l4 xl3 img-item">
                    <img
                      src={user.imageURL && user.imageURL.length > 0 ? user.imageURL : user.gender === "F" ? femaleIcon : maleIcon}
                      alt="user"
                      className="round-border"
                    />
                    <Link to={`${user.username}`}>{user.displayName}</Link>
                    <button className="btn-detail" />
                    <p>
                      {user.email}
                      {account && !user.followingAt && (
                        <button type="button" onClick={(e) => follow(e, user)}>
                          Follow
                        </button>
                      )}
                      {account && user.followingAt && (
                        <button type="button" onClick={(e) => unfollow(e, user)}>
                          Unfollow
                        </button>
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
