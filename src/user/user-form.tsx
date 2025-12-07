import { useLayoutEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { hideLoading, showLoading } from "ui-loading"
import { toast } from "ui-toast"
import { user as getUser, handleError, useResource } from "uione"
import imageOnline from "../assets/images/online.svg"
import { Achievement, getUserService, Skill, User } from "./service"

export const UserView = () => {
  const resource = useResource()
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
    <div className="profile view-container">
      <form id="userForm" name="userForm">
        <header className="profile-header border-bottom-highlight">
          <div className="cover-image">
            <img src={user.coverURL} alt="cover" />
            <div className="contact-group">
              <button id="btnPhone" name="btnPhone" className="btn-phone" />
              <button id="btnEmail" name="btnEmail" className="btn-email" />
            </div>
            {account && account.id !== user.id && !user.followingAt && (
              <button
                type="button"
                id="btnFollow"
                name="btnFollow"
                className="btn-follow"
                onClick={(e) => {
                  follow(e, user)
                }}
              >
                Follow
              </button>
            )}
            {account && account.id !== user.id && user.followingAt && (
              <button
                type="button"
                id="btnUnfollow"
                name="btnUnfollow"
                className="btn-follow"
                onClick={(e) => {
                  unfollow(e, user)
                }}
              >
                Unfollow
              </button>
            )}
          </div>
          <button id="btnCamera" name="btnCamera" className="btn-camera" />
          <div className="avatar-wrapper">
            <img className="avatar" src={user.imageURL || "https://avatars.githubusercontent.com/u/37324393?v=4"} alt="avatar" />
            <img className="profile-status" src={imageOnline} alt="status" />
          </div>
          <div className="profile-title">
            <h4>
              {user.displayName}
              {user.followingAt && user.followedAt && <i className="material-icons highlight">group</i>}
            </h4>
            <p>{user.headline}</p>
          </div>
          <div className="profile-followers">
            <p>
              <i className="material-icons highlight">group</i> {user.followerCount | 0} followers
            </p>
            <p>
              <i className="material-icons highlight">group_add</i> {user.followingCount | 0} followings
            </p>
          </div>
        </header>
        <div className="row list card-grid">
          <div className="col m12 l4">
            <div className="card">
              <header>
                <i className="material-icons highlight">account_box</i>
                {resource.user_profile_basic_info}
              </header>
              {user.occupation && (
                <p className="icon-text">
                  <i className="material-icons">local_mall</i>
                  {user.occupation}
                </p>
              )}
              {user.company && (
                <p className="icon-text">
                  <i className="material-icons">location_city</i>
                  {user.company}
                </p>
              )}
              {user.location && (
                <p className="icon-text">
                  <i className="material-icons">location_on</i>
                  {user.location}
                </p>
              )}
              {user.website && (
                <p className="icon-text">
                  <i className="material-icons">bookmark</i>
                  {user.website}
                </p>
              )}
              {user.email && (
                <p className="icon-text">
                  <i className="material-icons">email</i>
                  {user.email}
                </p>
              )}
              {user.phone && (
                <p className="icon-text">
                  <i className="material-icons">phone</i>
                  {user.phone}
                </p>
              )}
            </div>
            <div className="card">
              <header>
                <i className="material-icons highlight">local_mall</i>
                {resource.skills}
              </header>
              <section className="chip-list">
                {user.skills &&
                  user.skills.map((item: Skill, index: number) => {
                    return (
                      <div key={index} className="chip">
                        {item.skill}
                        {item.hirable === true && <i className="star highlight" />}
                      </div>
                    )
                  })}
                <hr />
                <p className="icon-text">
                  <i className="star highlight" />
                  Hirable skill
                  {resource.user_profile_hirable_skill}
                </p>
              </section>
            </div>
          </div>
          <div className="col m12 l8">
            <div className="card border-bottom-highlight">
              <header>
                <i className="material-icons highlight">person</i>
                {resource.user_profile_bio}
              </header>
              <p>{user.bio}</p>
            </div>
            <div className="card border-bottom-highlight">
              <header>
                <i className="material-icons highlight">flash_on</i>
                {resource.interests}
              </header>
              <section className="chip-list">
                {user.interests &&
                  user.interests.map((item: string, index: number) => {
                    return (
                      <div key={index} className="chip" tabIndex={index}>
                        {item}
                      </div>
                    )
                  })}
              </section>
            </div>

            <div className="card border-bottom-highlight">
              <header>
                <i className="material-icons highlight">beenhere</i>
                {resource.achievements}
              </header>
              {user.achievements &&
                user.achievements.map((achievement: Achievement, index: number) => {
                  return (
                    <section key={index}>
                      <h3>
                        {achievement.subject}
                        {achievement.highlight && <i className="star highlight float-right" />}
                      </h3>
                      <p className="description">{achievement.description}</p>
                      <hr />
                    </section>
                  )
                })}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
