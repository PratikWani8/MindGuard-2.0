import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-violet-100/60">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <div className="flex items-center gap-2 font-display font-semibold text-ink-900 mb-2">
            <span className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-aqua-500 text-white flex items-center justify-center">
              <img
          src="/logo.png"
          alt="MindGuard"
          className="h-9 w-9 object-contain"
        />
            </span>
            MindGuard
          </div>
          <p className="text-ink-400 max-w-xs">
            A wellbeing-support signal, not a diagnosis. Always seek professional help for medical concerns.
          </p>
        </div>
        <div>
          <p className="font-semibold text-ink-700 mb-2">Product</p>
          <ul className="space-y-1.5 text-ink-400">
            <li><Link to="/how-it-works" className="hover:text-violet-600">How it works</Link></li>
            <li><Link to="/about" className="hover:text-violet-600">About</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-ink-700 mb-2">Trust</p>
          <ul className="space-y-1.5 text-ink-400">
            <li><Link to="/privacy" className="hover:text-violet-600">Privacy & Safety</Link></li>
            <li><Link to="/support" className="hover:text-violet-600">Support resources</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-ink-700 mb-2">Need help now?</p>
          <p className="text-ink-400">If you're in crisis, please contact local emergency services or a crisis helpline immediately.</p>
        </div>
      </div>
      <div className="text-center text-xs text-ink-300 pb-6">© 2026 MindGuard. AI That Understands, Support & Cares.</div>
    </footer>
  );
}
