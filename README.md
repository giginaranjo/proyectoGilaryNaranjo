
# Entrega final

## Authors

- Naranjo, Gilary [@giginaranjo](https://github.com/giginaranjo)

## Description

Consta de un servidor que contiene los endpoints y servicios necesarios para gestionar productos y carritos de compra. Cuenta con MongoDB como sistema de persistencia principal.

Para realizar el testeo puede utilizar las siguientes lineas de código correspondientes a los datos que se deben ingresar para crear productos y carritos respectivamente, y así empezar a interactuar con los endpoints.

Crear producto
{"title": "", "description":"", "code":"", "price": , "stock": , "category": "", "thumbnail": }

Crear carrito
{"product":[{"id":"", "quantity":}]}



## Dependencies

- express
- express-handlebars
- socket.io
- mongodb
- mongoose
- mongoose-paginate-v2
- mongosh