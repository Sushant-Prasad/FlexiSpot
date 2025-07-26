import React from "react";
import { Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1e293b] text-gray-300 border-t border-gray-600 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

        {/* Branding */}
        <div className="text-center md:text-left space-y-1">
          <h2 className="text-2xl font-bold text-white">FlexiSpot</h2>
          <p className="text-sm text-gray-400">&copy; 2025 FlexiSpot. All rights reserved.</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-6 text-sm">
          <a href="#" className="hover:text-blue-400 transition duration-300">Privacy Policy</a>
          <a href="#" className="hover:text-blue-400 transition duration-300">Terms</a>
          <a href="#" className="hover:text-blue-400 transition duration-300">Contact</a>
        </div>

        {/* Socials */}
        <div className="flex justify-center md:justify-end space-x-3">
          <a
            href="#"
            className="p-2 bg-[#0f172a] rounded-full hover:bg-blue-600 transition duration-300"
          >
            <Facebook size={18} className="text-white" />
          </a>
          <a
            href="#"
            className="p-2 bg-[#0f172a] rounded-full hover:bg-blue-500 transition duration-300"
          >
            <Twitter size={18} className="text-white" />
          </a>
          <a
            href="#"
            className="p-2 bg-[#0f172a] rounded-full hover:bg-blue-700 transition duration-300"
          >
            <Linkedin size={18} className="text-white" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
