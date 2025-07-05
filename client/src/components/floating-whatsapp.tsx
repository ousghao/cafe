import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const handleWhatsAppClick = () => {
    const phoneNumber = "+212635623456"; // Replace with actual WhatsApp number
    const message = encodeURIComponent("Bonjour! Je souhaite obtenir des informations sur vos services.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={handleWhatsAppClick}
        className="bg-green-600 hover:bg-green-700 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 p-0"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}
