
# Segunda pre-entrega

## Authors

- Naranjo, Gilary [@giginaranjo](https://github.com/giginaranjo)

## Description

Consta de un servidor que contiene los endpoints y servicios necesarios para gestionar productos y carritos de compra.

Para realizar el testeo puede utilizar las siguientes lineas de código correspondientes a los datos que se deben ingresar para crear y/o modificar un producto y para crear un carrito de compras.

Crear producto
{"title": "", "description":"", "code":"", "price": , "stock": , "category": "", "thumbnail": }

Crear carrito
{"product":[{"id":"", "quantity":}]}

Actualización: 

Se integraron vistas y sockets al servidor actual.


## Dependencies

- express
- express-handlebars
- socket.io