import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarVendedor } from '../components/vendedor/SidebarVendedor.jsx'
import { NavbarVendedor } from '../components/vendedor/NavbarVendedor.jsx'
import { AlertasVendedorProvider } from '../context/AlertasVendedorContext.jsx'

const VendedorLayoutInner = () => {
    const [sidebarAbierto, setSidebarAbierto] = useState(false)

    return (
        <div className="flex h-screen bg-[#f4f4f5] overflow-hidden">
            <div className="hidden lg:flex flex-shrink-0">
                <SidebarVendedor />
            </div>

            {sidebarAbierto && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSidebarAbierto(false)}
                    />

                    <div className="relative z-10 flex">
                        <SidebarVendedor
                            cerrar={() => setSidebarAbierto(false)}
                        />
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <NavbarVendedor
                    onAbrirSidebar={() => setSidebarAbierto(true)}
                />

                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

const VendedorLayout = () => (
    <AlertasVendedorProvider>
        <VendedorLayoutInner />
    </AlertasVendedorProvider>
)

export default VendedorLayout