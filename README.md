# Tarea Final Electivo Backend
### Estudiante: Guillermo Hernández Valderrama
## Enunciado:
Es necesario crear los siguientes endpoints para el backend:
- ```GET api/v1/users/getAllUsers``` que devuelva una lista de usuarios creados en la
DB que están activos (No han sido eliminados)
- ```GET api/v1/users/findUsers``` que devuelva una lista filtrada de usuarios que
cumplan con cualquiera de los siguientes parámetros:
    - eliminados (true or false)
    - Coincidan parcial o totalmente con el nombre
    - Hayan iniciado sesión antes de una fecha especificada
    - Hayan iniciado sesión después de una fecha especificada

    (Obs: usar los parámetros del request, QueryParams como filtros)
- ```POST api/v1/users/bulkCreate``` que reciba una lista (array) con usuarios para ser
creados, valide cada uno de ellos, y que como resultado, devuelva la cantidad de
usuarios registrados exitosamente, y la cantidad de los que no fueron registrados.


## Endpoints creados para su uso

###  GET ```api/v1/users/getAllUsers```
Devuelve una lista de los usuarios creados en la
DB que  no han sido eliminados. 

Busca los elementos que cumplan la condición: ```user.status=true```.

### GET ```api/v1/users/findUsers```

Busca todos los usuarios que cumplan los criterios entregados.

Ejemplo de ruta:
 http://localhost:3001/api/v1/users/findUsers?login_after_date=1718357477360&login_before_date=1720053877360&active=true&name=ad

- ```login_after_date```: filtra usuarios que hayan iniciado sesión despues de esta fecha.
- ```login_before_date```: filtra usuarios que hayan iniciado sesión antes de esta fecha.
- ```active```: filtra usuarios según su status (true or false).
- ```name```: filtra usuarios cuyo nombre coincidan parcial o totalmente con la cadena de caracteres entregada.

### POST ```api/v1/users/bulkCreate```

Función que recibe una lista (array) con usuarios para ser creados. Valida cada uno de ellos, y que como resultado, devuelva la cantidad de usuarios registrados exitosamente, y la cantidad de los que no fueron registrados.

- Estructura de lista de usuarios:
[ {data de usuario 1} , {data de usuario 2} , {data de usuario 3} , ... ]

- Cada usuario se debe componer con: ```"name"```, ```"email"```, ```"password"```, ```"password_second"``` y ```"cellphone"```.

Observación: Debe entregarse en formato Json.

## Notas para su uso:
- Recuerde iniciar sesión con la ruta POST: http://localhost:3001/api/v1/auth/login y utilizar el token de sesión generado.
- Se ha habilitado un usuario para tener el rol Administador, con los datos: 
{
    "email": "cuentaadministrador@gmail.com",
    "password": "12312344"
}, para el correcto funcionamiento de los nuevos endpoints.