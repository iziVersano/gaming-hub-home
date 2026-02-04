import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '@/hooks/I18nContext';

export default function Health() {
  const [status, setStatus] = useState<{
    manifest?: any;
    jsCheck?: { status: number; contentType: string; url: string };
    error?: string;
  }>({});

  useEffect(() => {
    async function checkHealth() {
      try {
        // Try to fetch manifest.json to get the actual JS bundle URL
        let manifestData;
        try {
          const manifestResponse = await fetch('/dist/manifest.json');
          if (manifestResponse.ok) {
            manifestData = await manifestResponse.json();
          }
        } catch (e) {
          // Manifest might not exist in dev mode
        }

        // Check the main JS module
        const jsUrl = manifestData?.['src/main.tsx']?.file || '/src/main.tsx';
        const fullJsUrl = jsUrl.startsWith('/') ? jsUrl : `/${jsUrl}`;
        
        const jsResponse = await fetch(fullJsUrl, { method: 'HEAD' });
        const contentType = jsResponse.headers.get('content-type') || '';
        
        setStatus({
          manifest: manifestData,
          jsCheck: {
            status: jsResponse.status,
            contentType,
            url: fullJsUrl
          }
        });
      } catch (error) {
        setStatus({
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    checkHealth();
  }, []);

  const isHealthy = status.jsCheck?.status === 200 && 
                   status.jsCheck?.contentType.includes('javascript');

  const { t } = useI18n();

  return (
    <>
      <Helmet>
        <title>{t('health.title')} - CONSOLTECH</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">{t('health.title')}</h1>
          
          <div className="space-y-6">
            {/* Overall Status */}
            <div className={`p-4 rounded-lg border ${
              isHealthy 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <h2 className="text-xl font-semibold mb-2">
                {t('health.statusHealthy').startsWith('✅') || t('health.statusIssues').startsWith('❌')
                  ? isHealthy
                    ? t('health.statusHealthy')
                    : t('health.statusIssues')
                  : `Status: ${isHealthy ? t('health.statusHealthy') : t('health.statusIssues')}`}
              </h2>
              <p>
                {isHealthy ? t('health.resourcesOk') : t('health.resourcesIssues')}
              </p>
            </div>

            {/* JavaScript Module Check */}
            <div className="product-card p-6">
              <h3 className="text-lg font-semibold mb-4">{t('health.jsCheckTitle')}</h3>
              {status.jsCheck ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>{t('health.label.url')}</strong>
                      <code className="block mt-1 p-2 bg-muted rounded">
                        {status.jsCheck.url}
                      </code>
                    </div>
                    <div>
                      <strong>{t('health.label.status')}</strong>
                      <span className={`ml-2 ${
                        status.jsCheck.status === 200 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {status.jsCheck.status}
                      </span>
                    </div>
                    <div>
                      <strong>{t('health.label.contentType')}</strong>
                      <span className={`ml-2 ${
                        status.jsCheck.contentType.includes('javascript') 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {status.jsCheck.contentType || 'Missing'}
                      </span>
                    </div>
                  </div>

                  {!status.jsCheck.contentType.includes('javascript') && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                      {t('health.mimeIssue').replace('{contentType}', status.jsCheck.contentType || 'Missing')}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground">{t('health.loading')}</div>
              )}
            </div>

            {/* Build Manifest */}
            <div className="product-card p-6">
              <h3 className="text-lg font-semibold mb-4">{t('health.buildManifest')}</h3>
              {status.manifest ? (
                <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-64">
                  {JSON.stringify(status.manifest, null, 2)}
                </pre>
              ) : (
                <div className="text-muted-foreground">
                  {t('health.noManifest')}
                </div>
              )}
            </div>

            {/* Error Display */}
            {status.error && (
              <div className="product-card p-6 border-red-200">
                <h3 className="text-lg font-semibold mb-4 text-red-600">{t('health.errorTitle')}</h3>
                <code className="block bg-red-50 p-4 rounded text-red-700">
                  {status.error}
                </code>
              </div>
            )}

            {/* Instructions */}
            <div className="product-card p-6">
              <h3 className="text-lg font-semibold mb-4">{t('health.troubleshootingTitle')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• {t('health.troubleshooting.list1')}</li>
                <li>• {t('health.troubleshooting.list2')}</li>
                <li>• {t('health.troubleshooting.list3')}</li>
                <li>• {t('health.troubleshooting.list4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}