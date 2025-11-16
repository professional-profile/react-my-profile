import { AuthenClient, AuthenService, OAuth2Client, OAuth2Service, User } from "authen-client"
import axios from "axios"
import { HttpRequest } from "axios-core"
import { PasswordClient, PasswordService } from "password-client"
import { Signup, SignupClient, SignupService } from "signup-client"
import { storage } from "uione"
// axios.defaults.withCredentials = true;

export interface Config {
  authentication_url: string
  signup_url: string
  password_url: string
  oauth2_url: string
  public_privilege_url: string
}
const httpRequest = new HttpRequest(axios)

let signupService: SignupService<Signup> | SignupService<Signup>
export function getSignupService(): SignupService<Signup> {
  if (!signupService) {
    const c = storage.config()
    signupService = new SignupClient<Signup>(httpRequest, c.signup_url + "/signup", c.signup_url)
  }
  return signupService
}

let authenticator: AuthenService<User> | undefined
export function getAuthenticator(): AuthenService<User> {
  if (!authenticator) {
    const c = storage.config()
    authenticator = new AuthenClient<User>(httpRequest, c.authentication_url + "/authenticate")
  }
  return authenticator
}
let oauth2Service: OAuth2Service | undefined
export function getOAuth2Service(): OAuth2Service {
  if (!oauth2Service) {
    const c = storage.config()
    oauth2Service = new OAuth2Client(httpRequest, c.oauth2_url + "/authenticate", c.oauth2_url + "/configurations")
  }
  return oauth2Service
}

let passwordService: PasswordService | undefined
export function getPasswordService(): PasswordService {
  if (!passwordService) {
    const c = storage.config()
    passwordService = new PasswordClient(httpRequest, c.password_url)
  }
  return passwordService
}
