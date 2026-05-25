/**
 * print.service.ts
 * Servicio para gestionar solicitudes de impresión 3D
 * Conecta el frontend con la API Route /api/print
 */

export interface PrintableItem {
  id: number;
  title: string;
  modelo3dUrl?: string;
  modelo_3d_path?: string;
}

export interface PrintJob {
  status: "printing" | "queued" | "error" | "no_model";
  itemId: number;
  itemName: string;
  modelUrl: string;
  orderId: string;
  octoprintRef?: string;
  message: string;
  timestamp: string;
}

export interface PrintResponse {
  success: boolean;
  jobs: PrintJob[];
  orderId: string;
  octoprintConfigured: boolean;
  message?: string;
  error?: string;
}

export interface PrinterStatus {
  configured: boolean;
  online?: boolean;
  message?: string;
  error?: string;
  job?: {
    job: {
      file: { name: string; size: number };
      estimatedPrintTime: number;
    };
    progress: {
      completion: number | null;
      printTime: number | null;
      printTimeLeft: number | null;
    };
    state: string;
  } | null;
  printer?: {
    temperature: {
      bed: { actual: number; target: number };
      tool0: { actual: number; target: number };
    };
    state: {
      text: string;
      flags: Record<string, boolean>;
    };
  } | null;
}

/** Solicitar impresión 3D para los items de una orden */
export async function requestPrint(
  orderId: string,
  items: PrintableItem[]
): Promise<PrintResponse> {
  const res = await fetch("/api/print", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, items }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

/** Obtener estado actual de la impresora OctoPrint */
export async function getPrinterStatus(): Promise<PrinterStatus> {
  const res = await fetch("/api/print", { cache: "no-store" });
  if (!res.ok) {
    return { configured: false, online: false, message: "Sin conexión" };
  }
  return res.json();
}

/** Guardar items pendientes de impresión en localStorage antes del pago */
export function savePendingPrintItems(
  orderId: string,
  items: PrintableItem[]
): void {
  try {
    const printables = items.filter(
      (it) => it.modelo3dUrl || it.modelo_3d_path
    );
    if (printables.length === 0) return;

    localStorage.setItem(
      "pendingPrintJob",
      JSON.stringify({
        orderId,
        items: printables,
        savedAt: new Date().toISOString(),
      })
    );
  } catch {
    // localStorage no disponible (SSR)
  }
}

/** Recuperar items pendientes de impresión del localStorage */
export function getPendingPrintJob(): {
  orderId: string;
  items: PrintableItem[];
  savedAt: string;
} | null {
  try {
    const raw = localStorage.getItem("pendingPrintJob");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Limpiar items pendientes de impresión del localStorage */
export function clearPendingPrintJob(): void {
  try {
    localStorage.removeItem("pendingPrintJob");
  } catch {
    // ignore
  }
}

/** Formatear tiempo en segundos a string legible */
export function formatPrintTime(seconds: number | null): string {
  if (seconds === null || seconds === undefined) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
