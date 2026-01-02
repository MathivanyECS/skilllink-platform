const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-black via-green-950 to-black text-gray-300 mt-24">

      {/* TOP FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-12">

        {/* BRAND */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="src/assets/images/skilllink-logo.png"
              alt="SkillLink"
              className="h-12 w-auto"
            />
            <span className="text-xl font-bold text-white">SkillLink</span>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed">
            Empowering university students through skill-sharing,
            collaboration, and real-world learning.
          </p>
        </div>

        {/* PLATFORM */}
        <div>
          <h4 className="text-white font-semibold mb-4">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#how-it-works" className="hover:text-green-400">How it Works</a></li>
            <li><a href="#features" className="hover:text-green-400">Features</a></li>
            <li><a href="/login" className="hover:text-green-400">Get Started</a></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-green-400">Help Center</a></li>
            <li><a href="#" className="hover:text-green-400">Contact Us</a></li>
            <li><a href="#community" className="hover:text-green-400">Community</a></li>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-green-400">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-green-400">Terms of Service</a></li>
            <li><a href="#" className="hover:text-green-400">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-green-500/20">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} SkillLink. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
