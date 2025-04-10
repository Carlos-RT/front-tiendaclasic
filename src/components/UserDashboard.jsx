import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const products = [
  { id: 1, name: "Laptop", price: 300 },
  { id: 2, name: "Smartphone", price: 150 },
  { id: 3, name: "Televisor", price: 400 },
  { id: 4, name: "Estufa", price: 290 },
  { id: 5, name: "Nevera", price: 600 },
];

function UserDashboard() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [compras, setCompras] = useState([]);
  const [mostrarCompras, setMostrarCompras] = useState(false);
  const navigate = useNavigate();

  // Obtener email del usuario desde localStorage
  const userEmail = localStorage.getItem("userEmail") || "usuario";

  const handleSelection = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((productId) => productId !== id)
        : [...prev, id]
    );
  };

  const totalPrice = selectedProducts.reduce(
    (sum, id) => sum + products.find((p) => p.id === id).price,
    0
  );

  const handlePurchase = () => {
    const selectedItems = products.filter((p) => selectedProducts.includes(p.id));
    navigate("/checkout", { state: { selectedItems, totalPrice } });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const handleViewPurchases = async () => {
    setMostrarCompras(!mostrarCompras);

    if (!mostrarCompras) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/compras", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setCompras(data);
        } else {
          console.error("Error al obtener compras:", data.mensaje);
        }
      } catch (error) {
        console.error("Error al obtener compras:", error);
      }
    }
  };

  return (
    <div>
      <h1>Hola, {userEmail}</h1>
      <h2>Bienvenido a la tienda</h2>
      <button onClick={handleLogout} style={{ background: "red", color: "white", padding: "10px", marginBottom: "10px" }}>
        Salir
      </button>
      <div>
        {products.map((product) => (
          <div key={product.id}>
            <input
              type="checkbox"
              onChange={() => handleSelection(product.id)}
              checked={selectedProducts.includes(product.id)}
            />
            {product.name} - ${product.price}
          </div>
        ))}
      </div>
      <h3>Total: ${totalPrice}</h3>
      <button onClick={handlePurchase}>Comprar</button>
      <button onClick={handleViewPurchases} style={{ marginLeft: "10px" }}>
        {mostrarCompras ? "Ocultar compras" : "Revisar tus compras"}
      </button>

      {mostrarCompras && (
        <div>
          <h3>Historial de Compras</h3>
          {compras.length > 0 ? (
            <ul>
              {compras.map((compra, index) => (
                <li key={index}>
                  <strong>Fecha:</strong> {new Date(compra.fechaCompra).toLocaleDateString()} <br />
                  <strong>Total:</strong> ${compra.total} <br />
                  <strong>Productos:</strong>{" "}
                  {compra.productos.map((p) => `${p.name} ($${p.price})`).join(", ")}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes compras registradas.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;