"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatARS } from "@/lib/utils";

export default function PaymentsPage() {
  const payments = useQuery(api.payments.list);

  if (!payments) {
    return <p className="text-muted-foreground">Cargando...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pagos</h1>

      <Card>
        <CardHeader>
          <CardTitle>Historial de pagos</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay pagos registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Monto</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Método</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Estado</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">ID MP</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p: any) => (
                    <tr key={p._id} className="border-b border-border/50">
                      <td className="py-3 px-2 font-medium">{formatARS(p.amount)}</td>
                      <td className="py-3 px-2 capitalize">{p.method}</td>
                      <td className="py-3 px-2">
                        <Badge
                          variant={
                            p.status === "approved"
                              ? "default"
                              : p.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {p.status === "approved"
                            ? "Aprobado"
                            : p.status === "rejected"
                            ? "Rechazado"
                            : "Pendiente"}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground font-mono text-xs">
                        {p.mpPaymentId ?? "—"}
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString("es-AR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
