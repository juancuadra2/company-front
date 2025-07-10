# Company Management Frontend

Una aplicación web moderna desarrollada con React Router v7 para la gestión de empresas. Esta aplicación permite crear, listar, editar y eliminar empresas con una interfaz intuitiva y responsive.

## 🚀 Características

- **Gestión completa de empresas**: CRUD completo (Crear, Leer, Actualizar, Eliminar)
- **Autenticación**: Sistema de login con JWT
- **Interfaz adaptable**: Vista en tarjetas y tabla
- **Búsqueda en tiempo real**: Filtrado instantáneo de empresas
- **Paginación**: Manejo eficiente de grandes conjuntos de datos
- **Responsive**: Diseño adaptado para dispositivos móviles y escritorio
- **Estado global**: Gestión de estado con Redux Toolkit
- **Notificaciones**: Sistema de toasts para feedback del usuario

## 🛠️ Tecnologías Utilizadas

- **React Router v7**: Framework principal con SSR
- **TypeScript**: Tipado estático para mayor robustez
- **Redux Toolkit**: Gestión de estado global
- **Bootstrap 5**: Framework CSS para diseño responsive
- **Bootstrap Icons**: Conjunto de iconos
- **Vite**: Herramienta de build rápida
- **Docker**: Containerización para deployment

## 📋 Prerrequisitos

- Node.js 20+
- npm
- Backend API ejecutándose en `http://localhost:8080`

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd company-front
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Asegúrate de que el backend esté ejecutándose en `http://localhost:8080` o modifica la URL en `app/helpers/api.ts`.

## 🚀 Uso

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Producción

```bash
# Construir la aplicación
npm run build

# Iniciar servidor de producción
npm start
```

### Docker

```bash
# Construir imagen
docker build -t company-front .

# Ejecutar contenedor
docker run -p 3000:3000 company-front
```

## 📁 Estructura del Proyecto

```
app/
├── auth/                   # Módulo de autenticación
│   └── login-page.tsx     # Página de login
├── companies/             # Módulo de empresas
│   ├── components/        # Componentes específicos
│   ├── companies-list.tsx # Lista de empresas
│   ├── company-edit.tsx   # Edición de empresas
│   └── types.ts          # Tipos TypeScript
├── components/           # Componentes compartidos
├── helpers/             # Utilidades de API
├── hooks/              # Custom hooks
├── layouts/           # Layouts de la aplicación
├── routes/           # Rutas principales
├── store/           # Configuración de Redux
└── utils/          # Utilidades generales
```

## 🔐 Autenticación

La aplicación utiliza JWT para la autenticación:

- **Login por defecto**: 
  - Usuario: `admin`
  - Contraseña: `admin`
- Los tokens se almacenan en localStorage
- Las rutas están protegidas y redirigen al login si no hay autenticación

## 🏢 Gestión de Empresas

### Funcionalidades disponibles:

- **Listar empresas**: Vista paginada con búsqueda
- **Crear empresa**: Modal con formulario validado
- **Editar empresa**: Página dedicada para modificaciones
- **Eliminar empresa**: Confirmación antes de eliminar
- **Cambio de vista**: Alternar entre vista de tarjetas y tabla

### Campos de empresa:

- **Nombre**: Nombre de la empresa (requerido)
- **NIT**: Número de identificación tributaria (requerido)
- **Dirección**: Dirección física (opcional)
- **Teléfono**: Número de contacto (opcional)

## 🎨 Interfaz de Usuario

- **Bootstrap 5**: Framework CSS para un diseño moderno
- **Bootstrap Icons**: Iconografía consistente
- **Responsive Design**: Adaptable a cualquier dispositivo
- **Dark/Light**: Interfaz clara y profesional
- **Toasts**: Notificaciones no intrusivas para feedback

## 📊 Estado de la Aplicación

El estado global se gestiona con Redux Toolkit:

- **Companies**: Lista de empresas, paginación, búsqueda
- **Loading states**: Estados de carga para mejor UX
- **Error handling**: Manejo centralizado de errores

## 🔌 API Integration

La aplicación se conecta a un backend REST:

- **Base URL**: `http://localhost:8080`
- **Autenticación**: Bearer token en headers
- **Endpoints**:
  - `POST /auth/login` - Autenticación
  - `GET /companies` - Listar empresas
  - `POST /companies` - Crear empresa
  - `PUT /companies/:id` - Actualizar empresa
  - `DELETE /companies/:id` - Eliminar empresa

## 🧪 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm start           # Servidor de producción
npm run typecheck   # Verificación de tipos TypeScript
```

## 🚀 Deployment

### Con Docker

```bash
docker build -t company-front .
docker run -p 3000:3000 company-front
```

### Manual

```bash
npm run build
npm start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📝 Notas Técnicas

- **SSR**: Server-Side Rendering habilitado con React Router v7
- **Type Safety**: TypeScript en toda la aplicación
- **Performance**: Lazy loading y optimizaciones de Vite
- **SEO**: Meta tags y estructura semántica
- **Accessibility**: Componentes accesibles con Bootstrap

## 📄 Licencia

Este proyecto es una prueba técnica y está disponible bajo los términos que especifique la organización.

## 📞 Soporte

Para preguntas o problemas, contacta al equipo de desarrollo.

---

**Nota**: Asegúrate de tener el backend correspondiente ejecutándose antes de iniciar esta aplicación frontend.
