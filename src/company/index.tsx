import { Route, Routes } from "react-router"
import { CompaniesForm } from "./companies-form"
import { CompanyForm } from "./company-form"

export default function CompaniesRoute() {
  return (
    <Routes>
      <Route path="" element={<CompaniesForm />} />
      <Route path="/:slug" element={<CompanyForm />} />
    </Routes>
  )
}
