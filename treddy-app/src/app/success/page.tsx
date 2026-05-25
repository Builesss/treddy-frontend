"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import {
  Printer,
  Package,
  Clock,
  Thermometer,
  CheckCheck,
  AlertTriangle,
  Loader2,
  Boxes,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  requestPrint,
  getPrinterStatus,
  getPendingPrintJob,
  clearPendingPrintJob,
  formatPrintTime,
  PrintJob,
  PrinterStatus,
} from "@/services/print.service";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type PrintPhase =
  | "idle"
  | "sending"
  | "printing"
  | "queued"
  | "done"
  | "error"
  | "no_model";

// ─── Componente principal ─────────────────────────────────────────────────────
export default function SuccessPage() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [printPhase, setPrintPhase] = useState<PrintPhase>("idle");
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [printerStatus, setPrinterStatus] = useState<PrinterStatus | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pollInterval, setPollInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  // ── Leer el external_reference de la URL ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("external_reference") || params.get("preference_id");
    setOrderId(ref);
  }, []);

  // ── Auto-disparar impresión cuando se conoce el orderId ──
  useEffect(() => {
    if (!orderId) return;
    triggerPrint(orderId);
  }, [orderId]);

  // ── Polling del estado de la impresora ──
  const pollStatus = useCallback(async () => {
    try {
      const status = await getPrinterStatus();
      setPrinterStatus(status);

      // Si OctoPrint dice que terminó, actualizamos la fase
      if (
        status.job?.state === "Operational" ||
        status.job?.progress?.completion === 100
      ) {
        setPrintPhase((prev) => (prev === "printing" ? "done" : prev));
      }
    } catch {
      // ignorar errores de red en el polling
    }
  }, []);

  // ── Iniciar/detener polling ──
  useEffect(() => {
    if (printPhase === "printing") {
      pollStatus(); // primer fetch inmediato
      const id = setInterval(pollStatus, 4000); // cada 4 segundos
      setPollInterval(id);
    } else {
      if (pollInterval) {
        clearInterval(pollInterval);
        setPollInterval(null);
      }
    }
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [printPhase]);

  // ── Limpiar polling al desmontar ──
  useEffect(() => {
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Función: disparar impresión ──
  const triggerPrint = async (oid: string) => {
    const pending = getPendingPrintJob();
    if (!pending || !pending.items || pending.items.length === 0) {
      setPrintPhase("no_model");
      return;
    }

    const printables = pending.items.filter(
      (it) => it.modelo3dUrl || it.modelo_3d_path
    );

    if (printables.length === 0) {
      setPrintPhase("no_model");
      clearPendingPrintJob();
      return;
    }

    setPrintPhase("sending");

    try {
      const result = await requestPrint(oid, printables);
      clearPendingPrintJob();

      setPrintJobs(result.jobs);

      // Determinar fase según resultado
      const anyPrinting = result.jobs.some((j) => j.status === "printing");
      const anyQueued = result.jobs.some((j) => j.status === "queued");

      if (anyPrinting) {
        setPrintPhase("printing");
      } else if (anyQueued) {
        setPrintPhase("queued");
      } else {
        setPrintPhase("done");
      }
    } catch (err) {
      console.error("[SuccessPage] Error al disparar impresión:", err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "No se pudo contactar con el servicio de impresión"
      );
      setPrintPhase("error");
      clearPendingPrintJob();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0F2C] to-[#0F173A] text-white px-4 py-16">
      {/* Fondo animado */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-6">
        {/* ── Tarjeta de pago exitoso ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-[#10193F]/80 backdrop-blur-xl border border-cyan-500/20 p-8 rounded-3xl shadow-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.3 }}
          >
            <CheckCircleIcon className="w-20 h-20 text-green-400 mx-auto" />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-5 text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          >
            ¡Pago Exitoso!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-2 text-gray-300"
          >
            Tu pago fue aprobado correctamente. 🎉
          </motion.p>

          {orderId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-4 px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl inline-block"
            >
              <p className="text-xs text-cyan-400 mb-1">Número de Orden</p>
              <p className="text-lg font-mono font-bold text-white">{orderId}</p>
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-4 text-xs text-gray-500"
          >
            Gracias por confiar en Treddy 🚀
          </motion.p>
        </motion.div>

        {/* ── Panel de Impresión 3D ── */}
        <AnimatePresence>
          {printPhase !== "idle" && (
            <motion.div
              key="print-panel"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-[#10193F]/80 backdrop-blur-xl border border-cyan-500/20 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-b border-cyan-500/20 px-6 py-4 flex items-center gap-3">
                <div className="relative">
                  <Printer className="text-cyan-400" size={24} />
                  {printPhase === "printing" && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping" />
                  )}
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg leading-none">
                    Impresión 3D
                  </h2>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {printPhase === "sending" && "Enviando modelos a la impresora..."}
                    {printPhase === "printing" && "Imprimiendo en tiempo real"}
                    {printPhase === "queued" && "Trabajos en cola de impresión"}
                    {printPhase === "done" && "Impresión completada"}
                    {printPhase === "error" && "Error en el servicio de impresión"}
                    {printPhase === "no_model" && "Sin modelos 3D en esta orden"}
                  </p>
                </div>
                <div className="ml-auto">
                  <StatusBadge phase={printPhase} />
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* ── ESTADO: Enviando ── */}
                {printPhase === "sending" && (
                  <div className="flex flex-col items-center gap-4 py-6">
                    <div className="relative">
                      <Printer size={48} className="text-cyan-400 opacity-30" />
                      <Loader2
                        size={28}
                        className="animate-spin text-cyan-400 absolute -top-1 -right-1"
                      />
                    </div>
                    <p className="text-gray-300 text-sm">
                      Conectando con la impresora y enviando archivos…
                    </p>
                    <div className="w-full bg-[#0A0F2C] rounded-full h-2">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full animate-pulse w-2/3 transition-all" />
                    </div>
                  </div>
                )}

                {/* ── ESTADO: Sin modelo ── */}
                {printPhase === "no_model" && (
                  <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <Boxes size={40} className="text-gray-600" />
                    <p className="text-gray-400 text-sm">
                      Los productos de esta orden no tienen un modelo 3D asociado,
                      por lo que no se enviará ningún trabajo de impresión.
                    </p>
                  </div>
                )}

                {/* ── ESTADO: Error ── */}
                {printPhase === "error" && (
                  <div className="flex flex-col items-center gap-3 py-4 text-center">
                    <AlertTriangle size={36} className="text-red-400" />
                    <div>
                      <p className="text-red-300 font-semibold text-sm">
                        No se pudo iniciar la impresión automáticamente
                      </p>
                      {errorMsg && (
                        <p className="text-gray-500 text-xs mt-1 max-w-sm">
                          {errorMsg}
                        </p>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs">
                      Un administrador revisará tu pedido y procesará la impresión manualmente.
                    </p>
                  </div>
                )}

                {/* ── Lista de trabajos ── */}
                {(printPhase === "printing" ||
                  printPhase === "queued" ||
                  printPhase === "done") &&
                  printJobs.length > 0 && (
                    <div className="space-y-3">
                      {printJobs.map((job, i) => (
                        <JobCard key={i} job={job} />
                      ))}
                    </div>
                  )}

                {/* ── Estado en tiempo real OctoPrint ── */}
                {printPhase === "printing" && printerStatus && (
                  <PrinterStatusPanel status={printerStatus} />
                )}

                {/* ── Impresión completada ── */}
                {printPhase === "done" && (
                  <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <CheckCheck size={24} className="text-green-400 shrink-0" />
                    <p className="text-green-300 text-sm">
                      Todos los trabajos de impresión han finalizado exitosamente.
                    </p>
                  </div>
                )}

                {/* ── Cola (sin OctoPrint) ── */}
                {printPhase === "queued" && (
                  <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <Clock size={20} className="text-yellow-400 shrink-0" />
                    <p className="text-yellow-200 text-sm">
                      Los trabajos fueron registrados. El equipo de Treddy los
                      procesará en breve con la impresora correspondiente.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Botón volver ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="flex justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-3 rounded-full font-bold shadow-md hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:opacity-90 transition-all"
          >
            Volver al inicio
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function StatusBadge({ phase }: { phase: PrintPhase }) {
  const config: Record<PrintPhase, { label: string; classes: string }> = {
    idle: { label: "—", classes: "bg-gray-700 text-gray-300" },
    sending: {
      label: "Enviando",
      classes: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40",
    },
    printing: {
      label: "Imprimiendo",
      classes: "bg-green-500/20 text-green-300 border border-green-500/40 animate-pulse",
    },
    queued: {
      label: "En cola",
      classes: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40",
    },
    done: {
      label: "Completado",
      classes: "bg-green-500/20 text-green-300 border border-green-500/40",
    },
    error: {
      label: "Error",
      classes: "bg-red-500/20 text-red-300 border border-red-500/40",
    },
    no_model: {
      label: "Sin modelo",
      classes: "bg-gray-700/50 text-gray-400 border border-gray-600/40",
    },
  };

  const { label, classes } = config[phase];
  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-full ${classes}`}>
      {label}
    </span>
  );
}

function JobCard({ job }: { job: PrintJob }) {
  const statusIcon: Record<string, React.ReactNode> = {
    printing: <Loader2 size={16} className="animate-spin text-cyan-400" />,
    queued: <Clock size={16} className="text-yellow-400" />,
    done: <CheckCheck size={16} className="text-green-400" />,
    error: <AlertTriangle size={16} className="text-red-400" />,
    no_model: <Package size={16} className="text-gray-500" />,
  };

  return (
    <div className="bg-[#0A0F2C]/60 border border-[#1a2040] rounded-xl p-4 flex items-start gap-3">
      <div className="mt-0.5">{statusIcon[job.status] ?? <Package size={16} />}</div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">{job.itemName}</p>
        <p className="text-gray-400 text-xs mt-0.5 truncate">{job.message}</p>
        {job.octoprintRef && (
          <p className="text-cyan-600 text-xs mt-1 truncate font-mono">
            📁 {job.octoprintRef}
          </p>
        )}
      </div>
      <p className="text-gray-600 text-xs shrink-0">
        {new Date(job.timestamp).toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}

function PrinterStatusPanel({ status }: { status: PrinterStatus }) {
  const progress = status.job?.progress;
  const job = status.job?.job;
  const temps = status.printer?.temperature;
  const completion = progress?.completion ?? 0;

  return (
    <div className="bg-[#0A0F2C]/60 border border-[#1a2040] rounded-2xl p-5 space-y-4">
      {/* Conexión */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
          Estado de la Impresora
        </span>
        <span
          className={`flex items-center gap-1.5 text-xs font-bold ${
            status.online ? "text-green-400" : "text-red-400"
          }`}
        >
          {status.online ? (
            <Wifi size={12} />
          ) : (
            <WifiOff size={12} />
          )}
          {status.online ? "En línea" : "Sin conexión"}
        </span>
      </div>

      {/* Barra de progreso */}
      {progress && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300 font-medium">
              {job?.file?.name ?? "Archivo"}
            </span>
            <span className="text-cyan-400 font-bold text-sm">
              {completion.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-[#1a2040] rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              Transcurrido: {formatPrintTime(progress.printTime)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              Restante: {formatPrintTime(progress.printTimeLeft)}
            </span>
          </div>
        </div>
      )}

      {/* Temperaturas */}
      {temps && (
        <div className="grid grid-cols-2 gap-3">
          <TempCard
            label="Extrusor"
            actual={temps.tool0?.actual}
            target={temps.tool0?.target}
          />
          <TempCard
            label="Cama"
            actual={temps.bed?.actual}
            target={temps.bed?.target}
          />
        </div>
      )}
    </div>
  );
}

function TempCard({
  label,
  actual,
  target,
}: {
  label: string;
  actual?: number;
  target?: number;
}) {
  return (
    <div className="bg-[#10193F]/60 border border-[#1a2040] rounded-xl p-3 flex items-center gap-2">
      <Thermometer size={16} className="text-orange-400 shrink-0" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-white font-bold text-sm">
          {actual !== undefined ? `${actual.toFixed(0)}°C` : "—"}
          {target !== undefined && target > 0 && (
            <span className="text-gray-500 font-normal text-xs ml-1">
              / {target.toFixed(0)}°C
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
