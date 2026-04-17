import { Helmet } from 'react-helmet-async';
import { INTEGRATIONS_CONFIG } from '../config/integrations';

/**
 * Componente per la predisposizione di Analytics e Tracciamenti.
 *
 * NOTA SULLA GDPR:
 * Se verrà utilizzato Iubenda o un servizio simile, Iubenda bloccherà
 * automaticamente questi script se sono configurati correttamente (spesso
 * richiede attributi come type="text/plain" e class="_iub_cs_activate").
 * Al momento sono predisposti come standard.
 */
export default function AnalyticsScripts() {
  const { googleAnalyticsId, metaPixelId } = INTEGRATIONS_CONFIG;

  return (
    <Helmet>
      {/* ─── GOOGLE ANALYTICS 4 ─── */}
      {googleAnalyticsId && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} />
      )}
      {googleAnalyticsId && (
        <script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}', {
              page_path: window.location.pathname,
            });
          `}
        </script>
      )}

      {/* ─── META PIXEL ─── */}
      {metaPixelId && (
        <script id="meta-pixel">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </script>
      )}
      {metaPixelId && (
        <noscript id="meta-pixel-noscript">
          {`<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1" />`}
        </noscript>
      )}
    </Helmet>
  );
}
