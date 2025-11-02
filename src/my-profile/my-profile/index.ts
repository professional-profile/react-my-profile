import { HttpRequest } from "axios-core"
import { Client } from "web-clients"
import { MyProfileService, User, UserFilter, userModel, UserService, UserSettings } from "./user"

export * from "./user"

export class UserClient extends Client<User, string, UserFilter> implements UserService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, userModel)
    this.searchGet = true
  }
  getUsersByRole(id: string): Promise<User[]> {
    const url = `${this.serviceUrl}?roleId=${id}`
    return this.http.get<User[]>(url)
  }
}
export class MyProfileClient implements MyProfileService {
  constructor(private http: HttpRequest, private myProfileUrl: string, private mySettingsUrl: string) {
    this.getMyProfile = this.getMyProfile.bind(this)
    this.getMySettings = this.getMySettings.bind(this)
  }
  getMyProfile(): Promise<User | null> {
    return this.http.get<User>(this.myProfileUrl).catch((err) => {
      const data = err && err.response ? err.response : err
      if (data && (data.status === 404 || data.status === 410)) {
        return null
      }
      throw err
    })
  }
  getMySettings(): Promise<UserSettings | null> {
    return this.http.get<UserSettings>(this.mySettingsUrl).catch((err) => {
      const data = err && err.response ? err.response : err
      if (data && (data.status === 404 || data.status === 410)) {
        return null
      }
      throw err
    })
  }

  saveMySettings(settings: UserSettings): Promise<number> {
    return this.http.patch<number>(this.mySettingsUrl, settings).catch((err) => {
      const data = err && err.response ? err.response : err
      if (data && (data.status === 404 || data.status === 410)) {
        return 0
      }
      throw err
    })
  }
  saveMyProfile(user: User): Promise<number> {
    const url = this.myProfileUrl
    return this.http.patch<number>(url, user).catch((err) => {
      const data = err && err.response ? err.response : err
      if (data && (data.status === 404 || data.status === 410)) {
        return 0
      }
      throw err
    })
  }
}
