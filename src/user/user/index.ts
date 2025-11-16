import { HttpRequest } from "axios-core"
import { Client } from "web-clients"
import { User, UserFilter, userModel, UserService } from "./user"

export * from "./user"

export class UserClient extends Client<User, string, UserFilter> implements UserService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, userModel)
    this.searchGet = true
  }
  follow(id: string): Promise<number> {
    const url = `${this.serviceUrl}/${id}`
    return this.http
      .patch<number>(url, {})
      .then((result) => {
        return result
      })
      .catch((err) => {
        if (err) {
          const data = err && err.response ? err.response : err
          if (data.status === 409) {
            return 0
          }
        }
        throw err
      })
  }
  unfollow(id: string): Promise<number> {
    const url = `${this.serviceUrl}/${id}`
    return this.http
      .delete<number>(url)
      .then((result) => {
        return result
      })
      .catch((err) => {
        if (err) {
          const data = err && err.response ? err.response : err
          if (data.status === 410) {
            return 0
          }
        }
        throw err
      })
  }
}
