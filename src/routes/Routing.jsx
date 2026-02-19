import React from 'react'
import { Routes, Route } from 'react-router-dom'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Companies from '../pages/Companies'
import Products from '../pages/Products'
import Jobs from '../pages/Jobs'
import JobsPage from '../SinglePage/JobsPage'
import JobSingle from '../DetailsPage/JobSingle'
import JobsByCategory from '../Category_Jobs_Page/JobsByCategory'
import JobsByCity from '../Category_Jobs_Page/JobsByCity'
import CompaniesSingle from '../DetailsPage/CompaniesSingle'
import NoPage from '../NoPage'
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'
import Account from '../pages/Account'
import RecruiterCheckin from '../recruiter/RecruiterCheckin'
import RecruiterDashboard from '../recruiter/RecruiterDashboard'
import CompanyDashboard from '../company/CompanyDashboard'
import AddRecruiter from '../Admin/AddRecruiter'
import RecruiterJobs from '../recruiter/RecruiterJobs';
import RecruiterApplication from '../recruiter/RecruiterApplication';
import AddJob from '../recruiter/AddJob';
import RecruiterCandidateProfile from '../pages/RecruiterCandidateProfile';
import Nprojects from '../pages/CompanyPage/Nprojects';
import ProjectDetails from '../pages/ProjectDetails';

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path='/companies' element={<Companies />} />
      <Route path='*' element={<NoPage />} />
      <Route path='/recruiter' element={<RecruiterCheckin />} />
      <Route path='/recruiter/dashboard' element={<RecruiterDashboard />} />
      <Route path='/company/dashboard' element={<CompanyDashboard />} />
      <Route path='/admin/add-recruiter' element={<AddRecruiter />} />
      <Route path='/jobs/category/:category' element={<JobsByCategory />} />
      <Route path="/jobs/:id" element={<JobSingle />} />
      <Route path='/jobs' element={<JobsPage />} />

      <Route path="/jobs/city/:cityName" element={<JobsByCity />} />
      <Route path="/jobs/:id" element={<JobSingle />} />

      <Route path="/companies/:id" element={<CompaniesSingle />} />
      <Route path="/projects" element={<Nprojects />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/account" element={<Account />} />

      <Route path='/recruiter/jobs' element={<RecruiterJobs />} />
      <Route path='/recruiter/applications' element={<RecruiterApplication />} />
      <Route path='/recruiter/add-job' element={<AddJob />} />

      <Route path="/recruiter/candidate/:id" element={<RecruiterCandidateProfile />} />
      <Route path="/companies/:companyId/projects/:projectId" element={<ProjectDetails />} />
    </Routes>
  )
}

export default Routing; 
