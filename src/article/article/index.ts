import { HttpRequest } from "axios-core"
import { SearchClient } from "web-clients"
import { Article, ArticleFilter, articleModel, ArticleService } from "./article"

export * from "./article"

export class ArticleClient extends SearchClient<Article, string, ArticleFilter> implements ArticleService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, articleModel)
  }

  postOnly(s: ArticleFilter): boolean {
    return true
  }
  save(id: string): Promise<number> {
    const url = `${this.serviceUrl}/${id}`
    return this.http
      .patch<number>(url, {})
      .then((res) => {
        return res
      })
      .catch((err) => {
        if (err) {
          const data = err && err.response ? err.response : err
          if (data.status === 409) {
            return 0
          } else if (data.status === 422) {
            return -1
          }
        }
        throw err
      })
  }
  remove(id: string): Promise<number> {
    const url = `${this.serviceUrl}/${id}`
    return this.http
      .delete<number>(url)
      .then((res) => {
        return res
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
