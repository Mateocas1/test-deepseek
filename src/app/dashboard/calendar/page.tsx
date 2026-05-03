"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TIME_SLOTS } from "@/convex/schema";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import "react-day-picker/dist/style.css";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [blockReason, setBlockReason] = useState("");

  const blocked = useQuery(
    api.availability.getBlockedSlots,
    selectedDate ? { date: format(selectedDate, "yyyy-MM-dd") } : "skip"
  );
  const blockSlots = useMutation(api.availability.blockSlots);
  const blockDay = useMutation(api.availability.blockDay);
  const unblock = useMutation(api.availability.unblockDate);

  const handleBlockSlots = async () => {
    if (!selectedDate || selectedSlots.length === 0) return;
    await blockSlots({
      date: format(selectedDate, "yyyy-MM-dd"),
      timeSlots: selectedSlots,
      reason: blockReason || undefined,
    });
    setSelectedSlots([]);
    setBlockReason("");
  };

  const handleBlockDay = async () => {
    if (!selectedDate) return;
    await blockDay({
      date: format(selectedDate, "yyyy-MM-dd"),
      reason: blockReason || undefined,
    });
    setBlockReason("");
  };

  const handleUnblock = async () => {
    if (!selectedDate) return;
    await unblock({ date: format(selectedDate, "yyyy-MM-dd") });
  };

  const toggleSlot = (slot: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Calendario</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Seleccionar fecha</CardTitle>
          </CardHeader>
          <CardContent>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={es}
              className="!m-0 flex justify-center"
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {selectedDate && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {format(selectedDate, "PPPP", { locale: es })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {blocked?.allDay ? (
                    <div className="bg-destructive/10 rounded-lg p-4 text-center">
                      <p className="text-sm font-medium text-destructive">
                        Día completo bloqueado
                      </p>
                      {blocked.reason && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Motivo: {blocked.reason}
                        </p>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={handleUnblock}
                      >
                        Desbloquear día
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Label className="mb-3 block">
                        Bloquear horarios específicos
                      </Label>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {TIME_SLOTS.map((slot) => {
                          const isBlocked = blocked?.timeSlots?.includes(slot);
                          const isSelected = selectedSlots.includes(slot);
                          return (
                            <button
                              key={slot}
                              onClick={() => toggleSlot(slot)}
                              className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                                isBlocked
                                  ? "bg-destructive/10 text-destructive border-destructive/30 line-through"
                                  : isSelected
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-background border-border hover:border-primary/50"
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                      <Input
                        placeholder="Motivo (opcional)"
                        value={blockReason}
                        onChange={(e) => setBlockReason(e.target.value)}
                        className="mb-3"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleBlockSlots}
                          disabled={selectedSlots.length === 0}
                        >
                          Bloquear seleccionados
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          onClick={handleBlockDay}
                        >
                          Bloquear día completo
                        </Button>
                        {blocked && !blocked.allDay && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleUnblock}
                          >
                            Desbloquear
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
