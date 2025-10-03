import React from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import BlogVisitorsPage from '../../components/admin/BlogVisitorsPage'

const BlogVisitorsPageWrapper = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <BlogVisitorsPage />
      </div>
    </AdminLayout>
  )
}

export default BlogVisitorsPageWrapper
