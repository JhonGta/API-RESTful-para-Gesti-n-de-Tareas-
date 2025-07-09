@echo off
echo Instalando dependencias de Node.js...
echo.

cd /d "%~dp0"

echo Instalando dependencias principales...
call npm install express@^4.18.2
call npm install mongoose@^7.0.3
call npm install bcryptjs@^2.4.3
call npm install jsonwebtoken@^9.0.0
call npm install cors@^2.8.5
call npm install dotenv@^16.0.3
call npm install express-validator@^6.14.3

echo.
echo Instalando dependencias de desarrollo...
call npm install --save-dev nodemon@^2.0.20

echo.
echo ¡Instalación completada!
echo.
echo Para ejecutar el proyecto:
echo   npm run dev    (modo desarrollo con nodemon)
echo   npm start      (modo producción)
echo.

pause
