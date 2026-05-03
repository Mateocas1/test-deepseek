"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { formatARS, isLateSlot } from "@/lib/utils";
import { SERVICE_SUBCATEGORIES, SURCHARGE_COLEGA, SURCHARGE_LATE_SLOT } from "@/convex/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ChevronRight, ArrowLeft, CreditCard, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

type BookingStep = "type" | "origin" | "retiro-subcat" | "servicio-subcat" | "date" | "time" | "payment" | "summary";

interface BookingState {
  type: "solo-retiro" | "retiro-servicio" | "solo-servicio" | null;
  origin: "frecuente" | "colega" | null;
  retiroSubcategory: string | null;
  servicioSubcategory: string | null;
  date: string | null;
  time: string | null;
  paymentMethod: "platform" | "transfer" | null;
}

export default function BookingWizard() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const createAppointment = useMutation(api.appointments.create);
  const calculatePrice = useMutation(api.appointments.calculatePrice);
  const services = useQuery(api.services.list);
  const prices = useQuery(api.services.getPrices);

  const [step, setStep] = useState<BookingStep>("type");
  const [booking, setBooking] = useState<BookingState>({
    type: null,
    origin: null,
    retiroSubcategory: null,
    servicioSubcategory: null,
    date: null,
    time: null,
    paymentMethod: null,
  });
  const [priceInfo, setPriceInfo] = useState<{ total: number; deposit: number } | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableSlotsQuery = useQuery(
    api.availability.getAvailableSlots,
    selectedDay ? { date: format(selectedDay, "yyyy-MM-dd") } : "skip"
  );

  const updateBooking = (updates: Partial<BookingState>) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  };

  const minDate = new Date();
  minDate.setHours(minDate.getHours() + 24);

  const canGoNext = () => {
    switch (step) {
      case "type":
        return !!booking.type;
      case "origin":
        return !!booking.origin;
      case "retiro-subcat":
        return !!booking.retiroSubcategory;
      case "servicio-subcat":
        return booking.type === "solo-servicio"
          ? !!booking.servicioSubcategory
          : !!booking.servicioSubcategory;
      case "date":
        return !!selectedDay;
      case "time":
        return !!booking.time;
      case "payment":
        return !!booking.paymentMethod;
      default:
        return false;
    }
  };

  const handleNext = () => {
    setError(null);
    switch (step) {
      case "type":
        if (booking.type === "solo-retiro") setStep("origin");
        else if (booking.type === "retiro-servicio") setStep("origin");
        else setStep("servicio-subcat");
        break;
      case "origin":
        if (booking.type === "solo-retiro") setStep("retiro-subcat");
        else setStep("retiro-subcat");
        break;
      case "retiro-subcat":
        if (booking.type === "solo-retiro") setStep("date");
        else setStep("servicio-subcat");
        break;
      case "servicio-subcat":
        setStep("date");
        break;
      case "date":
        setStep("time");
        if (availableSlotsQuery) setAvailableSlots(availableSlotsQuery);
        break;
      case "time":
        setStep("payment");
        break;
      case "payment":
        handleConfirm();
        break;
    }
  };

  const handleBack = () => {
    setError(null);
    switch (step) {
      case "origin":
        setStep("type");
        break;
      case "retiro-subcat":
        setStep(booking.type === "solo-retiro" ? "origin" : "origin");
        break;
      case "servicio-subcat":
        setStep(booking.type === "retiro-servicio" ? "retiro-subcat" : "type");
        break;
      case "date":
        if (booking.type === "solo-servicio") setStep("servicio-subcat");
        else if (booking.type === "retiro-servicio") setStep("servicio-subcat");
        else setStep("retiro-subcat");
        break;
      case "time":
        setStep("date");
        break;
      case "payment":
        setStep("time");
        break;
    }
  };

  const handleConfirm = async () => {
    if (!booking.type || !booking.date || !booking.time || !booking.paymentMethod) return;
    setLoading(true);
    setError(null);

    try {
      const id = await createAppointment({
        type: booking.type,
        origin: booking.origin ?? "frecuente",
        retiroSubcategory: booking.retiroSubcategory ?? undefined,
        servicioSubcategory: booking.servicioSubcategory ?? undefined,
        date: booking.date,
        time: booking.time,
        paymentMethod: booking.paymentMethod,
      });

      router.push(`/booking/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear el turno");
    } finally {
      setLoading(false);
    }
  };

  const handleDaySelect = (day: Date | undefined) => {
    setSelectedDay(day);
    if (day) {
      updateBooking({ date: format(day, "yyyy-MM-dd") });
    } else {
      updateBooking({ date: null });
    }
  };

  if (!isSignedIn) {
    return (
      <section className="min-h-screen pt-24 flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>Iniciá sesión para reservar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Necesitás una cuenta de Google para reservar tu turno.
            </p>
            <SignInButton mode="modal">
              <Button className="w-full">Ingresar con Google</Button>
            </SignInButton>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          {step !== "type" && (
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <h1 className="text-2xl font-bold">Reservá tu turno</h1>
        </div>

        <div className="flex gap-1 mb-8">
          {["type", "origin", "subcat", "date", "time", "payment"].map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                ["type", "origin", "retiro-subcat", "servicio-subcat", "date", "time", "payment"].indexOf(step) >= i
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        {step === "type" && (
          <div className="grid gap-4">
            <button
              onClick={() => updateBooking({ type: "solo-retiro" })}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                booking.type === "solo-retiro"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <h3 className="font-semibold text-lg mb-1">Solo Retiro</h3>
              <p className="text-sm text-muted-foreground">
                Sacar las uñas sin poner nuevo trabajo.
              </p>
            </button>
            <button
              onClick={() => updateBooking({ type: "retiro-servicio" })}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                booking.type === "retiro-servicio"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <h3 className="font-semibold text-lg mb-1">Retiro + Servicio</h3>
              <p className="text-sm text-muted-foreground">
                Retirar lo que tenés y aplicar nuevo trabajo en el mismo turno.
              </p>
            </button>
            <button
              onClick={() => updateBooking({ type: "solo-servicio" })}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                booking.type === "solo-servicio"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <h3 className="font-semibold text-lg mb-1">Solo Servicio</h3>
              <p className="text-sm text-muted-foreground">
                Mantenimiento de uñas existentes.
              </p>
            </button>
          </div>
        )}

        {(step === "origin" && (booking.type === "solo-retiro" || booking.type === "retiro-servicio")) && (
          <div className="grid gap-4">
            <button
              onClick={() => updateBooking({ origin: "frecuente" })}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                booking.origin === "frecuente"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <h3 className="font-semibold text-lg mb-1">Vengo del salón</h3>
              <p className="text-sm text-muted-foreground">
                Mis uñas fueron hechas acá en Mena Nails.
              </p>
            </button>
            <button
              onClick={() => updateBooking({ origin: "colega" })}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                booking.origin === "colega"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <h3 className="font-semibold text-lg mb-1">Vengo de otro lado</h3>
              <p className="text-sm text-muted-foreground">
                Mis uñas fueron hechas en otro salón (+${formatARS(SURCHARGE_COLEGA)}).
              </p>
            </button>
          </div>
        )}

        {(step === "retiro-subcat") && (
          <div className="grid gap-4">
            <Label>¿Qué tipo de uñas te vas a retirar?</Label>
            {SERVICE_SUBCATEGORIES.map((sub) => (
              <button
                key={sub}
                onClick={() => updateBooking({ retiroSubcategory: sub })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  booking.retiroSubcategory === sub
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium capitalize">{sub.replace("-", " ")}</span>
                  <span className="text-sm text-primary font-semibold">
                    {formatARS(prices?.retiro[sub] ?? 0)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {(step === "servicio-subcat" && (booking.type === "retiro-servicio" || booking.type === "solo-servicio")) && (
          <div className="grid gap-4">
            <Label>¿Qué servicio querés?</Label>
            {SERVICE_SUBCATEGORIES.map((sub) => (
              <button
                key={sub}
                onClick={() => updateBooking({ servicioSubcategory: sub })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  booking.servicioSubcategory === sub
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium capitalize">{sub.replace("-", " ")}</span>
                  <span className="text-sm text-primary font-semibold">
                    {formatARS(prices?.servicio[sub] ?? 0)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === "date" && (
          <div>
            <Label className="mb-4 block">Elegí el día</Label>
            <div className="flex justify-center">
              <DayPicker
                mode="single"
                selected={selectedDay}
                onSelect={handleDaySelect}
                locale={es}
                disabled={{ before: minDate }}
                fromDate={minDate}
                className="!m-0"
              />
            </div>
          </div>
        )}

        {step === "time" && selectedDay && (
          <div className="grid gap-3">
            <Label className="mb-2 block">Elegí el horario</Label>
            {availableSlotsQuery === undefined ? (
              <p className="text-muted-foreground">Cargando horarios...</p>
            ) : availableSlotsQuery.length === 0 ? (
              <p className="text-muted-foreground">No hay horarios disponibles para este día.</p>
            ) : (
              availableSlotsQuery.map((slot: string) => (
                <button
                  key={slot}
                  onClick={() => updateBooking({ time: slot })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    booking.time === slot
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{slot} hs</span>
                    {isLateSlot(slot) && (
                      <span className="text-xs text-destructive">
                        +{formatARS(SURCHARGE_LATE_SLOT)}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {step === "payment" && (
          <div>
            <Label className="mb-4 block">Elegí cómo pagar el depósito</Label>
            {prices && (
              <Card className="mb-6">
                <CardContent className="p-4 space-y-2">
                  {booking.type === "solo-retiro" && booking.retiroSubcategory && (
                    <div className="flex justify-between text-sm">
                      <span>Retiro {booking.retiroSubcategory}</span>
                      <span>{formatARS(prices.retiro[booking.retiroSubcategory])}</span>
                    </div>
                  )}
                  {booking.type === "retiro-servicio" && booking.retiroSubcategory && (
                    <div className="flex justify-between text-sm">
                      <span>Retiro {booking.retiroSubcategory}</span>
                      <span>{formatARS(prices.retiro[booking.retiroSubcategory])}</span>
                    </div>
                  )}
                  {booking.type === "retiro-servicio" && booking.servicioSubcategory && (
                    <div className="flex justify-between text-sm">
                      <span>Servicio {booking.servicioSubcategory}</span>
                      <span>{formatARS(prices.servicio[booking.servicioSubcategory])}</span>
                    </div>
                  )}
                  {booking.type === "solo-servicio" && booking.servicioSubcategory && (
                    <div className="flex justify-between text-sm">
                      <span>Servicio {booking.servicioSubcategory}</span>
                      <span>{formatARS(prices.servicio[booking.servicioSubcategory])}</span>
                    </div>
                  )}
                  {booking.origin === "colega" && (
                    <div className="flex justify-between text-sm">
                      <span>Recargo colega</span>
                      <span>+{formatARS(SURCHARGE_COLEGA)}</span>
                    </div>
                  )}
                  {booking.time && isLateSlot(booking.time) && (
                    <div className="flex justify-between text-sm">
                      <span>Recargo horario 18:30</span>
                      <span>+{formatARS(SURCHARGE_LATE_SLOT)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatARS(priceInfo?.total ?? 0)}</span>
                  </div>
                  <div className="flex justify-between text-primary font-bold">
                    <span>Depósito (50%)</span>
                    <span>{formatARS(priceInfo?.deposit ?? 0)}</span>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="grid gap-3">
              <button
                onClick={() => updateBooking({ paymentMethod: "platform" })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  booking.paymentMethod === "platform"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Pago en plataforma</p>
                    <p className="text-xs text-muted-foreground">
                      Tarjeta de crédito, débito o efectivo a través de Mercado Pago.
                    </p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => updateBooking({ paymentMethod: "transfer" })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  booking.paymentMethod === "transfer"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Transferencia</p>
                    <p className="text-xs text-muted-foreground">
                      Transferí el depósito al alias o CVU que te mostramos al confirmar.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive mt-4">{error}</p>
        )}

        <div className="mt-8">
          <Button
            onClick={handleNext}
            disabled={!canGoNext() || loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              "Procesando..."
            ) : step === "payment" ? (
              "Confirmar y pagar"
            ) : (
              <>
                Continuar
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
