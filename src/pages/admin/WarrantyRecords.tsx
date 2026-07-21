import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, Eye, Trash2, X, Download, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/AdminLayout';
import { isAuthenticated, getAuthToken, removeAuthToken } from '@/lib/api';
import { USE_MOCK_DATA, getMockWarrantyRecords, deleteMockWarrantyRecord } from '@/lib/mockData';
import { useI18n } from '@/hooks/I18nContext';
import { formatWarrantyReference } from '@/lib/warranty';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKEND_BASE_URL = API_BASE_URL.replace('/api', '');

interface WarrantyRecord {
  rowKey?: string;
  customerName: string;
  email: string;
  product: string;
  serialNumber: string;
  invoiceUrl: string;
  invoiceFileName: string;
  createdAt: string;
}

interface InvoiceModalProps {
  invoiceUrl: string;
  fileName: string;
  onClose: () => void;
}

const InvoiceModal = ({ invoiceUrl, fileName, onClose }: InvoiceModalProps) => {
  const { t } = useI18n();
  const isPdf = invoiceUrl.toLowerCase().includes('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif|webp)/i.test(invoiceUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div
        className="bg-background border border-border rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold truncate">{fileName || t('admin.warranty.invoicePreview')}</h3>
          <div className="flex items-center gap-2">
            <a
              href={invoiceUrl}
              download={fileName}
              className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              {t('admin.warranty.download')}
            </a>
            <button onClick={onClose} className="p-1.5 hover:bg-muted rounded">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 min-h-[400px]">
          {isPdf ? (
            <iframe src={invoiceUrl} className="w-full h-[600px] border-0 rounded" title={t('admin.warranty.invoicePreview')} />
          ) : isImage ? (
            <div className="flex items-center justify-center">
              <img src={invoiceUrl} alt={t('admin.warranty.invoice')} className="max-w-full max-h-[70vh] object-contain rounded" />
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>{t('admin.warranty.previewNotAvailable')}</p>
              <a href={invoiceUrl} download={fileName} className="mt-4 inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
                {t('admin.warranty.downloadFile')}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface DeleteModalProps {
  record: WarrantyRecord;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

const DeleteModal = ({ record, onConfirm, onCancel, isDeleting }: DeleteModalProps) => {
  const { t } = useI18n();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onCancel}>
      <div
        className="bg-background border border-border rounded-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/10 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold">{t('admin.warranty.deleteTitle')}</h3>
        </div>
        <p className="text-muted-foreground mb-2">
          {t('admin.warranty.deleteConfirm')}
        </p>
        <div className="bg-muted/50 p-3 rounded-lg mb-4">
          <p className="font-medium">{record.customerName}</p>
          <p className="text-sm text-muted-foreground">{record.product} - {record.serialNumber}</p>
        </div>
        <p className="text-sm text-red-500 mb-4">{t('admin.warranty.deleteWarning')}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
            {t('admin.warranty.cancel')}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('admin.warranty.deleting')}
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                {t('admin.warranty.delete')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const WarrantyRecords = () => {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const [records, setRecords] = useState<WarrantyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<{ url: string; fileName: string } | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<WarrantyRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const dateLocale = lang === 'he' ? 'he-IL' : 'en-US';
  const formatDate = (value: string) =>
    value ? new Date(value).toLocaleDateString(dateLocale) : t('admin.warranty.na');

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  /**
   * The warranty endpoint (api/warranty.js) is admin-gated and expects the
   * bearer token issued by /api/auth/login. This keeps its own wrapper rather
   * than using the shared fetchApi helper because responses here are not
   * always JSON and a 401 should surface in-page rather than hard-navigate.
   */
  const authedFetch = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
          ...options.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (response.status === 401) {
        removeAuthToken();
        navigate('/admin/login');
        throw new Error('Session expired');
      }
      return response;
    },
    [navigate],
  );

  const fetchRecords = useCallback(async () => {
    try {
      let data: WarrantyRecord[];

      if (USE_MOCK_DATA) {
        // Use mock data for local development
        const mockData = await getMockWarrantyRecords();
        data = mockData as WarrantyRecord[];
      } else {
        // Fetch from API in production
        const response = await authedFetch('/warranty');
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.message || `HTTP ${response.status}`);
        }
        data = await response.json();
      }

      setRecords(data);
    } catch (err) {
      if (err instanceof Error && err.message === 'Session expired') return;
      console.error('Failed to fetch warranty records:', err);
      setError(err instanceof Error ? err.message : t('admin.warranty.loadError'));
    } finally {
      setIsLoading(false);
    }
  }, [authedFetch, t]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleDelete = async () => {
    if (!deleteRecord) return;

    setIsDeleting(true);
    try {
      const identifier = deleteRecord.rowKey || deleteRecord.serialNumber;

      if (USE_MOCK_DATA) {
        // Use mock delete for local development
        const deleted = await deleteMockWarrantyRecord(identifier);
        if (!deleted) throw new Error('Record not found');
      } else {
        // Delete via API in production. The blob-backed endpoint addresses
        // records by rowKey only — serialNumber is not a valid handle.
        if (!deleteRecord.rowKey) {
          throw new Error(t('admin.warranty.deleteLegacyError'));
        }
        const response = await authedFetch(`/warranty?id=${encodeURIComponent(deleteRecord.rowKey)}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.message || `HTTP ${response.status}`);
        }
      }

      // Remove from local state
      setRecords(prev => prev.filter(r =>
        (r.rowKey && r.rowKey !== deleteRecord.rowKey) ||
        (!r.rowKey && r.serialNumber !== deleteRecord.serialNumber)
      ));
      setDeleteRecord(null);
    } catch (err) {
      if (err instanceof Error && err.message === 'Session expired') return;
      console.error('Failed to delete warranty record:', err);
      alert(err instanceof Error ? err.message : t('admin.warranty.deleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  const recordsLabel = records.length === 1
    ? t('admin.warranty.recordsSingular')
    : t('admin.warranty.recordsPlural');

  return (
    <AdminLayout>
      <Helmet>
        <title>{t('admin.warranty.pageTitle')}</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">{t('admin.warranty.heading')}</h1>
            <p className="text-muted-foreground mt-1">{t('admin.warranty.subtitle')}</p>
          </div>
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {records.length} {recordsLabel}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ms-3 text-muted-foreground">{t('admin.warranty.loading')}</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : records.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('admin.warranty.empty')}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto border border-border rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-start p-4 font-semibold">{t('admin.warranty.reference')}</th>
                    <th className="text-start p-4 font-semibold">{t('admin.warranty.customer')}</th>
                    <th className="text-start p-4 font-semibold">{t('admin.warranty.email')}</th>
                    <th className="text-start p-4 font-semibold">{t('admin.warranty.product')}</th>
                    <th className="text-start p-4 font-semibold">{t('admin.warranty.serialNumber')}</th>
                    <th className="text-start p-4 font-semibold">{t('admin.warranty.invoice')}</th>
                    <th className="text-start p-4 font-semibold">{t('admin.warranty.date')}</th>
                    <th className="text-center p-4 font-semibold">{t('admin.warranty.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={record.rowKey || index} className="border-b border-border hover:bg-muted/30">
                      <td className="p-4 font-mono text-sm text-primary whitespace-nowrap" dir="ltr">{record.rowKey ? formatWarrantyReference(record.rowKey) : t('admin.warranty.na')}</td>
                      <td className="p-4">{record.customerName}</td>
                      <td className="p-4 text-sm" dir="ltr">{record.email}</td>
                      <td className="p-4">{record.product}</td>
                      <td className="p-4 font-mono text-sm" dir="ltr">{record.serialNumber}</td>
                      <td className="p-4">
                        {record.invoiceUrl ? (
                          <button
                            onClick={() => setSelectedInvoice({
                              url: record.invoiceUrl.startsWith('http') ? record.invoiceUrl : `${BACKEND_BASE_URL}${record.invoiceUrl}`,
                              fileName: record.invoiceFileName
                            })}
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            {t('admin.warranty.view')}
                          </button>
                        ) : (
                          <span className="text-muted-foreground">{t('admin.warranty.na')}</span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(record.createdAt)}
                      </td>
                      <td className="p-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => setDeleteRecord(record)}
                          aria-label={t('admin.warranty.delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {records.map((record, index) => (
                <div key={record.rowKey || index} className="bg-card border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{record.customerName}</h3>
                      <p className="text-sm text-muted-foreground truncate" dir="ltr">{record.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10 shrink-0 -mt-1"
                      onClick={() => setDeleteRecord(record)}
                      aria-label={t('admin.warranty.delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm border-t border-border pt-3">
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">{t('admin.warranty.reference')}</span>
                      <span className="font-mono text-xs text-primary text-end" dir="ltr">{record.rowKey ? formatWarrantyReference(record.rowKey) : t('admin.warranty.na')}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">{t('admin.warranty.product')}</span>
                      <span className="font-medium text-end">{record.product}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">{t('admin.warranty.serialNumber')}</span>
                      <span className="font-mono text-xs text-end" dir="ltr">{record.serialNumber}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">{t('admin.warranty.date')}</span>
                      <span className="text-end">{formatDate(record.createdAt)}</span>
                    </div>
                  </div>
                  {record.invoiceUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedInvoice({
                        url: record.invoiceUrl.startsWith('http') ? record.invoiceUrl : `${BACKEND_BASE_URL}${record.invoiceUrl}`,
                        fileName: record.invoiceFileName
                      })}
                    >
                      <Eye className="h-4 w-4 me-2" />
                      {t('admin.warranty.viewInvoice')}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedInvoice && (
        <InvoiceModal
          invoiceUrl={selectedInvoice.url}
          fileName={selectedInvoice.fileName}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {deleteRecord && (
        <DeleteModal
          record={deleteRecord}
          onConfirm={handleDelete}
          onCancel={() => setDeleteRecord(null)}
          isDeleting={isDeleting}
        />
      )}
    </AdminLayout>
  );
};

export default WarrantyRecords;
