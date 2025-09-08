import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const URI = 'http://localhost:3001/api/medicamento'; // Cambiamos la URL a la de medicamentos

const CompEditarMedicamento = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [sustancias, setSustancias] = useState('');
  const [casafarma, setcasaFarmaceutica] = useState('');
  const [estado, setEstado] = useState('');
  const { idMedicamento } = useParams();

  const navigate = useNavigate();

  // Procedimiento para Actualizar
  const Actualizar = async (e) => {
    e.preventDefault();
    await axios.put(URI + '/' + idMedicamento, {
      Nombre: nombre,
      Descripcion: descripcion,
      Sustancias: sustancias,
      casaFarmaceutica: casafarma,
      Estado: estado
    });
    navigate('/medicamento');
  };

  useEffect(() => {
    getMedicamentoByID();
  }, []);

  const getMedicamentoByID = async () => {
    const res = await axios.get(URI + '/' + idMedicamento);
    setNombre(res.data.Nombre);
    setDescripcion(res.data.Descripcion);
    setSustancias(res.data.Sustancias);
    setcasaFarmaceutica(res.data.casaFarmaceutica);
    setEstado(res.data.Estado);
  };

  return (
    <div>
      <h3>Editar Medicamento</h3>
      <div className="offcanvas-body">
        <div className="container-fluid">
          <form onSubmit={Actualizar}>
            <div className="row">
              <div className="col-xl-6 mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="col-xl-6 mb-3">
                <label htmlFor="descripcion" className="form-label">
                  Descripción<span className="text-danger">*</span>{" "}
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                />
              </div>
              <div className="col-xl-6 mb-3">
                <label htmlFor="sustancias" className="form-label">
                  Sustancias<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  value={sustancias}
                  onChange={(e) => setSustancias(e.target.value)}
                  required
                />
              </div>
              <div className="col-xl-6 mb-3">
                <label htmlFor="casafarma" className="form-label">
                  Casa Farmaceutica<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  value={casafarma}
                  onChange={(e) => setcasaFarmaceutica(e.target.value)}
                  required
                />
              </div>
              <div className="col-xl-6 mb-3">
                <label htmlFor="estado" className="form-label">
                  Estado<span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  required
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </div>
            <div>
              <button type="submit" className="btn btn-primary me-1">
                Actualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompEditarMedicamento;
