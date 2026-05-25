import { NextRequest, NextResponse } from "next/server";

const OCTOPRINT_URL = (process.env.OCTOPRINT_URL || "").replace(/\/$/, "");
const OCTOPRINT_API_KEY = process.env.OCTOPRINT_API_KEY || "";

export interface PrintItem {
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

// POST /api/print  → inicia trabajos de impresión para una orden
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, items } = body as {
      orderId: string;
      items: PrintItem[];
    };

    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Se requiere orderId y una lista de items" },
        { status: 400 }
      );
    }

    // Filtrar sólo los que tienen modelo 3D
    const printables = items.filter(
      (it) => it.modelo3dUrl || it.modelo_3d_path
    );

    if (printables.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Ningún producto en esta orden tiene modelo 3D asociado",
        jobs: [] as PrintJob[],
      });
    }

    const jobs: PrintJob[] = [];

    for (const item of printables) {
      const modelUrl = (item.modelo3dUrl || item.modelo_3d_path) as string;

      if (OCTOPRINT_URL && OCTOPRINT_API_KEY) {
        // Intentar envío real a OctoPrint
        try {
          const job = await sendToOctoPrint(item, modelUrl, orderId);
          jobs.push(job);
        } catch (err) {
          console.error("[OctoPrint] Error enviando trabajo:", err);
          jobs.push({
            status: "queued",
            itemId: item.id,
            itemName: item.title,
            modelUrl,
            orderId,
            message: `Trabajo en cola (error OctoPrint: ${err instanceof Error ? err.message : "desconocido"})`,
            timestamp: new Date().toISOString(),
          });
        }
      } else {
        // OctoPrint no configurado → cola de impresión manual
        jobs.push({
          status: "queued",
          itemId: item.id,
          itemName: item.title,
          modelUrl,
          orderId,
          message:
            "Trabajo registrado. Configura OCTOPRINT_URL en el servidor para impresión automática.",
          timestamp: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      jobs,
      orderId,
      octoprintConfigured: !!(OCTOPRINT_URL && OCTOPRINT_API_KEY),
    });
  } catch (error) {
    console.error("[Print API] Error:", error);
    return NextResponse.json(
      { error: "Error interno al procesar solicitud de impresión" },
      { status: 500 }
    );
  }
}

// GET /api/print  → estado actual de la impresora OctoPrint
export async function GET() {
  if (!OCTOPRINT_URL || !OCTOPRINT_API_KEY) {
    return NextResponse.json({
      configured: false,
      message: "OctoPrint no configurado en este servidor",
      job: null,
      printer: null,
    });
  }

  try {
    const headers = { "X-Api-Key": OCTOPRINT_API_KEY };

    const [jobRes, printerRes] = await Promise.allSettled([
      fetch(`${OCTOPRINT_URL}/api/job`, { headers, cache: "no-store" }),
      fetch(`${OCTOPRINT_URL}/api/printer`, { headers, cache: "no-store" }),
    ]);

    const job =
      jobRes.status === "fulfilled" && jobRes.value.ok
        ? await jobRes.value.json()
        : null;

    const printer =
      printerRes.status === "fulfilled" && printerRes.value.ok
        ? await printerRes.value.json()
        : null;

    return NextResponse.json({
      configured: true,
      job,
      printer,
      online: !!(job || printer),
    });
  } catch {
    return NextResponse.json(
      {
        configured: true,
        online: false,
        error: "No se pudo conectar con OctoPrint",
        job: null,
        printer: null,
      },
      { status: 503 }
    );
  }
}

// ─── Función privada: enviar modelo a OctoPrint y arrancar impresión ──────────
async function sendToOctoPrint(
  item: PrintItem,
  modelUrl: string,
  orderId: string
): Promise<PrintJob> {
  // 1. Descargar el modelo
  const modelResponse = await fetch(modelUrl, { cache: "no-store" });
  if (!modelResponse.ok) {
    throw new Error(
      `No se pudo descargar el modelo 3D (HTTP ${modelResponse.status}): ${modelUrl}`
    );
  }

  const modelBuffer = await modelResponse.arrayBuffer();
  const extension = modelUrl.split(".").pop()?.toLowerCase() || "glb";
  const safeName = (item.title || `item_${item.id}`)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 40);
  const fileName = `orden_${orderId}_${safeName}.${extension}`;

  // Determinar MIME type
  const mimeMap: Record<string, string> = {
    glb: "model/gltf-binary",
    gltf: "model/gltf+json",
    stl: "model/stl",
    obj: "model/obj",
  };
  const mime = mimeMap[extension] || "application/octet-stream";

  // 2. Subir a OctoPrint
  const formData = new FormData();
  formData.append(
    "file",
    new Blob([modelBuffer], { type: mime }),
    fileName
  );
  // `print: true` hace que OctoPrint arranque la impresión al terminar la subida
  formData.append("print", "true");
  formData.append("path", "treddy_orders");

  const uploadResponse = await fetch(`${OCTOPRINT_URL}/api/files/local`, {
    method: "POST",
    headers: {
      "X-Api-Key": OCTOPRINT_API_KEY,
    },
    body: formData,
  });

  if (!uploadResponse.ok) {
    const errText = await uploadResponse.text();
    throw new Error(
      `OctoPrint rechazó el archivo (HTTP ${uploadResponse.status}): ${errText}`
    );
  }

  const uploadData = await uploadResponse.json();

  return {
    status: "printing",
    itemId: item.id,
    itemName: item.title,
    modelUrl,
    orderId,
    octoprintRef: uploadData?.refs?.resource ?? fileName,
    message: `Imprimiendo: ${fileName}`,
    timestamp: new Date().toISOString(),
  };
}
