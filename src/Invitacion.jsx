import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Cake,
  Music,
  VolumeX,
  MailOpen,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  PartyPopper,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useSearchParams } from "react-router-dom";

const Invitacion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [timeLeft, setTimeLeft] = useState({});
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) => console.log("Audio error:", e));
      }
    }
  }, [isMuted]);

  // Usamos URLSearchParams nativo para evitar problemas con react-router
  const searchParams = new URLSearchParams(window.location.search);
  const idInvitado = searchParams.get("id") || "";

  // NUEVOS ESTADOS PARA EL FORMULARIO
  const [showForm, setShowForm] = useState(false);
  const [invitadoData, setInvitadoData] = useState(null);
  const [adultosConfirmados, setAdultosConfirmados] = useState(0);
  const [ninosConfirmados, setNinosConfirmados] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [yaConfirmo, setYaConfirmo] = useState(false);
  const [comprobandoStatus, setComprobandoStatus] = useState(!!idInvitado);

  // Cambia aqui la fecha y hora del contador: "AAAA-MM-DDTHH:mm:ss"
  const fechaEvento = new Date("2026-08-16T15:00:00");
  const fotos = ["./1.jpg", "./2.jpeg", "./3.jpeg", "./4.jpeg", "./5.jpeg", "./6.jpeg", "./7.jpeg"];
  const marioSizeClass = "w-[130px] md:w-[180px]";
  const marioPositionClass = "left-[15px] md:left-[35px]";
  const marioluiguiSizeClass = "w-[180px] md:w-[180px]";
  const marioluiguiPositionClass =
    "left-[180px] md:left-[35px] top-[-150px] md:top-[-30px]";

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = fechaEvento - now;
      if (difference > 0) {
        setTimeLeft({
          días: Math.floor(difference / (1000 * 60 * 60 * 24)),
          horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
          min: Math.floor((difference / (1000 * 60)) % 60),
          seg: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    const handleScroll = () => {
      setShowScrollUp(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (idInvitado) {
      const urlAppScript =
        "https://script.google.com/macros/s/AKfycbyrgSPSWgRw5ESsb9GnHwK-oa4_90Oqeh6PUv2mnprFeLH8iXaGxk9yFV99MExy42Eyvg/exec";
      fetch(`${urlAppScript}?id=${idInvitado}`)
        .then((res) => res.json())
        .then((response) => {
          if (response.success && response.data) {
            setInvitadoData(response.data);
            if (response.data.confirmado) {
              setYaConfirmo(true);
            }
            setAdultosConfirmados(response.data.adultos_max || 0);
            setNinosConfirmados(response.data.ninos_max || 0);
          }
        })
        .catch((err) => console.error("Error al obtener estado:", err))
        .finally(() => setComprobandoStatus(false));
    }
  }, [idInvitado]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMuted(false);
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.7 },
      colors: ["#4ade80", "#38bdf8", "#fa2415ff"],
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmar = async () => {
    if (!invitadoData) return;
    if (adultosConfirmados > invitadoData.adultos_max) {
      alert(
        `La cantidad de adultos asignados es de ${invitadoData.adultos_max}`,
      );
      return;
    }
    if (ninosConfirmados > invitadoData.ninos_max) {
      alert(`La cantidad de niños asignados es de ${invitadoData.ninos_max}`);
      return;
    }
    setEnviando(true);
    const urlAppScript =
      "https://script.google.com/macros/s/AKfycbyrgSPSWgRw5ESsb9GnHwK-oa4_90Oqeh6PUv2mnprFeLH8iXaGxk9yFV99MExy42Eyvg/exec";

    try {
      await fetch(urlAppScript, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          id: idInvitado,
          adultos_confirmados: adultosConfirmados,
          ninos_confirmados: ninosConfirmados,
        }),
      });
      alert("¡Asistencia confirmada! Gracias.");
      setYaConfirmo(true);
      setShowForm(false);
    } catch (error) {
      alert("Hubo un error al confirmar.");
    }
    setEnviando(false);
  };

  return (
    <div className="min-h-screen text-slate-800 antialiased overflow-x-hidden">
      <audio ref={audioRef} src="./Super Mario Bros.mp3" loop />
      {/* SECCIÓN 0: SOBRE INICIAL */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            exit={{ y: -1000, opacity: 0, transition: { duration: 1 } }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-green-100 bg-cover bg-center bg-no-repeat p-4"
            style={{ backgroundImage: "url('./fondo2.webp')" }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="bg-white/15 backdrop-blur-sm p-10 rounded-3xl shadow-xl text-center max-w-sm border border-white/30 relative overflow-hidden"
            >
              <img
                src="./toad.webp"
                className="absolute top-0 left-0 w-40 h-40 object-contain z-0 -translate-x-10 "
              />
              <img
                src="./yoshi.webp"
                className="absolute bottom-1 right-[-12px] w-32 h-32 object-contain z-20 pointer-events-none "
              />
              <div className="relative z-10">
                <img
                  src="./cumple.webp"
                  alt="Es mi cumpleanos"
                  className="mx-auto mb-6 w-[220px] max-w-full object-contain drop-shadow-xl"
                />

                <button
                  onClick={handleOpen}
                  className="bg-blue-400 hover:bg-blue-500 text-white text-xl px-12 py-4 rounded-full font-black shadow-lg transition-all"
                >
                  Toca para abrir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5 } }}
        >
          {/* BOTONES FLOTANTES */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="fixed bottom-5 right-5 z-40 bg-white/90 p-4 rounded-full shadow-lg backdrop-blur-sm border border-green-100 text-green-600"
          >
            {isMuted ? (
              <VolumeX size={28} />
            ) : (
              <Music className="animate-pulse" size={28} />
            )}
          </button>

          {showScrollUp && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-5 left-5 z-40 bg-blue-400 p-4 rounded-full shadow-lg text-white"
            >
              <ArrowUp size={28} />
            </button>
          )}

          {/* SECCIÓN 1: HERO & CONTEO */}
          <section
            className="min-h-screen flex flex-col items-center justify-start md:justify-center text-center p-4 pt-12 md:p-6 bg-green-100 bg-cover bg-center bg-no-repeat relative overflow-hidden"
            style={{ backgroundImage: "url('./fondo1.webp')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/15 to-black/15 pointer-events-none z-0" />
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="w-full max-w-2xl relative z-10"
            >
              <span className="text-lg md:text-2xl font-semibold text-blue-900 bg-white/70 px-4 py-1 md:px-6 md:py-2 rounded-full shadow-inner border border-white">
                ¡Hermanos Croy Almengor!
              </span>
              <img
                src="./thomas.webp"
                alt="Thomas"
                className="mx-auto my-[-10px] md:my-7 w-[350px] max-w-full md:w-[420px] object-contain drop-shadow-2xl"
              />
              <div className="relative flex items-center justify-center h-[190px] md:h-[350px] mt-12">
                <motion.img
                  src="./mario.webp"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`${marioSizeClass} object-contain z-0 translate-y-8 md:translate-y-16`}
                />
              </div>

              <div className="flex flex-col items-center mt-12 md:mt-12 z-10 relative">
                <p className="text-2xl md:text-4xl font-black text-white text-center z-10">
                  Mis padres
                </p>
                <img
                  src="./parents.webp"
                  alt="William y Joselyn"
                  className="w-[300px] md:w-[350px] object-contain -mt-1 -mb-1 z-0 drop-shadow-xl relative"
                />
                <div className="flex flex-col items-center mt-0 gap-2 z-10 relative">
                  <p className="text-2xl md:text-4xl font-black text-white text-center">
                    te invitan a celebrar mi
                  </p>
                  <div className="flex items-center justify-center gap-2 md:gap-3 -mt-2">
                    <img
                      src="./a.webp"
                      alt="1er"
                      className="w-[70px] md:w-[120px] object-contain drop-shadow-xl"
                    />
                    <p className="text-3xl md:text-5xl font-black text-white">
                      añito.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* SECCIÓN 3: UBICACIÓN */}
          <section className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={sectionVariants}
              className="max-w-4xl w-full text-center relative z-10"
            >
              <div className="flex items-center justify-center gap-3 mb-10">
                <PartyPopper
                  size={38}
                  className="text-blue-500 animate-bounce"
                />
                <h2 className="text-2xl md:text-5xl font-black">
                  ¿Dónde es la fiesta?
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 items-stretch">
                <div className="bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-[35px] border-2 border-blue-200 shadow-xl flex flex-col items-center justify-center">
                  <h4 className="font-bold text-xl mb-3 text-blue-600 uppercase text-center">
                    Fecha y Hora
                  </h4>
                  <p className="text-2xl md:text-3xl font-black text-slate-800 text-center">
                    16 de Agosto, 2026
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-slate-600 mt-1 text-center">
                    11:00 AM
                  </p>

                  {/* CONTADOR EN LA CARD */}
                  <div className="w-full mt-6 flex flex-col items-center relative z-10">
                    <h5 className="text-lg md:text-xl font-black text-slate-700 mb-4 tracking-wide">
                      ¿Cuánto falta?
                    </h5>
                    <div className="flex justify-center gap-1 md:gap-2 w-full overflow-visible">
                      {Object.entries(timeLeft).map(([label, value], index) => (
                        <div
                          key={label}
                          className={`relative flex flex-col items-center justify-center w-[60px] h-[60px] md:w-[75px] md:h-[75px] rounded-full shadow-lg ${index % 4 === 0 ? "bg-green-400 text-white" : index % 3 === 0 ? "bg-red-400 text-white" : index % 2 === 0 ? "bg-yellow-400 text-white" : "bg-blue-400 text-white"} border-2 border-white`}
                        >
                          <span className="text-xl md:text-2xl font-black leading-none">
                            {String(value ?? 0).padStart(2, "0")}
                          </span>
                          <span className="text-[8px] md:text-[10px] font-black uppercase mt-1">
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-[35px] border-2 border-blue-200 shadow-xl flex flex-col items-center justify-center">
                  <h4 className="font-bold text-xl mb-3 text-blue-600 uppercase text-center">
                    Lugar de la fiesta
                  </h4>
                  <p className="text-2xl md:text-3xl font-black text-slate-800 text-center">
                    Finca la Azotea, Jocotenango
                  </p>
                  <p className="text-lg md:text-xl text-slate-600 italic text-center mt-2">
                    Presentar invitación
                  </p>
                  <a
                    href="https://maps.app.goo.gl/qUEZMsoCux7o9puj7"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-md active:scale-95 transition-all"
                  >
                    <MapPin size={18} className="inline mr-2" /> VER UBICACIÓN
                  </a>
                </div>
              </div>
            </motion.div>
          </section>

          {/* SECCIÓN 2: CALENDARIO Y ASISTENCIA */}
          <section
            className="min-h-screen flex items-center py-12 px-4 relative overflow-hidden"
            style={{
              backgroundImage: "url('./fondo2.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          >
            <div className="absolute inset-0 bg-blue-100/40 backdrop-blur-sm" />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={sectionVariants}
              className="max-w-5xl mx-auto w-full relative z-10 text-center"
            >
              <h2 className="text-2xl md:text-5xl font-black mb-8 text-slate-800 flex items-center justify-center gap-3">
                <Cake className="w-8 h-8 text-blue-600" /> ¡Es un placer
                invitarte!
              </h2>
              <div className="grid md:grid-cols-2 gap-2 items-center">
                <div className="flex items-center justify-center">
                  <img
                    src="./invit.webp"
                    alt="Invitacion"
                    className="w-full max-w-[300px] md:max-w-[460px] object-contain drop-shadow-2xl"
                  />
                </div>
                <div className="bg-white/95 p-8 rounded-3xl shadow-xl flex flex-col justify-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    Invitación para:
                  </h2>
                  <p className="text-lg text-slate-600 mb-3 italic">
                    {invitadoData ? invitadoData.nombre : "Cargando..."}
                  </p>
                  <p className="text-sm md:text-lg mb-6 leading-relaxed">
                    He reservado{" "}
                    <span className="text-xl md:text-2xl font-black text-green-600">
                      {invitadoData
                        ? invitadoData.ninos_max && invitadoData.ninos_max > 0
                          ? `${invitadoData.adultos_max} pases para adulto y ${invitadoData.ninos_max} para niño`
                          : `${invitadoData.adultos_max} pases para adulto`
                        : "..."}
                    </span>{" "}
                    para ti. Por favor, confirma tu asistencia.
                  </p>
                  {comprobandoStatus ? (
                    <div className="w-full text-center py-4 text-slate-500 italic font-medium">
                      Verificando estado...
                    </div>
                  ) : yaConfirmo ? (
                    <div className="w-full bg-green-100 text-green-700 font-black py-4 rounded-2xl text-center border-2 border-green-200 shadow-inner">
                      ¡Tu asistencia ya ha sido confirmada!
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowForm(true)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
                    >
                      Confirmar asistencia
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </section>

          {/* SECCIÓN 4: GALERÍA */}
          <section
            className="px-6 min-h-screen flex flex-col justify-center pt-10 pb-4 px-4 relative overflow-hidden"
            style={{
              backgroundImage: "url('./fondo1.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          >
            <div className="absolute inset-0 bg-black/20 z-0" />
            <h2 className="text-4xl md:text-6xl font-black text-white mb-2 text-center z-20">
              Mira cuanto he crecido
            </h2>
            <div className="max-w-md mx-auto relative w-full">
              <button
                onClick={() =>
                  setSliderIndex(
                    (prev) => (prev - 1 + fotos.length) % fotos.length,
                  )
                }
                className="absolute left-[-16px] md:-left-16 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-xl text-green-500 z-20 hover:scale-110 active:scale-95 transition-all border border-green-50"
              >
                <ChevronLeft size={28} />
              </button>
              <div className="overflow-hidden rounded-[10px] shadow-2xl aspect-[3/4] relative z-10 border-2 border-green-50">
                <AnimatePresence>
                  <motion.img
                    key={sliderIndex}
                    src={fotos[sliderIndex]}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
              </div>
              <button
                onClick={() =>
                  setSliderIndex((prev) => (prev + 1) % fotos.length)
                }
                className="absolute right-[-16px] md:-right-16 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-xl text-green-500 z-20 hover:scale-110 active:scale-95 transition-all border border-green-50"
              >
                <ChevronRight size={28} />
              </button>
            </div>
            <div className="relative flex items-center justify-center z-20  mt-4">
              <motion.img
                src="./marioluigui.webp"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`absolute ${marioluiguiPositionClass} ${marioluiguiSizeClass} object-contain z-0`}
              />
              <p className="text-white mt-4 text-center text-1xl md:text-5xl font-black">
                Eres importante para nuestra familia y queremos compartir
                contigo este momento. No olvides confiar asistencia.
              </p>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-6 text-center text-slate-400 text-base">
            <p className="text-[12px]">© 2026 Todos los derechos reservados</p>
            <p className="text-[12px]">
              Desarrollado con por{" "}
              <span className="font-bold text-green-500">Kevin Almengor</span>
            </p>
          </footer>
        </motion.main>
      )}

      {/* FORMULARIO MODAL*/}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">¿Cuántos asistirán?</h3>
            <div className="flex items-center justify-center gap-4 mb-4 mt-6">
              <div className="w-full">
                <p className="font-bold text-slate-700">
                  Adultos (Max {invitadoData?.adultos_max})
                </p>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <button
                    onClick={() =>
                      setAdultosConfirmados(Math.max(0, adultosConfirmados - 1))
                    }
                    className="w-10 h-10 rounded-full bg-slate-100 text-2xl font-bold"
                  >
                    -
                  </button>
                  <span className="text-4xl font-black text-green-600 w-12">
                    {adultosConfirmados}
                  </span>
                  <button
                    onClick={() => {
                      if (adultosConfirmados < (invitadoData?.adultos_max || 0))
                        setAdultosConfirmados(adultosConfirmados + 1);
                      else
                        alert(
                          `Solo tienes ${invitadoData?.adultos_max} adultos asignados.`,
                        );
                    }}
                    className="w-10 h-10 rounded-full bg-slate-100 text-2xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {invitadoData?.ninos_max > 0 && (
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-full">
                  <p className="font-bold text-slate-700">
                    Niños (Max {invitadoData?.ninos_max})
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-2">
                    <button
                      onClick={() =>
                        setNinosConfirmados(Math.max(0, ninosConfirmados - 1))
                      }
                      className="w-10 h-10 rounded-full bg-slate-100 text-2xl font-bold"
                    >
                      -
                    </button>
                    <span className="text-4xl font-black text-green-600 w-12">
                      {ninosConfirmados}
                    </span>
                    <button
                      onClick={() => {
                        if (ninosConfirmados < (invitadoData?.ninos_max || 0))
                          setNinosConfirmados(ninosConfirmados + 1);
                        else
                          alert(
                            `Solo tienes ${invitadoData?.ninos_max} niños asignados.`,
                          );
                      }}
                      className="w-10 h-10 rounded-full bg-slate-100 text-2xl font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-4">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 text-slate-400 font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmar}
                disabled={enviando}
                className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-100 active:scale-95 transition-all"
              >
                {enviando ? "Enviando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invitacion;
