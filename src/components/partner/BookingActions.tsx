"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Download,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "./StatusBadge";
import { formatPax } from "@/lib/format";
import { cancellationRequestSchema, emailSchema } from "@/lib/validations/partner";
import {
  CANCELLATION_REASONS,
  PARTNER,
  bookingEmailTemplates,
  type Booking,
  type BookingStatus,
} from "@/data/partner-mock";

type DialogKind = "email" | "cancellation" | null;

/** Replaces {{placeholders}} in a template with the booking data. */
function fillTemplate(template: string, booking: Booking): string {
  const map: Record<string, string> = {
    "{{viajero}}": booking.customer.name,
    "{{producto}}": booking.productTitle,
    "{{fecha}}": booking.date,
    "{{hora}}": booking.time,
    "{{recogida}}": booking.pickupPoint,
    "{{pax}}": formatPax(booking.adults, booking.children),
    "{{id}}": booking.id,
    "{{partner}}": PARTNER.name,
  };
  return Object.entries(map).reduce(
    (acc, [key, value]) => acc.split(key).join(value),
    template,
  );
}

export default function BookingActions({
  booking,
  status,
  onStatusChange,
}: {
  booking: Booking;
  status: BookingStatus;
  onStatusChange: (status: BookingStatus) => void;
}) {
  const [dialog, setDialog] = React.useState<DialogKind>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Formulario de email
  const [subject, setSubject] = React.useState(
    fillTemplate(bookingEmailTemplates[0].subject, booking),
  );
  const [message, setMessage] = React.useState(
    fillTemplate(bookingEmailTemplates[0].body, booking),
  );
  const [templateId, setTemplateId] = React.useState(bookingEmailTemplates[0].id);

  // Formulario de cancelación
  const [reason, setReason] = React.useState("");
  const [comment, setComment] = React.useState("");

  const canConfirm = status === "Pendiente" || status === "Cancelación solicitada";
  const canComplete = status === "Confirmada";
  const canRequestCancellation = status === "Pendiente" || status === "Confirmada";
  const isClosed = status === "Cancelada" || status === "Completada";

  function closeDialog() {
    setDialog(null);
    setError(null);
  }

  function applyStatus(next: BookingStatus, title: string, description?: string) {
    onStatusChange(next);
    closeDialog();
    toast.success(title, { description: description ?? `${booking.id} → ${next}` });
  }

  function handleTemplateChange(id: string) {
    const template = bookingEmailTemplates.find((t) => t.id === id);
    if (!template) return;
    setTemplateId(id);
    setSubject(fillTemplate(template.subject, booking));
    setMessage(fillTemplate(template.body, booking));
  }

  function handleSendEmail() {
    const parsed = emailSchema.safeParse({ subject, message });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    closeDialog();
    toast.success("Email enviado al cliente", {
      description: `${parsed.data.subject} → ${booking.customer.email}`,
    });
  }

  function handleRequestCancellation() {
    const parsed = cancellationRequestSchema.safeParse({ reason, comment });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setReason("");
    setComment("");
    applyStatus(
      "Cancelación solicitada",
      "Cancelación solicitada",
      "El equipo de Nomadica Sahara revisará la solicitud y gestionará el reembolso.",
    );
  }

  function handleDownloadVoucher() {
    toast.info("Descargando voucher…", {
      description: `${booking.id}-voucher.pdf`,
    });
  }

  return (
    <div className="rounded-sm border border-[#E5E5E5] bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-[#1A1A1A]">Acciones</h2>
        <StatusBadge status={status} />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {/* Primarias */}
        <Button
          onClick={() => setDialog("email")}
          className="h-11 gap-2"
          disabled={isClosed}
          aria-label="Enviar email al cliente"
        >
          <Mail className="h-4 w-4" aria-hidden />
          Enviar email al cliente
        </Button>

        <Button
          onClick={() => setDialog("cancellation")}
          variant="outline"
          className="h-11 gap-2 border-[#D93025]/40 text-[#D93025] hover:bg-[#FDECEC] hover:text-[#D93025]"
          disabled={!canRequestCancellation}
          aria-label="Solicitar cancelación"
        >
          <Ban className="h-4 w-4" aria-hidden />
          Solicitar cancelación
        </Button>

        {/* Secundarias */}
        <Button
          onClick={() =>
            applyStatus("Confirmada", "Reserva confirmada", "El voucher se ha enviado al cliente.")
          }
          variant="outline"
          className="h-11 gap-2"
          disabled={!canConfirm}
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          Confirmar
        </Button>

        <Button
          onClick={() =>
            applyStatus("Completada", "Reserva marcada como completada", "El importe se libera en el siguiente payout.")
          }
          variant="outline"
          className="h-11 gap-2"
          disabled={!canComplete}
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          Marcar como completada
        </Button>

        <Button onClick={handleDownloadVoucher} variant="outline" className="h-11 gap-2">
          <Download className="h-4 w-4" aria-hidden />
          Descargar voucher
        </Button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-[#999]">
        {isClosed
          ? "Esta reserva está cerrada: no admite más cambios."
          : "Los cambios se aplican solo a esta sesión de demostración (mock local)."}
      </p>

      {/* ---------------------------- Email ---------------------------- */}
      <Dialog open={dialog === "email"} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar email al cliente</DialogTitle>
            <DialogDescription>
              El mensaje se enviará a {booking.customer.email} ({booking.customer.name}).
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email-template" className="text-xs font-medium">
                Plantilla
              </Label>
              <Select value={templateId} onValueChange={handleTemplateChange}>
                <SelectTrigger id="email-template" aria-label="Elegir plantilla de email">
                  <SelectValue placeholder="Plantilla" />
                </SelectTrigger>
                <SelectContent>
                  {bookingEmailTemplates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email-subject" className="text-xs font-medium">
                Asunto
              </Label>
              <Input
                id="email-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email-body" className="text-xs font-medium">
                Mensaje
              </Label>
              <Textarea
                id="email-body"
                rows={10}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="font-mono text-[13px] leading-relaxed"
              />
            </div>

            {error ? (
              <p role="alert" className="text-xs font-medium text-[#D93025]">
                {error}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Volver
            </Button>
            <Button onClick={handleSendEmail}>Enviar email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ------------------------- Cancelación ------------------------- */}
      <Dialog
        open={dialog === "cancellation"}
        onOpenChange={(o) => !o && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar cancelación</DialogTitle>
            <DialogDescription>
              Indica el motivo para la reserva {booking.id}. El equipo de Nomadica Sahara revisará
              la solicitud.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cancellation-reason" className="text-xs font-medium">
                Motivo
              </Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger id="cancellation-reason" aria-label="Motivo de la cancelación">
                  <SelectValue placeholder="Selecciona un motivo" />
                </SelectTrigger>
                <SelectContent>
                  {CANCELLATION_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cancellation-comment" className="text-xs font-medium">
                Comentario <span className="font-normal text-[#999]">(opcional)</span>
              </Label>
              <Textarea
                id="cancellation-comment"
                rows={4}
                maxLength={500}
                placeholder="Añade contexto para el equipo de Nomadica Sahara…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div
              role="alert"
              className="flex items-start gap-2 rounded-sm border border-[#F0A500]/40 bg-[#FFF9EC] px-3 py-2.5"
            >
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0 text-[#B87900]"
                aria-hidden
              />
              <p className="text-xs leading-relaxed text-[#8A6100]">
                Según la política de cancelación, el reembolso puede no ser íntegro si la
                solicitud se realiza dentro de las 48&nbsp;h previas a la actividad. La reserva
                pasará a estado <strong>Cancelación solicitada</strong> hasta que sea revisada.
              </p>
            </div>

            {error ? (
              <p role="alert" className="text-xs font-medium text-[#D93025]">
                {error}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Volver
            </Button>
            <Button
              onClick={handleRequestCancellation}
              className="bg-[#D93025] hover:bg-[#B82519]"
            >
              Confirmar solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
