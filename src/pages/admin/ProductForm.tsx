import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getProduct,
  createProduct,
  updateProduct,
  uploadImage,
  getImageUrl,
  isAuthenticated,
  type Product,
} from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2, Upload, Image } from 'lucide-react';
import { useI18n } from '@/hooks/I18nContext';

const categories = ['New Arrivals', 'Gaming', 'Electronics', 'Drones', 'E-Bikes', 'TVs'];

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    price: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    if (isEditMode) {
      loadProduct();
    }
  }, [id, navigate]);

  const loadProduct = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const product = await getProduct(parseInt(id));
      setFormData({
        title: product.title,
        description: product.description,
        category: product.category,
        imageUrl: product.imageUrl,
        price: product.price.toString(),
      });
    } catch (error) {
      toast.error('Failed to load product');
      console.error('Error loading product:', error);
      navigate('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        imageUrl: formData.imageUrl,
        price: parseFloat(formData.price),
      };

      if (isEditMode && id) {
        await updateProduct(parseInt(id), {
          id: parseInt(id),
          ...productData,
        });
        toast.success(t('admin.productForm.success.updated'));
      } else {
        await createProduct(productData);
        toast.success(t('admin.productForm.success.created'));
      }

      navigate('/admin/products');
    } catch (error) {
      toast.error(t(isEditMode ? 'admin.productForm.error.update' : 'admin.productForm.error.create'));
      console.error('Error saving product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: result.imageUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/products')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t('admin.productForm.back')}</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditMode ? t('admin.productForm.editProduct') : t('admin.productForm.newProduct')}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode ? t('admin.productForm.updateDetails') : t('admin.productForm.addNew')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">{t('admin.productForm.title')} *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder={t('admin.productForm.titlePlaceholder')}
              required
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('admin.productForm.description')} *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={t('admin.productForm.descriptionPlaceholder')}
              rows={4}
              required
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{t('admin.productForm.category')} *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange('category', value)}
              disabled={isSaving}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('admin.productForm.categoryPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Product Image *</Label>

            {/* Upload Button */}
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                disabled={isSaving || isUploading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSaving || isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t('admin.productForm.uploading')}</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>{t('admin.productForm.uploadImage')}</span>
                  </>
                )}
              </Button>
            </div>

            {/* Or enter URL manually */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{t('admin.productForm.imageUrl')}:</span>
            </div>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              placeholder={t('admin.productForm.imageUrlPlaceholder')}
              required
              disabled={isSaving || isUploading}
            />

            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="mt-2 p-2 border border-border rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                <img
                  src={getImageUrl(formData.imageUrl)}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded border border-border"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">{t('admin.productForm.price')} *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder={t('admin.productForm.pricePlaceholder')}
              required
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button
              type="submit"
              className="btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t('admin.productForm.saving')}</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isEditMode ? t('admin.productForm.updateProduct') : t('admin.productForm.createProduct')}</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/admin/products')}
              disabled={isSaving}
            >
              {t('admin.productForm.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;

