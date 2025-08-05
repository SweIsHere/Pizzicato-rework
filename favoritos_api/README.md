# api-favorites


### **GET** user's favorites (/favorites/mine): 
Obtener todas las canciones favoritas de un usuario.

**Request body:**

```json
{
    "tenant_id": "angel@example.com",
    "sorted": true
}
```


### **POST** new favorite song (/favorites/add): 
Usuario agrega una canción a sus favoritos.

**Request body:**

```json
{
    "tenant_id": "angel@example.com",
    "song_uuid": "7b9c3b18-efbc-448d-ae3a-6a657c674dfc"
}
```


### **DELETE** favorite song (/favorites/remove):
Usuario quita canción de sus favoritos.

**Request body:**

```json
{
    "tenant_id": "angel@example.com",
    "song_uuid": "7b9c3b18-efbc-448d-ae3a-6a657c674dfc"
}
```
