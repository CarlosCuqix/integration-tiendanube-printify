const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Reemplaza estos valores con tus tokens
const tiendanubeToken = '3e2ebcc442129034e1957262adff3ed3c1c78b88f68eadc93c5175bfadba2bc9';
const printifyToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6IjZkZWIxZWFiOTExZTk3NGU0OWE0Mzk0M2UyZDE2NzRmMjQzYzk0YzA3MmQ1ZmEzMWFiMTM3OGRiMDg2Nzg4MTNkMGRkZGVjZDVhMWFlOWIyIiwiaWF0IjoxNzM4NDM2ODQyLjI0NTUzMywibmJmIjoxNzM4NDM2ODQyLjI0NTUzNiwiZXhwIjoxNzY5OTcyODQyLjIzNzgwNiwic3ViIjoiMjE3ODAwOTQiLCJzY29wZXMiOlsic2hvcHMubWFuYWdlIiwic2hvcHMucmVhZCIsImNhdGFsb2cucmVhZCIsIm9yZGVycy5yZWFkIiwib3JkZXJzLndyaXRlIiwicHJvZHVjdHMucmVhZCIsInByb2R1Y3RzLndyaXRlIiwid2ViaG9va3MucmVhZCIsIndlYmhvb2tzLndyaXRlIiwidXBsb2Fkcy5yZWFkIiwidXBsb2Fkcy53cml0ZSIsInByaW50X3Byb3ZpZGVycy5yZWFkIiwidXNlci5pbmZvIl19.ADZv8o7CfsD49iEeRm2Nv3Arbuik7_LYocEAJJzTmAX9_16EYy0rEJmuGGXzWKFAcZGAIrerCyj25jPjqV4';

app.use(express.json());

// Endpoint para recibir los pedidos de Tiendanube y enviar a Printify
app.post('/create-printify-order', async (req, res) => {
    try {
        const orderData = req.body; // Datos del pedido que recibimos de Tiendanube

        // Crear un pedido en Printify
        const response = await axios.post(
            'https://api.printify.com/v1/orders.json',
            {
                external_order_id: orderData.id, // ID del pedido de Tiendanube
                line_items: orderData.items.map(item => ({
                    product_id: item.product_id, 
                    quantity: item.quantity
                })),
                shipping_address: orderData.shipping_address,
                // Aquí puedes incluir más datos según los requisitos de Printify
            },
            {
                headers: {
                    'Authorization': `Bearer ${printifyToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        // Si la creación del pedido en Printify es exitosa, respondemos con éxito.
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error al crear el pedido en Printify:', error);
        res.status(500).json({ error: 'Ocurrió un error al procesar el pedido.' });
    }
});

// Escuchar en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

