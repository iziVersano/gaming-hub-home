import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { getAllPlacesAdmin, createPlace, updatePlace, isAuthenticated, type Place, type PlaceType } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';

const CITIES = ['ישראל', 'New York', 'Paris', 'Buenos Aires', 'London', 'Moscow'];

const PLACE_TYPES: { value: PlaceType; label: string }[] = [
  { value: 'chabad', label: 'Chabad House' },
  { value: 'hospital', label: 'Hospital / Medical Center' },
  { value: 'synagogue', label: 'Synagogue' },
  { value: 'charity', label: 'Charity / NGO' },
  { value: 'school', label: 'School / Educational' },
  { value: 'community_center', label: 'Community Center' },
  { value: 'other', label: 'Other' },
];

const MITZVOT = [
  { key: 'chesed',   he: 'חסד',           en: 'Loving Kindness' },
  { key: 'tzedakah', he: 'צדקה',          en: 'Charity' },
  { key: 'bikur',    he: 'ביקור חולים',   en: 'Visiting Sick' },
  { key: 'orchim',   he: 'הכנסת אורחים', en: 'Welcoming Guests' },
  { key: 'avelim',   he: 'ניחום אבלים',  en: 'Comforting Mourners' },
  { key: 'horim',    he: 'כיבוד הורים',  en: 'Honoring Parents' },
  { key: 'olam',     he: 'תיקון עולם',   en: 'Repairing the World' },
  { key: 'gmilut',   he: 'גמילות חסדים', en: 'Acts of Kindness' },
];

const empty = (): Omit<Place, 'id' | 'createdAt'> => ({
  name: '', type: 'chabad', city: CITIES[0], mitzvot: [],
  address: '', website: '', phone: '', description: '', approved: true,
});

const AdminPlaceForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isAuthenticated()) { navigate('/admin/login'); return; }
    if (!isEdit) return;
    getAllPlacesAdmin().then(places => {
      const p = places.find(x => x.id === parseInt(id!));
      if (p) {
        setForm({ name: p.name, type: p.type, city: p.city, mitzvot: p.mitzvot,
          address: p.address ?? '', website: p.website ?? '', phone: p.phone ?? '',
          description: p.description ?? '', approved: p.approved });
      } else {
        toast.error('Place not found');
        navigate('/admin/places');
      }
      setLoading(false);
    }).catch(() => { toast.error('Failed to load place'); setLoading(false); });
  }, [id, isEdit, navigate]);

  const set = (field: keyof typeof form, value: unknown) => setForm(f => ({ ...f, [field]: value }));

  const toggleMitzvah = (key: string) => {
    setForm(f => ({
      ...f,
      mitzvot: f.mitzvot.includes(key) ? f.mitzvot.filter(m => m !== key) : [...f.mitzvot, key],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    if (form.mitzvot.length === 0) { toast.error('Select at least one mitzvah'); return; }
    setSaving(true);
    try {
      if (isEdit) {
        await updatePlace(parseInt(id!), form);
        toast.success('Place updated');
      } else {
        await createPlace(form);
        toast.success('Place created');
      }
      navigate('/admin/places');
    } catch {
      toast.error('Failed to save place');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
    </AdminLayout>
  );

  const inputCls = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/places')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Places
          </Button>
          <h1 className="text-xl font-bold">{isEdit ? 'Edit Place' : 'Add Community Place'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="text-sm font-medium block mb-1">Organization name *</label>
              <input className={inputCls} value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="Chabad of Tel Aviv" required />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Type *</label>
              <select className={inputCls} value={form.type} onChange={e => set('type', e.target.value as PlaceType)}>
                {PLACE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          {/* City */}
          <div>
            <label className="text-sm font-medium block mb-1">City *</label>
            <select className={inputCls} value={form.city} onChange={e => set('city', e.target.value)}>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Mitzvot */}
          <div>
            <label className="text-sm font-medium block mb-2">Relevant mitzvot * <span className="text-muted-foreground font-normal">(select all that apply)</span></label>
            <div className="grid grid-cols-2 gap-2">
              {MITZVOT.map(m => (
                <label key={m.key}
                  className="flex items-center gap-2 rounded-md border p-2.5 cursor-pointer hover:bg-muted transition-colors text-sm"
                  style={form.mitzvot.includes(m.key) ? { background: 'rgba(212,175,55,0.08)', borderColor: 'rgba(212,175,55,0.5)' } : {}}>
                  <input type="checkbox" checked={form.mitzvot.includes(m.key)} onChange={() => toggleMitzvah(m.key)}
                    className="rounded" />
                  <span dir="rtl" className="font-medium">{m.he}</span>
                  <span className="text-muted-foreground text-xs">{m.en}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Optional fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Address</label>
              <input className={inputCls} value={form.address} onChange={e => set('address', e.target.value)}
                placeholder="123 Main St" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Phone</label>
              <input className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="+1 212 555 0100" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Website</label>
            <input className={inputCls} value={form.website} onChange={e => set('website', e.target.value)}
              placeholder="https://..." type="url" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Description</label>
            <textarea className={inputCls} value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Brief description shown to users..." rows={2} />
          </div>

          {/* Approved */}
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={form.approved} onChange={e => set('approved', e.target.checked)}
              className="rounded" />
            <span>Approved — visible to users in the deed picker</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create Place'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/places')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminPlaceForm;
