import { lazy, Suspense, useEffect, type ComponentType, type ReactNode } from 'react';
import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { Toaster } from '@project/components/ui/sonner';
import { TooltipProvider } from '@project/components/ui/tooltip';
import type { Capability } from '@project/shared/roles';
import { AppShell } from './components/shell/AppShell';
import { EmptyState } from './components/primitives/bits';
import { errorMessage } from './lib/errors';
import { useBootstrap } from './lib/queries';
import { useTheme } from './lib/theme';
import { useWorkspace, WorkspaceProvider } from './lib/workspace';

/**
 * HashRouter, not BrowserRouter: the app is served under a path the runtime
 * doesn't rewrite, so a refreshed path-based deep link would 404.
 *
 * Every page is lazy — an area whose code fails to load only breaks itself —
 * and the likeliest next pages are prefetched once the browser is idle.
 */

function page<K extends string>(loader: () => Promise<Record<K, ComponentType>>, name: K) {
  const load = () => loader().then(m => ({ default: m[name] }));
  return { Component: lazy(load), load };
}

const P = {
  home: page(() => import('./pages/HomePage'), 'HomePage'),
  inbox: page(() => import('./pages/InboxPage'), 'InboxPage'),
  tasks: page(() => import('./pages/TasksPage'), 'TasksPage'),
  messages: page(() => import('./pages/MessagesPage'), 'MessagesPage'),
  announcements: page(() => import('./pages/AnnouncementsPage'), 'AnnouncementsPage'),
  workOrders: page(() => import('./pages/WorkOrdersPage'), 'WorkOrdersPage'),
  workOrder: page(() => import('./pages/WorkOrderPage'), 'WorkOrderPage'),
  schedules: page(() => import('./pages/SchedulesPage'), 'SchedulesPage'),
  inspections: page(() => import('./pages/InspectionsPage'), 'InspectionsPage'),
  inspection: page(() => import('./pages/InspectionPage'), 'InspectionPage'),
  vendors: page(() => import('./pages/VendorsPage'), 'VendorsPage'),
  vendor: page(() => import('./pages/VendorPage'), 'VendorPage'),
  leasing: page(() => import('./pages/LeasingPage'), 'LeasingPage'),
  application: page(() => import('./pages/ApplicationPage'), 'ApplicationPage'),
  listing: page(() => import('./pages/ListingPage'), 'ListingPage'),
  leases: page(() => import('./pages/LeasesPage'), 'LeasesPage'),
  lease: page(() => import('./pages/LeasePage'), 'LeasePage'),
  residents: page(() => import('./pages/ResidentsPage'), 'ResidentsPage'),
  resident: page(() => import('./pages/ResidentPage'), 'ResidentPage'),
  properties: page(() => import('./pages/PropertiesPage'), 'PropertiesPage'),
  property: page(() => import('./pages/PropertyPage'), 'PropertyPage'),
  unit: page(() => import('./pages/UnitPage'), 'UnitPage'),
  owners: page(() => import('./pages/OwnersPage'), 'OwnersPage'),
  owner: page(() => import('./pages/OwnerPage'), 'OwnerPage'),
  accounting: page(() => import('./pages/AccountingPage'), 'AccountingPage'),
  reports: page(() => import('./pages/ReportsPage'), 'ReportsPage'),
  report: page(() => import('./pages/ReportPage'), 'ReportPage'),
  settings: page(() => import('./pages/SettingsPage'), 'SettingsPage'),
  view: page(() => import('./pages/ViewPage'), 'ViewPage'),
};

function usePrefetchPages() {
  useEffect(() => {
    const run = () => [P.workOrders, P.workOrder, P.leases, P.lease, P.properties, P.property, P.inbox, P.tasks, P.accounting].forEach(p => void p.load().catch(() => undefined));
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (idle) idle(run);
    else window.setTimeout(run, 1500);
  }, []);
}

function Page({ page: { Component }, need }: { page: { Component: ComponentType }; need?: Capability }) {
  const ws = useWorkspace();
  if (need && !ws.can(need)) {
    return <EmptyState className="flex-1" title="You don’t have access to this page" description={`Your role (${ws.me.role}) can’t open it. An admin can change your role in Settings → Team.`} />;
  }
  return (
    <Suspense fallback={<div className="min-h-0 flex-1" />}>
      <Component />
    </Suspense>
  );
}

/** The company logo from Settings, remembered from the last visit so it shows before the workspace loads. */
function BrandLogo() {
  return (
    <div className="mb-10 flex flex-col items-center gap-5">
      <img src="/mark.svg" alt="" className="h-24 w-24 rounded-[22px] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)] ring-1 ring-white/15" />
      <div>
        <div className="font-serif text-[28px] font-bold leading-tight tracking-tight text-[#F4EFE4] sm:text-[32px]">Property Management</div>
        <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A86A]">Homes · Residents · Owners</div>
      </div>
    </div>
  );
}

