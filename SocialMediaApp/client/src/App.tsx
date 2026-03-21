/**
 * ACS Social Awareness – React app entry.
 * Parts of this codebase were developed with AI assistance (Cursor). See CODE_ATTRIBUTION.md in the project root.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Layout from './Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import CampaignCreate from './pages/CampaignCreate';
import Businesses from './pages/Businesses';
import BusinessCreate from './pages/BusinessCreate';
import Feed from './pages/Feed';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import MyCampaigns from './pages/MyCampaigns';
import AboutUs from './pages/AboutUs';
import WhatWeDo from './pages/WhatWeDo';
import NewsMedia from './pages/NewsMedia';
import SupportUs from './pages/SupportUs';
import ContactUs from './pages/ContactUs';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="admin/register" element={<AdminRegister />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="my-campaigns" element={<MyCampaigns />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="campaigns/create" element={<CampaignCreate />} />
            <Route path="businesses" element={<Businesses />} />
            <Route path="businesses/create" element={<BusinessCreate />} />
            <Route path="feed" element={<Feed />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="what-we-do" element={<WhatWeDo />} />
            <Route path="news" element={<NewsMedia />} />
            <Route path="support" element={<SupportUs />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
