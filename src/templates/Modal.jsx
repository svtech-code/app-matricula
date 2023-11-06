import CloseIcon from "@mui/icons-material/Close";

import { useEffect, useState } from "react";
import ErrorHandler from "../components/ErrorHandler";
import apiGet from "../api/apiGet";

const Modal = ({ children, stateModal, onCloseModal, title }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (stateModal) {
      apiGet({ route: "validateSession" }).catch((error) => setError(error));
    }
  }, [stateModal]);

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center transition-colors z-40 duration-300
        ${stateModal ? "visible bg-black/50" : "invisible"}`}
    >
      <div
        className={`bg-white rounded-xl shadow transition-all duration-300 
            w-[70%] h-[70%] max-h-[37rem] min-h-[37rem] min-w-[20rem] max-w-[50rem] relative flex flex-col
            ${stateModal ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
      >
        <header className="relative w-full bg-blue-500 rounded-xl flex items-center justify-between p-4 scale-[102%]">
          <span className="text-white text-base md:text-lg font-semibold transition-all duration-300">
            {title}
          </span>
          <button
            onClick={onCloseModal}
            className={`relative p-2 rounded-full w-11 h-11 flex justify-center items-center bg-white text-dark transition-all duration-200
                hover:text-white hover:bg-red-400 hover:shadow-md hover:shadow-white`}
          >
            <span className="flex justify-center items-center">
              <CloseIcon sx={{ fontSize: 25 }} />
            </span>
          </button>
        </header>

        <main className="relative p-4 flex-grow max-h-[36rem] overflow-y-auto">
          {children}
        </main>
      </div>

      <ErrorHandler error={error} />
    </div>
  );
};

export default Modal;