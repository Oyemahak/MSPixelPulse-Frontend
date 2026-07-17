// src/portals/client/index.jsx  (ClientPortal)
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PortalShell from "@/components/portal/PortalShell.jsx";
import PortalRouteFallback from "@/components/portal/PortalRouteFallback.jsx";

import ClientDashboard from "./ClientDashboard.jsx";
const Projects = lazy(() => import("./Projects.jsx"));
const ProjectDetail = lazy(() => import("./ProjectDetail.jsx"));
const Discussions = lazy(() => import("./Discussions.jsx"));
const Billings = lazy(() => import("./Billings.jsx"));
const Support = lazy(() => import("./Support.jsx"));
const MyAccount = lazy(() => import("./MyAccount.jsx"));

export default function ClientPortal() {
  return (
    <PortalShell>
      <Suspense fallback={<PortalRouteFallback />}>
        <Routes>
        <Route index element={<ClientDashboard />} />
        <Route path="dashboard" element={<ClientDashboard />} />

        <Route path="projects" element={<Projects />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />

        <Route path="discussions" element={<Discussions />} />
        <Route path="discussions/:projectId" element={<Discussions />} />
        <Route path="messages" element={<Discussions />} />
        <Route path="messages/:projectId" element={<Discussions />} />

        <Route path="billing" element={<Billings />} />
        <Route path="support" element={<Support />} />
        <Route path="my-account" element={<MyAccount />} />
        <Route path="profile" element={<MyAccount />} />
        <Route path="settings" element={<MyAccount />} />

        <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
      </Suspense>
    </PortalShell>
  );
}
