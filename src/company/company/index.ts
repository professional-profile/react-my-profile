import { HttpRequest } from "axios-core"
import { Client } from "web-clients"
import { Company, CompanyFilter, companyModel, CompanyService } from "./company"

export * from "./company"

export class CompanyClient extends Client<Company, string, CompanyFilter> implements CompanyService {
  constructor(http: HttpRequest, private url: string) {
    super(http, url, companyModel)
    this.searchGet = false
    // this.getCompanies = this.getCompanies.bind(this);
  }
  // getCompanies(id: string): Promise<Company[]> {
  //   console.log(id)
  //   const url = this.url + "/" + id
  //   return this.http.get<Company[]>(url);
  // }
  postOnly(s: CompanyFilter): boolean {
    return true
  }
}
