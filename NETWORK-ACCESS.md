# Acceso desde otros dispositivos

Para acceder a tu aplicación Next.js desde otros dispositivos en la misma red (como un teléfono móvil u otro ordenador), sigue estos pasos:

1. Ejecuta el siguiente comando:

```bash
npm run dev:network
```

2. Encuentra tu dirección IP local:

   - En Windows: Abre CMD y escribe `ipconfig`
   - Busca la dirección IPv4 (algo como 192.168.1.X)

3. Ahora puedes acceder a tu aplicación desde cualquier dispositivo en la misma red usando:

```
http://TU_IP_LOCAL:3000
```

Por ejemplo: `http://192.168.1.100:3000`

## Solución de problemas

Si no puedes conectarte, verifica lo siguiente:

1. Asegúrate de que todos los dispositivos estén conectados a la misma red WiFi
2. Verifica que el firewall de Windows no esté bloqueando el puerto 3000
3. Si tienes antivirus o software de seguridad, verifica que no esté bloqueando las conexiones
4. Algunos routers tienen habilitado el "aislamiento de cliente", lo que impide que los dispositivos se comuniquen entre sí

## Método alternativo con ngrok

Si necesitas acceder desde fuera de tu red local:

1. Instala ngrok: `npm install -g ngrok`
2. Ejecuta tu servidor normal: `npm run dev`
3. En otra terminal, ejecuta: `ngrok http 3000`
4. Usa la URL que te proporciona ngrok (como `https://12345abcde.ngrok.io`)
