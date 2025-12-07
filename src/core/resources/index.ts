import { Resources, StringMap } from "uione"
import { en as adminEN } from "./admin/en"
import { vi as adminVI } from "./admin/vi"
import { en as articleEN } from "./article/en"
import { vi as articleVI } from "./article/vi"
import { en as authenticationEN } from "./authentication/en"
import { vi as authenticationVI } from "./authentication/vi"
import { en as commonEN } from "./en"
import { en as myprofileEN } from "./my-profile/en"
import { vi as myprofileVI } from "./my-profile/vi"
import { vi as commonVI } from "./vi"

const en: StringMap = {
  ...commonEN,
  ...authenticationEN,
  ...adminEN,
  ...articleEN,
  ...myprofileEN,
}
const vi: StringMap = {
  ...commonVI,
  ...authenticationVI,
  ...adminVI,
  ...articleVI,
  ...myprofileVI,
}

export const resources: Resources = {
  en: en,
  vi: vi,
}
