import { useEffect, useState, FormEvent } from 'react';
import { MessageSquare, Users, Sparkles, ExternalLink, MessageCircle, Send, Heart, Shield, RefreshCw } from 'lucide-react';

interface DisqusForumProps {
  pageUrl?: string;
  pageIdentifier?: string;
}

interface CommunityPost {
  id: string;
  author: string;
  avatarBg: string;
  timeAgo: string;
  title: string;
  content: string;
  category: 'Rain Shelter' | 'Transit Tips' | 'Food Recs' | 'Attraction Hacks';
  upvotes: number;
  hasUpvoted?: boolean;
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'Sarah Tan (Local Guide)',
    avatarBg: 'bg-emerald-500',
    timeAgo: '2 hours ago',
    title: '☔ Best underground shelter route from Raffles Place to Marina Bay Sands',
    content: 'If it starts pouring in the CBD, do NOT call an expensive surge Grab! You can walk underground via the Marina Bay Link Mall and subterranean walkways all the way from Downtown MRT directly into The Shoppes at MBS without getting a single drop of rain.',
    category: 'Rain Shelter',
    upvotes: 24,
  },
  {
    id: 'post-2',
    author: 'Marcus Wong',
    avatarBg: 'bg-blue-500',
    timeAgo: '5 hours ago',
    title: '💳 MRT Fare Tip: Foreign Mastercard / Visa SimplyGo',
    content: 'You don\'t need to buy a physical EZ-Link tourist pass. Just tap your Apple Pay / Google Wallet or foreign contactless credit card at any gantry. It charges standard Singapore resident rates (around S$1.09 - S$2.20 per trip).',
    category: 'Transit Tips',
    upvotes: 38,
  },
  {
    id: 'post-3',
    author: 'Chloe & Dave (UK Travelers)',
    avatarBg: 'bg-amber-500',
    timeAgo: 'Yesterday',
    title: '🌿 Gardens by the Bay Cloud Forest Mist Timing',
    content: 'Cloud Forest misting happens every 2 hours (10:00, 12:00, 14:00, 16:00, 18:00, 20:00). Enter 10 minutes before the hour to be at the top treetop walkway for incredible photos!',
    category: 'Attraction Hacks',
    upvotes: 19,
  }
];

