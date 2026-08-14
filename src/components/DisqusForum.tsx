import { useEffect } from 'react';
import { MessageSquare, Users, Sparkles } from 'lucide-react';

interface DisqusForumProps {
  pageUrl?: string;
  pageIdentifier?: string;
}

export function DisqusForum({ pageUrl, pageIdentifier = 'sunnysg-main-community' }: DisqusForumProps) {
  useEffect(() => {
    // Current URL fallback
    const currentUrl = pageUrl || (typeof window !== 'undefined' ? window.location.href : 'https://sunnysg.app');

    // Configure Disqus global config
    (window as any).disqus_config = function (this: any) {
      this.page.url = currentUrl;
      this.page.identifier = pageIdentifier;
    };

    // If DISQUS already exists on window, reset it for the current page
    if ((window as any).DISQUS) {
      (window as any).DISQUS.reset({
        reload: true,
        config: function (this: any) {
          this.page.url = currentUrl;
          this.page.identifier = pageIdentifier;
        }
      });
    } else {
      // Embed Disqus script as per universal code
      const d = document;
      const s = d.createElement('script');
      s.src = 'https://sunnysg.disqus.com/embed.js';
      s.setAttribute('data-timestamp', String(+new Date()));
      (d.head || d.body).appendChild(s);
    }

    // Embed Disqus comment count script if not already added
    if (!document.getElementById('dsq-count-scr')) {
      const countScript = document.createElement('script');
      countScript.id = 'dsq-count-scr';
      countScript.src = '//sunnysg.disqus.com/count.js';
      countScript.async = true;
      (document.head || document.body).appendChild(countScript);
    }
  }, [pageUrl, pageIdentifier]);

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs mt-10">
      {/* Forum Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Singapore Travelers & Locals Community
              </h3>
              <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" /> Disqus Forum
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ask travel tips, share shelter routes during sudden downpours, food recommendations & MRT insights.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 self-start sm:self-auto">
          <Users className="w-3.5 h-3.5 text-slate-500" />
          <span>Live Community Discussion</span>
        </div>
      </div>

      {/* Disqus Container */}
      <div className="mt-6">
        <div id="disqus_thread" className="min-h-[220px]" />
        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" className="text-amber-600 underline">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </section>
  );
}
