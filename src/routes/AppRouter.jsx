import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { CargandoPagina } from '../components/ui/Spinner.jsx'
import { RutaPrivada } from './RutaPrivada.jsx'
import { RutaPublica } from './RutaPublica.jsx'
import PublicoLayout from '../layouts/PublicoLayout.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import ClienteLayout from '../layouts/ClienteLayout.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'
import VendedorLayout from '../layouts/VendedorLayout.jsx'

const HomePage = lazy(() => import('../pages/public/HomePage.jsx'))
const CatalogoPage = lazy(() => import('../pages/public/CatalogoPage.jsx'))
const ProductoDetallePage = lazy(() => import('../pages/public/ProductoDetallePage.jsx'))

const LoginPage = lazy(() => import('../pages/auth/LoginPage.jsx'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage.jsx'))

const CartPage = lazy(() => import('../pages/cliente/CartPage.jsx'))
const CheckoutPage = lazy(() => import('../pages/cliente/CheckoutPage.jsx'))
const MisPedidosPage = lazy(() => import('../pages/cliente/MisPedidosPage.jsx'))
const DetallePedidoPage = lazy(() => import('../pages/cliente/DetallePedidoPage.jsx'))
const PerfilPage = lazy(() => import('../pages/cliente/PerfilPage.jsx'))

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard.jsx'))
const ProductosPage = lazy(() => import('../pages/admin/ProductosPage.jsx'))
const CategoriasPage = lazy(() => import('../pages/admin/CategoriasPage.jsx'))
const InventarioPage = lazy(() => import('../pages/admin/InventarioPage.jsx'))
const VentasPage = lazy(() => import('../pages/admin/VentasPage.jsx'))
const PedidosPage = lazy(() => import('../pages/admin/PedidosPage.jsx'))
const PromocionesPage = lazy(() => import('../pages/admin/PromocionesPage.jsx'))
const ClientesPage = lazy(() => import('../pages/admin/ClientesPage.jsx'))
const UsuariosPage = lazy(() => import('../pages/admin/UsuariosPage.jsx'))
const ReportesPage = lazy(() => import('../pages/admin/ReportesPage.jsx'))
const ConfiguracionPage = lazy(() => import('../pages/admin/ConfiguracionPage.jsx'))

const VendedorDashboard = lazy(() => import('../pages/vendedor/VendedorDashboard.jsx'))
const NuevaVentaPage = lazy(() => import('../pages/vendedor/NuevaVentaPage.jsx'))
const HistorialVentasPage = lazy(() => import('../pages/vendedor/HistorialVentasPage.jsx'))
const DetalleVentaPage = lazy(() => import('../pages/vendedor/DetalleVentaPage.jsx'))
const InventarioVendedorPage = lazy(() => import('../pages/vendedor/InventarioVendedorPage.jsx'))
const ClientesVendedorPage = lazy(() => import('../pages/vendedor/ClientesVendedorPage.jsx'))


const AppRouter = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<CargandoPagina />}>
                <Routes>
                    <Route element={<PublicoLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="catalogo" element={<CatalogoPage />} />
                        <Route path="producto/:id" element={<ProductoDetallePage />} />
                    </Route>

                    <Route element={<AuthLayout />}>
                        <Route path="login" element={<RutaPublica><LoginPage /></RutaPublica>} />
                        <Route path="registro" element={<RutaPublica><RegisterPage /></RutaPublica>} />
                    </Route>

                    <Route
                        path="cliente"
                        element={
                            <RutaPrivada roles={['CLIENTE']}>
                                <ClienteLayout />
                            </RutaPrivada>
                        }
                    >
                        <Route path="carrito" element={<CartPage />} />
                        <Route path="checkout" element={<CheckoutPage />} />
                        <Route path="pedidos" element={<MisPedidosPage />} />
                        <Route path="pedidos/:id" element={<DetallePedidoPage />} />
                        <Route path="perfil" element={<PerfilPage />} />
                    </Route>

                    <Route
                        path="admin"
                        element={
                            <RutaPrivada roles={['ADMIN']}>
                                <AdminLayout />
                            </RutaPrivada>
                        }
                    >
                        <Route index element={<AdminDashboard />} />
                        <Route path="productos" element={<ProductosPage />} />
                        <Route path="categorias" element={<CategoriasPage />} />
                        <Route path="inventario" element={<InventarioPage />} />
                        <Route path="ventas" element={<VentasPage />} />
                        <Route path="pedidos" element={<PedidosPage />} />
                        <Route path="promociones" element={<PromocionesPage />} />
                        <Route path="clientes" element={<ClientesPage />} />
                        <Route path="usuarios" element={<UsuariosPage />} />
                        <Route path="reportes" element={<ReportesPage />} />
                        <Route path="configuracion" element={<ConfiguracionPage />} />
                    </Route>

                    <Route
                        path="vendedor"
                        element={
                            <RutaPrivada roles={['VENDEDOR']}>
                                <VendedorLayout />
                            </RutaPrivada>
                        }
                    >
                        <Route index element={<VendedorDashboard />} />
                        <Route path="nueva-venta" element={<NuevaVentaPage />} />
                        <Route path="historial" element={<HistorialVentasPage />} />
                        <Route path="ventas/:id" element={<DetalleVentaPage />} />
                        <Route path="inventario" element={<InventarioVendedorPage />} />
                        <Route path="clientes" element={<ClientesVendedorPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default AppRouter