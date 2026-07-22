import { Outlet, Link } from 'react-router-dom'

const AuthLayout = () => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f5f0e8] via-white to-[#eef1f6] flex flex-col items-center justify-center px-4 py-12">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#b8933f]/20 blur-3xl animate-float motion-reduce:animate-none" />
                <div className="absolute top-1/3 -right-28 w-96 h-96 rounded-full bg-[#1b2a4a]/10 blur-3xl animate-floatSlow motion-reduce:animate-none" />
                <div className="absolute -bottom-28 left-1/4 w-72 h-72 rounded-full bg-[#b8933f]/15 blur-3xl animate-floatSlow motion-reduce:animate-none" />
            </div>

            <div className="relative z-10 flex flex-col items-center w-full">
                <Link to="/" className="mb-8">
                    <img src="/logo-principal.png" alt="MODA JELÚ" className="h-32 w-auto object-contain rounded-lg" />
                </Link>
                <div className="w-full max-w-md bg-white rounded-lg border border-neutral-200 shadow-sm p-8">
                    <Outlet />
                </div>
                <p className="mt-6 text-xs text-neutral-400">
                    © {new Date().getFullYear()} MODA JELÚ. Todos los derechos reservados.
                </p>
            </div>
        </div>
    )
}

export default AuthLayout