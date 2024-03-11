import Swal from "sweetalert2";
import apiPut from "../../api/apiPut";
import useAuth from "../../hooks/useAuth";
import useCourse from "../../hooks/useCourse";
import { getDateStringFormat } from "../../utils/funciones";

const SelectCourse = ({ idMatricula, grado, value, estado }) => {
  const { authPeriodo, authClassStartDate, updateAuthProvider } = useAuth();
  const { course, filterCourseContex, listCourseForGrade, updateDataCourse } =
    useCourse();

  // datos para trabajar fecha de asignacion de curso
  const currentDate = new Date(getDateStringFormat(new Date()));
  const classStartDate = new Date(authClassStartDate);

  // función para obtener la lista de cursos según el grado
  const listLetter = (grade) => {
    const list = listCourseForGrade.find((item) => item.grado === grade);

    if (grade) {
      const arrayLetter = JSON.parse(list?.letra);
      arrayLetter.unshift("---");
      return arrayLetter;
    }

    return [];
  };

  // asignación de la lista de elementos para el select
  const selectLetter = listLetter(grado) || [];

  // función para actualizar array de course y filtro con nuevas letras de curso
  const updatedArray = ({ dataArray, letter, numberList, dateString }) => {
    const newArray = dataArray.map((item) => {
      if (item.id === idMatricula) {
        return {
          ...item,
          curso: letter,
          n_lista: numberList,
          fecha_alta: dateString,
        };
      }
      return item;
    });

    return newArray;
  };

  // función onchange para manejar la logica al cambiar la letra dentro de un grado
  const handleChange = async (selectedLetter) => {
    // comprobar estado de la matricula, para poder hacer la asignación o cambio
    if (estado === "RETIRADO (A)") {
      updateAuthProvider({
        error: { message: "Advertencia: Estudiante retirado !" },
      });
      return;
    }

    // variable para la fecha de la asignación de curso
    let dateOfAssignment;

    // condición para manejar solicitud de fecha de asignación
    if (classStartDate > currentDate) {
      // La asignación de curso se hace con la fecha de inicio de clases
      dateOfAssignment = getDateStringFormat(classStartDate);
    } else {
      // Texto informativo para la asignación de fecha
      const dateAssignmentText = !value ? "asignación" : "cambio";

      // modal para solicitar fecha de asignacion
      const { value: date } = await Swal.fire({
        title: `Fecha de ${dateAssignmentText}`,
        input: "date",
        showCancelButton: true,
        confirmButtonText: "Asignar",
        cancelButtonText: "Cancelar",
        width: 350,
        allowOutsideClick: false,
        preConfirm: (value) => {
          if (!value) {
            Swal.showValidationMessage("Seleccionar fecha válida!");
          }
        },
        customClass: {
          input: "input-date", // clase personalizada desde main.css
        },
      });

      // cancelacion de la asignación de fecha y curso
      if (!date) return;

      // asignación de la fecha ingresada
      dateOfAssignment = date.replace(/-/g, "/");
    }

    // petición put
    apiPut({
      route: "course/updateLetterCourse",
      object: {
        idMatricula: idMatricula,
        curso: selectedLetter,
        periodo: authPeriodo,
        fechaAlta: dateOfAssignment,
      },
    }).then((response) => {
      const cursoAsignado = response?.data?.curso;
      const numeroListaAsignado = response?.data?.numero_lista ?? "-";

      // actualización del array del sistema
      updateDataCourse({
        course: updatedArray({
          dataArray: course,
          letter: selectedLetter,
          numberList: numeroListaAsignado,
          dateString: getDateStringFormat(new Date(dateOfAssignment), true),
        }),
        filterCourseContex: updatedArray({
          dataArray: filterCourseContex,
          letter: selectedLetter,
          numberList: numeroListaAsignado,
          dateString: getDateStringFormat(new Date(dateOfAssignment), true),
        }),
      });

      // texto a mostrar en el toast
      const textTitle = `Estudiante ${
        !value ? "asignado" : "cambiado"
      } al ${cursoAsignado}`;
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: textTitle,
      });
    });
  };

  return (
    <select
      className="relative border rounded-md px-2 py-1 hover:bg-gray-300 
        focus:outline-none tracking-wider"
      value={value || "---"}
      onChange={(e) => handleChange(e.target.value)}
    >
      {selectLetter.map((course, index) => (
        <option key={index} value={course}>
          {course}
        </option>
      ))}
    </select>
  );
};

export default SelectCourse;
