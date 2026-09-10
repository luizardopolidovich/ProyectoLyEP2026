import '../css/login.css'
// useRef y useEffect permiten llevar el foco al primer campo con error
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAutorizaciones from '../hooks/useAutorizaciones'
import AutorizacionesService from '../services/autorizacionesServices'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sector, setSector] = useState('')
  const [errores, setErrores] = useState({})
  const { setAdmin } = useAutorizaciones()
  const navigate = useNavigate()
  // Referencias a los campos, para poder mandarles el foco
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const sectorRef = useRef(null)
  // Corre después de mostrar los errores, así el lector de pantalla ya los encuentra
  useEffect(() => {
    if (errores.email) {
      emailRef.current.focus()
    } else if (errores.password) {
      passwordRef.current.focus()
    } else if (errores.sector) {
      sectorRef.current.focus()
    }
  }, [errores])
  const validar = () => {
    const nuevosErrores = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      nuevosErrores.email = 'El email es obligatorio'
    } else if (!emailRegex.test(email)) {
      nuevosErrores.email = 'Email inválido'
    }
    if (!password) {
      nuevosErrores.password = 'La contraseña es obligatoria'
    } else {
      if (password.length < 8) {
        nuevosErrores.password = 'Mínimo 8 caracteres'
      } else if (!/[A-Z]/.test(password)) {
        nuevosErrores.password = 'Debe tener una mayúscula'
      } else if (!/[0-9]/.test(password)) {
        nuevosErrores.password = 'Debe tener un número'
      }
    }
    if (!sector) {
      nuevosErrores.sector = 'Seleccione un sector'
    }
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }
  const manejarSubmit = (e) => {
    e.preventDefault()
    if (!validar()) return
    const usuario = AutorizacionesService.login(
      email,
      password,
      sector
    )
    if (!usuario) {
     alert('Verifique los datos')
      return
    }
    localStorage.setItem("role", usuario.sector)
    setAdmin({
      nombre: usuario.nombre,
      email: usuario.email,
      sector: usuario.sector
    })
    navigate('/')
  }
  return (
    <div className="login-container">
      <h1>Iniciar Sesión</h1>
      {/* noValidate deja validar al propio formulario, sin los globos del navegador */}
      <form onSubmit={manejarSubmit} noValidate>
        {/* htmlFor conecta cada etiqueta con el campo que tiene ese mismo id */}
        <label htmlFor="login-email">Email:</label>
        <input
          id="login-email"
          ref={emailRef}
          // Tipo, obligatoriedad y autocompletado: los usan el navegador y los lectores de pantalla
          type="email"
          autoComplete="email"
          required
          // aria-invalid marca el campo con error y aria-describedby lo une a su mensaje
          aria-invalid={Boolean(errores.email)}
          aria-describedby={errores.email ? 'login-email-error' : undefined}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* Sin estilo en línea: toma el rojo de login.css, que cumple el contraste mínimo */}
        <p id="login-email-error">
          {errores.email || ' '}
        </p>
        <label htmlFor="login-password">Contraseña:</label>
        <input
          id="login-password"
          ref={passwordRef}
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(errores.password)}
          aria-describedby={errores.password ? 'login-password-error' : undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p id="login-password-error">
          {errores.password || ' '}
        </p>
        <label htmlFor="login-sector">Sector:</label>
        <select
          id="login-sector"
          ref={sectorRef}
          required
          aria-invalid={Boolean(errores.sector)}
          aria-describedby={errores.sector ? 'login-sector-error' : undefined}
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        >
          <option value="">Seleccione un sector</option>
          <option value="Soporte">Soporte</option>
          <option value="Gerencia">Gerencia</option>
        </select>
        <p id="login-sector-error">
          {errores.sector || ' '}
        </p>
        <button type="submit">Ingresar</button>
      </form>
    </div>
  )
}
export default Login
