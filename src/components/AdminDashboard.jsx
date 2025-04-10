import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [compras, setCompras] = useState([]);
  const navigate = useNavigate();

  const handleVerCompras = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("https://back-tiendaclasic.vercel.app/admin/compras", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Error al obtener las compras");
      }

      const data = await response.json();
      setCompras(data);
    } catch (error) {
      console.error("❌ Error al obtener compras:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Eliminar el token
    localStorage.removeItem("userEmail"); // Limpiar datos de usuario
    navigate("/login"); // Redirigir al login
  };

  return (
    <div>
      <h1>Hola Administrador</h1>
      <button onClick={handleVerCompras}>Revisar Actividad</button>
      <button onClick={handleLogout} style={{ marginLeft: "10px", background: "red", color: "white" }}>
        Salir
      </button>

      <h2>Historial de Compras</h2>
      <ul>
        {compras.map((compra) => (
          <li key={compra._id}>
            <strong>{compra.usuario.email}</strong> - ${compra.total} - {compra.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
