import { Attributes, Filter, SearchResult } from "onecore"

export interface Company {
  id: string
  slug: string
  name: string
  overview: string
  website?: string
  industry?: string
  size?: string
  logo?: string
  coverURL?: string
  status: string

  followerCount?: number
  followingAt?: Date
  followedAt?: Date
}
export interface CompanyFilter extends Filter {
  id?: string
  slug?: string
  name?: string
  status?: string
  userId?: string
}

export interface CompanyRepository {
  search(filter: CompanyFilter, limit: number, page?: number, fields?: string[]): Promise<SearchResult<Company>>
  load(slug: string): Promise<Company | null>
}
export interface CompanyService {
  search(filter: CompanyFilter, limit: number, page?: number, fields?: string[]): Promise<SearchResult<Company>>
  load(slug: string): Promise<Company | null>
}

export const companyModel: Attributes = {
  id: {
    length: 40,
    required: true,
    key: true,
  },
  slug: {
    length: 150,
  },
  name: {
    length: 255,
    q: true,
  },
  overview: {
    length: 3000,
  },
  website: {
    length: 255,
  },
  industry: {
    length: 100,
  },
  size: {
    length: 100,
  },
  logo: {
    length: 300,
  },
  coverURL: {
    column: "cover_url",
    length: 500,
  },
  status: {
    length: 1,
  },
}
