import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="px-6 py-16">

      {/* ================= HERO ================= */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Launch Your Own Online Store in Minutes
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
          Create, customize and grow your digital or physical product business
          with our powerful multi-store eCommerce SaaS platform.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/register"
            className="px-6 py-3 rounded text-white font-medium bg-black hover:bg-gray-800 transition"
          >
            🚀 Create Your Store
          </Link>

          <Link
            to="/products"
            className="px-6 py-3 rounded border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Browse Marketplace
          </Link>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-6xl mx-auto">

        <Feature
          title="Multi-Store System"
          desc="Each seller gets a fully isolated store with custom branding, theme and product management."
        />

        <Feature
          title="Digital & Physical Products"
          desc="Sell instant download digital products or physical goods with stock management."
        />

        <Feature
          title="Built-in Dashboard"
          desc="Track orders, manage products, view revenue analytics and control your business easily."
        />

      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="mt-24 text-center max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <Step
            number="1"
            title="Create Account"
            desc="Sign up as a store owner and choose your store name."
          />

          <Step
            number="2"
            title="Add Products"
            desc="Upload digital files or physical products and set your pricing."
          />

          <Step
            number="3"
            title="Start Selling"
            desc="Share your store link and start receiving orders instantly."
          />

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mt-28 text-center bg-black text-white py-16 rounded-lg">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Build Your Online Business?
        </h2>

        <p className="mb-8 text-gray-300">
          Join today and start selling without any technical complexity.
        </p>

        <Link
          to="/register"
          className="bg-white text-black px-8 py-3 rounded font-medium hover:opacity-90 transition"
        >
          Get Started Now
        </Link>
      </section>

    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const Feature = ({ title, desc }) => (
  <div className="p-6 border rounded hover:shadow transition text-center">
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 text-sm">{desc}</p>
  </div>
);

const Step = ({ number, title, desc }) => (
  <div className="p-6 border rounded hover:shadow transition">
    <div className="text-3xl font-bold mb-4">{number}</div>
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 text-sm">{desc}</p>
  </div>
);

export default Home;
