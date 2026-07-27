import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/message/GWDVWEYHKZ63G1"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-green-500 hover:bg-green-400 p-3.5 sm:p-4 rounded-full shadow-[0_10px_30px_rgba(34,197,94,0.4)] z-50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer group"
      title="Chat on WhatsApp"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-7 h-7 sm:w-8 sm:h-8 text-white transition-transform duration-300 group-hover:rotate-12" />
    </a>
  );
}