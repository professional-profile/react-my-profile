import { Route, Routes } from "react-router"
import { UserView } from "./user-form"
import { UsersForm } from "./users-form"

export default function UsersRoute() {
  return (
    <Routes>
      <Route path="" element={<UsersForm />} />
      <Route path="/:id" element={<UserView />} />
    </Routes>
  )
}
