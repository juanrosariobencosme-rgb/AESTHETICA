# Configuración de Supabase para Aesthetica Skincare

Este documento describe cómo configurar Supabase para la aplicación Aesthetica Skincare.

## Pasos de Configuración

### 1. Crear cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto llamado "aesthetica-skincare"

### 2. Obtener credenciales

1. En tu proyecto de Supabase, ve a **Settings > API**
2. Copia los siguientes valores:
   - **Project URL**: Tu URL del proyecto (ej: `https://xyz.supabase.co`)
   - **anon/public key**: Tu clave anónima pública

### 3. Configurar variables de entorno

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega las siguientes variables:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Reemplaza `YOUR_SUPABASE_PROJECT_URL` y `YOUR_SUPABASE_ANON_KEY` con tus credenciales reales.

### 4. Ejecutar el script SQL

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Crea una nueva consulta
3. Copia y pega el contenido del archivo `supabase-schema.sql`
4. Ejecuta el script para crear todas las tablas necesarias

### 5. Verificar la configuración

Las siguientes tablas deberían crearse automáticamente:
- `products` - Catálogo de productos
- `promotion_bundles` - Promociones y bundles
- `orders` - Órdenes de clientes
- `expenses` - Gastos y egresos
- `cash_sessions` - Sesiones de caja
- `social_config` - Configuración de redes sociales

## Funcionalidades Integradas

### Panel de Admin
- **CRUD de Productos**: Crear, actualizar, eliminar productos
- **CRUD de Promociones**: Crear, eliminar promociones
- **CRUD de Gastos**: Registrar y eliminar egresos
- **Sesión de Caja**: Abrir y cerrar sesiones de caja
- **Simulación de Ventas**: Crear órdenes de prueba

### Sistema de Órdenes
- **Checkout**: Las órdenes se guardan automáticamente en Supabase
- **Actualización de Caja**: Las ventas actualizan la sesión de caja activa
- **Historial**: Todas las transacciones se registran en el historial

### Sincronización
- Todos los datos se sincronizan con Supabase en tiempo real
- Los datos locales (localStorage) se usan como fallback si Supabase no está disponible
- La aplicación carga datos de Supabase al iniciar

## Seguridad

El script SQL incluye políticas de seguridad básicas (RLS) que permiten acceso público. Para producción, deberías:

1. Configurar autenticación de usuarios en Supabase
2. Actualizar las políticas RLS para restringir acceso
3. Implementar autenticación real para el panel de admin
4. Usar service role key para operaciones de admin

## Troubleshooting

### Error: "Supabase connection failed"
- Verifica que las credenciales en `.env.local` sean correctas
- Asegúrate de que el proyecto de Supabase esté activo
- Revisa la consola del navegador para más detalles

### Error: "Table does not exist"
- Ejecuta el script SQL en el SQL Editor de Supabase
- Verifica que todas las tablas se hayan creado correctamente

### Los datos no se guardan
- Verifica que las políticas RLS permitan escritura
- Revisa la consola para errores de red
- Asegúrate de que las credenciales tengan permisos suficientes

## Soporte

Para más información sobre Supabase:
- Documentación: https://supabase.com/docs
- Dashboard: https://app.supabase.com
- Comunidad: https://github.com/supabase/supabase
