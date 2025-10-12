import { HttpRequest } from "axios-core"
import { Client } from "web-clients"
import { User, UserFilter, userModel, UserService } from "./user"

export * from "./user"

export class UserClient extends Client<User, string, UserFilter> implements UserService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, userModel)
    this.searchGet = true
  }
}
