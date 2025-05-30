"use client";
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="min-h-screen bg-background flex flex-col justify-center items-center text-center p-8">
      <h1 className="text-5xl font-bold text-foreground mb-6 md:text-6xl lg:text-7xl">
        Zenith Task: Elevate Your Productivity to New Heights
      </h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl md:text-xl">
        The ultimate SaaS solution for seamless task and project management. Experience unparalleled intuition, stunning design, and AI-powered insights.
      </p>
      <button
        className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
        onClick={() => { /* Placeholder for navigation or action */ }}
      >
        Get Started Free
      </button>
      <div className="mt-16 w-full max-w-4xl h-96 bg-gray-700/50 border-2 border-gray-600 rounded-lg flex justify-center items-center">
        <p className="text-muted-foreground text-2xl">Visual Placeholder</p>
      </div>
    </section>
  );
};

export default HeroSection;
