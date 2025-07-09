import type { Route } from "./+types/home";
import { Link } from 'react-router'
import { isAuthenticated } from '../utils/auth'

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sistema de Gestión de Empresas" },
    { name: "description", content: "Plataforma para gestionar empresas de forma eficiente" },
  ];
}

export default function Home() {
  const userIsAuthenticated = isAuthenticated()

  return (
    <div className="container">
      <div className="row min-vh-100 align-items-center">
        <div className="col-lg-8 mx-auto text-center">
          <div className="mb-5">
            <i className="bi bi-building display-1 text-primary mb-3"></i>
            <h1 className="display-4 fw-bold mb-3">
              Sistema de Gestión de Empresas
            </h1>
            <p className="lead text-muted mb-4">
              Plataforma integral para administrar y gestionar empresas de manera eficiente y organizada
            </p>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-list-ul display-6 text-primary mb-3"></i>
                  <h5 className="card-title">Gestión de Empresas</h5>
                  <p className="card-text text-muted">
                    Administra todas tus empresas en un solo lugar
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-pencil-square display-6 text-success mb-3"></i>
                  <h5 className="card-title">Edición Rápida</h5>
                  <p className="card-text text-muted">
                    Actualiza información de empresas fácilmente
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-shield-check display-6 text-info mb-3"></i>
                  <h5 className="card-title">Acceso Seguro</h5>
                  <p className="card-text text-muted">
                    Sistema de autenticación robusto y seguro
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex gap-3 justify-content-center flex-wrap">
            {userIsAuthenticated ? (
              <Link to="/companies" className="btn btn-primary btn-lg">
                <i className="bi bi-building me-2"></i>
                Ver Empresas
              </Link>
            ) : (
              <>
                <Link to="/auth/login" className="btn btn-primary btn-lg">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Iniciar Sesión
                </Link>
                <Link to="/companies" className="btn btn-outline-secondary btn-lg">
                  <i className="bi bi-building me-2"></i>
                  Ver Empresas
                  <small className="d-block text-muted">(Requiere autenticación)</small>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
