import { useState } from 'react';
import { 
  Crown, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Ticket, 
  Zap, 
  CloudRain, 
  Copy, 
  CheckCheck, 
  Tag, 
  HelpCircle, 
  FileText,
  Compass,
  ArrowRight
} from 'lucide-react';
import { SubscriptionTier, SubscriptionPlan } from '../types';
import { SUBSCRIPTION_PLANS, EXCLUSIVE_PROMO_VOUCHERS } from '../data/singaporeData';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  onSelectPlan: (tier: SubscriptionTier) => void;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  currentTier,
  onSelectPlan
}: SubscriptionModalProps) {
  const [selectedBillingTab, setSelectedBillingTab] = useState<'tourist' | 'monthly' | 'annual'>('tourist');
  const [copiedVoucherId, setCopiedVoucherId] = useState<string | null>(null);
  const [showVouchersList, setShowVouchersList] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyCode = (id: string, code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedVoucherId(id);
      setTimeout(() => setCopiedVoucherId(null), 2000);
    }
  };

  const isSubscriber = currentTier === 'tourist-pass' || currentTier === 'resident-pro';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">
                  Sunny SG Pass & Subscription Plans
                </h3>
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  Save S$65+ on Tickets
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Unlock multi-day itineraries, automated rain-shield safeguards, and attraction partner promo codes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-7 flex-1 overflow-y-auto">
          {/* Active Status Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                {currentTier === 'free' ? '0' : 'PRO'}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                  Current Active Plan
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {SUBSCRIPTION_PLANS.find(p => p.id === currentTier)?.name || 'Free Explorer'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isSubscriber ? (
                <button
                  onClick={() => setShowVouchersList(!showVouchersList)}
                  className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5" />
                  {showVouchersList ? 'Hide Promo Codes' : 'View My 6 Unlocked Vouchers'}
                </button>
              ) : (
                <span className="text-xs text-slate-500 font-medium">
                  Switch or activate any plan below to test instantly.
                </span>
              )}
            </div>
          </div>

          {/* Vouchers Accordion if Pro */}
          {showVouchersList && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Ticket className="w-4 h-4 text-amber-600" />
                  <span>Exclusive Partner Promo Codes (Unlocked with Pass+)</span>
                </div>
                <span className="text-[10px] text-amber-700 font-medium">
                  Valid for direct online booking
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {EXCLUSIVE_PROMO_VOUCHERS.map(voucher => (
                  <div 
                    key={voucher.id}
                    className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                          {voucher.discountPercentage}% OFF
                        </span>
                        <span className="text-[9px] text-slate-400">Exp: {voucher.validUntil}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                        {voucher.attractionName}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {voucher.description}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <code className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                        {voucher.promoCode}
                      </code>
                      <button
                        onClick={() => handleCopyCode(voucher.id, voucher.promoCode)}
                        className="text-[10px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg transition-colors"
                      >
                        {copiedVoucherId === voucher.id ? (
                          <>
                            <CheckCheck className="w-3 h-3 text-emerald-600" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isSelected = currentTier === plan.id;
              const isPopular = plan.isPopular;

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl border transition-all flex flex-col justify-between relative ${
                    isSelected
                      ? 'border-slate-900 ring-2 ring-slate-900/10 bg-white shadow-md'
                      : isPopular
                      ? 'border-amber-400 bg-gradient-to-b from-amber-50/40 to-white shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  } p-5`}
                >
                  {/* Top Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs ${
                        isPopular
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-900 text-white'
                      }`}>
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="pb-3 border-b border-slate-100">
                      <h4 className="text-base font-bold text-slate-900">
                        {plan.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 min-h-[32px]">
                        {plan.tagline}
                      </p>

                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                          {plan.priceSGD === 0 ? 'Free' : `S$${plan.priceSGD}`}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          / {plan.id === 'free' ? 'forever' : plan.id === 'tourist-pass' ? '7 days' : 'year'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {plan.periodText}
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="py-4 space-y-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Included Features:
                      </span>
                      {plan.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            plan.id === 'free' ? 'text-slate-400' : 'text-emerald-600'
                          }`} />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        onSelectPlan(plan.id);
                        if (plan.id !== 'free') {
                          setShowVouchersList(true);
                        }
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                        isSelected
                          ? 'bg-slate-100 text-slate-900 border border-slate-300 cursor-default'
                          : isPopular
                          ? 'bg-amber-500 hover:bg-amber-600 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCheck className="w-4 h-4 text-emerald-600" /> Active Plan
                        </>
                      ) : (
                        <>
                          {plan.id === 'free' ? 'Downgrade to Free' : `Switch to ${plan.name}`}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Value Comparison / FAQ */}
          <div className="border-t border-slate-200 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-sky-600" />
                How Does Auto Rain-Shield Work?
              </h5>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                When activated, Sunny SG monitors live NEA radar scans. If a sudden tropical cloudburst is detected near your outdoor itinerary stop, the engine automatically calculates the nearest sheltered underground MRT walkway and redirects you to indoor air-conditioned conservatories (Flower Dome, ArtScience, Jewel).
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-amber-600" />
                How Do I Redeem the 15% Attraction Vouchers?
              </h5>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Pass+ members get official discount promo codes (e.g. <code>SUNNYGARDENS15</code>) that can be entered directly during online checkout on partner websites (Gardens by the Bay, Cable Car, Flyer, Mandai Zoo) for instant savings.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Instant activation with zero lock-in. Toggle anytime.</span>
          </div>

          <button
            onClick={onClose}
            className="bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 font-semibold px-4 py-2 rounded-xl transition-colors text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
