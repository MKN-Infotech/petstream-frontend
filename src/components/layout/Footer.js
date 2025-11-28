import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram
} from 'react-icons/fa';

import logo from '../../assets/images/f_logo.png';
import footer_logo_one from '../../assets/images/footer_logo_one.png';
import footer_logo_two from '../../assets/images/footer_logo_two.png';
import SGS_logo from '../../assets/images/SGS_logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Social media icons */}
        <div className="flex justify-center space-x-4 mb-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="bg-gray-800 hover:bg-blue-600 transition-colors duration-300 p-2 rounded-full text-gray-300 hover:text-white"
          >
            <FaFacebookF size={16} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="bg-gray-800 hover:bg-blue-400 transition-colors duration-300 p-2 rounded-full text-gray-300 hover:text-white"
          >
            <FaTwitter size={16} />
          </a>
          <a
            href="https://www.linkedin.com/company/petstreaminc/?viewAsMember=true"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="bg-gray-800 hover:bg-blue-700 transition-colors duration-300 p-2 rounded-full text-gray-300 hover:text-white"
          >
            <FaLinkedinIn size={16} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="bg-gray-800 hover:bg-pink-600 transition-colors duration-300 p-2 rounded-full text-gray-300 hover:text-white"
          >
            <FaInstagram size={16} />
          </a>
        </div>

        {/* Single line footer content - All sections in one row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-4">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3 pb-1 border-b-2 border-blue-500 inline-block">Quick Links</h3>
            <div className="space-y-1.5">
              <Link to="/" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> Home
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> About Us
              </Link>
              {/* <Link to="/products" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> Products
              </Link> */}
              <Link to="/contact" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> Contact
              </Link>
          <div className="flex items-center gap-4 mt-4">
                  <img src={footer_logo_one} alt="Footer Logo One" className="h-14 w-auto hover:scale-110 transition-transform"></img>
                  <img src={footer_logo_two} alt="Footer Logo One" className="h-14 w-auto hover:scale-110 transition-transform"></img>
                  <img src={SGS_logo} alt="Footer Logo three" className="h-14 w-auto hover:scale-110 transition-transform"></img>
                  </div>
            </div>
          </div>

          {/* Industries */}
          <div>
            <h3 className="text-lg font-semibold mb-3 pb-1 border-b-2 border-blue-500 inline-block">Industries</h3>
            <div className="space-y-1.5">
              <Link to="#" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> Healthcare
              </Link>
              <Link to="#" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> Beverage
              </Link>
              <Link to="#" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> Packaging
              </Link>
              <Link to="#" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> Medical
              </Link>
              <Link to="#" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> Pharmaceutical
              </Link>
              <Link to="#" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> Irrigation
              </Link>
              <Link to="#" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> Food Packaging
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>    
            <h3 className="text-lg font-semibold mb-3 pb-1 border-b-2 border-blue-500 inline-block">Services</h3>
            <div className="space-y-1.5">
              <Link to="/all/services" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> Project Consultancy
              </Link>
              <Link to="services/refurbishment" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> Machine Refurbishment
              </Link>
              <Link to="services/maintenance" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> Annual Maintenance
              </Link>
              <Link to="services/relocation" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> Machine Installation
              </Link>
              <Link to="services/breakdown" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> Breakdown Service
              </Link>
              <Link to="services/application" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> Application Support
              </Link>
              <Link to="services/training" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> Training
              </Link>
              <Link to="services/parts" className="block text-gray-300 hover:text-blue-400 transition-colors text-sm">
                <span className="mr-1 text-blue-500">›</span> Spare Parts
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base font-semibold mb-3 pb-1 border-b-2 border-blue-500 inline-block">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <FaMapMarkerAlt className="mt-0.5 mr-2 text-blue-400 flex-shrink-0" size={12} />
                <span className="text-gray-300 text-xs leading-relaxed">
                  Office No. 1603A & 1603B, 16th floor, The Iconic Tower, Corenthum,
                  Sector -62, Noida, NCR, India-201309
                </span>
              </div>
              <div className="flex items-center">
                <FaPhone className="mr-2 text-blue-400" size={12} />
                <a href="tel:+919811206119" className="text-gray-300 hover:text-blue-400 transition-colors text-xs">
                  +91-9811206119
                </a>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="mr-2 text-blue-400" size={12} />
                <a href="mailto:info@petstream.in" className="text-gray-300 hover:text-blue-400 transition-colors text-xs">
                  info@petstream.in
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-4" />

        {/* Bottom copyright section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs mb-2 md:mb-0">
            &copy; {currentYear} PET Stream Incorporation. All rights reserved.
          </p>
          {/* <div className="flex space-x-4">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-blue-400 text-xs transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-blue-400 text-xs transition-colors">
              Terms of Service
            </Link>
            <Link to="/sitemap" className="text-gray-400 hover:text-blue-400 text-xs transition-colors">
              Sitemap
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
