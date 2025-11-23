import { Item } from "onecore"
import { useEffect, useRef } from "react"
import { OnClick, Search, SearchComponentState, useSearch, value } from "react-hook-core"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"
import { Pagination } from "reactx-pagination"
import { getStatusName, inputSearch, useResource } from "uione"
import femaleIcon from "../assets/images/female.png"
import maleIcon from "../assets/images/male.png"
import { getUserService, User, UserFilter } from "./service"

interface UserSearch extends SearchComponentState<User, UserFilter> {
  statusList: Item[]
}
const userFilter: UserFilter = {
  limit: 24,
  id: "",
  username: "",
  email: "",
  q: "",
}
const initialState: UserSearch = {
  limit: 24,
  statusList: [],
  list: [],
  filter: userFilter,
}
export const UsersForm = () => {
  const resource = useResource()
  const navigate = useNavigate()
  const refForm = useRef<HTMLFormElement>(null)
  const { state, component, updateState, search, sort, toggleFilter, clearQ, changeView, pageChanged, pageSizeChanged } = useSearch<
    User,
    UserFilter,
    UserSearch
  >(refForm, initialState, getUserService(), resource, inputSearch())

  useEffect(() => {
    search() // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const view = (e: OnClick, id: string) => {
    e.preventDefault()
    navigate(`${id}`)
  }
  const { list } = state
  const filter = value(state.filter)
  return (
    <div>
      <header>
        <h2>{resource.users}</h2>
        <div className="btn-group">
          {component.view !== "table" && <button type="button" id="btnTable" name="btnTable" className="btn-table" data-view="table" onClick={changeView} />}
          {component.view === "table" && (
            <button type="button" id="btnListView" name="btnListView" className="btn-list" data-view="listview" onClick={changeView} />
          )}
        </div>
      </header>
      <div>
        <form id="usersForm" name="usersForm" className="form" noValidate={true} ref={refForm as any}>
          <section className="row search-group section">
            <Search
              className="col s12 m6 search-input"
              size={component.limit}
              sizes={component.pageSizes}
              pageSizeChanged={pageSizeChanged}
              onChange={updateState}
              placeholder={resource.keyword}
              toggle={toggleFilter}
              value={filter.q || ""}
              search={search}
              clear={clearQ}
            />
            <Pagination
              className="col s12 m6"
              total={component.total}
              size={component.limit}
              max={component.pageMaxSize}
              page={component.page}
              onChange={pageChanged}
            />
          </section>
          <section className="row search-group inline" hidden={component.hideFilter}>
            <label className="col s12 m4 l4">
              {resource.username}
              <input
                type="text"
                id="username"
                name="username"
                value={filter.username || ""}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.username}
              />
            </label>
          </section>
        </form>
        {component.view === "table" && (
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
        {component.view !== "table" && (
          <ul className="row list">
            {list &&
              list.length > 0 &&
              list.map((user, i) => {
                return (
                  <li key={i} className="col s12 m6 l4 xl3 img-item" onClick={(e) => view(e, user.username)}>
                    <img
                      src={user.imageURL && user.imageURL.length > 0 ? user.imageURL : user.gender === "F" ? femaleIcon : maleIcon}
                      alt="user"
                      className="round-border"
                    />
                    <Link to={`${user.username}`}>{user.displayName}</Link>
                    <button className="btn-detail" />
                    <p>{user.email}</p>
                  </li>
                )
              })}
          </ul>
        )}
      </div>
    </div>
  )
}
