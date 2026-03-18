import { Routes, Route, Navigate } from "react-router-dom";
import Advertorial from "./pages/Advertorial";
import Home from "./pages/Home";
import { Quiz } from "./pages/Quiz";
import { QuizCheckoutPreview } from "./pages/QuizCheckoutPreview";
import { Checkout } from "./pages/Checkout";
import { CheckoutSuccess } from "./pages/CheckoutSuccess";
import { UpsellSuccess } from "./pages/UpsellSuccess";
import { UpsellSkip } from "./pages/UpsellSkip";
import { Login } from "./pages/Login";
import { AppAuthGuard } from "./components/AppAuthGuard";
import { AppLayout } from "./components/AppLayout";
import { Dashboard } from "./pages/app/Dashboard";
import { ExercisesPage } from "./pages/app/ExercisesPage";
import { ProgressPage } from "./pages/app/ProgressPage";
import { GlucosePage } from "./pages/app/GlucosePage";
import { RemindersPage } from "./pages/app/RemindersPage";
import { EmergencyPage } from "./pages/app/EmergencyPage";
import { DoctorPrepPage } from "./pages/app/DoctorPrepPage";
import { DrMarcusPage } from "./pages/app/DrMarcusPage";
import { NutritionPage } from "./pages/app/NutritionPage";
import { LearnPage } from "./pages/app/LearnPage";
import { WeeklyReportPage } from "./pages/app/WeeklyReportPage";
import { InsightsPage } from "./pages/app/InsightsPage";
import { PhotosPage } from "./pages/app/PhotosPage";
import { SofiaPage } from "./pages/app/SofiaPage";
import { ProfilePage } from "./pages/app/ProfilePage";
import { SettingsPage } from "./pages/app/SettingsPage";
import { AllToolsPage } from "./pages/app/AllToolsPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfUse } from "./pages/TermsOfUse";
import { RefundPolicy } from "./pages/RefundPolicy";
import { ContactPage } from "./pages/ContactPage";
import { AffiliatePortal } from "./pages/AffiliatePortal";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminAffiliates } from "./pages/admin/AdminAffiliates";
import { AdminSupport } from "./pages/admin/AdminSupport";
import { AdminSettings } from "./pages/admin/AdminSettings";

/**
 * Sales funnel flow:
 * 1. Advertorial (/ or /advertorial) → 2. Quiz (/quiz) → 3. Checkout Premium (/checkout-premium.html) →
 * 4. Payment (Cartpanda, from checkout CTA) → 5. Email sent (welcome + credentials) → 6. Platform access (/app)
 * Initial link: / or /advertorial
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/advertorial" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/advertorial" element={<Advertorial />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/quiz-checkout-preview" element={<QuizCheckoutPreview />} />
      <Route path="/login" element={<Login />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout-premium" element={<Navigate to="/checkout-premium.html" replace />} />
      <Route path="/preview-checkout" element={<Navigate to="/preview-checkout.html" replace />} />
      <Route path="/checkout/success" element={<CheckoutSuccess />} />
      <Route path="/checkout/upsell-success" element={<UpsellSuccess />} />
      <Route path="/checkout/upsell-skip" element={<UpsellSkip />} />
      <Route path="/app" element={<AppAuthGuard />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="exercises" element={<ExercisesPage />} />
          <Route path="dr-marcus" element={<DrMarcusPage />} />
          <Route path="nutrition" element={<NutritionPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="glucose" element={<GlucosePage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="emergency" element={<EmergencyPage />} />
          <Route path="doctor-prep" element={<DoctorPrepPage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="weekly-report" element={<WeeklyReportPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="photos" element={<PhotosPage />} />
          <Route path="sofia" element={<SofiaPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="tools" element={<AllToolsPage />} />
        </Route>
      </Route>
      <Route path="/reviews" element={<ReviewsPage />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfUse />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/affiliates" element={<AffiliatePortal />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="orders" replace />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="affiliates" element={<AdminAffiliates />} />
        <Route path="support" element={<AdminSupport />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
