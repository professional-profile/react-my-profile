import { useLayoutEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { hideLoading, showLoading } from "ui-loading"
import { handleError, useResource } from "uione"
import imageOnline from "../assets/images/online.svg"
import { Achievement, getUserService, Skill, User } from "./service"

const newUser = {} as any
export const UserView = () => {
  const resource = useResource()
  const [user, setUser] = useState<User>(newUser)
  const { id } = useParams()
  useLayoutEffect(() => {
    if (id) {
      showLoading()
      getUserService()
        .load(id)
        .then((tmpUser) => {
          if (tmpUser) {
            setUser(tmpUser)
          }
        })
        .catch(handleError)
        .finally(hideLoading)
    }
  }, [id])
  return (
    <div className="profile view-container">
      <form id="userForm" name="userForm">
        <header className="border-bottom-highlight">
          <div className="cover-image">
            <img src={user.coverURL} alt="cover" />
            <div className="contact-group">
              <button id="btnPhone" name="btnPhone" className="btn-phone" />
              <button id="btnEmail" name="btnEmail" className="btn-email" />
            </div>
            <button id="btnFollow" name="btnFollow" className="btn-follow">
              Follow
            </button>
          </div>
          <button id="btnCamera" name="btnCamera" className="btn-camera" />
          <div className="avatar-wrapper">
            <img className="avatar" src={user.imageURL || "https://avatars.githubusercontent.com/u/37324393?v=4"} alt="avatar" />
            <img className="profile-status" src={imageOnline} alt="status" />
          </div>
          <div className="profile-title">
            <h4>{user.displayName}</h4>
            <p>{user.headline}</p>
          </div>
          <div className="profile-followers">
            <p>
              <i className="material-icons highlight">group</i>
            </p>
            <p>
              <i className="material-icons highlight">group_add</i>
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
