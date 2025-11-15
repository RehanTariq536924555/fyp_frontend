import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Animal } from '@/data/animals';

interface ContactSellerProps {
  animal: Animal;
}

const ContactSeller: React.FC<ContactSellerProps> = ({ animal }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleCall = () => {
    window.open(`tel:${animal.sellerPhone}`);
  };
  
  const handleWhatsApp = () => {
    const message = `Hello, I'm interested in your ${animal.name} listed for sale.`;
    window.open(`https://wa.me/${animal.sellerWhatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`);
  };

  return (
    <Card className="p-4 border-black/5">
      <div className="flex items-center mb-4">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarFallback className="bg-primary text-white">
            {getInitials(animal.sellerName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{animal.sellerName}</h3>
          <div className="flex items-center text-muted-foreground text-sm">
            <span className="text-sm">Seller</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          className="w-full bg-gradient-to-r from-teal-600 to-coral-600 text-white"
          onClick={handleCall}
        >
          <Phone className="h-4 w-4 mr-2" />
          Call
        </Button>
        
        <Button
          variant="secondary"
          className="w-full bg-gradient-to-r from-teal-600 to-coral-600 text-white"
          onClick={handleWhatsApp}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>
      </div>
    </Card>
  );
};

export default ContactSeller;