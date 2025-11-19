import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Register() {
  const [role, setRole] = useState<'CANDIDATO' | 'EMPRESA'>('EMPRESA')
  const [nombre_completo, setNombreCompleto] = useState('')
  const [usuario, setUsuario] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena_hash, setContrasenaHash] = useState('')
  const [contrasena_confirmacion, setContrasenaConfirmacion] = useState('')
  const [loading, setLoading] = useState(false)
  const [candidatosCount, setCandidatosCount] = useState<number | null>(null)
  const [empresasCount, setEmpresasCount] = useState<number | null>(null)
  const navigate = useNavigate()

  const roleButtonClass = (r: 'CANDIDATO' | 'EMPRESA') =>
    `px-4 py-2 rounded-md focus:outline-none ${
      role === r ? 'bg-blue-700 text-white' : 'text-gray-700'
    }`

  const apiBase = (import.meta.env.VITE_API_URL as string)

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [cRes, eRes] = await Promise.all([
          fetch(`${apiBase}/usuarios/count/candidatos`),
          fetch(`${apiBase}/usuarios/count/empresas`),
        ])
        if (cRes.ok) {
          const cData = await cRes.json().catch(() => ({}))
          setCandidatosCount(Number(cData.count ?? 0))
        } else {
          setCandidatosCount(0)
        }
        if (eRes.ok) {
          const eData = await eRes.json().catch(() => ({}))
          setEmpresasCount(Number(eData.count ?? 0))
        } else {
          setEmpresasCount(0)
        }
      } catch (err) {
        console.error('Error fetching counts', err)
        setCandidatosCount(0)
        setEmpresasCount(0)
      }
    }
    fetchCounts()
  }, [apiBase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre_completo || !usuario || !correo || !contrasena_hash) {
      toast.error('Rellena todos los campos requeridos.')
      return
    }
    if (contrasena_hash !== contrasena_confirmacion) {
      toast.error('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_completo,
          usuario,
          correo,
          contrasena_hash,
          tipo: role,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        toast.success('Cuenta creada correctamente. Serás redirigido al login.')
        setTimeout(() => navigate('/login'), 1500)
      } else {
        toast.error(data?.message || 'Error al crear la cuenta.')
      }
    } catch (err) {
      toast.error('No se pudo conectar al servidor. Revisa que el backend esté corriendo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - form */}
      <div className="w-full md:w-1/2 bg-white p-8 md:px-30 md:py-20 flex flex-col justify-center relative">
        <Link to="/" className="absolute top-6 left-6 text-gray-600 hover:text-gray-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Home
        </Link>
        <header className="mb-6">
          <div className="text-blue-600 font-bold text-xl">HireHub</div>
        </header>

        <main className="max-w-xl w-full">
          <h1 className="text-2xl font-semibold mb-1">Create account.</h1>
          <p className="text-sm text-gray-500 mb-6">
            Already have account? <Link to="/login" className="text-blue-600">Log In</Link>
          </p>

          <div className="inline-flex bg-gray-100 rounded-md p-1 mb-6" role="tablist" aria-label="Account type">
            <button
              type="button"
              role="tab"
              aria-pressed={role === 'CANDIDATO'}
              className={roleButtonClass('CANDIDATO')}
              onClick={() => setRole('CANDIDATO')}
            >
              Candidate
            </button>
            <button
              type="button"
              role="tab"
              aria-pressed={role === 'EMPRESA'}
              className={roleButtonClass('EMPRESA')}
              onClick={() => setRole('EMPRESA')}
            >
              Employers
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="hidden" name="tipo" value={role} />

            <div className="flex gap-4">
              <input value={nombre_completo} onChange={(e) => setNombreCompleto(e.target.value)} className="flex-1 border border-gray-200 rounded-md px-3 py-2" placeholder="Full Name" />
              <input value={usuario} onChange={(e) => setUsuario(e.target.value)} className="flex-1 border border-gray-200 rounded-md px-3 py-2" placeholder="Username" />
            </div>

            <input value={correo} onChange={(e) => setCorreo(e.target.value)} className="w-full border border-gray-200 rounded-md px-3 py-2" placeholder="Email address" />

            <div className="flex gap-4">
              <input value={contrasena_hash} onChange={(e) => setContrasenaHash(e.target.value)} className="flex-1 border border-gray-200 rounded-md px-3 py-2" placeholder="Password" type="password" />
              <input value={contrasena_confirmacion} onChange={(e) => setContrasenaConfirmacion(e.target.value)} className="flex-1 border border-gray-200 rounded-md px-3 py-2" placeholder="Confirm Password" type="password" />
            </div>

            <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-medium">
              {loading ? 'Creating...' : 'Create Account →'}
            </button>

          </form>
        </main>
      </div>

      {/* Right - hero */}
      <aside className="hidden md:flex w-1/2 items-end justify-start bg-cover bg-center p-12" style={{ backgroundImage: "linear-gradient(to bottom, rgba(7,11,21,0.6), rgba(7,11,21,0.6)), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=')" }}>
        <div className="max-w-lg text-white">
          <h2 className="text-3xl font-semibold mb-6 leading-tight">Over {candidatosCount ?? '—'} candidates waiting for good employees.</h2>

          <div className="flex gap-4">
            <div className="bg-white/5 p-4 rounded-lg text-center min-w-[100px]">
              <div className="font-bold text-lg">10,000</div>
              <div className="text-sm text-white/80">Live Job</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center min-w-[100px]">
              <div className="font-bold text-lg">{empresasCount ?? '—'}</div>
              <div className="text-sm text-white/80">Companies</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center min-w-[100px]">
              <div className="font-bold text-lg">7,532</div>
              <div className="text-sm text-white/80">New Jobs</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}