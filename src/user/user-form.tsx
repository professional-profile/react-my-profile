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
      <header className="profile-header border-bottom-highlight">
        <div className="cover-image">
          <img src={user.coverURL} alt="cover" />
          <div className="contact-group">
            <button type="button" id="btnPhone" name="btnPhone" className="btn-phone" />
            <button type="button" id="btnEmail" name="btnEmail" className="btn-email" />
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
              {resource.button_follow}
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
              {resource.button_unfollow}
            </button>
          )}
        </div>
        <div className="avatar-wrapper">
          <img className="avatar" src={user.imageURL || "https://avatars.githubusercontent.com/u/37324393?v=4"} alt="avatar" />
          <img className="profile-status" src={imageOnline} alt="status" />
        </div>
        <div className="profile-title">
          <h3>
            {user.displayName}
            {user.followingAt && user.followedAt && <i className="material-icons highlight">group</i>}
          </h3>
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
      <form id="userForm" name="userForm">
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
              {user.website && (
                <p className="icon-text">
                  <i className="material-icons">bookmark</i>
                  <a href={user.website} title="website" target="_blank" rel="noreferrer">
                    {user.website}
                  </a>
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
              </section>
              <hr />
              <p className="description">
                <i className="star highlight" />
                {resource.user_profile_hirable_skill}
              </p>
            </div>
            <div className="card">
              <header>
                <i className="material-icons highlight">chat</i>Social
              </header>
              <p className="icon-text">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 15.3 15.4"
                  role="img"
                  aria-labelledby="aeaiy4p0y15j8vy4fq2tp21o9gluhm1g"
                  className="octicon"
                  width="18"
                  height="18"
                >
                  <title id="aeaiy4p0y15j8vy4fq2tp21o9gluhm1g">Facebook</title>
                  <path
                    d="M14.5 0H.8a.88.88 0 0 0-.8.9v13.6a.88.88 0 0 0 .8.9h7.3v-6h-2V7.1h2V5.4a2.87 2.87 0 0 1 2.5-3.1h.5a10.87 10.87 0 0 1 1.8.1v2.1h-1.3c-1 0-1.1.5-1.1 1.1v1.5h2.3l-.3 2.3h-2v5.9h3.9a.88.88 0 0 0 .9-.8V.8a.86.86 0 0 0-.8-.8z"
                    fill="currentColor"
                  ></path>
                </svg>
                <a href="https://facebook.com/minhduc1405" title="facebook" target="_blank" rel="noreferrer">
                  minhduc1405
                </a>
              </p>
              <p className="icon-text">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  role="img"
                  aria-labelledby="acebck4n0ndpuwfypjm9vui6fy7auzbz"
                  className="octicon"
                >
                  <title id="acebck4n0ndpuwfypjm9vui6fy7auzbz">LinkedIn</title>
                  <g clipPath="url(#clip0_202_91845)">
                    <path
                      d="M14.5455 0H1.45455C0.650909 0 0 0.650909 0 1.45455V14.5455C0 15.3491 0.650909 16 1.45455 16H14.5455C15.3491 16 16 15.3491 16 14.5455V1.45455C16 0.650909 15.3491 0 14.5455 0ZM5.05746 13.0909H2.912V6.18764H5.05746V13.0909ZM3.96291 5.20073C3.27127 5.20073 2.712 4.64 2.712 3.94982C2.712 3.25964 3.272 2.69964 3.96291 2.69964C4.65236 2.69964 5.21309 3.26036 5.21309 3.94982C5.21309 4.64 4.65236 5.20073 3.96291 5.20073ZM13.0938 13.0909H10.9498V9.73382C10.9498 8.93309 10.9353 7.90327 9.83491 7.90327C8.71855 7.90327 8.54691 8.77527 8.54691 9.67564V13.0909H6.40291V6.18764H8.46109V7.13091H8.49018C8.77673 6.58836 9.47636 6.016 10.52 6.016C12.6924 6.016 13.0938 7.44582 13.0938 9.30473V13.0909V13.0909Z"
                      fill="currentColor"
                    ></path>
                  </g>
                </svg>
                <a href="https://www.linkedin.com/in/duc-nguyen-437240239/" title="Linked in" target="_blank" rel="noreferrer">
                  duc-nguyen-437240239
                </a>
              </p>
              <p className="icon-text">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 16"
                  width="16"
                  height="16"
                  role="img"
                  aria-labelledby="ao03sn9p5pr8jedn0s5ax9eggkuvp7cn"
                  className="octicon"
                >
                  <title id="ao03sn9p5pr8jedn0s5ax9eggkuvp7cn">X</title>
                  <path
                    fill="currentColor"
                    d="M9.332 6.925 14.544 1h-1.235L8.783 6.145 5.17 1H1l5.466 7.78L1 14.993h1.235l4.78-5.433 3.816 5.433H15L9.332 6.925ZM7.64 8.848l-.554-.775L2.68 1.91h1.897l3.556 4.975.554.775 4.622 6.466h-1.897L7.64 8.848Z"
                  ></path>
                </svg>
                <a href="https://x.com/minhduc1405" title="X" target="_blank" rel="noreferrer">
                  minhduc1405
                </a>
              </p>
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
                    <section key={index} className="item">
                      <h4>
                        {achievement.subject}
                        {achievement.highlight && <i className="star highlight float-right" />}
                      </h4>
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
