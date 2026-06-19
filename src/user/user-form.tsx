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
      <div className="cover" style={{ backgroundImage: `url(${user.coverURL})` }}>
        <button type="button" id="cameraBtn" name="cameraBtn" className="btn-camera"></button>
      </div>
      <div id="headerTrigger" className="header-trigger"></div>
      <header className="profile-header">
        <div className="profile-header-inner">
          <div className="avatar-wrapper">
            <div className="avatar" style={{ backgroundImage: `url(${user.imageURL || "https://avatars.githubusercontent.com/u/37324393?v=4"})` }}></div>
            <img className="profile-status" src={imageOnline} alt="status" />
            <button type="button" id="cameraBtn" name="cameraBtn" className="btn-camera"></button>
          </div>
          <div className="profile-info">
            <h1>
              <span>{user.displayName}</span>
              <i className="material-icons highlight">group</i>
            </h1>
            <p>{user.headline}</p>
            <div className="profile-followers">
              <span><i className="material-icons highlight">group</i> {user.followerCount | 0} followers</span>
              <Link to={`/profiles/${id}/following`}><i className="material-icons highlight">group_add</i> {user.followingCount | 0} followings</Link>
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
        </div>
      </header>
      <nav className="tabs">
        <Link className="tab active" to={`/profiles/${id}`}>Overview</Link>
        <Link className="tab" to={`/profiles/${id}/followers`}>Followers</Link>
        <Link className="tab" to={`/profiles/${id}/following`}>Following</Link>
        <a href="#" className="tab">Articles</a>
        <a href="#" className="tab">Company</a>
      </nav>
      <div id="userBody" className="profile-content">
        {count === 3 && <Overview user={user} resource={resource} />}
        {locationPath.endsWith("/followers") && <Followers />}
        {locationPath.endsWith("/following") && <Following />}
        {locationPath.endsWith("/review") && <Rating />}
      </div>
    </div>
  )
}
