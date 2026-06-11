import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getAllPlacesAdmin, updatePlace, deletePlace, isAuthenticated, type Place } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Loader2, CheckCircle, XCircle } from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  chabad: 'Chabad',
  hospital: 'Hospital',
  synagogue: 'Synagogue',
  charity: 'Charity',
  school: 'School',
  community_center: 'Community Center',
  other: 'Other',
};

const MITZVAH_LABELS: Record<string, string> = {
  chesed: 'חסד', tzedakah: 'צדקה', bikur: 'ביקור חולים',
  orchim: 'הכנסת אורחים', avelim: 'ניחום אבלים', horim: 'כיבוד הורים',
  olam: 'תיקון עולם', gmilut: 'גמילות חסדים',
};

const AdminPlaces = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) { navigate('/admin/login'); return; }
    load();
  }, [navigate]);

  const load = async () => {
    try {
      setLoading(true);
      setPlaces(await getAllPlacesAdmin());
    } catch {
      toast.error('Failed to load places');
    } finally {
      setLoading(false);
    }
  };

  const toggleApproved = async (place: Place) => {
    try {
      const updated = await updatePlace(place.id, { approved: !place.approved });
      setPlaces(places.map(p => p.id === place.id ? updated : p));
      toast.success(updated.approved ? 'Place approved' : 'Place hidden');
    } catch {
      toast.error('Failed to update place');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePlace(deleteId);
      setPlaces(places.filter(p => p.id !== deleteId));
      toast.success('Place deleted');
    } catch {
      toast.error('Failed to delete place');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🏛️ Community Places</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Registered organizations shown to users in the Kotel Wall deed picker
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/places/new">
              <Plus className="h-4 w-4 mr-2" /> Add Place
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Mitzvot</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {places.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No places registered yet
                    </TableCell>
                  </TableRow>
                ) : places.map(place => (
                  <TableRow key={place.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{place.name}</p>
                        {place.address && <p className="text-xs text-muted-foreground">{place.address}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{TYPE_LABELS[place.type] ?? place.type}</Badge>
                    </TableCell>
                    <TableCell>{place.city}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-48">
                        {place.mitzvot.slice(0, 4).map(m => (
                          <span key={m} className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            {MITZVAH_LABELS[m] ?? m}
                          </span>
                        ))}
                        {place.mitzvot.length > 4 && (
                          <span className="text-[10px] text-muted-foreground">+{place.mitzvot.length - 4}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleApproved(place)}
                        className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                        style={{ color: place.approved ? '#16a34a' : '#9ca3af' }}
                      >
                        {place.approved
                          ? <><CheckCircle className="h-4 w-4" /> Approved</>
                          : <><XCircle className="h-4 w-4" /> Hidden</>
                        }
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/admin/places/edit/${place.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(place.id)}
                          className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this place?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the organization from the community deed picker. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminPlaces;
