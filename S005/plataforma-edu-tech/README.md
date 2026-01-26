# Plataforma EduTech

Proyecto educativo con sitio web público y panel administrativo.

## Estructura del Proyecto

```
plataforma-edu-tech/
│
├── public/                 # Sitio web público (landing page)
│   ├── index.html          # Página principal del sitio
│   ├── css/
│   │   └── styles.css      # Estilos del sitio público
│   ├── js/
│   │   └── main.js         # Lógica JavaScript del sitio
│   ├── images/             # Imágenes del sitio (fotos, banners)
│   └── icons/              # Íconos y favicons
│
├── admin/                  # Panel administrativo interno
│   ├── index.html          # Página principal del admin
│   ├── css/
│   │   └── admin.css       # Estilos del panel admin
│   └── js/
│       └── admin.js        # Lógica del panel admin
│
├── src/                    # Código fuente reutilizable
│   ├── components/         # Componentes compartidos (futuro)
│   └── utils/              # Funciones utilitarias (futuro)
│
├── docs/                   # Documentación del proyecto
│   └── guia-usuario.md     # Guía de uso para usuarios
│
├── .gitignore              # Archivos ignorados por Git
└── README.md               # Este archivo
```

## Descripción de Directorios

### `/public`
Contiene todo el sitio web público visible para los visitantes. Aquí va la landing page y todos sus recursos asociados.

### `/admin`
Panel de administración interno. Separado del sitio público por seguridad y organización. Solo accesible para administradores.

### `/src`
Código fuente que puede ser compartido entre el sitio público y el admin. Preparado para crecimiento futuro con componentes y utilidades.

### `/docs`
Documentación del proyecto: guías de usuario, especificaciones técnicas y cualquier información relevante.

## Uso de Archivos Estáticos

| Tipo | Ubicación | Ejemplos |
|------|-----------|----------|
| Imágenes | `public/images/` | logos, fotos, banners |
| Íconos | `public/icons/` | favicon, íconos UI |
| Estilos CSS | `public/css/` o `admin/css/` | hojas de estilo |
| JavaScript | `public/js/` o `admin/js/` | scripts de funcionalidad |

## Control de Versiones

El proyecto usa Git desde el inicio. Para comenzar:

```bash
git init
git add .
git commit -m "Estructura inicial del proyecto"
```

## Crecimiento Futuro

La estructura permite agregar fácilmente:
- Nuevas páginas en `/public` o `/admin`
- APIs en una carpeta `/api`
- Tests en una carpeta `/tests`
- Configuraciones en `/config`
