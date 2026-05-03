"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const mpAccount = useQuery(api.settings.get, { key: "mp_account" });
  const updateSettings = useMutation(api.settings.set);

  const [alias, setAlias] = useState(mpAccount?.value?.alias ?? "");
  const [cvu, setCvu] = useState(mpAccount?.value?.cvu ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        key: "mp_account",
        value: { alias, cvu },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>

      <Card>
        <CardHeader>
          <CardTitle>Cuenta de Mercado Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Estos datos se le muestran al cliente cuando elige pagar por
            transferencia.
          </p>
          <div className="space-y-2">
            <Label>Alias</Label>
            <Input
              placeholder="ejemplo.mp"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>CVU</Label>
            <Input
              placeholder="0000000000000000000000"
              value={cvu}
              onChange={(e) => setCvu(e.target.value)}
            />
          </div>
          <Separator />
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
