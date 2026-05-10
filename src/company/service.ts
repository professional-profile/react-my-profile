import axios from "axios"
import { HttpRequest } from "axios-core"
import { options, storage } from "uione"
import { CompanyClient, CompanyService } from "./company"

export * from "./company"
// axios.defaults.withCredentials = true;

const httpRequest = new HttpRequest(axios, options)
export interface Config {
  company_url: string
}
let companyService: CompanyService | undefined

export function getCompanyService(): CompanyService {
  if (!companyService) {
    const c = storage.config()
    companyService = new CompanyClient(httpRequest, c.company_url)
  }
  return companyService
}
