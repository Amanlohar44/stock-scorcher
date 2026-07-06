import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/message/GWDVWEYHKZ63G1"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl z-50 transition duration-300 hover:scale-110"
      title="Chat on WhatsApp"
    >
      <FaWhatsapp size={32} />
    </a>
  );
}