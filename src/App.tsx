import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';

import { AdminLayout } from './components/layout/AdminLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';

import { NewsListPage } from './pages/news/NewsListPage';
import { NewsEditorPage } from './pages/news/NewsEditorPage';

import { OpinionListPage } from './pages/opinions/OpinionListPage';
import { OpinionEditorPage } from './pages/opinions/OpinionEditorPage';

import { UnitListPage } from './pages/units/UnitListPage';
import { UnitEditorPage } from './pages/units/UnitEditorPage';

import { ProgramListPage } from './pages/programs/ProgramListPage';
import { AgendaListPage } from './pages/agenda/AgendaListPage';
import { AchievementListPage } from './pages/achievements/AchievementListPage';
import { GalleryPage } from './pages/gallery/GalleryPage';
import { MediaLibraryPage } from './pages/media/MediaLibraryPage';
import { TestimonialListPage } from './pages/testimonials/TestimonialListPage';
import { PartnerListPage } from './pages/partners/PartnerListPage';
import { BrochureListPage } from './pages/brochures/BrochureListPage';
import { FAQListPage } from './pages/faqs/FAQListPage';

import { PPDBListPage } from './pages/ppdb/PPDBListPage';
import { InboxPage } from './pages/communication/InboxPage';
import { NewsletterPage } from './pages/communication/NewsletterPage';

import { SiteSettingsPage } from './pages/site/SiteSettingsPage';
import { HeroSlidesPage } from './pages/site/HeroSlidesPage';
import { SocialLinksPage } from './pages/site/SocialLinksPage';

import { AdminUsersPage } from './pages/system/AdminUsersPage';
import { AuditLogsPage } from './pages/system/AuditLogsPage';
import { SessionsPage } from './pages/system/SessionsPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />

              {/* Content Management */}
              <Route path="news" element={<NewsListPage />} />
              <Route path="news/create" element={<NewsEditorPage />} />
              <Route path="news/edit/:id" element={<NewsEditorPage />} />

              <Route path="opinions" element={<OpinionListPage />} />
              <Route path="opinions/create" element={<OpinionEditorPage />} />

              <Route path="units" element={<UnitListPage />} />
              <Route path="units/edit/:id" element={<UnitEditorPage />} />

              <Route path="programs" element={<ProgramListPage />} />
              <Route path="agendas" element={<AgendaListPage />} />
              <Route path="achievements" element={<AchievementListPage />} />
              <Route path="galleries" element={<GalleryPage />} />
              <Route path="media" element={<MediaLibraryPage />} />
              <Route path="testimonials" element={<TestimonialListPage />} />
              <Route path="partners" element={<PartnerListPage />} />
              <Route path="brochures" element={<BrochureListPage />} />
              <Route path="faqs" element={<FAQListPage />} />

              {/* PPDB & Communication */}
              <Route path="ppdb" element={<PPDBListPage />} />
              <Route path="inbox" element={<InboxPage />} />
              <Route path="newsletters" element={<NewsletterPage />} />

              {/* Website Configuration */}
              <Route path="site-settings" element={<SiteSettingsPage />} />
              <Route path="hero-slides" element={<HeroSlidesPage />} />
              <Route path="social-links" element={<SocialLinksPage />} />

              {/* System & Security */}
              <Route path="admin-users" element={<AdminUsersPage />} />
              <Route path="audit-logs" element={<AuditLogsPage />} />
              <Route path="sessions" element={<SessionsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
