"use client";

import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";

const Dashboard = () => {
  return (
    <div className="relative h-screen overflow-hidden bg-black/20">
      <Sidebar />
      <Navbar />
      <main className="pt-20 px-6 md:ml-64 h-full">
        <div
          className="relative w-full h-full bg-center bg-no-repeat bg-contain"
          style={{
            backgroundImage: "url('/images/Logo/NagaInFiredefr.png')",
          }}
        >
          {/* Overlay for subtle dark effect */}
          <div className="absolute inset-0"></div>

          <div className="relative z-10 flex flex-col items-start justify-start h-full px-6 pt-8 text-white">
            <h1 className="text-4xl text-sky-950 font-bold mb-2">
              Welcome, Admin!
            </h1>
            <h2 className="text-xl text-sky-950 font-light mb-4">
              This is your dashboard
            </h2>
            <p className="text-sky-950 mb-6 max-w-lg">
              Here you can manage your products, teams, and locations
              efficiently.
            </p>

            <div className="flex flex-wrap gap-4">
              {/* Action buttons here if needed */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
