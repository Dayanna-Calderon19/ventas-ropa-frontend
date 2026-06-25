import { Outlet, Link } from 'react-router-dom'

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 py-12">
            <Link to="/" className="text-2xl font-bold tracking-tight text-neutral-900 mb-8">
                TIENDA
            </Link>
            <div className="w-full max-w-md bg-white rounded-lg border border-neutral-200 shadow-sm p-8">
                <Outlet />
            </div>
            <p className="mt-6 text-xs text-neutral-400">
                © {new Date().getFullYear()} Tienda. Todos los derechos reservados.
            </p>
        </div>
    )
}

export default AuthLayout