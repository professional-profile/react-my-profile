import axios from "axios"
import { HttpRequest } from "axios-core"
import { options, storage } from "uione"
import { MyProfileClient, MyProfileService } from "./my-profile"

export * from "./my-profile"
// axios.defaults.withCredentials = true;

const httpRequest = new HttpRequest(axios, options)
export interface Config {
  my_profile_url: string
  my_settings_url: string
}
let service: MyProfileService | undefined

export function getMyProfileService(): MyProfileService {
  if (!service) {
    const c = storage.config()
    service = new MyProfileClient(httpRequest, c.my_profile_url, c.my_settings_url)
  }
  return service
}
