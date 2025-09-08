import React, {useState, useRef, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { CSVLink } from 'react-csv';
import MainPagetitle from '../../../layouts/MainPagetitle';
import VentaCreate from '../../../constant/VentaCreate';
import VentaCreate1 from '../../../constant/VentaCreate1';
import axios from 'axios';
import {idVentaRecuperado} from '../../../constant/VentaCreate1';
import {loteSelect} from '../../../constant/VentaCreate';
export let banderaAux = false;
const URIVenta = 'http://localhost:3001/api/venta'
const URI = 'http://localhost:3001/api/detalle_factura'
const URI2 = 'http://localhost:3001/api/inventario/cargar'
const CompVentaShow = () => {
  const [reloadComponent, setReloadComponent] = useState(false);
  const closeVentaCreate1 = () => {
    
    // Lógica para cerrar VentaCreate1
    setReloadComponent(true); // Actualiza el estado para volver a renderizar CompVentaShow
  };
  //DETALLE FACTURA----------------------------------------------------------------
  const [detalles, setDetalle] = useState([]);
  useEffect(() => {
    getDetalle();
  }, []);
  const reloadDetalle= () => {
    getDetalle(); 
  };
  // Procedimiento para mostrar todos los elementos del detalle
  const getDetalle = async () => {
    const res = await axios.get(URI);
    setDetalle(res.data);
    };
    // Procedimiento para eliminar un elemento de detalle
  const deleteDetalle = async (dato) => {
    try {
      const resp = await axios.put(`${URI2}/${dato.IDLote}/${dato.Cantidad}`);
      console.log(resp.data);
      await axios.delete(`${URI}/${dato.IdDetalle}`);
      getDetalle();
    } catch (error) {
      console.error("Error al eliminar detalle", error);
    } 
  };
  const headers = [
    { label: "IdDetalle", key: "IdDetalle" },
    { label: "Cantidad", key: "Cantidad" },
    { label: "subTotal", key: "subTotal" },
    { label: "Idventa", key: "Idventa" }, 
    { label: "IdInventario", key: "IdInventario" },
  ];
  const csvlink = {
    headers: headers,
    data: detalles,
    filename: "factura.csv"
  };
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = detalles.slice(firstIndex, lastIndex); //cambio 1
  const npage = Math.ceil(detalles.length / recordsPage);
  const number = [...Array(npage + 1).keys()].slice(1);
  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCPage(id) {
    setCurrentPage(id);
  }
   function nextPage() {
     if (currentPage !== npage) {
       setCurrentPage(currentPage + 1);
     }
   }
  async function cancelarVenta() {
    let cont = 1;
    for (const dato of detalles.filter((dato) => dato.Idventa === idVentaRecuperado)) {
    console.log(cont++);
    console.log("dato Eliminado " + dato.IdDetalle + "/" + dato.IDLote + "/" + dato.Cantidad);
    await deleteDetalle(dato);
    }
    await axios.delete(`${URIVenta}/${idVentaRecuperado}`);
    window.location.reload();
  }
  async function confirmarVenta(){
    let total=0;
    for (const dato of detalles.filter((dato) => dato.Idventa === idVentaRecuperado)) {
      total+=dato.subTotal;
      console.log(dato.subTotal);
    }
    const resp = await axios.put(`${URIVenta}/${idVentaRecuperado}`,{MontoTotal: total});
    window.location.reload();
  }
   const elemento = useRef(); // Para el modal de detalle
   const elemento1 = useRef(); // Para el modal de Venta
  return (
    <>
      <MainPagetitle mainTitle="Venta" pageTitle={'Venta'} parentTitle={'Inicio'} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                    <h4 className="heading mb-0">Productos</h4>
                    <div>
                    {idVentaRecuperado === null && (
                      <Link to={"#"} className="btn btn-primary btn-sm ms-1" data-bs-toggle="offcanvas"
                        onClick={() => elemento1.current.showVentaModal()} // Cambiado
                      >+ Agregar Venta</Link>
                      )}
                      {idVentaRecuperado !== null && (
                        <Link
                          to={"#"}
                          className="btn btn-primary btn-sm ms-1"
                          data-bs-toggle="offcanvas"
                          onClick={() => elemento.current.showDetalleModal()}
                        >
                          + Agregar Producto
                        </Link>
                      )}
                      <CSVLink {...csvlink} className="btn btn-primary light btn-sm me-1">
                        <i className="fa-solid fa-file-excel" /> {" "}
                        Generar Factura
                      </CSVLink>
                    </div>
                  </div>
                  <div id="employee-tbl_wrapper" className="dataTables_wrapper no-footer">
                    <table id="empoloyees-tblwrapper" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                      <thead>
                        <tr>
                          <th>ID Detalle</th>
                          <th>Cantidad</th>
                          <th>Subtotal</th>
                          <th>ID Venta</th>
                          <th>ID Inventario</th>
                          <th>ID Lote</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detalles
                        .filter((dato) => dato.Idventa === idVentaRecuperado)
                        .map((dato) => (
                          <tr key={dato.IdDetalle}>
                            <td>{dato.IdDetalle}</td>
                            <td>{dato.Cantidad}</td>
                            <td>{dato.subTotal}</td>
                            <td>{dato.Idventa}</td>
                            <td>{dato.IdInventario}</td>
                            <td>{dato.IDLote}</td>
                            <div>
                              <button onClick={() => deleteDetalle(dato)} className='btn btn-danger'>Eliminar</button>
                            </div>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="d-sm-flex text-center justify-content-between align-items-center">
                      <div className='dataTables_info'>
                        Showing {lastIndex - recordsPage + 1} to{" "}
                        {detalles.length < lastIndex ? detalles.length : lastIndex}
                        {" "}of {detalles.length} entries
                      </div>
                      <div
                        className="dataTables_paginate paging_simple_numbers justify-content-center"
                        id="example2_paginate"
                      >
                        <Link
                          className="paginate_button previous disabled"
                          to="#"
                          onClick={prePage}
                        >
                          <i className="fa-solid fa-angle-left" />
                        </Link>
                        <span>
                          {number.map((n, i) => (
                            <Link className={`paginate_button ${currentPage === n ? 'current' : ''} `} key={i}
                              onClick={() => changeCPage(n)}
                            >
                              {n}
                            </Link>
                          ))}
                        </span>
                        <Link
                          className="paginate_button next"
                          to="#"
                          onClick={nextPage}
                        >
                          <i className="fa-solid fa-angle-right" />
                        </Link>
                      </div>
                    </div>
                    {idVentaRecuperado !== null && (
                    <div className="text-center" >
                      <button type="submit" className="btn btn-primary me-1" onClick={() => confirmarVenta()}>Confirmar</button>
                      <button type="button" className="btn btn-danger light ms-1" onClick={() => cancelarVenta()}
                      ref={elemento1} reloadDetalle={reloadDetalle}>Cancelar</button>
                      <br />
                      <label></label>
                    </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <VentaCreate
        ref={elemento}
        Title="Add Inventario"
        reloadDetalle={reloadDetalle} // Cambiado
      />
      <VentaCreate1
        ref={elemento1}
        reloadDetalle={reloadDetalle} // Cambiado
      />
    </>
  );
};
export default CompVentaShow;