// src/components/Register.jsx
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://back-tiendaclasic.vercel.app/register", { email, password, role });
      alert("Registro exitoso");
    } catch (error) {
      alert("Error en el registro");
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Correo" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
        <select onChange={(e) => setRole(e.target.value)}>
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
    </div>
  );
}

export default Register;
