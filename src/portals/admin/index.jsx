// frontend/src/portals/admin/index.jsx
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PortalShell from "@/components/portal/PortalShell.jsx";
import PortalRouteFallback from "@/components/portal/PortalRouteFallback.jsx";

import AdminDashboard from "./AdminDashboard.jsx";
const Users = lazy(() => import("./Users.jsx"));
const UserDetail = lazy(() => import("./UserDetail.jsx"));
const CreateUser = lazy(() => import("./CreateUser.jsx"));
const Projects = lazy(() => import("./Projects.jsx"));
const ProjectDetail = lazy(() => import("./ProjectDetail.jsx"));
const ProjectNew = lazy(() => import("./ProjectNew.jsx"));
const Approvals = lazy(() => import("./Approvals.jsx"));
const Billings = lazy(() => import("./Billings.jsx"));
const Discussions = lazy(() => import("./Discussions.jsx"));
const DirectIndex = lazy(() => import("./DirectIndex.jsx"));
const Direct = lazy(() => import("./Direct.jsx"));
const Requirements = lazy(() => import("./Requirements.jsx"));
const MyAccount = lazy(() => import("./MyAccount.jsx"));

export default function AdminPortal() {
  return (
    <PortalShell>
      <Suspense fallback={<PortalRouteFallback />}>
        <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="approvals" element={<Approvals />} />

        <Route path="users" element={<Users />} />
        <Route path="users/new" element={<CreateUser />} />
        <Route path="users/:userId" element={<UserDetail />} />

        <Route path="projects" element={<Projects />} />
        <Route path="projects/new" element={<ProjectNew />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />
        <Route path="projects/:projectId/requirements" element={<Requirements />} />

        <Route path="billing" element={<Billings />} />

        <Route path="discussions" element={<Discussions />} />
        <Route path="discussions/:projectId" element={<Discussions />} />

        <Route path="direct" element={<DirectIndex />} />
        <Route path="direct/:peerId" element={<Direct />} />
        <Route path="messages" element={<DirectIndex />} />
        <Route path="messages/:peerId" element={<Direct />} />

        <Route path="my-account" element={<MyAccount />} />
        <Route path="profile" element={<MyAccount />} />
        <Route path="settings" element={<MyAccount />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </PortalShell>
  );
}
