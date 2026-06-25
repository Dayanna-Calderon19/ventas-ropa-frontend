import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarAdmin } from '../components/admin/SidebarAdmin.jsx'
import { NavbarAdmin } from '../components/admin/NavbarAdmin.jsx'
import { AlertasProvider } from '../context/AlertasContext.jsx'

const AdminLayoutInner = () => {
    const [sidebarAbierto, setSidebarAbierto] = useState(false)

    return (
        <div className="flex h-screen bg-[#f4f4f5] overflow-hidden">
            <div className="hidden lg:flex flex-shrink-0">
                <SidebarAdmin />
            </div>

            {sidebarAbierto && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSidebarAbierto(false)}
                    />
                    <div className="relative z-10 flex">
                        <SidebarAdmin cerrar={() => setSidebarAbierto(false)} />
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <NavbarAdmin onAbrirSidebar={() => setSidebarAbierto(true)} />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

const AdminLayout = () => (
    <AlertasProvider>
        <AdminLayoutInner />
    </AlertasProvider>
)

export default AdminLayout