import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, Eye, Trash2, X, Download, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/AdminLayout';
import { isAuthenticated } from '@/lib/api';
import { USE_MOCK_DATA, getMockWarrantyRecords, deleteMockWarrantyRecord } from '@/lib/mockData';

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
  const isPdf = invoiceUrl.toLowerCase().includes('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif|webp)/i.test(invoiceUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div
        className="bg-background border border-border rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold truncate">{fileName || 'Invoice Preview'}</h3>
          <div className="flex items-center gap-2">
            <a
              href={invoiceUrl}
              download={fileName}
              className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
            <button onClick={onClose} className="p-1.5 hover:bg-muted rounded">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 min-h-[400px]">
          {isPdf ? (
            <iframe src={invoiceUrl} className="w-full h-[600px] border-0 rounded" title="Invoice PDF Preview" />
          ) : isImage ? (
            <div className="flex items-center justify-center">
              <img src={invoiceUrl} alt="Invoice" className="max-w-full max-h-[70vh] object-contain rounded" />
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Preview not available for this file type.</p>
              <a href={invoiceUrl} download={fileName} className="mt-4 inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
                Download File
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
          <h3 className="text-lg font-semibold">Delete Warranty Record</h3>
        </div>
        <p className="text-muted-foreground mb-2">
          Are you sure you want to delete the warranty record for:
        </p>
        <div className="bg-muted/50 p-3 rounded-lg mb-4">
          <p className="font-medium">{record.customerName}</p>
          <p className="text-sm text-muted-foreground">{record.product} - {record.serialNumber}</p>
        </div>
        <p className="text-sm text-red-500 mb-4">This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
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
  const [records, setRecords] = useState<WarrantyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<{ url: string; fileName: string } | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<WarrantyRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  const fetchRecords = async () => {
    try {
      let data: WarrantyRecord[];

      if (USE_MOCK_DATA) {
        // Use mock data for local development
        const mockData = await getMockWarrantyRecords();
        data = mockData as WarrantyRecord[];
      } else {
        // Fetch from API in production
        const response = await fetch(`${API_BASE_URL}/warranty`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        data = await response.json();
      }

      setRecords(data);
    } catch (err) {
      console.error('Failed to fetch warranty records:', err);
      setError('Failed to load warranty records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

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
        // Delete via API in production
        const response = await fetch(`${API_BASE_URL}/warranty/${encodeURIComponent(identifier)}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      }

      // Remove from local state
      setRecords(prev => prev.filter(r =>
        (r.rowKey && r.rowKey !== deleteRecord.rowKey) ||
        (!r.rowKey && r.serialNumber !== deleteRecord.serialNumber)
      ));
      setDeleteRecord(null);
    } catch (err) {
      console.error('Failed to delete warranty record:', err);
      alert('Failed to delete warranty record. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Warranty Records | Admin | Consoltech</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Warranty Records</h1>
            <p className="text-muted-foreground mt-1">Manage customer warranty registrations</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {records.length} record{records.length !== 1 ? 's' : ''}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading records...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : records.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No warranty records found.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto border border-border rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left p-4 font-semibold">Customer</th>
                    <th className="text-left p-4 font-semibold">Email</th>
                    <th className="text-left p-4 font-semibold">Product</th>
                    <th className="text-left p-4 font-semibold">Serial Number</th>
                    <th className="text-left p-4 font-semibold">Invoice</th>
                    <th className="text-left p-4 font-semibold">Date</th>
                    <th className="text-center p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={record.rowKey || index} className="border-b border-border hover:bg-muted/30">
                      <td className="p-4">{record.customerName}</td>
                      <td className="p-4 text-sm">{record.email}</td>
                      <td className="p-4">{record.product}</td>
                      <td className="p-4 font-mono text-sm">{record.serialNumber}</td>
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
                            View
                          </button>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => setDeleteRecord(record)}
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
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{record.customerName}</h3>
                      <p className="text-sm text-muted-foreground">{record.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10 -mt-1 -mr-2"
                      onClick={() => setDeleteRecord(record)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Product:</span>
                      <span className="ml-2 font-medium">{record.product}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Serial:</span>
                      <span className="ml-2 font-mono text-xs">{record.serialNumber}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <span className="ml-2">{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'N/A'}</span>
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
                      <Eye className="h-4 w-4 mr-2" />
                      View Invoice
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
