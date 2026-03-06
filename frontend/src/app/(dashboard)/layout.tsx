// ===========================================
// Dashboard Layout
// ===========================================
// Layout for admin/manager dashboard pages.
// Includes sidebar navigation and top bar.

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard-layout">
            {/* <Sidebar /> */}
            <div className="dashboard-content">
                {/* <TopBar /> */}
                <main>{children}</main>
            </div>
        </div>
    );
}
