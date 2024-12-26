import React from "react";
import Navbar from "../_components/Navbar";
import Header from "../_components/Header"; // Updated to match a typical relative import structure

const Home = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg_img.png')" }} // Using inline style for background image
    >
      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <Header />
    </div>
  );
};

export default Home;
