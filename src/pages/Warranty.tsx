import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, CheckCircle2, Info, Home, RotateCcw } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { translations } from '@/i18n';
import { formatWarrantyReference } from '@/lib/warranty';

// Production: same-origin Vercel serverless function (api/warranty.js).
// Dev: the local NestJS backend (backend/api) via VITE_API_URL.
const WARRANTY_ENDPOINT = import.meta.env.PROD
  ? '/api/warranty'
  : `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/warranty`;

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
  const [confirmationRef, setConfirmationRef] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<typeof formData | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Get today's date in YYYY-MM-DD format for max date validation
  const today = new Date().toISOString().split('T')[0];

  const formatHebrewDate = (value: string): string => {
    if (!value) return '';
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toLocaleDateString('he-IL');
  };

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
    const maxSize = 4 * 1024 * 1024; // 4MB — Vercel serverless request body limit is 4.5MB
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
      submitData.append('phone', formData.phone);
      submitData.append('product', formData.productModel);
      submitData.append('serialNumber', formData.serialNumber);
      submitData.append('purchaseDate', formData.purchaseDate);
      submitData.append('storeName', formData.storeName);
      if (file) submitData.append('invoice', file, file.name);

      const res = await fetch(WARRANTY_ENDPOINT, {
        method: 'POST',
        body: submitData,
      });

      if (!res.ok) throw new Error(`Warranty API returned ${res.status}`);

      const result = await res.json().catch(() => null);
      setConfirmationRef(formatWarrantyReference(result?.id));
      setSubmittedData(formData);
      setIsSuccess(true);
      // Intentionally no auto-redirect: the customer must see a persistent
      // confirmation with their reference number. They navigate away manually.
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Warranty submission error:', error);
      toast({
        variant: "destructive",
        title: "אירעה שגיאה בשליחת הטופס",
        description: "אנא נסו שנית",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      productModel: '',
      serialNumber: '',
      purchaseDate: '',
      storeName: '',
    });
    setFile(null);
    setErrors({});
    setTouched({});
    setConfirmationRef(null);
    setSubmittedData(null);
    setIsSuccess(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const inputClass = "w-full px-4 py-3 bg-muted/30 rounded-lg border border-border focus:outline-none focus:border-primary text-foreground text-right box-border transition-colors";
  const inputErrorClass = "w-full px-4 py-3 bg-muted/30 rounded-lg border border-red-500 focus:outline-none text-foreground text-right box-border transition-colors";
  const labelClass = "block text-sm font-semibold mb-2 text-right text-foreground";
  const errorClass = "text-sm text-red-400 mt-1.5 text-right break-words";

  return (
    <div dir="rtl" className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{t('warranty.title')} - {t('warranty.subtitle')} | Consoltech</title>
        <meta name="description" content={t('warranty.description')} />
        <html lang="he" />
      </Helmet>

      <Navigation />

      <main id="main-content" className="flex-1 pt-16 md:pt-24 container px-4 md:px-6 pb-16">
      <div className="max-w-3xl mx-auto py-4 sm:py-8">
        {/* Header */}
        <header className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('warranty.title')}</span>
          </h1>
        </header>

        {/* Mobile hero banner — replaces logo */}
        <div className="md:hidden w-full rounded-2xl overflow-hidden mb-4 relative" style={{ height: '220px' }}>
          <img
            src="/images/nintendo-switch-2-banner-1.jpg"
            alt="Nintendo Switch 2"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Desktop logo — only on desktop */}
        <div className="hidden md:block text-center mb-6">
          <img
            src="/images/nintendo-switch-2-logo.png"
            alt="Nintendo Switch 2"
            className="mx-auto"
            style={{ height: '100px', width: 'auto' }}
          />
        </div>

        <p className="text-muted-foreground text-base mb-6 px-2 text-center">{t('warranty.description')}</p>

        {/* Success / Confirmation screen */}
        {isSuccess ? (
          <div className="max-w-2xl mx-auto rounded-2xl bg-card/50 backdrop-blur-sm border border-border overflow-hidden">
            {/* Header */}
            <div className="text-center px-6 pt-10 pb-8 border-b border-border">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 ring-8 ring-green-500/5">
                <CheckCircle2 className="h-11 w-11 text-green-500" />
              </div>
              <span className="inline-block mb-3 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-500">
                {t('warranty.success.badge')}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">{t('warranty.success.heading')}</h2>
              <p className="text-muted-foreground">{t('warranty.success.intro')}</p>
            </div>

            {/* Reference number */}
            <div className="px-6 py-5 text-center bg-muted/20 border-b border-border">
              <p className="text-xs text-muted-foreground mb-1">{t('warranty.success.referenceLabel')}</p>
              <p className="text-xl font-mono font-bold tracking-widest text-primary" dir="ltr">{confirmationRef}</p>
            </div>

            {/* Registration details */}
            {submittedData && (
              <div className="px-6 py-5 border-b border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">{t('warranty.success.detailsTitle')}</h3>
                <dl className="space-y-2.5 text-sm">
                  {([
                    [t('warranty.fullName'), submittedData.fullName, false],
                    [t('warranty.email'), submittedData.email, true],
                    [t('warranty.phone'), submittedData.phone, true],
                    [t('warranty.productModel'), submittedData.productModel, false],
                    [t('warranty.serialNumber'), submittedData.serialNumber, true],
                    [t('warranty.purchaseDate'), formatHebrewDate(submittedData.purchaseDate), false],
                    [t('warranty.storeName'), submittedData.storeName, false],
                  ] as [string, string, boolean][]).map(([label, value, ltr]) => (
                    <div key={label} className="flex items-start justify-between gap-4">
                      <dt className="text-muted-foreground shrink-0">{label}</dt>
                      <dd className="font-medium text-end break-words" dir={ltr ? 'ltr' : undefined}>
                        {value || t('warranty.success.noValue')}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Reassurance note */}
            <div className="px-6 py-5">
              <div className="flex items-start gap-2 rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{t('warranty.success.emailNote')}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate('/')}
                className="flex-1 font-bold py-6 rounded-xl text-white transition-all duration-300 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)', boxShadow: '0 0 24px rgba(220,38,38,0.5)' }}
              >
                <Home className="h-5 w-5" />
                <span>{t('warranty.success.backHome')}</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1 py-6 rounded-xl"
              >
                <RotateCcw className="h-5 w-5" />
                <span>{t('warranty.success.submitAnother')}</span>
              </Button>
            </div>
          </div>
        ) : (
          /* Form — matches NintendoSwitch2Manual card style */
          <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
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
                    className={`flex items-center justify-center gap-3 w-full px-4 py-4 bg-muted/30 rounded-lg border-2 border-dashed cursor-pointer transition-colors box-border ${
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
                className="w-full font-bold text-lg py-6 rounded-xl text-white transition-all duration-300 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)', boxShadow: '0 0 24px rgba(220,38,38,0.5)' }}
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

