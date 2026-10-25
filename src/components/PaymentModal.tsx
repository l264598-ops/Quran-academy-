import React, { useState } from 'react';
import {
  AlertCircle,
  Building,
  CheckCircle2,
  CreditCard,
  Download,
  ExternalLink,
  HelpCircle,
  Info,
  Lock,
  RefreshCw,
  Shield,
  Smartphone,
  Wallet,
  X,
} from 'lucide-react';
import { db } from '../services/db';
import { Course, PaymentInvoice } from '../types';
import { formatCurrencyPrice } from '../utils/islamicUtils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  packageName?: string;
  initialAmountUSD?: number;
  onPaymentSuccess?: (invoice: PaymentInvoice) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  course,
  packageName = 'Standard Package (3 Classes/Week)',
  initialAmountUSD,
  onPaymentSuccess,
}) => {
  const currentUser = db.getCurrentUser();
  const settings = db.getSettings();
  const gatewayConfig = db.getGatewayConfig();

  const [currency, setCurrency] = useState('USD');
  const [isRecurring, setIsRecurring] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'stripe_card' | 'paypal' | 'bank_transfer' | 'easypaisa_jazzcash'>('stripe_card');
  const [testMode, setTestMode] = useState<'success' | 'fail'>('success');
  const [showEnvGuide, setShowEnvGuide] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [billingName, setBillingName] = useState(currentUser.name);

  // Offline / Bank transaction proof state
  const [bankTxnRef, setBankTxnRef] = useState('');

  // Processing & Outcome states
  const [processing, setProcessing] = useState(false);
  const [outcome, setOutcome] = useState<{
    status: 'success' | 'failure' | null;
    invoice?: PaymentInvoice;
    message?: string;
  }>({ status: null });

  if (!isOpen) return null;

  const baseUSD = initialAmountUSD || course.pricePerMonthUSD || 45;
  const totalAmount = isRecurring ? baseUSD : baseUSD * 3; // 3-month package if one-time

  const handleTestCardFill = (type: 'success' | 'fail') => {
    setTestMode(type);
    if (type === 'success') {
      setCardNumber('4242 4242 4242 4242');
    } else {
      setCardNumber('4000 0000 0000 0002');
    }
  };

  const handleProcess = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setOutcome({ status: null });

    setTimeout(() => {
      const result = db.processPayment({
        studentId: currentUser.id,
        studentName: currentUser.name,
        courseTitle: course.title,
        packageName,
        amount: totalAmount,
        currency,
        method: paymentMethod,
        isRecurring,
        cardNumberMock: paymentMethod === 'stripe_card' ? cardNumber.replace(/\s+/g, '') : undefined,
      });

      setProcessing(false);

      if (result.success) {
        setOutcome({
          status: 'success',
          invoice: result.invoice,
          message: result.message,
        });

        // Ensure enrollment exists in DB
        db.createEnrollment({
          studentId: currentUser.id,
          studentName: currentUser.name,
          courseId: course.id,
          courseTitle: course.title,
          packageName,
          frequency: '3 days per week (Mon, Wed, Fri)',
          monthlyFee: totalAmount,
          currency,
        });

        if (onPaymentSuccess) {
          onPaymentSuccess(result.invoice);
        }
      } else {
        setOutcome({
          status: 'failure',
          invoice: result.invoice,
          message: result.message,
        });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-emerald-200 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5" /> 256-Bit Encrypted Secure Checkout
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Complete Course Enrollment</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            {course.title} · Teacher Bua Qasim Shigry
          </p>
        </div>

        {/* Sandbox Mode & API Keys Notice */}
        <div className="bg-amber-50/80 border-b border-amber-200/60 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold uppercase text-[10px]">
              {gatewayConfig.mode.toUpperCase()} GATEWAY
            </span>
            <span>Test mode active · Real credit card will not be charged.</span>
          </div>
          <button
            type="button"
            onClick={() => setShowEnvGuide(!showEnvGuide)}
            className="text-amber-800 underline font-semibold flex items-center gap-1 hover:text-amber-950"
          >
            <Info className="w-3.5 h-3.5" /> API Keys Guide
          </button>
        </div>

        {/* API Keys Configuration Accordion */}
        {showEnvGuide && (
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs text-slate-700 space-y-2">
            <p className="font-bold text-slate-900">Setting Up Live Production Payment Gateways:</p>
            <p>
              To accept real credit cards and automated bank drafts, configure these environment variables in your server or Cloud Run settings:
            </p>
            <div className="font-mono bg-white p-3 rounded-lg border border-slate-200 space-y-1 text-slate-800">
              <p><span className="text-emerald-700 font-semibold">VITE_STRIPE_PUBLIC_KEY</span>="pk_live_..."</p>
              <p><span className="text-emerald-700 font-semibold">STRIPE_SECRET_KEY</span>="sk_live_..."</p>
              <p><span className="text-emerald-700 font-semibold">PAYPAL_CLIENT_ID</span>="AZ_live_..."</p>
              <p><span className="text-emerald-700 font-semibold">PAYMENT_WEBHOOK_SECRET</span>="whsec_..."</p>
            </div>
            <p className="text-slate-500 text-[11px]">
              For local Pakistani students, fees are also supported via manual bank wire (Meezan Bank IBAN) and JazzCash / Easypaisa with instant receipt verification by academy administrators.
            </p>
          </div>
        )}

        {/* Outcome View: SUCCESS */}
        {outcome.status === 'success' && outcome.invoice && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-slate-900">Payment & Enrollment Successful!</h3>
              <p className="text-sm text-slate-600">
                Alhamdulillah! Your tuition has been confirmed. Your official invoice reference is:
              </p>
              <p className="text-lg font-mono font-bold text-emerald-800">{outcome.invoice.invoiceNumber}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left text-xs text-slate-700 space-y-1.5">
              <div className="flex justify-between py-1 border-b border-slate-200 font-medium">
                <span>Course</span>
                <span className="font-semibold text-slate-900">{course.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Student</span>
                <span className="font-semibold text-slate-900">{currentUser.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Amount Paid</span>
                <span className="font-semibold text-emerald-800">
                  {outcome.invoice.currency} {outcome.invoice.amount}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Payment Method</span>
                <span className="font-medium text-slate-800">{outcome.invoice.paymentMethod}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" /> Print Official Receipt
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
              >
                Go to Student Portal
              </button>
            </div>
          </div>
        )}

        {/* Outcome View: FAILURE */}
        {outcome.status === 'failure' && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-slate-900">Payment Authorization Declined</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {outcome.message || 'Your card issuer or payment gateway declined this transaction.'}
              </p>
            </div>
            <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 max-w-md mx-auto text-left text-xs text-red-800">
              <p className="font-semibold mb-1">Common causes in sandbox testing:</p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                <li>Using a test card configured for rejection (e.g. 4000...0002)</li>
                <li>Temporary gateway simulated timeout</li>
                <li>Insufficient test authorization balance</li>
              </ul>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleTestCardFill('success')}
                className="px-5 py-2.5 bg-emerald-800 text-white font-semibold text-xs rounded-xl hover:bg-emerald-900 transition-colors"
              >
                Retry with Success Card (4242...)
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Main Payment Form */}
        {outcome.status === null && (
          <form onSubmit={handleProcess} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Currency & Billing Frequency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="USD">USD ($) - US & International</option>
                  <option value="GBP">GBP (£) - United Kingdom</option>
                  <option value="EUR">EUR (€) - Europe</option>
                  <option value="CAD">CAD (CA$) - Canada</option>
                  <option value="AED">AED - United Arab Emirates</option>
                  <option value="PKR">PKR (Rs.) - Pakistan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Billing Schedule
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRecurring(true)}
                    className={`flex-1 py-1.5 px-2 text-xs rounded-lg border text-center transition-colors ${
                      isRecurring
                        ? 'bg-emerald-800 text-white border-emerald-800 font-semibold'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Monthly Tuition
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRecurring(false)}
                    className={`flex-1 py-1.5 px-2 text-xs rounded-lg border text-center transition-colors ${
                      !isRecurring
                        ? 'bg-emerald-800 text-white border-emerald-800 font-semibold'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    3-Month Semester
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe_card')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'stripe_card'
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-700/20 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-emerald-700" />
                  <span className="text-xs block">Card (Stripe)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-700/20 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Wallet className="w-5 h-5 mx-auto mb-1 text-sky-600" />
                  <span className="text-xs block">PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-700/20 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Building className="w-5 h-5 mx-auto mb-1 text-amber-700" />
                  <span className="text-xs block">Bank Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('easypaisa_jazzcash')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'easypaisa_jazzcash'
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-700/20 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1 text-green-600" />
                  <span className="text-xs block">Easypaisa</span>
                </button>
              </div>
            </div>

            {/* Method Details: STRIPE CREDIT CARD */}
            {paymentMethod === 'stripe_card' && (
              <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-semibold text-slate-800">Card Credentials (Sandbox)</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTestCardFill('success')}
                      className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                        testMode === 'success' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white text-slate-600 border-slate-300'
                      }`}
                    >
                      Use Pass Card
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTestCardFill('fail')}
                      className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                        testMode === 'fail' ? 'bg-red-800 text-white border-red-800' : 'bg-white text-slate-600 border-slate-300'
                      }`}
                    >
                      Use Fail Card
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                    />
                    <CreditCard className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">CVC / CVV</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="123"
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Cardholder Name</label>
                  <input
                    type="text"
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>
            )}

            {/* Method Details: PAYPAL */}
            {paymentMethod === 'paypal' && (
              <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-200 text-xs text-sky-950 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <Wallet className="w-4 h-4 text-sky-700" />
                  <span>PayPal Express Checkout (Sandbox)</span>
                </div>
                <p>
                  You will be redirected to PayPal sandbox to authorize payment with buyer email <code>buyer-sb@quranacademy.com</code>.
                </p>
                <div className="p-2 bg-white rounded border border-sky-200 font-mono text-[11px]">
                  ClientID: {gatewayConfig.paypalClientId}
                </div>
              </div>
            )}

            {/* Method Details: BANK TRANSFER */}
            {paymentMethod === 'bank_transfer' && (
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <Building className="w-4 h-4 text-amber-800" />
                  <span>Direct Bank Wire Details</span>
                </div>
                <p className="font-mono bg-white p-2.5 rounded border border-amber-200 leading-relaxed text-slate-800">
                  {settings.bankAccountDetails}
                </p>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Your Bank Transaction Reference / Deposit Slip No.
                  </label>
                  <input
                    type="text"
                    value={bankTxnRef}
                    onChange={(e) => setBankTxnRef(e.target.value)}
                    placeholder="e.g. FT2629402914 or Online Ref"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Method Details: EASYPAISA / JAZZCASH */}
            {paymentMethod === 'easypaisa_jazzcash' && (
              <div className="bg-green-50/70 p-4 rounded-xl border border-green-200 text-xs text-green-950 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <Smartphone className="w-4 h-4 text-green-700" />
                  <span>Mobile Account (Easypaisa / JazzCash)</span>
                </div>
                <p className="font-mono bg-white p-2.5 rounded border border-green-200 text-slate-800">
                  {settings.easypaisaDetails}
                </p>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Transaction ID (TID) from SMS (3737 / 8558)
                  </label>
                  <input
                    type="text"
                    value={bankTxnRef}
                    onChange={(e) => setBankTxnRef(e.target.value)}
                    placeholder="e.g. TID 01928472918"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Order Summary Strip */}
            <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Total Due:</span>
                <span className="text-xl font-bold text-emerald-950">
                  {formatCurrencyPrice(totalAmount, currency)}
                </span>
                <span className="text-[11px] text-slate-500 ml-1">
                  ({isRecurring ? 'per month' : 'full 3-month fee'})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Authorizing...
                    </>
                  ) : (
                    <>
                      <Shield className="w-3.5 h-3.5 text-amber-300" /> Pay & Activate Enrollment
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