function BootScreen({ state, onRetry, message }: { state: 'loading' | 'error'; onRetry: () => void; message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-[#2C3E2D] bg-[radial-gradient(ellipse_at_top,rgba(201,168,106,0.18),transparent_60%)] px-6 py-10">
      <div className="flex w-full max-w-md flex-col items-center text-center animate-fade-up">
        <BrandLogo />
        {state === 'error' ? (
          <>
            <h1 className="text-[17px] font-semibold text-[#F4EFE4]">This app couldn’t load</h1>
            <p className="mt-2 text-[14px] leading-relaxed text-[#F4EFE4]/75">{message ?? 'The workspace didn’t respond. If you opened this in a new browser, make sure you’re signed in to your organization.'}</p>
            <button type="button" onClick={onRetry} className="mt-5 h-10 rounded-md bg-[#C9A86A] px-4 text-[14px] font-medium text-[#2C3E2D] hover:bg-[#d6b87c]">Try again</button>
          </>
        ) : (
          <>
            <h1 className="text-[15px] font-medium text-[#F4EFE4]/85">Loading your workspace…</h1>
            <div className="mt-5 h-1.5 w-56 overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-1/3 rounded-full bg-[#C9A86A]" style={{ animation: 'boot-slide 1.2s ease-in-out infinite' }} />
            </div>
            <style>{'@keyframes boot-slide{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}'}</style>
          </>
        )}
      </div>
    </div>
  );
}

function LegacyRedirect({ to }: { to: (params: Record<string, string | undefined>) => string }) {
  const params = useParams();
  return <Navigate to={to(params)} replace />;
}

function Boot() {
  const { data, isError, error, refetch } = useBootstrap();
  usePrefetchPages();

  if (isError) {
    const refusal = errorMessage(error, '');
    return <BootScreen state="error" message={/deactivated/i.test(refusal) ? refusal : undefined} onRetry={() => void refetch()} />;
  }
  if (!data) return <BootScreen state="loading" onRetry={() => void refetch()} />;

  return (
    <WorkspaceProvider data={data}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Page page={P.home} />} />
          <Route path="/inbox" element={<Page page={P.inbox} />} />
          <Route path="/tasks" element={<Page page={P.tasks} />} />
          <Route path="/messages" element={<Page page={P.messages} need="communications.send" />} />
          <Route path="/messages/:thread" element={<Page page={P.messages} need="communications.send" />} />
          <Route path="/announcements" element={<Page page={P.announcements} need="announcements.send" />} />

          <Route path="/work-orders" element={<Page page={P.workOrders} need="maintenance.create" />} />
          <Route path="/work-orders/schedules" element={<Page page={P.schedules} need="maintenance.manage" />} />
          <Route path="/work-orders/:number" element={<Page page={P.workOrder} need="maintenance.create" />} />
          <Route path="/inspections" element={<Page page={P.inspections} need="maintenance.manage" />} />
          <Route path="/inspections/:id" element={<Page page={P.inspection} need="maintenance.manage" />} />
          <Route path="/vendors" element={<Page page={P.vendors} need="vendors.manage" />} />
          <Route path="/vendors/:id" element={<Page page={P.vendor} need="vendors.manage" />} />

          <Route path="/leasing" element={<Navigate to="/leasing/applications" replace />} />
          <Route path="/leasing/:tab" element={<Page page={P.leasing} need="leasing.manage" />} />
          <Route path="/applications/:number" element={<Page page={P.application} need="leasing.manage" />} />
          <Route path="/listings/:id" element={<Page page={P.listing} need="leasing.manage" />} />
          <Route path="/leases" element={<Page page={P.leases} need="residents.manage" />} />
          <Route path="/leases/:id" element={<Page page={P.lease} need="residents.manage" />} />
          <Route path="/leases/:id/:tab" element={<Page page={P.lease} need="residents.manage" />} />
          <Route path="/residents" element={<Page page={P.residents} need="residents.manage" />} />
          <Route path="/residents/:id" element={<Page page={P.resident} need="residents.manage" />} />

          <Route path="/properties" element={<Page page={P.properties} />} />
          <Route path="/properties/:id" element={<Page page={P.property} />} />
          <Route path="/properties/:id/:tab" element={<Page page={P.property} />} />
          <Route path="/units/:id" element={<Page page={P.unit} />} />
          <Route path="/owners" element={<Page page={P.owners} need="owners.manage" />} />
          <Route path="/owners/:id" element={<Page page={P.owner} need="owners.manage" />} />

          <Route path="/accounting" element={<Navigate to="/accounting/receivables" replace />} />
          <Route path="/accounting/:tab" element={<Page page={P.accounting} need="accounting.view" />} />
          <Route path="/accounting/:tab/:id" element={<Page page={P.accounting} need="accounting.view" />} />
          <Route path="/reports" element={<Page page={P.reports} need="reports.view" />} />
          <Route path="/reports/:report" element={<Page page={P.report} need="reports.view" />} />

          <Route path="/views/:id" element={<Page page={P.view} />} />
          <Route path="/settings" element={<Navigate to={data.me.role === 'Admin' ? '/settings/general' : '/settings/profile'} replace />} />
          <Route path="/settings/:section" element={<Page page={P.settings} />} />
          <Route path="/work-order/:number" element={<LegacyRedirect to={p => `/work-orders/${p.number}`} />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </WorkspaceProvider>
  );
}

export default function App({ children }: { children?: ReactNode }) {
  const { resolved } = useTheme();
  return (
    <HashRouter>
      <TooltipProvider delayDuration={350} skipDelayDuration={200}>
        <Boot />
        {children}
        <Toaster position="bottom-right" theme={resolved} closeButton richColors={false} toastOptions={{ className: 'text-[14px]' }} />
      </TooltipProvider>
    </HashRouter>
  );
}
