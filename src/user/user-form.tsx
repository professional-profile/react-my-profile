import { useLayoutEffect, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { hideLoading, showLoading } from "ui-loading"
import { toast } from "ui-toast"
import { user as getUser, handleError, useResource } from "uione"
import imageOnline from "../assets/images/online.svg"
import { Followers } from "./followers"
import { Following } from "./following"
import { Overview } from "./overview"
import { Rating } from "./rating"
import { getUserService, User } from "./service"

export const UserView = () => {
  const resource = useResource()
  const locationPath = useLocation().pathname
  const count = locationPath.split("/").length
  const [user, setUser] = useState<User>({} as User)
  const { id } = useParams()
  const service = getUserService()
  useLayoutEffect(() => {
    if (id) {
      showLoading()
      service
        .load(id)
        .then((obj) => {
          if (obj) {
            setUser(obj)
          }
        })
        .catch(handleError)
        .finally(hideLoading)
    }
  }, [id, service])

  const follow = (e: React.MouseEvent<HTMLElement, MouseEvent>, item: User) => {
    e.preventDefault()
    service.follow(item.id).then((res) => {
      if (res > 0) {
        item.followingAt = new Date()
        item.followerCount = (item.followerCount | 0) + 1
        setUser({ ...item })
        toast(resource.user_profile_follow_success)
      } else {
        toast(resource.user_profile_follow_conflict)
      }
    })
  }
  const unfollow = (e: React.MouseEvent<HTMLElement, MouseEvent>, item: User) => {
    e.preventDefault()
    service.unfollow(item.id).then((res) => {
      if (res > 0) {
        item.followingAt = undefined
        item.followerCount = (item.followerCount | 0) - 1
        setUser({ ...item })
        toast(resource.user_profile_unfollow_success)
      } else {
        toast(resource.user_profile_unfollow_conflict)
      }
    })
  }

  const account = getUser()
  return (
    <div className="profile">
      <header className="profile-header border-bottom-highlight">
        <div className="cover-image">
          <img src={user.coverURL} alt="cover" />
          <div className="contact-group">
            <button type="button" id="phoneBtn" name="phoneBtn" className="btn-phone" />
            <button type="button" id="emailBtn" name="emailBtn" className="btn-email" />
          </div>
          {account && account.id !== user.id && !user.followingAt && (
            <button
              type="button"
              id="followBtn"
              name="followBtn"
              className="btn-follow"
              onClick={(e) => {
                follow(e, user)
              }}
            >
              {resource.button_follow}
            </button>
          )}
          {account && account.id !== user.id && user.followingAt && (
            <button
              type="button"
              id="unfollowBtn"
              name="unfollowBtn"
              className="btn-follow"
              onClick={(e) => {
                unfollow(e, user)
              }}
            >
              {resource.button_unfollow}
            </button>
          )}
        </div>
        <div className="avatar-wrapper">
          <img className="avatar" src={user.imageURL || "https://avatars.githubusercontent.com/u/37324393?v=4"} alt="avatar" />
          <img className="profile-status" src={imageOnline} alt="status" />
        </div>
        <div className="profile-title">
          <h2>
            <Link to={`/profiles/${id}`}>{user.displayName}</Link>
            {user.followingAt && user.followedAt && <i className="material-icons highlight">group</i>}
          </h2>
          <p>{user.headline}</p>
        </div>
        <div className="profile-followers">
          <Link to={`/profiles/${id}/followers`}><i className="material-icons highlight">group</i> {user.followerCount | 0} followers</Link>
          <Link to={`/profiles/${id}/following`}><i className="material-icons highlight">group_add</i> {user.followingCount | 0} followings</Link>
        </div>
      </header>
      <div id="userBody">
        {count === 3 && <Overview user={user} resource={resource} />}
        {locationPath.endsWith("/followers") && <Followers />}
        {locationPath.endsWith("/following") && <Following />}
        {locationPath.endsWith("/review") && <Rating />}
      </div>
    </div>
  )
}
