import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Alertas = ({ toggleTab, PerfectScrollbar, toggleChatBox }) => {
  const [medicamentosVencidos, setMedicamentosVencidos] = useState([]);
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/reports/getLoteSoonExpire")
      .then((response) => response.json())
      .then((data) => setMedicamentosVencidos(data))
      .catch((error) => console.error("Error al obtener los medicamentos vencidos:", error));
  }, []);

  // Esta función se llama al hacer clic en un medicamento para mostrar sus detalles.
  const mostrarDetalles = (medicamento) => {
    setMedicamentoSeleccionado(medicamento);
  };

  return (
    <div
      className={`tab-pane fade  ${
        toggleTab === "alertas" ? "active show" : "active show"
      }`}
      id="alertas"
      role="tabpanel"
    >
      <div className="card mb-sm-3 mb-md-0 contacts_card">
        <div
          className={`card-body contacts_body p-0 dlab-scroll  ${
            toggleChatBox ? "ps ps--active-y" : ""
          }`}
          id="DZ_W_Contacts_Body1"
        >
          <ul className="contacts">
            <li className="name-first-letter">Medicamentos Por Vencer</li>
            {medicamentosVencidos.map((medicamento, index) => (
              <li className="active" key={index} onClick={() => mostrarDetalles(medicamento)}>
                <div className="d-flex bd-highlight">
                  <div className="user_info">
                    {/* Agrega un evento onClick para mostrar detalles al hacer clic. */}
                    <span>
                      LOTE CON ID: {medicamento.IDLote}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Sección para mostrar detalles del medicamento seleccionado con un margen a la izquierda. */}
      {medicamentoSeleccionado && (
        <div style={{ marginLeft: "10px" }}>
          <h3> Detalles Lote: {medicamentoSeleccionado.IDLote}</h3>
          <li>- Medicamento: {medicamentoSeleccionado.Medicamento}</li>
          <li>- Cantidad Disponible: {medicamentoSeleccionado.cantidadDisponible}</li>
          <li>- Vence: {medicamentoSeleccionado.Fecha_Vencimiento}</li>
        </div>
      )}
    </div>
  );
};

export default Alertas;
