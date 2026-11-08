# 📱 Cinetopia Mobile App (Expo & Tailwind)

Aplicación móvil moderna desarrollada con **Expo (React Native)**, **TypeScript** y estilizada con **Tailwind CSS**.

La aplicación es completamente responsiva y funciona de manera idéntica en:
* 🌐 **Web** (Chrome, Safari, Edge)
* 🤖 **Android** (Emulador o teléfono físico con Expo Go)
* 🍏 **iOS** (Simulador o iPhone físico con Expo Go)

---

## 🌟 Características Principales

1. **🍿 Cartelera y Catálogo de Películas:**
   * Listado en tiempo real conectado al backend de MySQL.
   * Filtro dinámico por categorías (Ciencia Ficción, Drama, Animación, Acción).
   * Búsqueda por texto (título, director o palabras clave de la sinopsis).
   * Diseño en cuadrícula responsiva (1 columna en móvil, 2 columnas en tablet/pantalla ancha).

2. **🔍 Detalle Completo de Película:**
   * Ficha técnica según los campos de la base de datos: `Identificador`, `Titulo`, `IDDirector`, `Duracion`, `IDCategoria`, `Sinopsis`.
   * Póster en alta definición, duración formateada en horas y minutos.
   * Acceso con un solo toque a la simulación de sala para esa película.

3. **🎟️ Simulación de Sala de Cine:**
   * Selector interactivo de películas y horarios (13:30, 16:15, 19:00, 21:45).
   * Simulación visual de pantalla curva de cine (*Screen*).
   * Cuadrícula de asientos interactiva (Filas A-F, Columnas 1-8).
   * Estados de asientos: **Disponible**, **Ocupado**, **VIP** y **Seleccionado**.
   * Cálculo en vivo de precio total según los asientos seleccionados.
   * Generación de **Boleto/Ticket de Cine** con código QR simulado, sala, función y total pagado.

4. **⚙️ Gestión / CRUD con MySQL:**
   * Formulario para registrar nuevas películas (`POST /api/peliculas`).
   * Eliminación de películas con confirmación.
   * Selector configurable de la IP/URL de la API para pruebas en redes Wi-Fi locales o emuladores.

---

## 🚀 Cómo Ejecutar la App

Asegúrate de estar en la carpeta `mobile`:

```bash
cd mobile
```

### Opción 1: En el Navegador Web (Recomendado para pruebas inmediatas)
```bash
npx expo start --web
```
*(O ejecuta `npx expo start` y presiona la tecla `w` en la consola)*.

### Opción 2: En tu Celular Físico (iOS / Android)
1. Instala la app gratuita **Expo Go** desde Google Play Store o App Store.
2. Ejecuta:
   ```bash
   npx expo start
   ```
3. Escanea el código QR que aparecerá en tu terminal desde la cámara (iPhone) o desde la app Expo Go (Android).

---

## 🔗 Conexión con el Backend

Por defecto:
* **En Web y iOS Simulator:** La app se conecta automáticamente a `http://localhost:3000`.
* **En Android Emulator:** Se conecta automáticamente a `http://10.0.2.2:3000`.
* **En celular físico:** Ve a la pestaña **⚙️ Gestión** dentro de la app e ingresa la IP local de tu computadora (ej: `http://192.168.1.15:3000`).
* **Modo Offline:** Si el backend aún no está iniciado, la app activa automáticamente datos de demostración para que nunca se quede en blanco ni falle.

