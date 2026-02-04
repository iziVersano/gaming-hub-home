import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, CheckCircle, Info } from 'lucide-react';
import Footer from '@/components/Footer';
import { translations } from '@/i18n';

// Use Azure backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const WARRANTY_ENDPOINT = `${API_BASE_URL}/warranty`;

// Field error type
interface FieldErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  productModel?: string;
  serialNumber?: string;
  purchaseDate?: string;
  storeName?: string;
  file?: string;
}

const Warranty = () => {
  const navigate = useNavigate();

  // Use Hebrew translations directly for this page only
  const t = useCallback((key: string) => translations.he[key] || key, []);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    productModel: '',
    serialNumber: '',
    purchaseDate: '',
    storeName: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Get today's date in YYYY-MM-DD format for max date validation
  const today = new Date().toISOString().split('T')[0];

  // Validate a single field
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return t('warranty.errors.required');
        if (value.trim().length < 2) return t('warranty.errors.nameTooShort');
        return undefined;
      case 'email':
        if (!value.trim()) return t('warranty.errors.required');
        if (!/^\S+@\S+\.\S+$/.test(value)) return t('warranty.errors.invalidEmail');
        return undefined;
      case 'phone':
        if (!value.trim()) return t('warranty.errors.required');
        if (!/^0\d{1,2}[-]?\d{7}$/.test(value.replace(/\s/g, ''))) return t('warranty.errors.invalidPhone');
        return undefined;
      case 'productModel':
        if (!value.trim()) return t('warranty.errors.required');
        return undefined;
      case 'serialNumber':
        if (!value.trim()) return t('warranty.errors.required');
        if (value.trim().length < 4) return t('warranty.errors.serialTooShort');
        return undefined;
      case 'purchaseDate':
        if (!value) return t('warranty.errors.required');
        if (new Date(value) > new Date()) return t('warranty.errors.futureDateNotAllowed');
        return undefined;
      case 'storeName':
        if (!value.trim()) return t('warranty.errors.required');
        return undefined;
      default:
        return undefined;
    }
  };

  // Validate file
  const validateFile = (selectedFile: File | null): string | undefined => {
    if (!selectedFile) return t('warranty.errors.fileRequired');
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (!validTypes.includes(selectedFile.type)) return t('warranty.errors.invalidFileType');
    if (selectedFile.size > maxSize) return t('warranty.errors.fileTooLarge');
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate on change if field was touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setTouched(prev => ({ ...prev, file: true }));

    if (selectedFile) {
      const error = validateFile(selectedFile);
      if (error) {
        setErrors(prev => ({ ...prev, file: error }));
        setFile(null);
        // Reset the input
        e.target.value = '';
        return;
      }
      setErrors(prev => ({ ...prev, file: undefined }));
      setFile(selectedFile);
    } else {
      setFile(null);
      setErrors(prev => ({ ...prev, file: 'נא להעלות קובץ חשבונית' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Mark all fields as touched
    const allTouched = {
      fullName: true,
      email: true,
      phone: true,
      productModel: true,
      serialNumber: true,
      purchaseDate: true,
      storeName: true,
      file: true,
    };
    setTouched(allTouched);

    // Validate all fields
    const newErrors: FieldErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key as keyof FieldErrors] = error;
    });
    const fileError = validateFile(file);
    if (fileError) newErrors.file = fileError;

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== undefined)) {
      toast({ variant: "destructive", title: "אנא תקנו את השגיאות בטופס" });
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('customerName', formData.fullName);
      submitData.append('email', formData.email);
      submitData.append('product', formData.productModel);
      submitData.append('serialNumber', formData.serialNumber);
      submitData.append('invoice', file!);

      const res = await fetch(WARRANTY_ENDPOINT, {
        method: "POST",
        body: submitData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Show success message and redirect to home after 3 seconds
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
        return;
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (error) {
      console.error('Warranty submission error:', error);
      toast({ variant: "destructive", title: "אירעה שגיאה בשליחת הטופס", description: "אנא נסו שנית" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-input rounded-lg border border-border focus:outline-none text-right box-border";
  const inputErrorClass = "w-full px-4 py-3 bg-input rounded-lg border border-red-500 focus:outline-none text-right box-border";
  const labelClass = "block text-sm font-medium mb-2 text-right";
  const errorClass = "text-sm text-red-500 mt-1.5 text-right break-words";

  return (
    <div dir="rtl" className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{t('warranty.title')} - {t('warranty.subtitle')} | Consoltech</title>
        <meta name="description" content={t('warranty.description')} />
        <html lang="he" />
      </Helmet>

      <main id="main-content" className="flex-1">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 gradient-text leading-tight">
            {t('warranty.title')}
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
            {t('warranty.subtitle')}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg px-2">
            {t('warranty.description')}
          </p>
        </div>

        {/* Success Message */}
        {isSuccess ? (
          <div className="product-card text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4 text-green-500">{t('warranty.success.title')}</h2>
            <p className="text-muted-foreground text-lg">
              {t('warranty.success.description')}
            </p>
          </div>
        ) : (
          /* Form */
          <div className="product-card">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Full Name */}
              <div>
                <label className={labelClass}>{t('warranty.fullName')} *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.fullName && errors.fullName ? inputErrorClass : inputClass}
                  placeholder={t('warranty.placeholders.fullName')}
                />
                {touched.fullName && errors.fullName && (
                  <p className={errorClass}>{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>{t('warranty.email')} *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.email && errors.email ? inputErrorClass : inputClass}
                  placeholder={t('warranty.placeholders.email')}
                  dir="ltr"
                  style={{ textAlign: 'left' }}
                />
                {touched.email && errors.email && (
                  <p className={errorClass}>{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>{t('warranty.phone')} *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.phone && errors.phone ? inputErrorClass : inputClass}
                  placeholder={t('warranty.placeholders.phone')}
                  dir="ltr"
                  style={{ textAlign: 'left' }}
                />
                {touched.phone && errors.phone && (
                  <p className={errorClass}>{errors.phone}</p>
                )}
              </div>

              {/* Product Model */}
              <div>
                <label className={labelClass}>{t('warranty.productModel')} *</label>
                <input
                  type="text"
                  name="productModel"
                  value={formData.productModel}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.productModel && errors.productModel ? inputErrorClass : inputClass}
                  placeholder={t('warranty.subtitle')}
                />
                {touched.productModel && errors.productModel && (
                  <p className={errorClass}>{errors.productModel}</p>
                )}
              </div>

              {/* Serial Number */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <label className="text-sm font-medium text-right">{t('warranty.serialNumber')} (S/N) *</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center w-4 h-4 opacity-60 hover:opacity-100 transition-opacity"
                        aria-label="איפה למצוא את המספר הסידורי"
                      >
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-64 p-3"
                      side="top"
                      align="center"
                      sideOffset={8}
                    >
                      <div className="space-y-3">
                        {/* Visual guide - inline SVG */}
                        <div className="w-full h-28 bg-muted/30 rounded-md flex items-center justify-center overflow-hidden">
                          <svg viewBox="0 0 200 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Console body */}
                            <rect x="30" y="15" width="140" height="60" rx="6" fill="#2d2d2d" stroke="#444" strokeWidth="1"/>
                            {/* Serial label area */}
                            <rect x="60" y="35" width="80" height="25" rx="3" fill="#3a3a3a" stroke="#c40000" strokeWidth="2" strokeDasharray="3 2"/>
                            {/* Barcode lines */}
                            <rect x="68" y="40" width="2" height="10" fill="#666"/>
                            <rect x="72" y="40" width="1" height="10" fill="#666"/>
                            <rect x="75" y="40" width="3" height="10" fill="#666"/>
                            <rect x="80" y="40" width="1" height="10" fill="#666"/>
                            <rect x="83" y="40" width="2" height="10" fill="#666"/>
                            <rect x="87" y="40" width="1" height="10" fill="#666"/>
                            <rect x="90" y="40" width="3" height="10" fill="#666"/>
                            <rect x="95" y="40" width="2" height="10" fill="#666"/>
                            <rect x="99" y="40" width="1" height="10" fill="#666"/>
                            <rect x="102" y="40" width="2" height="10" fill="#666"/>
                            <rect x="106" y="40" width="1" height="10" fill="#666"/>
                            <rect x="109" y="40" width="3" height="10" fill="#666"/>
                            <rect x="114" y="40" width="2" height="10" fill="#666"/>
                            <rect x="118" y="40" width="1" height="10" fill="#666"/>
                            <rect x="121" y="40" width="2" height="10" fill="#666"/>
                            <rect x="125" y="40" width="1" height="10" fill="#666"/>
                            <rect x="128" y="40" width="3" height="10" fill="#666"/>
                            {/* S/N text line */}
                            <rect x="68" y="52" width="60" height="4" rx="1" fill="#555"/>
                            {/* Arrow */}
                            <path d="M100 90 L100 68" stroke="#c40000" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M94 74 L100 68 L106 74" stroke="#c40000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        {/* Text explanation */}
                        <div className="text-sm text-right space-y-1">
                          <p>את המספר הסידורי ניתן למצוא בגב הקונסולה או באריזת המוצר.</p>
                          <p className="text-muted-foreground text-xs">דוגמה לפורמט: XAW10000000000 או HAC-001(-01)</p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.serialNumber && errors.serialNumber ? inputErrorClass : inputClass}
                  placeholder={t('warranty.placeholders.serialNumber')}
                  dir="ltr"
                  style={{ textAlign: 'left' }}
                />
                {touched.serialNumber && errors.serialNumber && (
                  <p className={errorClass}>{errors.serialNumber}</p>
                )}
              </div>

              {/* Purchase Date */}
              <div>
                <label className={labelClass}>{t('warranty.purchaseDate')} *</label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  max={today}
                  className={touched.purchaseDate && errors.purchaseDate ? inputErrorClass : inputClass}
                />
                {touched.purchaseDate && errors.purchaseDate && (
                  <p className={errorClass}>{errors.purchaseDate}</p>
                )}
              </div>

              {/* Store Name */}
              <div>
                <label className={labelClass}>{t('warranty.storeName')} *</label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.storeName && errors.storeName ? inputErrorClass : inputClass}
                  placeholder={t('warranty.placeholders.storeName')}
                />
                {touched.storeName && errors.storeName && (
                  <p className={errorClass}>{errors.storeName}</p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className={labelClass}>{t('warranty.purchaseInvoice')} *</label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    id="invoice-upload"
                  />
                  <label
                    htmlFor="invoice-upload"
                    className={`flex items-center justify-center gap-3 w-full px-4 py-4 bg-input rounded-lg border-2 border-dashed cursor-pointer transition-colors box-border ${
                      touched.file && errors.file
                        ? 'border-red-500 hover:border-red-400'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <Upload className={`h-5 w-5 flex-shrink-0 ${file ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <span className={`${file ? 'text-foreground' : 'text-muted-foreground'} break-all text-center`}>
                      {file ? file.name : t('warranty.chooseFile') + ' (PDF, JPG, PNG)'}
                    </span>
                  </label>
                </div>
                {touched.file && errors.file ? (
                  <p className={errorClass}>{errors.file}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-2 text-right">
                    {t('warranty.fileInfo')}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="btn-hero w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{t('warranty.submitting')}</span>
                  </>
                ) : (
                  <span>{t('warranty.submit')}</span>
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default Warranty;

