import { Route, Routes } from "react-router"
import { UserView } from "./user-form"
import { UsersForm } from "./users-form"

export default function UsersRoute() {
  return (
    <Routes>
      <Route path="" element={<UsersForm />} />
      <Route path="/:id" element={<UserView />} />
      <Route path="/:id/followers" element={<UserView />} />
      <Route path="/:id/following" element={<UserView />} />
      <Route path="/:id/review" element={<UserView />} />
    </Routes>
  )
}
