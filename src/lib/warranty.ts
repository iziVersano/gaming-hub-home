/**
 * Build the customer-facing warranty reference (e.g. "CT-AB12CD34") from the
 * server-issued record id, whose shape is "warranty-<timestamp>-<random>".
 *
 * This MUST stay the single source of truth: the public confirmation screen
 * shows the customer this reference, and the admin records list shows the same
 * value so staff can match a customer's reference to their record. Deriving it
 * in two places would risk them drifting apart.
 *
 * Falls back to a locally-generated code if no id is available.
 */
export const formatWarrantyReference = (id?: string | null): string => {
  const raw = id?.split('-').pop();
  const suffix = (raw || Date.now().toString(36)).toUpperCase();
  return `CT-${suffix}`;
};
