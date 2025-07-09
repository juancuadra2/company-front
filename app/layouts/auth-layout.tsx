import { Outlet } from 'react-router'

const AuthLayout = () => {
  return (
    <div className='min-vh-100 d-flex align-items-center justify-content-center bg-light'>
      <div className='container-fluid'>
        <div className='row justify-content-center'>
          <div className='col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4'>
            <div className='text-center mb-4'>
              <i className="bi bi-building display-4 text-primary mb-3"></i>
              <h2 className='text-primary'>Sistema de Gestión de Empresas</h2>
              <p className='text-muted'>Accede a tu cuenta para continuar</p>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
