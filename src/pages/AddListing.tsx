import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft, ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

// Schema: All fields are required
const listingFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  type: z.string().min(1, { message: 'Animal type is required' }),
  breed: z.string().min(1, { message: 'Breed is required' }),
  age: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive({ message: 'Age must be a positive number' })
  ),
  weight: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive({ message: 'Weight must be a positive number' })
  ),
  price: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive({ message: 'Price must be a positive number' })
  ),
  location: z.string().min(1, { message: 'Location is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

const AddListing = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: '',
      type: '',
      breed: '',
      age: undefined,
      weight: undefined,
      price: undefined,
      location: '',
      description: '',
    },
  });

  const onSubmit = async (values: ListingFormValues) => {
    // Validate images
    if (images.length === 0) {
      toast({
        title: 'Error',
        description: 'At least one image is required.',
        variant: 'destructive',
      });
      return;
    }

    console.log('Form submitted with values:', values);
    console.log('Images:', images);

    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    images.forEach((image, index) => {
      formData.append('images', image, image.name);
    });

    try {
      
     const token = localStorage.getItem('token');
console.log('Sending request to server...' , token);
const response = await fetch('http://localhost:3001/listings', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`, // add token here
  },
  body: formData,
});



      if (!response.ok) {
        let errorMessage = 'Failed to create listing';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('Server error response:', errorData);
        } catch (jsonError) {
          console.error('Failed to parse JSON:', jsonError);
          const text = await response.text();
          console.log('Response text:', text);
          errorMessage = text || 'Server returned an empty or invalid response';
        }
        throw new Error(errorMessage);
      }

      console.log('Listing created successfully!');
      toast({
        title: 'Listing created successfully',
        description: 'Your animal listing has been created.',
        variant: 'default',
        className: 'bg-teal-600 text-white border-none',
      });
      navigate('/');
    } catch (error: any) {
      console.error('Submission error:', error.message);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create listing',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      console.log('Submission process completed.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter((file) => {
        const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        if (!isValidType) {
          toast({
            title: 'Invalid File Type',
            description: 'Only JPG and PNG files are allowed.',
            variant: 'destructive',
          });
        }
        if (!isValidSize) {
          toast({
            title: 'File Too Large',
            description: 'Each file must be less than 5MB.',
            variant: 'destructive',
          });
        }
        return isValidType && isValidSize;
      });
      setImages((prev) => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="hover:bg-gray-100 transition-colors rounded-full p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-black">Add New Listing</h1>
            <p className="text-gray-600 mt-2 text-lg">Create a new animal listing to sell on the marketplace</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="shadow-xl bg-white rounded-xl overflow-hidden">
            <CardHeader className="bg-gray-50 p-6">
              <CardTitle className="text-black text-2xl">Listing Details</CardTitle>
              <CardDescription className="text-gray-600">Enter the details of the animal you want to sell</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black font-medium">Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Healthy Dairy Cow"
                            className="focus:ring-2 focus:ring-teal-600 border-gray-300 rounded-lg"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormDescription className="text-gray-500">Create a descriptive title for your listing</FormDescription>
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
                          <FormLabel className="text-black font-medium">Animal Type</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Cow"
                              className="focus:ring-2 focus:ring-teal-600 border-gray-300 rounded-lg"
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="breed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-medium">Breed</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Holstein"
                              className="focus:ring-2 focus:ring-teal-600 border-gray-300 rounded-lg"
                              {...field}
                              value={field.value ?? ''}
                            />
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
                          <FormLabel className="text-black font-medium">Age (years)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              className="focus:ring-2 focus:ring-teal-600 border-gray-300 rounded-lg"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                            />
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
                          <FormLabel className="text-black font-medium">Weight (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              className="focus:ring-2 focus:ring-teal-600 border-gray-300 rounded-lg"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                            />
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
                          <FormLabel className="text-black font-medium">Price (PKR)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              className="focus:ring-2 focus:ring-teal-600 border-gray-300 rounded-lg"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                            />
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
                        <FormLabel className="text-black font-medium">Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Lahore, Punjab"
                            className="focus:ring-2 focus:ring-teal-600 border-gray-300 rounded-lg"
                            {...field}
                            value={field.value ?? ''}
                          />
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
                        <FormLabel className="text-black font-medium">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your animal..."
                            className="min-h-32 resize-none focus:ring-2 focus:ring-teal-600 border-gray-300 rounded-lg"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormDescription className="text-gray-500">Include important details like health records...</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="submit"
                      className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Listing'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <Card className="shadow-xl bg-white rounded-xl overflow-hidden">
            <CardHeader className="bg-gray-50 p-6">
              <CardTitle className="text-black text-2xl">Photos</CardTitle>
              <CardDescription className="text-gray-600">Upload photos of your animal (max 5, at least 1 required)</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-md">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Animal image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-teal-600 hover:bg-teal-700"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center aspect-square rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors shadow-md"
                    >
                      <ImagePlus className="h-8 w-8 text-gray-600 mb-2" />
                      <span className="text-sm text-black font-medium">Add Image</span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageUpload}
                        multiple={images.length < 4}
                      />
                    </label>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-black">Photo Guidelines:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Upload clear photos showing the animal...</li>
                    <li>Include photos that show the animal's size...</li>
                    <li>Ensure good lighting and quality</li>
                    <li>Maximum file size: 5MB per image</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddListing;