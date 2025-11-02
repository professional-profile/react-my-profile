import axios from "axios"
import { HttpRequest } from "axios-core"
import { options } from "uione"
import { Client } from "web-clients"
import { MyProfileService, User, UserFilter, userModel, UserService, UserSettings } from "./user"

export * from "./user"

const httpRequest = new HttpRequest(axios, options)

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

  saveMySettings(id: string, settings: UserSettings): Promise<number> {
    return this.http.patch<number>(this.myProfileUrl + "/" + id + "/settings", settings).catch((err) => {
      const data = err && err.response ? err.response : err
      if (data && (data.status === 404 || data.status === 410)) {
        return 0
      }
      throw err
    })
  }
  saveMyProfile(user: User): Promise<number> {
    const url = this.myProfileUrl + "/" + user.userId
    return this.http.patch<number>(url, user).catch((err) => {
      const data = err && err.response ? err.response : err
      if (data && (data.status === 404 || data.status === 410)) {
        return 0
      }
      throw err
    })
  }
}
/*
export interface Config {
  my_profile_url: string
}
class ApplicationContext {
  service?: MyProfileService
  getConfig(): Config {
    return storage.config()
  }
  getMyProfileService(): MyProfileService {
    if (!this.service) {
      const c = this.getConfig()
      this.service = new MyProfileClient(httpRequest, c.my_profile_url)
    }
    return this.service
  }
}

export const context = new ApplicationContext()
export function useGetMyProfileService(): MyProfileService {
  const [service] = useState(() => {
    return context.getMyProfileService()
  })
  return service
}
*/