export function DisqusForum({ pageUrl, pageIdentifier = 'sunnysg-main-community' }: DisqusForumProps) {
  const [activeTab, setActiveTab] = useState<'disqus' | 'community'>('disqus');
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityPost['category']>('Rain Shelter');
  const [isPosting, setIsPosting] = useState(false);
  const [disqusStatus, setDisqusStatus] = useState<'loading' | 'loaded' | 'blocked'>('loading');

  const currentCanonicalUrl = pageUrl || (typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://sunnysg.app');

  useEffect(() => {
    // 1. Configure Disqus global configuration function
    (window as any).disqus_config = function (this: any) {
      this.page.url = currentCanonicalUrl;
      this.page.identifier = pageIdentifier;
      this.page.title = 'Sunny SG Community & Live Travel Discussion';
    };

    // 2. Load or reset Disqus
    let timer: any;
    try {
      if ((window as any).DISQUS) {
        try {
          (window as any).DISQUS.reset({
            reload: true,
            config: function (this: any) {
              this.page.url = currentCanonicalUrl;
              this.page.identifier = pageIdentifier;
              this.page.title = 'Sunny SG Community & Live Travel Discussion';
            }
          });
          setDisqusStatus('loaded');
        } catch {
          // ignore disqus reset errors
        }
      } else {
        const d = document;
        let s = d.getElementById('disqus-embed-script') as HTMLScriptElement | null;
        if (!s) {
          s = d.createElement('script');
          s.id = 'disqus-embed-script';
          s.src = 'https://sunnysg.disqus.com/embed.js';
          s.async = true;
          s.crossOrigin = 'anonymous';
          s.setAttribute('data-timestamp', String(+new Date()));
          s.onload = () => setDisqusStatus('loaded');
          s.onerror = () => setDisqusStatus('blocked');
          (d.head || d.body).appendChild(s);
        }
      }

      // Check if Disqus iframe loaded within 3.5 seconds
      timer = setTimeout(() => {
        const iframe = document.querySelector('#disqus_thread iframe');
        if (iframe) {
          setDisqusStatus('loaded');
        }
      }, 3500);
    } catch {
      setDisqusStatus('blocked');
    }

    // 3. Ensure Comment Count Script is present
    if (!document.getElementById('dsq-count-scr')) {
      const countScript = document.createElement('script');
      countScript.id = 'dsq-count-scr';
      countScript.src = 'https://sunnysg.disqus.com/count.js';
      countScript.async = true;
      (document.head || document.body).appendChild(countScript);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [currentCanonicalUrl, pageIdentifier]);

  const handleUpvote = (id: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        const hasUpvoted = post.hasUpvoted;
        return {
          ...post,
          upvotes: hasUpvoted ? post.upvotes - 1 : post.upvotes + 1,
          hasUpvoted: !hasUpvoted
        };
      }
      return post;
    }));
  };

  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newEntry: CommunityPost = {
      id: 'post-' + Date.now(),
      author: 'You (Traveler)',
      avatarBg: 'bg-amber-600',
      timeAgo: 'Just now',
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      upvotes: 1,
      hasUpvoted: true
    };

    setPosts([newEntry, ...posts]);
    setNewTitle('');
    setNewContent('');
    setIsPosting(false);
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs mt-10" id="community-forum">
      {/* Forum Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Singapore Travelers & Locals Community
              </h3>
              <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" /> Live Discussion
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live Q&A, rainy day shelter hacks, authentic hawker centers, and MRT transit guidance.
            </p>
          </div>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('disqus')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'disqus'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Disqus Board</span>
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'community'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Community Tips ({posts.length})</span>
            </button>
          </div>

          <a
            href="https://disqus.com/home/forums/sunnysg/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-slate-600 hover:text-amber-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-xl transition-colors flex items-center gap-1 shrink-0"
          >
            <span>Open in Disqus</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Tab 1: Disqus Universal Embed */}
      {activeTab === 'disqus' && (
        <div className="mt-6">
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200/70 px-3.5 py-2.5 rounded-xl mb-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Authenticated via <strong>sunnysg.disqus.com</strong>. Log in with Google, Twitter/X, Facebook, or Disqus to reply.
              </span>
            </div>
            <button
              onClick={() => {
                if ((window as any).DISQUS) {
                  (window as any).DISQUS.reset({ reload: true });
                }
              }}
              className="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 shrink-0 ml-2"
            >
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>

          {/* Disqus Container */}
          <div className="bg-slate-50/40 p-4 sm:p-6 rounded-2xl border border-slate-100 min-h-[260px]">
            <div id="disqus_thread" className="w-full" />
            <noscript>
              Please enable JavaScript to view the{' '}
              <a href="https://disqus.com/?ref_noscript" className="text-amber-600 underline">
                comments powered by Disqus.
              </a>
            </noscript>
          </div>
        </div>
      )}

      {/* Tab 2: Native Community Travel Tips & Instant Q&A */}
      {activeTab === 'community' && (
        <div className="mt-6">
          {/* Post Creation Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 mb-6">
            {!isPosting ? (
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">Have a Singapore travel question or rainy day tip?</p>
                <button
                  onClick={() => setIsPosting(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Send className="w-3 h-3" /> Share Travel Tip / Ask Question
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreatePost} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Create Community Post</h4>
                  <button
                    type="button"
                    onClick={() => setIsPosting(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Topic Title (e.g. Marina Bay Link Walkway)"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    required
                    className="sm:col-span-2 text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Rain Shelter">☔ Rain Shelter</option>
                    <option value="Transit Tips">🚇 Transit Tips</option>
                    <option value="Food Recs">🍜 Food Recs</option>
                    <option value="Attraction Hacks">🎟️ Attraction Hacks</option>
                  </select>
                </div>
                <textarea
                  placeholder="Write your recommendation, question or experience..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  required
                  rows={3}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Publish to Discussion
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Posts Stream */}
          <div className="space-y-3.5">
            {posts.map(post => (
              <div key={post.id} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full ${post.avatarBg} text-white text-xs font-bold flex items-center justify-center`}>
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{post.author}</div>
                      <div className="text-[10px] text-slate-400">{post.timeAgo}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    {post.category}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 mt-2.5">
                  {post.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {post.content}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                      post.hasUpvoted
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${post.hasUpvoted ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{post.upvotes} Helpful</span>
                  </button>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" /> Sunny SG Traveler Network
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
