import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const API_URL = 'http://localhost:3001/profiles';

const ViewProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>No profile found. Please create one.</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Profile Details</h1>
            <p className="text-muted-foreground">View your profile information</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profile.image} alt={profile.name} />
              <AvatarFallback className="text-3xl">
                {profile.name ? profile.name.split(' ').map((n: string) => n[0]).join('') : ''}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-medium">{profile.name}</h3>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <span>{profile.city}, {profile.country}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Seller</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div><p className="text-sm font-medium text-muted-foreground">Full Name</p><p>{profile.name}</p></div>
              <div><p className="text-sm font-medium text-muted-foreground">Email</p><p>{profile.email}</p></div>
              <div><p className="text-sm font-medium text-muted-foreground">Phone Number</p><p>{profile.phone}</p></div>
              <div><p className="text-sm font-medium text-muted-foreground">Address</p><p>{profile.address}</p></div>
              <div><p className="text-sm font-medium text-muted-foreground">City</p><p>{profile.city}</p></div>
              <div><p className="text-sm font-medium text-muted-foreground">Country</p><p>{profile.country}</p></div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bio</p>
              <p className="mt-2 whitespace-pre-wrap">{profile.bio}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ViewProfile;
