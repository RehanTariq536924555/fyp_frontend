import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Animal, AnimalType } from '@/types';
import { ArrowLeft, ImagePlus, Trash, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { animalListings } from '@/utils/data';
import { toast } from '@/components/ui/use-toast';

const listingFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  type: z.enum(['cow', 'goat', 'sheep', 'camel', 'horse', 'other'] as const),
  breed: z.string().min(2, { message: "Breed must be at least 2 characters long" }),
  age: z.coerce.number().min(0, { message: "Age cannot be negative" }),
  weight: z.coerce.number().min(0, { message: "Weight cannot be negative" }),
  price: z.coerce.number().min(1, { message: "Price must be at least 1" }),
  location: z.string().min(3, { message: "Location is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
  status: z.enum(['active', 'sold', 'archived'] as const),
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [animal, setAnimal] = useState<Animal | null>(null);
  
  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: '',
      type: 'cow',
      breed: '',
      age: 0,
      weight: 0,
      price: 0,
      location: '',
      description: '',
      status: 'active'
    }
  });
  
  useEffect(() => {
    if (id) {
      const foundAnimal = animalListings.find(animal => animal.id === id);
      if (foundAnimal) {
        setAnimal(foundAnimal);
        setExistingImages(foundAnimal.images);
        
        // Set form values
        form.reset({
          title: foundAnimal.title,
          type: foundAnimal.type,
          breed: foundAnimal.breed,
          age: foundAnimal.age,
          weight: foundAnimal.weight,
          price: foundAnimal.price,
          location: foundAnimal.location,
          description: foundAnimal.description,
          status: foundAnimal.status
        });
      } else {
        // If no animal is found, navigate back to listings
        navigate('/');
      }
    }
  }, [id, navigate, form]);
  
  const onSubmit = (values: ListingFormValues) => {
    // In a real app, we would handle file uploads and API submission here
    console.log(values, existingImages, newImages);
    
    toast({
      title: "Listing updated successfully",
      description: "Your animal listing has been updated."
    });
    
    // Navigate back to listing view
    navigate(`/listings/${id}`);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...newFiles]);
    }
  };
  
  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const totalImagesCount = existingImages.length + newImages.length;
  
  if (!animal) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-muted-foreground">Loading listing details...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate(`/listings/${id}`)} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Listing</h1>
            <p className="text-muted-foreground">
              Update your animal listing details
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Listing Details</CardTitle>
              <CardDescription>
                Update the details of your animal listing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Healthy Dairy Cow" {...field} />
                        </FormControl>
                        <FormDescription>
                          Create a descriptive title for your listing
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Animal Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select animal type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cow">Cow</SelectItem>
                              <SelectItem value="goat">Goat</SelectItem>
                              <SelectItem value="sheep">Sheep</SelectItem>
                              <SelectItem value="camel">Camel</SelectItem>
                              <SelectItem value="horse">Horse</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="breed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Breed</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Holstein" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age (years)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (PKR)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Lahore, Punjab" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your animal, its health, temperament, etc." 
                            className="min-h-32 resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Include important details like health records, vaccination status, and any other relevant information.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select listing status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-6 flex justify-end">
                    <Button type="submit">
                      Update Listing
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>
                Update photos of your animal (maximum 5 photos total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Existing Images */}
                  {existingImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative aspect-square rounded-md overflow-hidden border">
                      <img 
                        src={image} 
                        alt={`Animal image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => handleRemoveExistingImage(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {/* New Images */}
                  {newImages.map((image, index) => (
                    <div key={`new-${index}`} className="relative aspect-square rounded-md overflow-hidden border">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`New animal image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => handleRemoveNewImage(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {/* Add Image Button */}
                  {totalImagesCount < 5 && (
                    <label 
                      htmlFor="image-upload" 
                      className="flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Add Image
                      </span>
                      <input 
                        id="image-upload" 
                        type="file" 
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageUpload}
                        multiple={totalImagesCount < 4}
                      />
                    </label>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Photo Guidelines:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Upload clear photos showing the animal from different angles</li>
                    <li>Include photos that show the animal's size and condition</li>
                    <li>Ensure good lighting and quality</li>
                    <li>Maximum file size: 5MB per image</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditListing;
