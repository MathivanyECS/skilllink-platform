import Header from "../components/common/Header";
import Footer from "../components/common/Footer";




const GetStarted = () => {
  return (
    <div className="bg-gradient-to-br from-black via-green-950 to-black text-white">
      <Header />

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">

        {/* LEFT DARK GRADIENT BLEND */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-green-950/90 to-transparent z-10" />

        {/* HERO IMAGE – BLENDED INTO BACKGROUND */}
        <img
          src="src/assets/images/hero-group.png"
          alt="Skill sharing"
          className="
            absolute
            right-[6%]
            top-1/2
            -translate-y-1/2
            h-[82%]
            object-contain
            opacity-110
            z-0
          "
        />

        {/* CONTENT */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center -mt-6">
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Learn, Teach & <br />
              <span className="text-green-400">Collaborate</span>
            </h1>

            <p className="text-gray-400 mb-8">
              Join your university’s skill-sharing community. Exchange knowledge,
              build teams, and grow together.
            </p>

            <div className="flex gap-4">
              {/* Go to LOGIN */}
              <a
                href="/login"
                className="px-6 py-3 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-400 transition"
              >
                Get Started
              </a>

              <a
                href="#features"
                className="px-6 py-3 border border-green-500 rounded-lg hover:bg-green-500/10 transition"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-24 bg-black/60">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-4">
            Everything you need to <span className="text-green-400">Grow</span>
          </h2>

          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Four core features that make learning, sharing, and collaboration seamless.
          </p>

          <div className="grid md:grid-cols-4 gap-8">

            {/* TEACH */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-indigo-500/20 to-black border border-indigo-400/30 hover:border-indigo-400 transition">
              <div className="w-12 h-12 mb-5 rounded-xl bg-indigo-500/30 flex items-center justify-center text-xl">
                🎓
              </div>
              <h3 className="text-lg font-semibold mb-2">Teach</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Share your expertise with fellow students. Create structured learning
                sessions and build your reputation as a trusted mentor.
              </p>
            </div>

            {/* LEARN */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-cyan-500/20 to-black border border-cyan-400/30 hover:border-cyan-400 transition">
              <div className="w-12 h-12 mb-5 rounded-xl bg-cyan-500/30 flex items-center justify-center text-xl">
                📘
              </div>
              <h3 className="text-lg font-semibold mb-2">Learn</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Discover new skills from your peers. Browse the skill marketplace and
                connect with the perfect tutor for your learning journey.
              </p>
            </div>

            {/* COLLABORATE */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-green-500/20 to-black border border-green-400/30 hover:border-green-400 transition">
              <div className="w-12 h-12 mb-5 rounded-xl bg-green-500/30 flex items-center justify-center text-xl">
                🤝
              </div>
              <h3 className="text-lg font-semibold mb-2">Collaborate</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Find teammates for hackathons, projects, and events. Post opportunities
                and connect with like-minded collaborators.
              </p>
            </div>

            {/* GROW */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-amber-500/20 to-black border border-amber-400/30 hover:border-amber-400 transition">
              <div className="w-12 h-12 mb-5 rounded-xl bg-amber-500/30 flex items-center justify-center text-xl">
                📈
              </div>
              <h3 className="text-lg font-semibold mb-2">Grow</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Build your reputation through reviews and completed exchanges. Create a
                living portfolio that showcases your evolving skills.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="py-28 bg-gradient-to-b from-black via-green-950/60 to-black">
        <div className="max-w-7xl mx-auto px-6">

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-4">
            How it <span className="text-green-400">Works</span>
          </h2>

          <p className="text-center text-gray-400 mb-20 max-w-2xl mx-auto">
            Get started with SkillLink in just three simple steps.
          </p>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-10">

            {/* STEP 1 */}
            <div className="group relative p-8 rounded-2xl bg-black/40 border border-green-500/20 backdrop-blur hover:border-green-400 transition">
              <div className="absolute -top-6 left-6 w-12 h-12 rounded-full bg-green-500 text-black flex items-center justify-center font-bold text-lg shadow-lg">
                1
              </div>

              <div className="text-4xl mb-4">🔐</div>

              <h3 className="font-semibold text-xl mb-2">Login</h3>
              <p className="text-gray-400 leading-relaxed">
                Sign in securely using your university account and access the SkillLink platform.
              </p>
            </div>

            {/* STEP 2 */}
            <div className="group relative p-8 rounded-2xl bg-black/40 border border-green-500/20 backdrop-blur hover:border-green-400 transition">
              <div className="absolute -top-6 left-6 w-12 h-12 rounded-full bg-green-500 text-black flex items-center justify-center font-bold text-lg shadow-lg">
                2
              </div>

              <div className="text-4xl mb-4">🧑‍💻</div>

              <h3 className="font-semibold text-xl mb-2">Create Profile</h3>
              <p className="text-gray-400 leading-relaxed">
                Add your skills, interests, and learning goals to build your personal profile.
              </p>
            </div>

            {/* STEP 3 */}
            <div className="group relative p-8 rounded-2xl bg-black/40 border border-green-500/20 backdrop-blur hover:border-green-400 transition">
              <div className="absolute -top-6 left-6 w-12 h-12 rounded-full bg-green-500 text-black flex items-center justify-center font-bold text-lg shadow-lg">
                3
              </div>

              <div className="text-4xl mb-4">🧩</div>

              <h3 className="font-semibold text-xl mb-2">Connect & Learn</h3>
              <p className="text-gray-400 leading-relaxed">
                Connect with peers, collaborate on projects, and start learning together.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ================= COMMUNITY ================= */}
      <section id="community" className="py-16 bg-black/70 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Join a Thriving <span className="text-green-400">Community</span>
        </h2>
        <p className="text-gray-400 mb-6">
          Learn together. Grow together. Succeed together.
        </p>

        <a
          href="/login"
          className="inline-block px-8 py-3 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-400 transition"
        >
          Start Your Journey
        </a>
      </section>

      {/* ================= FOOTER ================= */}

      <Footer />
    </div>
  );
};

export default GetStarted;
