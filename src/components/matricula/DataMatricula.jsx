import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import useMatricula from "../../hooks/useMatricula";

// const formatDate = (date) => {
//   const part = date.split(" / ");
//   return `${part[2]}-${part[1]}-${part[0]}`;
// };

export const columnsMatricula = ({ updateStateMatricula }) => {
  const { bloqueo_periodo_actual } = useMatricula();

  return [
    {
      name: "Matrícula",
      selector: (row) => row.matricula,
      width: "110px",
      center: true,
    },
    {
      name: "Rut",
      selector: (row) => row.rut,
      width: "130px",
    },

    {
      name: "Ap. paterno",
      selector: (row) => row.paterno,
      width: "140px",
    },
    {
      name: "Ap. materno",
      selector: (row) => row.materno,
      width: "140px",
    },
    {
      name: "Nombres",
      selector: (row) => row.nombres,
      width: "280px",
    },
    {
      name: "Curso",
      selector: (row) => row.curso,
      width: "80px",
      center: true,
    },
    {
      name: "Estado",
      cell: (row) => (
        <span
          className={`p-2 border hover:shadow-md rounded-md
          ${row.estado === "ACTIVO(A)" && "border-blue-500  text-blue-500"}`}
        >
          {row.estado}
        </span>
      ),
      width: "140px",
      center: true,
    },
    {
      name: "Acciones",
      center: true,
      grow: 2,
      cell: (row) => (
        <div className="flex gap-4">
          {/* boton para descargar certificado */}
          <button
            className="rounded-full p-1 transition-all duration-300 text-blue-500 
            hover:bg-blue-500 hover:text-white shadow-sm"
          >
            <DownloadIcon sx={{ fontSize: 26 }} />
          </button>

          {/* boton para editar una matricula */}
          <button
            onClick={() => {
              updateStateMatricula({
                stateModal: true,
                newMatricula: false,
                idMatricula: row.id
                // dataMatricula: {
                //   id_matricula: row.id,
                //   numero_matricula: row.matricula,
                //   fecha_matricula: formatDate(row.fecha_matricula),
                //   grado: row.curso,
                //   rut_estudiante: row.rut.slice(0, row.rut.length - 2),
                //   dv_rut_estudiante: row.rut.slice(-1),
                //   nombres_estudiante: row.nombres,
                //   rut_titular: row.rut_titular
                //     ? row.rut_titular.slice(0, row.rut_titular.length - 2)
                //     : null,
                //   dv_rut_titular: row.rut_titular
                //     ? row.rut_titular.slice(-1)
                //     : null,
                //   nombres_titular: row.nombres_titular,
                //   rut_suplente: row.rut_suplente
                //     ? row.rut_suplente.slice(0, row.rut_suplente.length - 2)
                //     : null,
                //   dv_rut_suplente: row.rut_suplente
                //     ? row.rut_suplente.slice(-1)
                //     : null,
                // },
              });
            }}
            disabled={bloqueo_periodo_actual}
            className={`rounded-full p-1 transition-all duration-300 shadow-sm hover:text-white
            ${
              bloqueo_periodo_actual
                ? "text-gray-500 hover:bg-gray-700"
                : "text-green-500 hover:bg-green-500"
            }`}
          >
            <EditIcon sx={{ fontSize: 26 }} />
          </button>

          {/* boton para suspender una matricula */}
          <button
            onClick={() => console.log("suspender matricula")}
            disabled={bloqueo_periodo_actual}
            className={`rounded-full p-1 transition-all duration-300 shadow-sm hover:text-white
            ${
              bloqueo_periodo_actual
                ? "text-gray-500 hover:bg-gray-700"
                : "text-red-500 hover:bg-red-500"
            }`}
          >
            <ExitToAppIcon sx={{ fontSize: 26 }} />
          </button>
        </div>
      ),
    },
  ];
};
