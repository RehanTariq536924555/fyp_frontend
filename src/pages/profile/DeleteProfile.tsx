import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, AlertTriangle, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import axios from 'axios';

const API_URL = 'http://localhost:3001/profiles';

const DeleteProfile = ({ currentUser }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const token = localStorage.getItem('token');

  const handleDeleteProfile = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Profile deleted successfully.');
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete profile.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Delete Profile</h1>
        </div>
      </div>
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>This action cannot be undone.</AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle>Confirm Profile Deletion</CardTitle>
          <CardDescription>Please review the info before deleting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
              <AvatarFallback>{currentUser?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{currentUser?.name}</h3>
              <p className="text-sm">{currentUser?.email}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/profile/view')}>Cancel</Button>
          <Button variant="destructive" onClick={handleDeleteProfile} disabled={isDeleting}>
            <Trash className="mr-2 h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Permanently Delete'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default DeleteProfile;
