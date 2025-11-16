import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Camera, ArrowLeft, Save, CheckCircle, AlertCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axios from 'axios';

const API_URL = 'http://localhost:3001/profiles';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters long" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters long" }),
  city: z.string().min(2, { message: "City must be at least 2 characters long" }),
  country: z.string().min(2, { message: "Country must be at least 2 characters long" }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters long" }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const AddProfile = () => {
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      bio: ''
    }
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    const token = localStorage.getItem('token');
    
    // Check if the token is available
    if (!token) {
      toast.error('You must be logged in to create a profile.');
      return;
    }
console.log("Token:", token);
    try {
      const formData = new FormData();
      (Object.keys(values) as (keyof ProfileFormValues)[]).forEach((key) => {
        formData.append(key, values[key]);
      });

      if (avatarFile) {
        formData.append('image', avatarFile); // matches backend "image" column
      }

      console.log("Sending data:", { values, token });

      await axios.post(API_URL, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Send JWT token
        },
      });

      setFormStatus({ type: 'success', message: 'Profile created successfully!' });
      toast.success('Profile created successfully!');
      form.reset();
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create profile. Please try again.';
      setFormStatus({ type: 'error', message: errorMessage });
      toast.error(errorMessage);
      console.error('Error creating profile:', error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mr-4 bg-teal-600 hover:bg-teal-700 text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Profile</h1>
          <p className="text-muted-foreground">Set up your seller profile with basic information</p>
        </div>
      </div>

      {/* Status Message */}
      {formStatus.type && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-md flex items-center gap-2 ${
            formStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {formStatus.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span>{formStatus.message}</span>
        </motion.div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-7">
            {/* Avatar Upload */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
                <CardDescription>Add a profile picture</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt="Profile preview" />
                    ) : (
                      <AvatarFallback className="bg-primary/10">
                        <Camera className="h-8 w-8 text-primary" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 cursor-pointer">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Camera className="h-4 w-4" />
                    </div>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Personal Details */}
            <Card className="md:col-span-5">
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
                <CardDescription>Enter your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {(['name', 'email', 'phone', 'address', 'city', 'country'] as (keyof ProfileFormValues)[]).map(
                    (fieldName) => (
                      <FormField
                        key={fieldName}
                        control={form.control}
                        name={fieldName}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</FormLabel>
                            <FormControl>
                              <Input
                                type={fieldName === 'email' ? 'email' : 'text'}
                                placeholder={`Enter ${fieldName}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )
                  )}
                </div>

                {/* Bio Field */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about yourself..." className="resize-none" rows={4} {...field} />
                      </FormControl>
                      <FormDescription>Briefly describe yourself...</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
                    <Save className="mr-2 h-4 w-4" />
                    Create Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default AddProfile;
