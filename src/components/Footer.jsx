export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-yellow-500/20 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold text-yellow-400">
              Stock Scorcher
            </h2>

            <p className="text-gray-400 mt-4 leading-7">
              Learn Stock Market, Swing Trading, Price Action,
              Candlestick Patterns and Risk Management from professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-yellow-400 cursor-pointer">Home</li>
              <li className="hover:text-yellow-400 cursor-pointer">Courses</li>
              <li className="hover:text-yellow-400 cursor-pointer">Pricing</li>
              <li className="hover:text-yellow-400 cursor-pointer">Login</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Contact
            </h3>

            <p className="text-gray-400">
              📧 support@stockscorcher.com
            </p>

            <p className="text-gray-400 mt-3">
              📞 +91 XXXXXXXXXX
            </p>
          </div>

        </div>

        <div className="border-t border-zinc-800 mt-10 pt-6 text-center text-gray-500">
          © {new Date().getFullYear()} Stock Scorcher. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}