import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const validCard = {
  number: "9946 6854 2114 4000",
  expiry: "06/28",
  ccv: "986",
};

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedItems, totalPrice, userEmail, userName } = location.state || { 
    selectedItems: [], 
    totalPrice: 0, 
    userEmail: "", 
    userName: "" 
  };
  
  const [formData, setFormData] = useState({
    document: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    cardNumber: "",
    expiryDate: "",
    ccv: "",
  });
  
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (Object.values(formData).some((val) => val.trim() === "")) {
      setError("Todos los campos son obligatorios");
      return;
    }
  
    if (
      formData.cardNumber !== validCard.number ||
      formData.expiryDate !== validCard.expiry ||
      formData.ccv !== validCard.ccv
    ) {
      setError("Error de autenticación");
      return;
    }
  
    const token = localStorage.getItem("token"); // Asegúrate de que el token se obtiene correctamente
  
    try {
      const response = await fetch("http://localhost:5000/comprar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 Aquí enviamos el token
        },
        body: JSON.stringify({
          usuarioEmail: userEmail,
          usuarioNombre: userName,
          productos: selectedItems,
          total: totalPrice,
          fecha: formData.purchaseDate,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Compra completada con éxito");
        navigate("/user");
      } else {
        setError(data.mensaje);
      }
    } catch (error) {
      console.error("Error al registrar la compra:", error);
      setError("Ocurrió un error al procesar la compra");
    }
  };

  return (
    <div>
      <h1>Resumen de Compra</h1>
      <ul>
        {selectedItems.map((item) => (
          <li key={item.id}>{item.name} - ${item.price}</li>
        ))}
      </ul>
      <h3>Total a pagar: ${totalPrice}</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="document" placeholder="Número de documento" onChange={handleChange} />
        <input type="date" name="purchaseDate" value={formData.purchaseDate} readOnly />
        <input type="text" name="cardNumber" placeholder="Número de tarjeta" onChange={handleChange} />
        <input type="text" name="expiryDate" placeholder="Fecha de vencimiento (MM/YY)" onChange={handleChange} />
        <input type="text" name="ccv" placeholder="Código CCV" onChange={handleChange} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Completar Compra</button>
      </form>
    </div>
  );
}

export default Checkout;