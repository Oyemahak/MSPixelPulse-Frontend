// src/portals/dev/index.jsx
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PortalShell from "@/components/portal/PortalShell.jsx";
import PortalRouteFallback from "@/components/portal/PortalRouteFallback.jsx";

import DevDashboard from "./DevDashboard.jsx";
const Projects = lazy(() => import("./Projects.jsx"));
const ProjectDetail = lazy(() => import("./ProjectDetail.jsx"));
const Team = lazy(() => import("./Team.jsx"));
const Discussions = lazy(() => import("./Discussions.jsx"));
const Direct = lazy(() => import("./Direct.jsx"));
const Requirements = lazy(() => import("./Requirements.jsx"));
const MyAccount = lazy(() => import("./MyAccount.jsx"));

export default function DevPortal() {
  return (
    <PortalShell>
      <Suspense fallback={<PortalRouteFallback />}>
        <Routes>
        {/* Dashboard */}
        <Route index element={<DevDashboard />} />
        <Route path="dashboard" element={<DevDashboard />} />

        {/* Projects */}
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />
        <Route path="projects/:projectId/requirements" element={<Requirements />} />

        {/* Project rooms */}
        <Route path="discussions" element={<Discussions />} />
        <Route path="discussions/:projectId" element={<Discussions />} />

        {/* Direct messages */}
        <Route path="direct" element={<Direct />} />
        <Route path="direct/:peerId" element={<Direct />} />
        <Route path="messages" element={<Direct />} />
        <Route path="messages/:peerId" element={<Direct />} />

        {/* Team & Account */}
        <Route path="team" element={<Team />} />
        <Route path="my-account" element={<MyAccount />} />
        <Route path="profile" element={<MyAccount />} />
        <Route path="settings" element={<MyAccount />} />
        <Route path="tasks" element={<Navigate to="projects" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
      </Suspense>
    </PortalShell>
  );
}
