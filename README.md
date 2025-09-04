# Sentry RUM Demo App: The Unstable Thread

A Next.js e-commerce demo application designed to demonstrate Real User Monitoring (RUM) capabilities with Sentry. This app intentionally includes performance issues and subtle bugs that showcase how RUM monitoring helps identify and debug real-world user experience problems.

## 🎯 Purpose

This demo accompanies the article **"Real User Monitoring for Frontend Performance and Error Debugging"** and demonstrates two critical RUM use cases:

1. **Performance Issues That Kill User Experience** - Slow loading, poor Core Web Vitals, and unresponsive interactions
2. **Hidden State Management Bugs** - Race conditions and timing issues that only occur under specific user conditions

## 🏪 The Demo: "The Unstable Thread" Store

The demo simulates an e-commerce store with deliberately implemented problems that mirror real-world issues developers face in production.

### Performance Problems Demonstrated

**Slow Homepage Loading:**
- 3-second API delay (`/api/slow-data`) simulating slow backend responses
- 2-second delay for hero image loading (poor LCP)
- Blocking JavaScript operations (1000ms while loop) causing poor INP scores
- Multiple performance bottlenecks affecting TTFB, FCP, LCP, and INP metrics

### Error Scenarios Demonstrated  

**Checkout Race Condition Bug:**
- User can proceed through checkout faster than voucher processing completes
- When "Simulate Slow Connection" is enabled, the voucher API takes 5 seconds
- If user clicks "Proceed to Payment" before voucher processing finishes, the payment page receives `null` voucher data
- Attempting to pay throws a `TypeError: Cannot read properties of null (reading 'discountPercentage')`
- Results in dead clicks, rage clicks, and user frustration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- A [Sentry account](https://sentry.io) (free tier includes RUM features)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ritza-co/sentry-rum-demo-app
   cd sentry-rum-demo-app
   npm install
   ```

2. **Configure Sentry:**
   - Create a new Sentry project (select Next.js platform)
   - Copy your DSN from the project settings
   - Create a `.env.local` file:
     ```bash
     NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
     ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

## 🧪 Testing the Demo Issues

### Performance Issues
1. Open the homepage - observe the slow loading (3+ seconds)
2. Try clicking "Add to Cart" buttons - notice the unresponsive UI (1-second delay)
3. Check Sentry's **Web Vitals** dashboard to see poor performance scores

### Race Condition Error
1. Add items to cart and navigate to **Checkout**
2. **Important:** Check the "Simulate Slow Connection" checkbox
3. Click **"Apply"** on the pre-filled voucher (FREE-SHIPPING)
4. **Immediately** click **"Proceed to Payment"** (don't wait for voucher processing)
5. On the payment page, click **"Pay Now"** - this will throw a TypeError
6. Click the broken "Pay Now" button multiple times to generate rage clicks

## 📊 What You'll See in Sentry

### Performance Monitoring
- **Poor Core Web Vitals scores** (TTFB, FCP, LCP, INP all in red)
- **Performance transactions** showing the complete request timeline
- **Slow API calls** identified in the waterfall view
- **Real user session data** from different devices and browsers

### Error Tracking & Session Replay
- **TypeError** captured with full stack trace
- **Session Replay** showing the exact user journey that led to the error
- **Breadcrumbs** timeline of user interactions, API calls, and state changes
- **Rage Click Detection** automatically flagging user frustration
- **User context** including browser, device, and environmental information

## 🏗️ App Structure

```
src/
├── app/
│   ├── page.js              # Homepage with performance issues
│   ├── checkout/page.js     # Checkout flow with voucher processing
│   ├── payment/page.js      # Payment page with race condition bug
│   └── api/
│       ├── slow-data/       # 3-second delayed API endpoint
│       └── voucher/         # Voucher processing with optional delay
└── instrumentation-client.js # Sentry RUM configuration
```

### Key RUM Configuration

The app is configured with optimal settings for demonstration:

```javascript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1.0,        // 100% transaction sampling
  replaysSessionSampleRate: 1.0, // 100% session recording
  replaysOnErrorSampleRate: 1.0, // Always record when errors occur
  enableLogs: true
});
```

## 🔍 Learning Outcomes

After using this demo, you'll understand:

- How **Real User Monitoring** captures performance and error data from actual user sessions
- Why **Core Web Vitals** matter for user experience and business outcomes  
- How **Session Replay** provides crucial context for debugging complex errors
- How **Breadcrumbs** create a timeline of events leading to issues
- How **distributed tracing** connects frontend and backend performance data
- How RUM monitoring reveals issues that traditional server-side monitoring misses

## 🔗 Related Resources

- [Sentry Performance Monitoring Documentation](https://docs.sentry.io/product/performance/)
- [Session Replay Setup Guide](https://docs.sentry.io/platforms/javascript/session-replay/)
- [Core Web Vitals in Sentry](https://docs.sentry.io/product/insights/web-vitals/)
- [Breadcrumbs Documentation](https://docs.sentry.io/product/issues/issue-details/breadcrumbs/)

---

**Built with:** Next.js 15, React 19, Sentry Next.js SDK 10.8+
