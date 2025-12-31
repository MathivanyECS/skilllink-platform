import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const GetStarted = () => {
  return (
    <div className="bg-dark text-white min-h-screen flex flex-col">
      {/* NAVBAR */}
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-br from-black via-dark to-green-900">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Learn, Teach &{" "}
          <span className="text-primary">Collaborate</span>
        </h1>

        <p className="text-gray-400 max-w-2xl mb-8">
          SkillLink is a student-focused skill sharing platform where learners
          and teachers connect, collaborate, and grow together.
        </p>

        <div className="flex gap-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-primary text-black rounded-lg font-semibold hover:scale-105 transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-primary rounded-lg hover:bg-primary hover:text-black transition"
          >
            Login
          </Link>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-20 px-6 bg-black">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need to{" "}
          <span className="text-primary">grow</span>
        </h2>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Teach",
              desc: "Share your knowledge and help others learn.",
            },
            {
              title: "Learn",
              desc: "Gain new skills from experienced peers.",
            },
            {
              title: "Collaborate",
              desc: "Join projects, events, and competitions.",
            },
            {
              title: "Grow",
              desc: "Build your profile and reputation.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-card p-6 rounded-xl border border-green-500/20 hover:border-primary transition"
            >
              <h3 className="text-xl font-semibold mb-2 text-primary">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 px-6 bg-dark">
        <h2 className="text-3xl font-bold text-center mb-12">
          How it{" "}
          <span className="text-primary">works</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
          {[
            {
              step: "1",
              title: "Create Profile",
              desc: "Sign up and add your skills or interests.",
            },
            {
              step: "2",
              title: "Connect & Learn",
              desc: "Request skills or offer your expertise.",
            },
            {
              step: "3",
              title: "Grow Together",
              desc: "Collaborate, learn, and build reputation.",
            },
          ].map((item) => (
            <div key={item.step}>
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary text-black flex items-center justify-center font-bold">
                {item.step}
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= COMMUNITY ================= */}
      <section className="py-20 px-6 bg-black">
        <h2 className="text-3xl font-bold text-center mb-12">
          Join a{" "}
          <span className="text-primary">thriving community</span>
        </h2>

        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
          {[
            { value: "2,500+", label: "Active Students" },
            { value: "150+", label: "Skills Available" },
            { value: "5,000+", label: "Learning Sessions" },
            { value: "98%", label: "Satisfaction Rate" },
          ].map((item) => (
            <div key={item.label}>
              <h3 className="text-2xl font-bold text-primary">
                {item.value}
              </h3>
              <p className="text-gray-400 text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-600 to-green-500 text-center">
        <h2 className="text-3xl font-bold mb-4 text-black">
          Ready to start your journey?
        </h2>
        <p className="text-black/80 mb-6">
          Join thousands of students already learning on SkillLink.
        </p>
        <Link
          to="/register"
          className="px-8 py-3 bg-black text-primary rounded-lg font-semibold hover:scale-105 transition"
        >
          Get Started Today
        </Link>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default GetStarted;
