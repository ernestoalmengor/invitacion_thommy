import React, { useState, useEffect } from "react";
import {
  Users,
  Copy,
  CheckCircle,
  Clock,
  UserCheck,
  Users as UsersIcon,
  Baby,
  ArrowLeft,
} from "lucide-react";

const Admin = () => {
  const [invitados, setInvitados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // La URL del Apps Script que procesa los datos
  const urlAppScript =
    "https://script.google.com/macros/s/AKfycbyrgSPSWgRw5ESsb9GnHwK-oa4_90Oqeh6PUv2mnprFeLH8iXaGxk9yFV99MExy42Eyvg/exec";

  useEffect(() => {
    const fetchInvitados = async () => {
      try {
        const response = await fetch(`${urlAppScript}?action=getGuests`);
        if (!response.ok) {
          throw new Error("Error en la petición");
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setInvitados(data);
        } else if (data && data.error) {
          throw new Error(data.error);
        } else {
          throw new Error(
            "La respuesta del servidor no tiene el formato correcto.",
          );
        }
      } catch (err) {
        setError(
          `Error al cargar: ${err.message}. Asegúrate de haber actualizado e implementado el código en Google Apps Script.`,
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitados();
  }, []);

  const handleCopyLink = (invitado) => {
    const currentUrl = window.location.href.split("#")[0].split("?")[0];
    const link = `${currentUrl}?id=${invitado.id}`;

    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert(`Enlace copiado para: ${invitado.nombre}\n\nLink: ${link}`);
      })
      .catch((err) => {
        console.error("No se pudo copiar el texto: ", err);
        prompt("Copia el siguiente enlace manualmente:", link);
      });
  };

  // --- CÁLCULOS DEL DASHBOARD ---
  const totalInvitaciones = invitados.length;
  const invitacionesPendientes = invitados.filter((i) => !i.confirmado).length;
  const invitacionesConfirmadas = invitados.filter((i) => i.confirmado).length;

  const totalAdultosAsignados = invitados.reduce(
    (acc, i) => acc + (parseInt(i.adultos_max) || 0),
    0,
  );
  const totalNinosAsignados = invitados.reduce(
    (acc, i) => acc + (parseInt(i.ninos_max) || 0),
    0,
  );

  const totalAdultosConfirmados = invitados.reduce(
    (acc, i) => acc + (i.confirmado ? parseInt(i.adultos_conf) || 0 : 0),
    0,
  );
  const totalNinosConfirmados = invitados.reduce(
    (acc, i) => acc + (i.confirmado ? parseInt(i.ninos_conf) || 0 : 0),
    0,
  );

  const totalPersonasConfirmadas =
    totalAdultosConfirmados + totalNinosConfirmados;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <Users className="w-5 h-5 md:w-7 md:h-7 text-blue-500" />
            <h1 className="text-lg md:text-2xl font-bold text-slate-800">
              Panel de Administración
            </h1>
          </div>
          <a
            href="#/"
            className="flex items-center gap-1.5 text-[10px] md:text-sm text-slate-600 hover:text-blue-600 transition-colors bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm border border-slate-200 font-bold active:scale-95"
          >
            <ArrowLeft size={14} className="md:w-4 md:h-4" />{" "}
            <span className="hidden md:inline">Regresar a la</span> Invitación
          </a>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-500">Cargando invitados...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100 text-center">
            {error}
          </div>
        ) : (
          <>
            {/* MINI DASHBOARD */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 mb-6">
              <div className="bg-white p-2 md:p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
                <p className="text-[10px] md:text-sm text-slate-500 font-semibold uppercase mb-1">
                  Total Invitaciones
                </p>
                <p className="text-xl md:text-3xl font-black text-slate-800">
                  {totalInvitaciones}
                </p>
                <p className="text-[9px] md:text-xs text-slate-400 mt-1">
                  {invitacionesConfirmadas} confirmadas
                </p>
              </div>
              <div className="bg-white p-2 md:p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
                <p className="text-[10px] md:text-sm text-slate-500 font-semibold uppercase mb-1">
                  Invitados total
                </p>
                <p className="text-xl md:text-3xl font-black text-blue-600">
                  {totalAdultosAsignados + totalNinosAsignados}
                </p>
                <p className="text-[9px] md:text-xs text-slate-400 mt-1">
                  {totalAdultosAsignados} A - {totalNinosAsignados} N
                </p>
              </div>
              <div className="bg-white p-2 md:p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
                <UserCheck className="text-green-500 w-5 h-5 md:w-6 md:h-6 mb-1" />
                <p className="text-[10px] md:text-sm text-slate-500 font-semibold uppercase mb-1">
                  Asistirán (Total)
                </p>
                <p className="text-xl md:text-3xl font-black text-green-600">
                  {totalPersonasConfirmadas}
                </p>
              </div>
              <div className="bg-white p-2 md:p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
                <UsersIcon className="text-indigo-500 w-5 h-5 md:w-6 md:h-6 mb-1" />
                <p className="text-[10px] md:text-sm text-slate-500 font-semibold uppercase mb-1">
                  Adultos Conf.
                </p>
                <p className="text-xl md:text-3xl font-black text-indigo-600">
                  {totalAdultosConfirmados}
                </p>
              </div>
              <div className="bg-white p-2 md:p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
                <Baby className="text-pink-500 w-5 h-5 md:w-6 md:h-6 mb-1" />
                <p className="text-[10px] md:text-sm text-slate-500 font-semibold uppercase mb-1">
                  Niños Conf.
                </p>
                <p className="text-xl md:text-3xl font-black text-pink-600">
                  {totalNinosConfirmados}
                </p>
              </div>
              <div className="col-span-1 md:col-span-5 bg-orange-50 p-2 md:p-4 rounded-xl shadow-sm border border-orange-100 flex flex-col md:flex-row justify-center items-center text-center md:gap-3">
                <Clock className="text-orange-500 w-5 h-5 md:w-6 md:h-6 mb-1 md:mb-0" />
                <div>
                  <p className="text-[10px] md:text-sm text-orange-700 font-bold uppercase mb-0.5 md:mb-0">
                    Faltan por confirmar
                  </p>
                  <p className="text-xl md:text-xl font-black text-orange-600">
                    {invitacionesPendientes} invitaciones
                  </p>
                </div>
              </div>
            </div>

            {/* TABLA - TODAS LAS VISTAS */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px] md:min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] md:text-sm uppercase md:capitalize">
                      <th className="p-2 md:p-4 font-semibold">ID</th>
                      <th className="p-2 md:p-4 font-semibold">Invitado</th>
                      <th className="p-2 md:p-4 font-semibold text-center leading-tight">
                        Asignados
                        <br />
                        <span className="text-[9px] md:text-xs font-normal">
                          (A - N)
                        </span>
                      </th>
                      <th className="p-2 md:p-4 font-semibold text-center leading-tight">
                        Adultos
                        <br />
                        <span className="text-[9px] md:text-xs font-normal">
                          Conf.
                        </span>
                      </th>
                      <th className="p-2 md:p-4 font-semibold text-center leading-tight">
                        Niños
                        <br />
                        <span className="text-[9px] md:text-xs font-normal">
                          Conf.
                        </span>
                      </th>
                      <th className="p-2 md:p-4 font-semibold text-center">
                        Estado
                      </th>
                      <th className="p-2 md:p-4 font-semibold text-center">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitados.map((invitado) => {
                      const haConfirmado = invitado.confirmado;

                      return (
                        <tr
                          key={invitado.id}
                          className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="p-2 md:p-4 text-slate-500 font-medium text-xs md:text-base">
                            #{invitado.id}
                          </td>
                          <td className="p-2 md:p-4 font-bold text-slate-700 text-xs md:text-base">
                            {invitado.nombre}
                          </td>
                          <td className="p-2 md:p-4 text-center">
                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 md:px-3 md:py-1 rounded-full font-bold text-[10px] md:text-sm inline-block">
                              {invitado.adultos_max}A
                              {invitado.ninos_max > 0
                                ? ` / ${invitado.ninos_max}N`
                                : ""}
                            </span>
                          </td>
                          <td className="p-2 md:p-4 text-center">
                            {haConfirmado ? (
                              <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 md:px-3 md:py-1 rounded-full font-bold text-[10px] md:text-sm inline-block">
                                {invitado.adultos_conf}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs">-</span>
                            )}
                          </td>
                          <td className="p-2 md:p-4 text-center">
                            {haConfirmado ? (
                              invitado.ninos_max > 0 ? (
                                <span className="bg-pink-50 text-pink-600 px-2 py-0.5 md:px-3 md:py-1 rounded-full font-bold text-[10px] md:text-sm inline-block">
                                  {invitado.ninos_conf}
                                </span>
                              ) : (
                                <span className="text-slate-300 text-xs">
                                  -
                                </span>
                              )
                            ) : (
                              <span className="text-slate-400 text-xs">-</span>
                            )}
                          </td>
                          <td className="p-2 md:p-4 text-center">
                            {haConfirmado ? (
                              <div className="flex items-center justify-center gap-1 text-green-500 text-[10px] md:text-sm font-bold">
                                <CheckCircle
                                  size={14}
                                  className="md:w-4 md:h-4"
                                />{" "}
                                Conf.
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1 text-orange-400 text-[10px] md:text-sm font-bold">
                                <Clock size={14} className="md:w-4 md:h-4" />{" "}
                                Pend.
                              </div>
                            )}
                          </td>
                          <td className="p-2 md:p-4 text-center">
                            <button
                              onClick={() => handleCopyLink(invitado)}
                              className="inline-flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold transition-all active:scale-95 shadow-md whitespace-nowrap"
                            >
                              <Copy size={12} className="md:w-4 md:h-4" />{" "}
                              <span className="hidden md:inline">
                                Copiar Link
                              </span>
                              <span className="md:hidden">Copiar</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {invitados.length === 0 && (
                  <div className="p-12 text-center text-slate-500">
                    No se encontraron invitados en la hoja de cálculo.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
