"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AFFILIATE_CODE_LENGTH,
  DEFAULT_AFFILIATE_COMMISSION_RATE,
  affiliateShareUrl,
  isValidAffiliateCode,
  normalizeAffiliateCode,
  toAffiliateCode,
} from "@/lib/affiliate-constants";

type AffiliateRow = {
  id: string;
  code: string;
  name: string;
  email: string;
  status: string;
  commissionRate: string;
  clerkUserId?: string | null;
  stats?: {
    confirmedOrders: number;
    totalSales: number;
    totalEarnings: number;
  };
};

type CommissionRow = {
  id: string;
  affiliateId: string;
  orderNumber: string;
  orderSubtotal: string;
  commissionAmount: string;
  createdAt: string;
};

function shareLink(code: string) {
  return affiliateShareUrl(code);
}

export default function AdminAffiliateManagement() {
  const [affiliates, setAffiliates] = useState<AffiliateRow[]>([]);
  const [commissions, setCommissions] = useState<CommissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [ratePercent, setRatePercent] = useState(
    String(DEFAULT_AFFILIATE_COMMISSION_RATE * 100)
  );
  const [clerkUserId, setClerkUserId] = useState("");

  const [editingRateId, setEditingRateId] = useState<string | null>(null);
  const [editRatePercent, setEditRatePercent] = useState("");

  const [defaultRatePercent, setDefaultRatePercent] = useState(
    String(DEFAULT_AFFILIATE_COMMISSION_RATE * 100)
  );
  const [applyDefaultToAll, setApplyDefaultToAll] = useState(false);
  const [savingDefault, setSavingDefault] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/admin/affiliate-settings");
      const data = await res.json();
      if (!res.ok) return;
      const pct = data.default_commission_percent ?? DEFAULT_AFFILIATE_COMMISSION_RATE * 100;
      setDefaultRatePercent(String(pct));
      setRatePercent(String(pct));
    } catch {
      // keep fallback constant
    }
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/affiliate?all=1");
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "Failed to load");
      if (data.role !== "admin" || !Array.isArray(data.affiliates)) {
        setError("Admin role required (set Clerk publicMetadata.role = admin)");
        setAffiliates([]);
        setCommissions([]);
        return;
      }
      setAffiliates(data.affiliates || []);
      setCommissions(data.commissions || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    void loadSettings();
  }, []);

  const saveDefaultRate = async (e: React.FormEvent) => {
    e.preventDefault();
    const shouldApplyAll = applyDefaultToAll;
    setSavingDefault(true);
    setError(null);
    setSettingsMessage(null);
    try {
      const res = await fetch("/api/admin/affiliate-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commission_percent: Number(defaultRatePercent),
          apply_to_all: shouldApplyAll,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save default rate");
      const pct = data.default_commission_percent;
      setDefaultRatePercent(String(pct));
      setRatePercent(String(pct));
      setSettingsMessage(
        shouldApplyAll
          ? `Default set to ${pct}%. Updated ${data.updated_affiliates ?? 0} affiliate(s).`
          : `Default set to ${pct}% for new affiliates.`
      );
      setApplyDefaultToAll(false);
      if (shouldApplyAll) await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save default rate");
    } finally {
      setSavingDefault(false);
    }
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const rate = Number(ratePercent) / 100;
    const normalized = code
      ? normalizeAffiliateCode(code)
      : toAffiliateCode(name || email.split("@")[0] || "affiliate");
    if (!isValidAffiliateCode(normalized)) {
      setError(`Code must be exactly ${AFFILIATE_CODE_LENGTH} characters (a–z, 0–9)`);
      return;
    }
    const res = await fetch("/api/affiliate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        code: normalized,
        commission_rate: rate,
        clerk_user_id: clerkUserId.trim() || null,
        status: "active",
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError([data.error, data.detail].filter(Boolean).join(" — ") || "Create failed");
      return;
    }
    setName("");
    setEmail("");
    setCode("");
    setClerkUserId("");
    setRatePercent(defaultRatePercent);
    await load();
  };

  const patchAffiliate = async (
    id: string,
    body: Record<string, unknown>
  ) => {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/affiliate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const deleteAffiliate = async (id: string) => {
    setBusyId(id);
    setError(null);
    setSettingsMessage(null);
    try {
      const res = await fetch("/api/affiliate", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "Delete failed");
      setSettingsMessage(`Deleted affiliate ${data.deleted?.code || id}`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const saveRate = async (id: string) => {
    const rate = Number(editRatePercent) / 100;
    if (!Number.isFinite(rate) || rate < 0 || rate > 1) {
      setError("Rate must be between 0 and 100%");
      return;
    }
    await patchAffiliate(id, { commission_rate: rate });
    setEditingRateId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Affiliates</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Unique links, paid-order attribution, and commission activity. Self-signups start as
          pending until you approve them.{" "}
          <a
            href="/affiliate/guide"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Partner guide + PDF
          </a>
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {settingsMessage && <p className="text-sm text-green-700">{settingsMessage}</p>}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Default commission %</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveDefaultRate} className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="w-full sm:w-40">
              <Label htmlFor="default-aff-rate">Program default %</Label>
              <Input
                id="default-aff-rate"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={defaultRatePercent}
                onChange={(e) => setDefaultRatePercent(e.target.value)}
                required
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground pb-2">
              <input
                type="checkbox"
                className="rounded border-border"
                checked={applyDefaultToAll}
                onChange={(e) => setApplyDefaultToAll(e.target.checked)}
              />
              Apply to all existing affiliates
            </label>
            <Button type="submit" disabled={savingDefault}>
              {savingDefault ? "Saving…" : "Save default %"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-3">
            New signups and new admin-created affiliates use this rate unless you override it.
            You can still edit each affiliate’s rate in the table below.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create affiliate</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={create} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
            <div>
              <Label htmlFor="aff-name">Name</Label>
              <Input id="aff-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="aff-email">Email</Label>
              <Input
                id="aff-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="aff-code">8-char code</Label>
              <Input
                id="aff-code"
                value={code}
                maxLength={AFFILIATE_CODE_LENGTH}
                onChange={(e) => setCode(normalizeAffiliateCode(e.target.value).slice(0, 8))}
                placeholder="e.g. reve2026"
              />
            </div>
            <div>
              <Label htmlFor="aff-rate">Commission %</Label>
              <Input
                id="aff-rate"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={ratePercent}
                onChange={(e) => setRatePercent(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="aff-clerk">Clerk user id (optional)</Label>
              <Input
                id="aff-clerk"
                value={clerkUserId}
                onChange={(e) => setClerkUserId(e.target.value)}
                placeholder="leave blank to claim by email later"
              />
            </div>
            <Button type="submit">Add active affiliate</Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 pr-2">Name</th>
                  <th className="py-2 pr-2">Link</th>
                  <th className="py-2 pr-2">Rate</th>
                  <th className="py-2 pr-2">Orders</th>
                  <th className="py-2 pr-2">Sales</th>
                  <th className="py-2 pr-2">Earnings</th>
                  <th className="py-2 pr-2">Status</th>
                  <th className="py-2 pr-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map((a) => (
                  <tr key={a.id} className="border-b border-border/50 align-top">
                    <td className="py-3 pr-2">
                      <div className="font-medium">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.email}</div>
                      {a.clerkUserId ? (
                        <div className="text-[10px] text-muted-foreground mt-0.5 font-mono truncate max-w-[140px]">
                          {a.clerkUserId}
                        </div>
                      ) : (
                        <div className="text-[10px] text-amber-700 mt-0.5">Unlinked (claim by email)</div>
                      )}
                    </td>
                    <td className="py-3 pr-2">
                      <code className="text-xs break-all">{shareLink(a.code)}</code>
                      <div className="text-[10px] text-muted-foreground mt-0.5">code: {a.code}</div>
                    </td>
                    <td className="py-3 pr-2">
                      {editingRateId === a.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            className="h-8 w-16"
                            type="number"
                            min={0}
                            max={100}
                            step={0.1}
                            value={editRatePercent}
                            onChange={(e) => setEditRatePercent(e.target.value)}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            disabled={busyId === a.id}
                            onClick={() => void saveRate(a.id)}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="text-left hover:underline"
                          onClick={() => {
                            setEditingRateId(a.id);
                            setEditRatePercent(String(Number(a.commissionRate) * 100));
                          }}
                        >
                          {(Number(a.commissionRate) * 100).toFixed(0)}%
                        </button>
                      )}
                    </td>
                    <td className="py-3 pr-2">{a.stats?.confirmedOrders ?? 0}</td>
                    <td className="py-3 pr-2">₱{(a.stats?.totalSales ?? 0).toLocaleString()}</td>
                    <td className="py-3 pr-2">₱{(a.stats?.totalEarnings ?? 0).toLocaleString()}</td>
                    <td className="py-3 pr-2">
                      <span
                        className={
                          a.status === "active"
                            ? "text-green-700"
                            : a.status === "pending"
                              ? "text-amber-700"
                              : "text-muted-foreground"
                        }
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 pr-2">
                      <div className="flex flex-wrap gap-1">
                        {a.status !== "active" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            disabled={busyId === a.id}
                            onClick={() => void patchAffiliate(a.id, { status: "active" })}
                          >
                            Approve
                          </Button>
                        )}
                        {a.status !== "inactive" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            disabled={busyId === a.id}
                            onClick={() => void patchAffiliate(a.id, { status: "inactive" })}
                          >
                            Suspend
                          </Button>
                        )}
                        {a.status !== "pending" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs"
                            disabled={busyId === a.id}
                            onClick={() => void patchAffiliate(a.id, { status: "pending" })}
                          >
                            Pending
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-7 text-xs"
                          disabled={busyId === a.id}
                          onClick={() => {
                            if (
                              !window.confirm(
                                `Delete affiliate "${a.name}" (${a.code})?\n\nThis removes the entry and commission history. It does not remove the affiliate feature.`
                              )
                            ) {
                              return;
                            }
                            void deleteAffiliate(a.id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {affiliates.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-6 text-muted-foreground text-center">
                      No affiliates yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent attributed paid orders</CardTitle>
            </CardHeader>
            <CardContent>
              {commissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No commissions recorded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[480px]">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="py-2">Order</th>
                        <th className="py-2">Subtotal</th>
                        <th className="py-2">Commission</th>
                        <th className="py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissions.slice(0, 50).map((c) => (
                        <tr key={c.id} className="border-b border-border/50">
                          <td className="py-2">{c.orderNumber}</td>
                          <td className="py-2">₱{Number(c.orderSubtotal).toLocaleString()}</td>
                          <td className="py-2">₱{Number(c.commissionAmount).toLocaleString()}</td>
                          <td className="py-2 text-muted-foreground">
                            {new Date(c.createdAt).toLocaleString("en-PH")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
