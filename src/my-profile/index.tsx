import { Route, Routes } from "react-router"
import { MyProfileForm } from "./my-profile-form"
import { MySettingsForm } from "./my-settings-form"

export default function MyProfileRoute() {
  return (
    <Routes>
      <Route path="" element={<MyProfileForm />} />
      <Route path="/settings" element={<MySettingsForm />} />
    </Routes>
  )
}
