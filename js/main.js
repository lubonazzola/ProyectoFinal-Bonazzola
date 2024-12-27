let productos = [];
let carrito = [];

fetch('./js/productos.json')
    .then(response => response.json())
    .then(data => {
        productos = data;
        renderizarProductos(); 
    });

function renderizarProductos() {
    const contenedorProductos = document.getElementById('contenedorProductos');
    contenedorProductos.innerHTML = ''; 
    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');
        productoDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.titulo}">
            <h5>${producto.titulo}</h5>
            <p>$${producto.precio.toLocaleString()}</p>
            <button class="btn btn-primary" onclick="agregarAlCarrito('${producto.id}')">Agregar al carrito</button>
        `;
        contenedorProductos.appendChild(productoDiv);
    });
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);

    const productoEnCarrito = carrito.find(p => p.id === id);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({...producto, cantidad: 1});
    }

    actualizarCarrito();
    mostrarNotificacion('Producto agregado al carrito');
}

function actualizarCarrito() {
    const carritoProductos = document.getElementById('carrito-productos');
    const numerito = document.getElementById('numerito');
    const carritoVacio = document.getElementById('carrito-vacio');
    const carritoAcciones = document.getElementById('carrito-acciones');
    const carritoAccionesTotal = document.getElementById('total');
   
    let total = 0;
    let totalCantidad = 0;
    carritoProductos.innerHTML = '';
   
    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
        totalCantidad += producto.cantidad;

        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto-carrito');
        productoDiv.innerHTML = `
            <div>${producto.titulo}</div>
            <div>${producto.cantidad}</div>
            <div>$${(producto.precio * producto.cantidad).toLocaleString()}</div>
            <div>
                <i class="bi bi-trash" style="cursor: pointer; color: red;" onclick="eliminarDelCarrito('${producto.id}')"></i>
            </div>
        `;
        carritoProductos.appendChild(productoDiv);
    });

    numerito.textContent = totalCantidad;
    carritoVacio.classList.toggle('disabled', carrito.length > 0);
    carritoAcciones.classList.toggle('disabled', carrito.length === 0);
    carritoAccionesTotal.textContent = `$${total.toLocaleString()}`;

    carritoProductos.classList.toggle('disabled', carrito.length === 0);
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(producto => producto.id !== id);
    actualizarCarrito();
    mostrarNotificacion('Producto eliminado del carrito');
}

document.getElementById('carrito-acciones-vaciar').addEventListener('click', () => {
    carrito = [];
    actualizarCarrito();
    mostrarNotificacion('Tu carrito está vacío');
});

const modalCompra = new bootstrap.Modal(document.getElementById('modalCompra'));

document.getElementById('carrito-acciones-comprar').addEventListener('click', () => {
    modalCompra.show();
});

document.getElementById('formCompra').addEventListener('submit', (event) => {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;

    if (nombre && email) {
        carrito = [];
        actualizarCarrito();
        mostrarNotificacion('Compra realizada con éxito');
        Swal.fire('Gracias por tu compra', 'Tu pedido ha sido procesado con éxito', 'success');
        modalCompra.hide();
    }
});

function mostrarNotificacion(mensaje) {
    Toastify({
        text: mensaje,
        duration: 3000,
        gravity: "top", 
        position: "right",
        backgroundColor: "black",
        close: true
    }).showToast();
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
});
