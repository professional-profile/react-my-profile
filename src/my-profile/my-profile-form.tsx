import React, { useEffect, useState } from "react"
import { clone, OnClick, useUpdate } from "react-hook-core"
import ReactModal from "react-modal"
import { alertError } from "ui-alert"
import { message, useResource } from "uione"
import imageOnline from "../assets/images/online.svg"
import GeneralInfo from "./general-info"
import { Achievement, Skill, User } from "./my-profile"
import { getMyProfileService } from "./service"

interface Edit {
  edit: {
    lookingFor: string
    interest: string
    highlight: boolean
    description: string
    subject: string
    skill: string
    hirable: boolean
  }
}
const data: Edit = {
  edit: {
    lookingFor: "",
    interest: "",
    highlight: false,
    description: "",
    subject: "",
    skill: "",
    hirable: false,
  },
}
export const MyProfileForm = () => {
  const service = getMyProfileService()
  const { state, setState, updateState } = useUpdate<Edit>(data, "edit")

  const resource = useResource()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false)
  const [isEditingInterest, setIsEditingInterest] = useState<boolean>(false)
  const [isEditingLookingFor, setIsEditingLookingFor] = useState<boolean>(false)
  const [isEditingSkill, setIsEditingSkill] = useState<boolean>(false)
  const [isEditingAchievement, setIsEditingAchievement] = useState<boolean>(false)
  const [bio, setBio] = useState<string>("")
  const [user, setUser] = useState<User>({} as any)
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [modalConfirmIsOpen, setModalConfirmIsOpen] = useState<boolean>(false)

  useEffect(() => {
    service.getMyProfile().then((usr) => {
      if (usr) {
        setUser(usr)
        setBio(usr.bio || "")
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const closeModal = () => {
    setModalIsOpen(false)
  }

  // private readonly skillService = applicationContext.useGetMyProfileService();
  // private readonly chipSkillSuggestionsService = new DefaultSuggestionService<any>(this.skillService, MAX_LOOK_UP, 'skill', 'skill');
  // /*
  //   initData() {
  //     zip(
  //         this.skillService.getAll1(),
  //     ).subscribe(([skills]) => {
  //       this.setState({skills}, () => {
  //         const promise = new Promise((resolve, reject) => {
  //           this.loadData();
  //           resolve('Success!');
  //         });
  //         promise.then(() => {
  //           const chipsSkill = this.state.skills.filter((skill) =>
  //               this.state.skillsList.includes(skill.skill));
  //           this.setState({chipsSkill});
  //         });
  //       });
  //     }, this.handleError);
  //   }
  //   onChangeSkillChips = chipsSkill => {
  //     // this.skillService.getAll1().subscribe(
  //     //     ( result: any ) => {
  //     //       this.setState({skills: result});
  //     //     });
  //     let { skillsList } = this.state;
  //     const { skills } = this.state;
  //     console.log('UUUU', skills);
  //     skillsList = [];
  //     chipsSkill.map((value, index) => {
  //       const x = skills.find((v) => v.skill === value.skill);
  //       skillsList.push(x.skill);
  //     });
  //     this.setState({ chipsSkill, skillsList });
  //   }

  // fetchSuggestions = (keyWords) => {
  //   return new Promise((resolve, reject) => {
  //     const { skillsList, preSkillSuggestions } = this.state;
  //       this.chipSkillSuggestionsService.getSuggestion(keyWords, preSkillSuggestions, skillsList).subscribe(result => {
  //         const skill = keyWords;
  //         this.setState({ preSkillSuggestions: result.previousSuggestion , skill});
  //         resolve(result.response);
  //       });
  //   });
  // }

  // onRemoveChips = (id:string) => {
  //   let { skillsList, chipsSkill } = this.state;
  //   skillsList = skillsList.filter(skill => skill !== id);
  //    chipsSkill = chipsSkill.filter(chip => chip.skill !== id);
  //   this.setState({ skillsList, chipsSkill });
  // }

  //   openSkillModal = () => {
  //     this.setState({ modalSkillIsOpen: true });
  //   }

  //   loadData() {
  //     const userId = storage.getUserId();
  //     applicationContext.useGetMyProfileService().getMyProfile(userId).subscribe((user: User) => {
  //       this.setState({ user, objectUser: ReflectionUtil.clone(user) });
  //     }, err => {
  //       UIUtil.alertError(ResourceManager.getString('error_load_user_profile'), ResourceManager.getString('error'));
  //     });
  //   }

  //   // loadData() {
  //   //   const userId = storage.getUserId();
  //   //   zip(
  //   //       this.skillService.getAll1(),
  //   //       applicationContext.useGetMyProfileService().getMyProfile(userId),
  //   //   ).subscribe(([skills, user]) => {
  //   //     this.setState({skills, user, objectUser: ReflectionUtil.clone(user)}, () => {
  //   //       const promise = new Promise((resolve, reject) => {
  //   //         this.loadData();
  //   //         resolve('Success!');
  //   //       });
  //   //       promise.then(() => {
  //   //         const chipsSkill = this.state.skills.filter((skill) =>
  //   //             this.state.skillsList.includes(skill.skill));
  //   //         this.setState({chipsSkill});
  //   //       });
  //   //     });
  //   //   }, this.handleError);
  //   // }

  //   showChangeStatus = () => {

  //   }

  const showPopup = (e: OnClick) => {
    e.preventDefault()
    setModalIsOpen(true)
  }

  const close = () => {
    if (isEditingBio) {
      setIsEditingBio(!isEditingBio)
    }
    if (isEditingInterest) {
      setIsEditingInterest(!isEditingInterest)
    }
    if (isEditingLookingFor) {
      setIsEditingLookingFor(!isEditingLookingFor)
    }
    if (isEditingSkill) {
      setState({ edit: { ...state.edit, skill: "" } })
      setIsEditingSkill(!isEditingSkill)
    }
    if (isEditingAchievement) {
      setState({ edit: { ...state.edit, subject: "", highlight: false, description: "" } })
      setIsEditingAchievement(!isEditingAchievement)
    }
    setIsEditing(!isEditing)
  }

  const addSkill = (e: OnClick) => {
    e.preventDefault()
    const { skill, hirable } = state.edit
    const skillsEditing = user.skills ? user.skills : []
    if (skill && skill.trim() !== "") {
      const item = { hirable, skill }
      if (skillsEditing.filter((skillEdit) => skillEdit.skill === skill).length === 0) {
        skillsEditing.push(item)
        user.skills = skillsEditing
        setState({ edit: { ...state.edit, skill: "" } })
        setUser({ ...user })
      } else {
        alertError(resource.error_duplicated_skill)
      }
    }
  }
  //   addSkill = (e) => {
  //     e.preventDefault();
  //     this.onRemoveChips(this.state.skillsList[0]);
  //     const { user, hirable } = this.state;
  //     const skill = this.state.skillsList.length !== 0 ? this.state.skillsList[0] : this.state.skill;
  //     const skillsEditing = user.skills ? user.skills : [];
  //     if (skill) {
  //       const item = {
  //         hirable: hirable,
  //         skill
  //       };
  //       if (!this.isExistInArray(e, skillsEditing, item, 'skill')) {
  //         skillsEditing.push(item);
  //         user.skills = skillsEditing;
  //         this.setState({ skill: '', user });
  //       } else {
  //         UIUtil.alertError(ResourceManager.getString('error_duplicated_skill'), ResourceManager.getString('error'));
  //       }
  //     }
  //   }
  const saveChanges = (event: OnClick) => {
    event.preventDefault()
    if (isEditing) {
      service.saveMyProfile(user).then((successs) => {
        if (successs) {
          message(resource.success_save_my_profile)
          close()
        } else {
          alertError(resource.fail_save_my_profile)
        }
      })
    }
  }

  const saveEmit = (rs: any) => {
    if (rs.status === "success" && rs.user) {
      setUser(rs.user)
      message(resource.success_save_my_profile)
    } else {
      alertError(resource.fail_save_my_profile)
    }
  }

  const toggleBio = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()

    if (user.bio !== bio) {
      setModalConfirmIsOpen(true)
    } else {
      setIsEditingBio(!isEditingBio)
      setIsEditing(!isEditing)
    }
  }

  const revertBioChages = () => {
    setUser({ ...user, bio })
    setIsEditingBio(!isEditingBio)
    setIsEditing(!isEditing)
    setModalConfirmIsOpen(false)
  }
  const editBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    const bioText = e.target.value
    setUser({ ...user, bio: bioText })
  }
  const toggleLookingFor = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    setIsEditingLookingFor(!isEditingLookingFor)
    setIsEditing(!isEditing)
  }
  const removeLookingFor = (e: React.MouseEvent<HTMLElement, MouseEvent>, lookingForContent: string) => {
    e.preventDefault()
    user.lookingFor = user.lookingFor.filter((item) => item !== lookingForContent)
    setUser({ ...user })
  }
  const addLookingFor = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    const lookingForUser = user.lookingFor ? user.lookingFor : []
    if (state.edit.lookingFor && state.edit.lookingFor.trim() !== "") {
      if (!inArray(lookingForUser, state.edit.lookingFor)) {
        lookingForUser.push(state.edit.lookingFor)
        user.lookingFor = lookingForUser
        setState({ edit: { ...state.edit, lookingFor: "" } })
        setUser({ ...user })
      } else {
        alertError(resource.error_duplicated_looking_for)
      }
    }
  }
  const toggleInterest = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    setIsEditingInterest(!isEditingInterest)
    setIsEditing(!isEditing)
  }
  const removeInterest = (e: React.MouseEvent<HTMLElement, MouseEvent>, subject: string) => {
    e.preventDefault()
    if (user.interests) {
      const interests = user.interests.filter((item: string) => item !== subject)
      user.interests = interests
      setUser({ ...user })
    }
  }
  const addInterest = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    const interests = user.interests ? user.interests : []
    if (state.edit.interest && state.edit.interest.trim() !== "") {
      if (!inArray(interests, state.edit.interest)) {
        interests.push(state.edit.interest)
        user.interests = interests
        setUser({ ...user })
        setState({ edit: { ...state.edit, interest: "" } })
      } else {
        alertError(resource.error_duplicated_interest)
      }
    }
  }
  const toggleSkill = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    setIsEditingSkill(!isEditingSkill)
    setIsEditing(!isEditing)
  }
  const removeSkill = (e: React.MouseEvent<HTMLElement, MouseEvent>, skillContent: string) => {
    e.preventDefault()
    user.skills = user.skills.filter((item) => item["skill"] !== skillContent)
    setUser({ ...user })
    setState({ edit: { ...state.edit, interest: "" } })
  }
  const toggleAchievement = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    setIsEditing(!isEditing)
    setIsEditingAchievement(!isEditingAchievement)
  }
  const removeAchievement = (e: React.MouseEvent<HTMLElement, MouseEvent>, subject: string) => {
    if (user.achievements) {
      const achievements = user.achievements.filter((item: Achievement) => item["subject"] !== subject)
      user.achievements = achievements
      setUser({ ...user })
    }
  }
  const addAchievement = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    const achievement: Achievement = { subject: state.edit.subject, description: state.edit.description, highlight: state.edit.highlight }
    const achievements = user.achievements ? clone(user.achievements) : []
    achievement.subject = state.edit.subject
    achievement.description = state.edit.description
    achievement.highlight = state.edit.highlight
    if (state.edit.subject && state.edit.subject.trim().length > 0 && !inAchievements(achievements, achievement)) {
      achievements.push(achievement)
      user.achievements = achievements
      setUser({ ...user })
      setState({ edit: { ...state.edit, description: "", subject: "" } })
    }
  }

  const closeModalConfirm = () => {
    setModalConfirmIsOpen(false)
  }
  const followers = "7 followers" // StringUtil.format(ResourceManager.getString('user_profile_followers'), user.followerCount || 0);
  const following = "10 following" // StringUtil.format(ResourceManager.getString('user_profile_following'), user.followingCount || 0);
  return (
    <div className="profile">
      <header className="profile-header border-bottom-highlight">
        <div className="cover-image">
          <img src={user.coverURL} alt="cover" />
        </div>
        <button type="button" id="cameraBtn" name="cameraBtn" className="btn-camera" />
        <div className="avatar-wrapper">
          <img className="avatar" src={user.imageURL || "https://avatars.githubusercontent.com/u/37324393?v=4"} alt="avatar" />
          <img className="profile-status" src={imageOnline} alt="status" />
        </div>
        <div className="profile-title">
          <h2><a href="">{user.displayName}</a></h2>
          <p>{user.headline}</p>
        </div>
        <div className="profile-followers">
          <a href="">
            <i className="material-icons highlight">group</i> {followers}
          </a>
          <a href="">
            <i className="material-icons highlight">group_add</i> {following}
          </a>
        </div>
      </header>
      <div id="profileBody">
        <form id="profileForm" name="profileForm">
          <div className="row list card-grid">
            <div className="col m12 l4">
              <div className="card">
                <header>
                  <i className="material-icons highlight">account_box</i>
                  {resource.user_profile_basic_info}
                  <button type="button" id="basicInfoBtn" name="basicInfoBtn" hidden={isEditing} className="btn-edit" onClick={showPopup} />
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
              {!isEditingSkill && (
                <div className="card">
                  <header>
                    <i className="material-icons highlight">local_mall</i>
                    {resource.skills}
                    <button type="button" id="skillBtn" name="skillBtn" hidden={isEditing} className="btn-edit" onClick={toggleSkill} />
                  </header>
                  <section className="chip-list">
                    {user.skills &&
                      user.skills.map((item: Skill, index: number) => {
                        return (
                          <div key={index} className="chip">
                            {item.skill}
                            {item.hirable === true && <i className="star" />}
                          </div>
                        )
                      })}
                  </section>
                  <hr />
                  <p className="description">
                    <i className="star" />
                    {resource.user_profile_hirable_skill}
                  </p>
                </div>
              )}
              {isEditingSkill && (
                <div className="card">
                  <header>
                    <i className="material-icons highlight">local_mall</i>
                    {resource.skills}
                    <button type="button" id="skillBtn" name="skillBtn" className="btn-close" onClick={toggleSkill} />
                  </header>
                  <section className="chip-list">
                    {user.skills &&
                      user.skills.map((item: Skill, index: number) => {
                        return (
                          <div key={index} className="chip">
                            {item.skill}
                            {item.hirable === true && <i className="star" />}
                            <span className="close" onClick={(e) => removeSkill(e, item.skill)} />
                          </div>
                        )
                      })}
                  </section>
                  <hr />
                  <p className="description">
                    <i className="star" />
                    {resource.user_profile_hirable_skill}
                  </p>
                  <hr />
                  <section className="item">
                    <div className="form-group">
                      <input
                        type="text"
                        name="skill"
                        className="form-control"
                        value={state.edit.skill}
                        onChange={updateState}
                        placeholder={resource.placeholder_user_profile_skill}
                        maxLength={50}
                        required={true}
                      />
                    </div>
                    <label className="checkbox-container">
                      <input type="checkbox" id="hirable" name="hirable" checked={state.edit.hirable} onChange={updateState} />
                      {resource.user_profile_hirable_skill}
                    </label>
                    <div className="btn-group">
                      <button type="button" id="addAchievementBtn" name="addAchievementBtn" className="btn-add" onClick={addSkill} />
                      {resource.button_add_achievement}
                    </div>
                  </section>
                  <footer>
                    <button type="submit" id="saveSkillBtn" name="saveSkillBtn" onClick={saveChanges}>
                      {resource.save}
                    </button>
                  </footer>
                </div>
              )}
              {!isEditingLookingFor && (
                <div className="card">
                  <header>
                    <i className="material-icons highlight">find_in_page</i>
                    {resource.user_profile_looking_for}
                    <button
                      type="button"
                      id="lookingForBtn"
                      name="lookingForBtn"
                      hidden={isEditing && !isEditingLookingFor}
                      className="btn-edit"
                      onClick={toggleLookingFor}
                    />
                  </header>
                  <section className="chip-list">
                    {user.lookingFor &&
                      user.lookingFor.map((item: string, index: number) => {
                        return (
                          <div key={index} className="chip" tabIndex={index}>
                            {item}
                          </div>
                        )
                      })}
                  </section>
                </div>
              )}
              {isEditingLookingFor && (
                <div className="card">
                  <header>
                    <i className="material-icons highlight">find_in_page</i>
                    {resource.user_profile_looking_for}
                    <button type="button" id="lookingForBtn" name="lookingForBtn" className="btn-close" onClick={toggleLookingFor} />
                  </header>
                  <section className="chip-list">
                    {user.lookingFor &&
                      user.lookingFor.map((item: string, index: number) => {
                        return (
                          <div key={index} className="chip" tabIndex={index}>
                            {item}
                            <span className="close" onClick={(e) => removeLookingFor(e, item)} />
                          </div>
                        )
                      })}
                    <label className="form-group inline-input">
                      <input
                        name="lookingFor"
                        className="form-control"
                        value={state.edit.lookingFor}
                        onChange={updateState}
                        placeholder={resource.placeholder_user_profile_looking_for}
                        maxLength={100}
                      />
                      <button type="button" id="addLookingForBtn" name="addLookingForBtn" className="btn-add" onClick={addLookingFor} />
                    </label>
                  </section>
                  <footer>
                    <button type="submit" id="saveLookingForBtn" name="saveLookingForBtn" onClick={saveChanges}>
                      {resource.save}
                    </button>
                  </footer>
                </div>
              )}
              <div className="card">
                <header>
                  <i className="material-icons highlight">chat</i>
                  {resource.user_profile_social}
                  <button type="button" id="socialBtn" name="socialBtn" hidden={isEditing} className="btn-edit" onClick={showPopup} />
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
                  <button
                    type="button"
                    id="bioBtn"
                    name="bioBtn"
                    hidden={isEditing && !isEditingBio}
                    className={!isEditingBio ? "btn-edit" : "btn-close"}
                    onClick={toggleBio}
                  />
                </header>
                {!isEditingBio && <p>{user.bio}</p>}
                {isEditingBio && <textarea name="bio" value={user.bio} onChange={editBio} />}
                {isEditingBio && (
                  <footer>
                    <button
                      type="submit"
                      id="saveBioBtn"
                      name="saveBioBtn"
                      onClick={(e) => {
                        saveChanges(e)
                        setBio(user.bio || "")
                      }}
                    >
                      {resource.save}
                    </button>
                  </footer>
                )}
              </div>
              <div className="card border-bottom-highlight">
                <header>
                  <i className="material-icons highlight">flash_on</i>
                  {resource.interests}
                  <button
                    type="button"
                    id="interestBtn"
                    name="interestBtn"
                    hidden={isEditing && !isEditingInterest}
                    className={!isEditingInterest ? "btn-edit" : "btn-close"}
                    onClick={toggleInterest}
                  />
                </header>
                {!isEditingInterest && (
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
                )}
                {isEditingInterest && (
                  <section className="chip-list">
                    {user.interests &&
                      user.interests.map((item: string, index: number) => {
                        return (
                          <div key={index} className="chip" tabIndex={index}>
                            {item}
                            <span className="close" onClick={(e) => removeInterest(e, item)} />
                          </div>
                        )
                      })}
                    <label className="col s12 inline-input">
                      <input
                        type="text"
                        name="interest"
                        onChange={updateState}
                        placeholder={resource.placeholder_user_profile_interest}
                        value={state.edit.interest}
                        maxLength={100}
                      />
                      <button type="button" id="addInterestBtn" name="addInterestBtn" className="btn-add" onClick={addInterest} />
                    </label>
                  </section>
                )}
                {isEditingInterest && (
                  <footer>
                    <button type="submit" id="saveInterestBtn" name="saveInterestBtn" onClick={saveChanges}>
                      {resource.save}
                    </button>
                  </footer>
                )}
              </div>

              <div className="card border-bottom-highlight">
                <header>
                  <i className="material-icons highlight">beenhere</i>
                  {resource.achievements}
                  <button
                    type="button"
                    id="achievementBtn"
                    name="achievementBtn"
                    hidden={isEditing && !isEditingAchievement}
                    className={!isEditingAchievement ? "btn-edit" : "btn-close"}
                    onClick={toggleAchievement}
                  />
                </header>
                {!isEditingAchievement &&
                  user.achievements &&
                  user.achievements.map((achievement: Achievement, index: number) => {
                    return (
                      <section key={index} className="item">
                        <h4>
                          {achievement.subject}
                          {achievement.highlight && <i className="star float-right" />}
                        </h4>
                        <p className="description">{achievement.description}</p>
                        <hr />
                      </section>
                    )
                  })}
                {isEditingAchievement &&
                  user.achievements &&
                  user.achievements.map((achievement: Achievement, index: number) => (
                    <section key={index} className="item">
                      <h4>
                        {achievement.subject}
                        {achievement.highlight && <i className="star" />}
                      </h4>
                      <p className="description">{achievement.description}</p>
                      <button type="button" className="btn-remove" onClick={(e) => removeAchievement(e, achievement.subject)} />
                      <hr />
                    </section>
                  ))}
                {isEditingAchievement && (
                  <section className="item">
                    <div className="form-group">
                      <input
                        type="text"
                        name="subject"
                        className="form-control"
                        value={state.edit.subject}
                        onChange={updateState}
                        placeholder={resource.placeholder_user_profile_achievement_subject}
                        maxLength={50}
                        required={true}
                      />
                      <input
                        type="text"
                        name="description"
                        className="form-control"
                        value={state.edit.description}
                        onChange={updateState}
                        placeholder={resource.placeholder_user_profile_achievement_description}
                        maxLength={100}
                        required={true}
                      />
                    </div>
                    <label className="checkbox-container">
                      <input type="checkbox" id="highlight" name="highlight" checked={state.edit.highlight} onChange={updateState} />
                      {resource.user_profile_highlight_achievement}
                    </label>
                    <div className="btn-group">
                      <button type="button" id="addAchievementBtn" name="addAchievementBtn" className="btn-add" onClick={addAchievement} />
                      {resource.button_add_achievement}
                    </div>
                  </section>
                )}
                {isEditingAchievement && (
                  <footer>
                    <button type="submit" id="saveAchievementBtn" name="saveAchievementBtn" onClick={saveChanges}>
                      {resource.save}
                    </button>
                  </footer>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        // portalClassName='modal-portal'
        className="modal-portal-content"
        bodyOpenClassName="modal-portal-open"
        overlayClassName="modal-portal-backdrop"
      >
        <GeneralInfo resource={resource} close={closeModal} saveEmit={saveEmit} user={user} />
      </ReactModal>
      <ReactModal
        isOpen={modalConfirmIsOpen}
        onRequestClose={closeModalConfirm}
        contentLabel="Modal"
        // portalClassName='modal-portal'
        className="modal-portal-content small-width-height"
        bodyOpenClassName="modal-portal-open"
        overlayClassName="modal-portal-backdrop"
      >
        <div className="view-container profile-info">
          <form model-name="data">
            <header>
              <h2>{resource.user_profile_general_info}</h2>
              <button type="button" id="closeBtn" name="closeBtn" className="btn-close" onClick={closeModalConfirm} />
            </header>
            <div>
              <section className="row">
                <div> Data will not be saved, are you sure to continue?</div>
              </section>
            </div>

            <footer>
              <button type="button" id="saveBtn" name="saveBtn" onClick={revertBioChages}>
                OK
              </button>
            </footer>
          </form>
        </div>
      </ReactModal>
    </div>
  )
}
export function inArray(arr: string[], item: string): boolean {
  if (!arr || arr.length === 0) {
    return false
  }
  const isExist = arr.filter((itemFilter) => itemFilter === item).length > 0
  return isExist
}

export function inAchievements(arr: Achievement[], item: Achievement): boolean {
  if (!arr || arr.length === 0) {
    return false
  }
  const isExist = arr.filter((itemFilter) => itemFilter.subject === item.subject).length > 0
  return isExist
}
