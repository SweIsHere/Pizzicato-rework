# Configuración de APIs - Pizzicato

## Descripción

Este proyecto utiliza un sistema de configuración centralizada para manejar las URLs de las APIs de AWS Gateway. En lugar de tener URLs completas duplicadas en el archivo `.env`, ahora usamos IDs de API y construimos las URLs dinámicamente.

## Estructura de la Configuración

### Archivo `.env`
```properties
# AWS API Gateway IDs
VITE_API_USERS_ID="r4zgvdf5fd"
VITE_API_SONGS_ID="zw62rb3hm6"
VITE_API_ARTISTS_ID="15vyy97kc3"
VITE_API_PODCASTS_ID="oq4mieid2l"
VITE_API_ALBUMS_ID="ceez4ftvb2"
VITE_API_FAVORITES_ID="o1krvowm7j"

# AWS Region and Stage
VITE_AWS_REGION="us-east-1"
VITE_AWS_STAGE="dev"
```

### Archivo `src/config/api.js`
Contiene la configuración centralizada y las funciones helper para construir URLs.

## Cómo Usar

### Importar la configuración
```javascript
import { API_ENDPOINTS } from "./config/api";
```

### Usar endpoints en componentes
```javascript
// En lugar de:
// axios.post(import.meta.env.VITE_API_BASE_LOGIN, data)

// Usar:
axios.post(API_ENDPOINTS.users.login(), data)
```

## Endpoints Disponibles

### Usuarios
- `API_ENDPOINTS.users.register()` - Registro de usuarios
- `API_ENDPOINTS.users.login()` - Login de usuarios
- `API_ENDPOINTS.users.info()` - Información de usuario

### Canciones
- `API_ENDPOINTS.songs.all()` - Todas las canciones
- `API_ENDPOINTS.songs.byGenre()` - Canciones por género
- `API_ENDPOINTS.songs.byName()` - Canciones por nombre
- `API_ENDPOINTS.songs.byId()` - Canción por ID

### Artistas
- `API_ENDPOINTS.artists.info()` - Información de artista
- `API_ENDPOINTS.artists.byCountry()` - Artistas por país
- `API_ENDPOINTS.artists.byName()` - Artistas por nombre

### Podcasts
- `API_ENDPOINTS.podcasts.all()` - Todos los podcasts
- `API_ENDPOINTS.podcasts.byGenre()` - Podcasts por género

### Álbumes
- `API_ENDPOINTS.albums.filter()` - Filtrar álbumes

### Favoritos
- `API_ENDPOINTS.favorites.add()` - Agregar a favoritos
- `API_ENDPOINTS.favorites.remove()` - Remover de favoritos
- `API_ENDPOINTS.favorites.mine()` - Mis favoritos

## Ventajas

1. **Mantenibilidad**: Solo necesitas cambiar el ID en el `.env` para actualizar todas las URLs de una API
2. **Legibilidad**: Las llamadas a API son más descriptivas
3. **Consistencia**: Todas las URLs se construyen de la misma manera
4. **Escalabilidad**: Fácil agregar nuevos endpoints

## Migraciones Completadas

Los siguientes archivos han sido actualizados para usar la nueva configuración:
- ✅ `SignIn.jsx`
- ✅ `Fav.jsx` 
- ✅ `TopNavigation.jsx`
- ✅ `Songs.jsx`
- ✅ `Podcast.jsx`
- ✅ `Favorites.jsx`
- ✅ `Artists.jsx`

## Notas

- Las URLs se construyen automáticamente usando el patrón: `https://{API_ID}.execute-api.{REGION}.amazonaws.com/{STAGE}{ENDPOINT}`
- Si necesitas agregar un nuevo endpoint, solo agrégalo en `src/config/api.js`
- Asegúrate de que todos los IDs en el `.env` sean correctos
