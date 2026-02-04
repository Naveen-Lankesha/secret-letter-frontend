import React from "react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-50 mt-auto border-t border-purple-500/20 bg-purple-900/20 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="text-center text-sm text-purple-200/90">
          © {year}{" "}
          <span className="font-semibold text-purple-100">cloud7.lk</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
