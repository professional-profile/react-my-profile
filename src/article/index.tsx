import { Route, Routes } from "react-router"
import { ArticleForm } from "./article-form"
import { ArticlesForm } from "./articles-form"
import { Review } from "./review"

export default function ArticlesRoute() {
  return (
    <Routes>
      <Route path="" element={<ArticlesForm />} />
      <Route path="/:id" element={<ArticleForm />} />
      <Route path="/:id/review" element={<Review />} />
    </Routes>
  )
}
