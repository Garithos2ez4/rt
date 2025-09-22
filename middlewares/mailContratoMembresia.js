const dayjs = require("dayjs");
const { Distritos } = require("../models/Distritos");
const { Parametros } = require("../models/Parametros");
const { Cliente, Empleado } = require("../models/Usuarios");
const { mailMembresiaSTRING } = require("./mails");
const { FormatMoney } = require("../helpers/formatMoney");
const env = process.env;

function calcularEdad(fecha_nac) {
  const hoy = dayjs();
  const fechaNacimiento = dayjs(fecha_nac);
  const edad = hoy.diff(fechaNacimiento, "year");
  return edad;
}
const mailContratoMembresia = async (
  pdfContrato,
  detalle_membresia,
  dataVenta,
  dataPago,
  id_venta
) => {
  const {
    semanas,
    firmaCli,
    nutric,
    cong,
    time_h,
    id_pgm,
    name_pgm,
    fechaInicio_programa,
    fechaFinal,
    tarifa,
  } = detalle_membresia;
  const fecha_Venta = new Date();
  const { id_empl, id_cli, id_origen, id_tipo_transaccion, numero_transac } =
    dataVenta;
  console.log(dataVenta);

  const data_cliente = await Cliente.findOne({
    where: { flag: true, id_cli: id_cli },
  });
  const data_empl = await Empleado.findOne({
    where: { flag: true, id_empl: id_empl },
  });
  const data_Distrito = await Distritos.findOne({
    where: { flag: true, ubigeo: data_cliente.ubigeo_distrito_cli },
  });
  const data_origen = await Parametros.findOne({
    where: { flag: true, id_param: id_origen },
  });
  const data_comprobante = await Parametros.findOne({
    where: { flag: true, id_param: id_tipo_transaccion },
  });
  const dataInfo = {
    id_cli: id_cli,
    nombresCliente: data_cliente.nombre_cli,
    apPaternoCliente: data_cliente.apPaterno_cli,
    apMaternoCliente: data_cliente.apMaterno_cli,
    dni: `${data_cliente.numDoc_cli}`,
    DireccionCliente: data_cliente.direccion_cli,
    PaisCliente: "Peru",
    CargoCliente: data_cliente.cargo_cli,
    EmailCliente: data_cliente.email_cli,
    EdadCliente: `${calcularEdad(data_cliente.fecha_nacimiento)}`,
    DistritoCliente: data_Distrito.distrito,
    FechaDeNacimientoCliente: `${dayjs(data_cliente.fecha_nacimiento).format(
      "DD/MM/YYYY"
    )}`,
    CentroDeTrabajoCliente: data_cliente.trabajo_cli,
    origenCliente: `${data_origen?.label_param}`,
    sede: "Miraflores",
    nContrato: id_venta,
    codigoSocio: id_cli,
    fecha_venta: `${dayjs(fecha_Venta).locale("es").format("DD/MM/YYYY")}`,
    hora_venta: `${dayjs(fecha_Venta).locale("es").format("hh:mm:ss A")}`,
    //datos de membresia
    id_pgm: `${id_pgm}`,
    Programa: name_pgm,
    fec_inicio: `${dayjs(fechaInicio_programa, "YYYY-MM-DD").format(
      "DD/MM/YYYY"
    )}`,
    fec_fin: `${dayjs(fechaFinal, "YYYY-MM-DD").format("DD/MM/YYYY")}`,
    horario: time_h,
    semanas: semanas,
    tipo_comprobante: `${data_comprobante?.label_param}`,
    n_comprobante: `${numero_transac}`,
    dias_cong: `${cong}`,
    sesiones_nutricion: `${nutric}`,
    asesor: `${data_empl.nombre_empl.split(" ")[0]}`,
    forma_pago: dataPago?.map((item) => {
      if (item.id_forma_pago === 597) {
        return `${item.label_tipo_tarjeta?.split(" ")[1]} ${item.label_banco}`;
      } else {
        return item.label_forma_pago;
      }
    }),
    monto: `${FormatMoney(tarifa, "S/. ")}`,
    //Firma
    firma_cli: firmaCli,
  };

  try {
    return true;
  } catch (error) {
    console.log(error, "en mail");
    return false;
  }
};

module.exports = {
  mailContratoMembresia,
};

/*
    const {
      semanas,
      firmaCli,
      nutric,
      cong,
      time_h,
      id_pgm,
      name_pgm,
      fechaInicio_programa,
      fechaFinal,
      tarifa,
    } = detalle_membresia;
    const fecha_Venta = new Date();
    const { id_empl, id_cli, id_venta, id_origen } = dataVenta;

    const data_cliente = await Cliente.findOne({
      where: { flag: true, id_cli: id_cli },
    });
    const data_empl = await Empleado.findOne({
      where: { flag: true, id_empl: id_empl },
    });
    const data_Distrito = await Distritos.findOne({
      where: { flag: true, ubigeo: data_cliente.ubigeo_distrito_cli },
    });
    const data_origen = await Parametros.findOne({
      where: { flag: true, id_param: id_origen },
    });
    const dataInfo = {
      nombresCliente: data_cliente.nombre_cli,
      apPaternoCliente: data_cliente.apPaterno_cli,
      apMaternoCliente: data_cliente.apMaterno_cli,
      dni: `${data_cliente.numDoc_cli}`,
      DireccionCliente: data_cliente.direccion_cli,
      PaisCliente: "Peru",
      CargoCliente: data_cliente.cargo_cli,
      EmailCliente: data_cliente.email_cli,
      EdadCliente: `${calcularEdad(data_cliente.fecNac_cli)}`,
      DistritoCliente: data_Distrito.distrito,
      FechaDeNacimientoCliente: `${dayjs(data_cliente.fecNac_cli).format(
        "DD/MM/YYYY"
      )}`,
      CentroDeTrabajoCliente: data_cliente.trabajo_cli,
      origenCliente: `${data_origen?.label_param}`,
      sede: "Miraflores",
      nContrato: id_venta,
      codigoSocio: id_cli,
      fecha_venta: `${dayjs(fecha_Venta).locale("es").format("DD/MM/YYYY")}`,
      hora_venta: `${dayjs(fecha_Venta).locale("es").format("hh:mm:ss A")}`,
      //datos de membresia
      id_pgm: `${id_pgm}`,
      Programa: name_pgm,
      fec_inicio: `${dayjs(fechaInicio_programa, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      )}`,
      fec_fin: `${dayjs(fechaFinal, "YYYY-MM-DD").format("DD/MM/YYYY")}`,
      horario: time_h,
      semanas: semanas,
      dias_cong: `${cong}`,
      sesiones_nutricion: `${nutric}`,
      asesor: `${data_empl.nombre_empl.split(" ")[0]}`,
      forma_pago: dataPago?.map((item) => {
        if (item.id_forma_pago === 597) {
          return `${item.label_tipo_tarjeta?.split(" ")[1]} ${
            item.label_banco
          }`;
        } else {
          return item.label_forma_pago;
        }
      }),
      monto: `${FormatMoney(tarifa, "S/. ")}`,
      //Firma
      firma_cli: firmaCli,
    };
*/
