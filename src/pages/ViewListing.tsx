
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Animal } from '@/types';
import { animalListings } from '@/utils/data';
import { ArrowLeft, Calendar, Edit, ExternalLink, MapPin, Trash, Weight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

const ViewListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  
  useEffect(() => {
    if (id) {
      const foundAnimal = animalListings.find(animal => animal.id === id);
      if (foundAnimal) {
        setAnimal(foundAnimal);
        setSelectedImage(foundAnimal.images[0]);
      } else {
        // If no animal is found, navigate back to listings
        navigate('/');
      }
    }
  }, [id, navigate]);
  
  const handleDelete = () => {
    // In a real app, we would call an API to delete the animal listing
    toast({
      title: "Listing deleted",
      description: "The listing has been successfully removed."
    });
    
    // Navigate back to listings
    navigate('/');
  };
  
  if (!animal) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-muted-foreground">Loading listing details...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', { 
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700';
      case 'sold':
        return 'bg-blue-50 text-blue-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return '';
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{animal.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{animal.location}</span>
                <span>•</span>
                <span>Listed on {formatDate(animal.listed)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(`/listings/${animal.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Listing</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this listing? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {}}>Cancel</Button>
                  <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <div className="overflow-hidden rounded-lg border">
              <img 
                src={selectedImage} 
                alt={animal.title}
                className="w-full aspect-video object-cover"
              />
            </div>
            
            <div className="flex overflow-auto pb-2 gap-2">
              {animal.images.map((image, index) => (
                <button
                  key={index}
                  className={`rounded-md overflow-hidden border-2 flex-shrink-0 ${selectedImage === image ? 'border-primary' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img 
                    src={image} 
                    alt={`${animal.title} - Image ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">{animal.description}</p>
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{formatPrice(animal.price)}</h2>
                  <Badge className={getStatusColor(animal.status)}>
                    {animal.status.charAt(0).toUpperCase() + animal.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="space-y-3 pt-2">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Age: {animal.age} years</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Weight className="h-4 w-4 mr-2" />
                    <span>Weight: {animal.weight} kg</span>
                  </div>
                  <div className="flex items-center text-muted-foreground capitalize">
                    <span>Type: {animal.type}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <span>Breed: {animal.breed}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-2">Listing Stats</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="border rounded-md p-2">
                      <p className="text-muted-foreground">Views</p>
                      <p className="font-medium">245</p>
                    </div>
                    <div className="border rounded-md p-2">
                      <p className="text-muted-foreground">Inquiries</p>
                      <p className="font-medium">12</p>
                    </div>
                    <div className="border rounded-md p-2">
                      <p className="text-muted-foreground">Saved</p>
                      <p className="font-medium">34</p>
                    </div>
                    <div className="border rounded-md p-2">
                      <p className="text-muted-foreground">Days Active</p>
                      <p className="font-medium">15</p>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Public Listing
                </Button>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-medium mb-2">Selling Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>Add more specific details about health records to increase buyer trust</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>Respond quickly to buyer inquiries to increase your chances of a sale</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>Consider offering delivery options to attract more buyers</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewListing;
