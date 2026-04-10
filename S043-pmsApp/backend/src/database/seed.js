/**
 * Script para poblar la base de datos con datos de ejemplo
 * Ejecutar: node src/database/seed.js
 */

require('dotenv').config()
const bcrypt = require('bcrypt')
const { initDB } = require('./db')

async function seed() {
    console.log('🌱 Iniciando seed de la base de datos...\n')

    const db = await initDB()

    // Limpiar tablas existentes
    console.log('🗑️  Limpiando tablas...')
    await db.run('DELETE FROM comments')
    await db.run('DELETE FROM logs')
    await db.run('DELETE FROM tasks')
    await db.run('DELETE FROM project_members')
    await db.run('DELETE FROM projects')
    await db.run('DELETE FROM users')

    // ==================== USUARIOS ====================
    console.log('👥 Creando usuarios...')

    const hashedPassword = await bcrypt.hash('password123', 10)

    const users = [
        { name: 'Miguel Carrillo', email: 'miguel@devteam.com', role: 'admin' },
        { name: 'Carlos Mendoza', email: 'carlos@devteam.com', role: 'admin' },
        { name: 'Ana García', email: 'ana@devteam.com', role: 'user' },
        { name: 'Laura Rodríguez', email: 'laura@devteam.com', role: 'user' },
        { name: 'Pedro Sánchez', email: 'pedro@devteam.com', role: 'user' },
        { name: 'María López', email: 'maria@devteam.com', role: 'user' },
        { name: 'Juan Martínez', email: 'juan@devteam.com', role: 'user' },
        { name: 'Sofia Castro', email: 'sofia@devteam.com', role: 'admin' }
    ]

    for (const user of users) {
        await db.run(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [user.name, user.email, hashedPassword, user.role]
        )
    }
    console.log(`   ✓ ${users.length} usuarios creados`)

    // ==================== PROYECTOS ====================
    console.log('📁 Creando proyectos...')

    const projects = [
        {
            name: 'E-Commerce API',
            description: 'Backend RESTful para plataforma de comercio electrónico con autenticación JWT, carrito de compras, pagos con Stripe y gestión de inventario.',
            status: 'in_progress',
            owner_id: 1
        },
        {
            name: 'Mobile Banking App',
            description: 'Aplicación móvil React Native para banca digital. Incluye transferencias, pagos de servicios, consulta de saldos y notificaciones push.',
            status: 'in_progress',
            owner_id: 8
        },
        {
            name: 'Dashboard Analytics',
            description: 'Panel de administración con visualización de datos en tiempo real usando Chart.js y WebSockets. Métricas de ventas, usuarios y rendimiento.',
            status: 'planning',
            owner_id: 1
        },
        {
            name: 'Sistema de Tickets',
            description: 'Plataforma de soporte técnico con sistema de tickets, chat en vivo, base de conocimientos y reportes de SLA.',
            status: 'completed',
            owner_id: 2
        },
        {
            name: 'API Gateway Microservicios',
            description: 'Gateway central para arquitectura de microservicios con rate limiting, autenticación centralizada y load balancing.',
            status: 'in_progress',
            owner_id: 8
        }
    ]

    for (const project of projects) {
        await db.run(
            'INSERT INTO projects (name, description, status, owner_id) VALUES (?, ?, ?, ?)',
            [project.name, project.description, project.status, project.owner_id]
        )
    }
    console.log(`   ✓ ${projects.length} proyectos creados`)

    // ==================== MIEMBROS DE PROYECTO ====================
    console.log('👥 Asignando miembros a proyectos...')

    const projectMembers = [
        // E-Commerce API (proyecto 1)
        { project_id: 1, user_id: 2, role: 'member' },
        { project_id: 1, user_id: 3, role: 'member' },
        { project_id: 1, user_id: 4, role: 'member' },
        // Mobile Banking App (proyecto 2)
        { project_id: 2, user_id: 3, role: 'member' },
        { project_id: 2, user_id: 5, role: 'member' },
        { project_id: 2, user_id: 6, role: 'member' },
        // Dashboard Analytics (proyecto 3)
        { project_id: 3, user_id: 2, role: 'member' },
        { project_id: 3, user_id: 7, role: 'member' },
        // Sistema de Tickets (proyecto 4)
        { project_id: 4, user_id: 1, role: 'member' },
        { project_id: 4, user_id: 4, role: 'member' },
        { project_id: 4, user_id: 6, role: 'member' },
        // API Gateway (proyecto 5)
        { project_id: 5, user_id: 1, role: 'member' },
        { project_id: 5, user_id: 3, role: 'member' },
        { project_id: 5, user_id: 7, role: 'member' }
    ]

    for (const member of projectMembers) {
        await db.run(
            'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
            [member.project_id, member.user_id, member.role]
        )
    }
    console.log(`   ✓ ${projectMembers.length} miembros asignados`)

    // ==================== TASKS ====================
    console.log('📋 Creando tasks...')

    const tasks = [
        // E-Commerce API (proyecto 1)
        {
            title: 'Implementar autenticación JWT',
            description: 'Crear endpoints de login, registro y refresh token. Incluir middleware de verificación.',
            status: 'done',
            priority: 'high',
            project_id: 1,
            user_id: 2,
            due_date: '2026-04-01'
        },
        {
            title: 'CRUD de productos',
            description: 'Endpoints para crear, leer, actualizar y eliminar productos. Incluir validaciones y paginación.',
            status: 'done',
            priority: 'high',
            project_id: 1,
            user_id: 3,
            due_date: '2026-04-05'
        },
        {
            title: 'Carrito de compras',
            description: 'Implementar lógica de carrito: agregar items, actualizar cantidades, calcular totales.',
            status: 'in_progress',
            priority: 'high',
            project_id: 1,
            user_id: 2,
            due_date: '2026-04-15'
        },
        {
            title: 'Integración con Stripe',
            description: 'Configurar Stripe SDK, crear intents de pago, manejar webhooks de confirmación.',
            status: 'todo',
            priority: 'high',
            project_id: 1,
            user_id: 4,
            due_date: '2026-04-20'
        },
        {
            title: 'Sistema de inventario',
            description: 'Control de stock, alertas de bajo inventario, historial de movimientos.',
            status: 'pending',
            priority: 'medium',
            project_id: 1,
            user_id: 3,
            due_date: '2026-04-25'
        },
        {
            title: 'Documentación API con Swagger',
            description: 'Documentar todos los endpoints con ejemplos de request/response.',
            status: 'todo',
            priority: 'low',
            project_id: 1,
            user_id: 2,
            due_date: '2026-04-30'
        },

        // Mobile Banking App (proyecto 2)
        {
            title: 'Setup proyecto React Native',
            description: 'Configurar proyecto con TypeScript, ESLint, Prettier y estructura de carpetas.',
            status: 'done',
            priority: 'high',
            project_id: 2,
            user_id: 5,
            due_date: '2026-03-20'
        },
        {
            title: 'Pantalla de login con biometría',
            description: 'Implementar login con Face ID / Touch ID usando react-native-biometrics.',
            status: 'done',
            priority: 'high',
            project_id: 2,
            user_id: 5,
            due_date: '2026-03-25'
        },
        {
            title: 'Dashboard de cuentas',
            description: 'Mostrar saldos de cuentas, últimos movimientos y gráfico de gastos del mes.',
            status: 'in_progress',
            priority: 'high',
            project_id: 2,
            user_id: 6,
            due_date: '2026-04-10'
        },
        {
            title: 'Módulo de transferencias',
            description: 'Transferencias entre cuentas propias y a terceros. Validar límites y horarios.',
            status: 'in_progress',
            priority: 'high',
            project_id: 2,
            user_id: 3,
            due_date: '2026-04-12'
        },
        {
            title: 'Notificaciones push',
            description: 'Integrar Firebase Cloud Messaging para alertas de transacciones.',
            status: 'todo',
            priority: 'medium',
            project_id: 2,
            user_id: 5,
            due_date: '2026-04-18'
        },
        {
            title: 'Testing E2E con Detox',
            description: 'Escribir tests end-to-end para flujos críticos: login, transferencias, pagos.',
            status: 'pending',
            priority: 'medium',
            project_id: 2,
            user_id: 6,
            due_date: '2026-04-25'
        },

        // Dashboard Analytics (proyecto 3)
        {
            title: 'Definir arquitectura frontend',
            description: 'Decidir stack: Next.js vs Vite, estado global, librerías de gráficos.',
            status: 'done',
            priority: 'high',
            project_id: 3,
            user_id: 2,
            due_date: '2026-04-05'
        },
        {
            title: 'Diseño de mockups en Figma',
            description: 'Crear wireframes y diseño visual del dashboard con componentes reutilizables.',
            status: 'in_progress',
            priority: 'high',
            project_id: 3,
            user_id: 7,
            due_date: '2026-04-15'
        },
        {
            title: 'Conexión WebSocket tiempo real',
            description: 'Implementar Socket.io para actualización de métricas en tiempo real.',
            status: 'pending',
            priority: 'medium',
            project_id: 3,
            user_id: 2,
            due_date: '2026-04-22'
        },
        {
            title: 'Gráficos con Chart.js',
            description: 'Componentes de gráficos: líneas, barras, pie charts para métricas de negocio.',
            status: 'pending',
            priority: 'medium',
            project_id: 3,
            user_id: 7,
            due_date: '2026-04-28'
        },

        // Sistema de Tickets (proyecto 4) - COMPLETADO
        {
            title: 'CRUD de tickets',
            description: 'Crear, asignar, actualizar estado y cerrar tickets de soporte.',
            status: 'done',
            priority: 'high',
            project_id: 4,
            user_id: 4,
            due_date: '2026-02-15'
        },
        {
            title: 'Sistema de prioridades y SLA',
            description: 'Definir niveles de prioridad con tiempos de respuesta según SLA.',
            status: 'done',
            priority: 'high',
            project_id: 4,
            user_id: 6,
            due_date: '2026-02-20'
        },
        {
            title: 'Chat en vivo con agentes',
            description: 'Implementar chat real-time entre usuarios y agentes de soporte.',
            status: 'done',
            priority: 'high',
            project_id: 4,
            user_id: 4,
            due_date: '2026-03-01'
        },
        {
            title: 'Base de conocimientos',
            description: 'Sistema de artículos FAQ con búsqueda y categorías.',
            status: 'done',
            priority: 'medium',
            project_id: 4,
            user_id: 1,
            due_date: '2026-03-10'
        },
        {
            title: 'Reportes de métricas',
            description: 'Dashboard con tiempo de resolución, satisfacción y tickets por categoría.',
            status: 'done',
            priority: 'medium',
            project_id: 4,
            user_id: 6,
            due_date: '2026-03-15'
        },

        // API Gateway (proyecto 5)
        {
            title: 'Configurar Kong Gateway',
            description: 'Setup inicial de Kong con Docker, configurar rutas base y plugins.',
            status: 'done',
            priority: 'high',
            project_id: 5,
            user_id: 1,
            due_date: '2026-03-25'
        },
        {
            title: 'Rate limiting por API key',
            description: 'Implementar límites de requests por minuto según plan del cliente.',
            status: 'in_progress',
            priority: 'high',
            project_id: 5,
            user_id: 3,
            due_date: '2026-04-08'
        },
        {
            title: 'Autenticación OAuth2 centralizada',
            description: 'Single Sign-On para todos los microservicios a través del gateway.',
            status: 'in_progress',
            priority: 'high',
            project_id: 5,
            user_id: 7,
            due_date: '2026-04-12'
        },
        {
            title: 'Load balancing y health checks',
            description: 'Configurar balanceo de carga round-robin con verificación de salud.',
            status: 'todo',
            priority: 'medium',
            project_id: 5,
            user_id: 1,
            due_date: '2026-04-18'
        },
        {
            title: 'Logging centralizado con ELK',
            description: 'Enviar logs de todos los servicios a Elasticsearch vía Logstash.',
            status: 'pending',
            priority: 'medium',
            project_id: 5,
            user_id: 3,
            due_date: '2026-04-25'
        }
    ]

    for (const task of tasks) {
        await db.run(
            `INSERT INTO tasks (title, description, status, priority, project_id, user_id, due_date)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [task.title, task.description, task.status, task.priority, task.project_id, task.user_id, task.due_date]
        )
    }
    console.log(`   ✓ ${tasks.length} tasks creadas`)

    // ==================== COMMENTS ====================
    console.log('💬 Creando comentarios...')

    const comments = [
        // Comentarios en task 1 (JWT auth)
        { task_id: 1, user_id: 2, content: 'Implementé el endpoint de login y registro. Falta agregar el refresh token.' },
        { task_id: 1, user_id: 1, content: 'Revisé el código, se ve bien. Agrega tests unitarios antes de mergear.' },
        { task_id: 1, user_id: 2, content: 'Tests agregados. Cobertura al 85%. PR listo para review.' },
        { task_id: 1, user_id: 1, content: 'Aprobado y mergeado a develop. Buen trabajo! 🚀' },

        // Comentarios en task 3 (Carrito)
        { task_id: 3, user_id: 2, content: 'Empecé con la estructura del carrito. Usando Redis para persistir sesiones.' },
        { task_id: 3, user_id: 1, content: '¿Por qué Redis y no guardar en la BD directamente?' },
        { task_id: 3, user_id: 2, content: 'Por performance. El carrito se consulta mucho y Redis es más rápido para este caso de uso.' },
        { task_id: 3, user_id: 4, content: 'Tiene sentido. Asegúrate de manejar la expiración de sesiones inactivas.' },

        // Comentarios en task 4 (Stripe)
        { task_id: 4, user_id: 4, content: 'Necesito las credenciales de Stripe para el ambiente de desarrollo.' },
        { task_id: 4, user_id: 1, content: 'Te las envío por el canal privado de Slack. No las subas al repo!' },
        { task_id: 4, user_id: 4, content: 'Recibidas. Ya configuré el .env.example sin las keys reales.' },

        // Comentarios en task 9 (Dashboard cuentas)
        { task_id: 9, user_id: 6, content: 'El diseño del dashboard está listo. Empiezo con la implementación.' },
        { task_id: 9, user_id: 8, content: 'Usa el componente de tarjeta que ya tenemos en el design system.' },
        { task_id: 9, user_id: 6, content: 'Encontré un bug en el componente de tarjeta. Lo reporto como issue aparte.' },

        // Comentarios en task 10 (Transferencias)
        { task_id: 10, user_id: 3, content: 'Duda: ¿Las transferencias a terceros requieren token de confirmación?' },
        { task_id: 10, user_id: 8, content: 'Sí, por seguridad enviamos un código por SMS que expira en 5 minutos.' },
        { task_id: 10, user_id: 3, content: 'Entendido. Integro con el servicio de SMS que ya tenemos.' },
        { task_id: 10, user_id: 5, content: 'Agregué validación de horarios: solo de 6am a 10pm para terceros.' },

        // Comentarios en task 14 (Mockups Figma)
        { task_id: 14, user_id: 7, content: 'Primera versión de los mockups lista. Revisen el link de Figma.' },
        { task_id: 14, user_id: 2, content: 'Se ve genial! Sugiero agregar modo oscuro desde el inicio.' },
        { task_id: 14, user_id: 7, content: 'Buena idea. Agrego variables de color para soportar ambos temas.' },
        { task_id: 14, user_id: 1, content: 'El cliente pidió que el logo sea más prominente. ¿Puedes ajustarlo?' },
        { task_id: 14, user_id: 7, content: 'Listo, aumenté el tamaño y lo moví al header. Nueva versión subida.' },

        // Comentarios en task 22 (Kong Gateway)
        { task_id: 22, user_id: 1, content: 'Kong configurado con Docker Compose. Incluí Konga como UI admin.' },
        { task_id: 22, user_id: 3, content: '¿Documentaste los pasos de instalación?' },
        { task_id: 22, user_id: 1, content: 'Sí, está en el README del repo. Incluye troubleshooting común.' },

        // Comentarios en task 23 (Rate limiting)
        { task_id: 23, user_id: 3, content: 'Implementando rate limiting. ¿Cuáles son los límites por plan?' },
        { task_id: 23, user_id: 8, content: 'Free: 100/min, Basic: 1000/min, Pro: 10000/min, Enterprise: ilimitado.' },
        { task_id: 23, user_id: 3, content: 'Perfecto. También agrego headers X-RateLimit-* en las respuestas.' },

        // Comentarios en task 24 (OAuth2)
        { task_id: 24, user_id: 7, content: 'Estoy evaluando entre Keycloak y Auth0. ¿Alguna preferencia?' },
        { task_id: 24, user_id: 1, content: 'Keycloak si queremos self-hosted, Auth0 si preferimos SaaS.' },
        { task_id: 24, user_id: 8, content: 'Vamos con Keycloak para tener control total. Ya tenemos infraestructura.' },
        { task_id: 24, user_id: 7, content: 'Entendido. Empiezo con la configuración del realm y clients.' }
    ]

    for (const comment of comments) {
        await db.run(
            'INSERT INTO comments (task_id, user_id, content) VALUES (?, ?, ?)',
            [comment.task_id, comment.user_id, comment.content]
        )
    }
    console.log(`   ✓ ${comments.length} comentarios creados`)

    // ==================== RESUMEN ====================
    console.log('\n✅ Seed completado exitosamente!\n')
    console.log('📊 Resumen:')
    console.log(`   • ${users.length} usuarios`)
    console.log(`   • ${projects.length} proyectos`)
    console.log(`   • ${projectMembers.length} asignaciones de miembros`)
    console.log(`   • ${tasks.length} tasks`)
    console.log(`   • ${comments.length} comentarios`)

    console.log('\n🔐 Credenciales de prueba:')
    console.log('   Admin: carlos@devteam.com / password123')
    console.log('   Admin: sofia@devteam.com / password123')
    console.log('   User:  ana@devteam.com / password123')

    await db.close()
}

seed().catch(err => {
    console.error('❌ Error en seed:', err)
    process.exit(1)
})
