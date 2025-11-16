
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Separator } from '@/components/ui/separator';
// import { Textarea } from '@/components/ui/textarea';
// import { currentUser } from '@/utils/data';
// import { motion } from 'framer-motion';
// import { Badge } from '@/components/ui/badge';
// import { Camera, Edit, MapPin, Save } from 'lucide-react';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { useState } from 'react';

// const ProfileSection = () => {
//   const [editing, setEditing] = useState(false);
//   const [profile, setProfile] = useState({ ...currentUser });
  
//   const handleSave = () => {
//     setEditing(false);
//     // Save profile logic would go here
//   };
  
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.3 }}
//       className="space-y-6"
//     >
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight">Profile & Portfolio</h1>
//           <p className="text-muted-foreground">
//             Manage your personal information and portfolio
//           </p>
//         </div>
        
//         <Button onClick={() => setEditing(!editing)}>
//           {editing ? (
//             <>
//               <Save className="mr-2 h-4 w-4" />
//               Save Changes
//             </>
//           ) : (
//             <>
//               <Edit className="mr-2 h-4 w-4" />
//               Edit Profile
//             </>
//           )}
//         </Button>
//       </div>
      
//       <div className="grid gap-6 md:grid-cols-7">
//         {/* Profile photo card */}
//         <Card className="md:col-span-2">
//           <CardHeader>
//             <CardTitle>Profile Photo</CardTitle>
//             <CardDescription>
//               Update your profile picture
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="flex flex-col items-center space-y-4">
//             <div className="relative">
//               <Avatar className="h-32 w-32">
//                 <AvatarImage src={profile.avatar} alt={profile.name} />
//                 <AvatarFallback className="text-3xl">
//                   {profile.name.split(' ').map(n => n[0]).join('')}
//                 </AvatarFallback>
//               </Avatar>
              
//               {editing && (
//                 <Button 
//                   size="icon" 
//                   className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
//                 >
//                   <Camera className="h-4 w-4" />
//                 </Button>
//               )}
//             </div>
            
//             <div className="text-center">
//               <h3 className="font-medium">{ profile.name }</h3>
//               <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
//                 <MapPin className="h-3 w-3" />
//                 <span>{ profile.city }, { profile.country }</span>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <Badge variant="outline" className="text-xs">
//                 Seller
//               </Badge>
              
//               {profile.isVerified && (
//                 <Badge variant="secondary" className="bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs">
//                   Verified
//                 </Badge>
//               )}
//             </div>
//           </CardContent>
//         </Card>
        
//         {/* Personal details card */}
//         <Card className="md:col-span-5">
//           <CardHeader>
//             <CardTitle>Personal Details</CardTitle>
//             <CardDescription>
//               Update your personal information
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="grid gap-4 sm:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name</Label>
//                 <Input 
//                   id="name" 
//                   value={profile.name}
//                   readOnly={!editing}
//                   onChange={(e) => setProfile({ ...profile, name: e.target.value })}
//                   className={!editing ? "bg-muted" : ""}
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input 
//                   id="email"
//                   type="email"
//                   value={profile.email}
//                   readOnly={!editing}
//                   onChange={(e) => setProfile({ ...profile, email: e.target.value })}
//                   className={!editing ? "bg-muted" : ""}
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="phone">Phone Number</Label>
//                 <Input 
//                   id="phone"
//                   value={profile.phone}
//                   readOnly={!editing}
//                   onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
//                   className={!editing ? "bg-muted" : ""}
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="address">Address</Label>
//                 <Input 
//                   id="address"
//                   value={profile.address}
//                   readOnly={!editing}
//                   onChange={(e) => setProfile({ ...profile, address: e.target.value })}
//                   className={!editing ? "bg-muted" : ""}
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="city">City</Label>
//                 <Input 
//                   id="city"
//                   value={profile.city}
//                   readOnly={!editing}
//                   onChange={(e) => setProfile({ ...profile, city: e.target.value })}
//                   className={!editing ? "bg-muted" : ""}
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="country">Country</Label>
//                 <Input 
//                   id="country"
//                   value={profile.country}
//                   readOnly={!editing}
//                   onChange={(e) => setProfile({ ...profile, country: e.target.value })}
//                   className={!editing ? "bg-muted" : ""}
//                 />
//               </div>
//             </div>
            
//             <Separator />
            
//             <div className="space-y-2">
//               <Label htmlFor="bio">Bio</Label>
//               <Textarea 
//                 id="bio"
//                 value={profile.bio}
//                 readOnly={!editing}
//                 rows={4}
//                 onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
//                 className={!editing ? "bg-muted resize-none" : "resize-none"}
//               />
//               <p className="text-xs text-muted-foreground">
//                 Briefly describe yourself, your experience with animals, and what you specialize in.
//               </p>
//             </div>
            
//             {editing && (
//               <div className="flex justify-end">
//                 <Button onClick={handleSave}>
//                   <Save className="mr-2 h-4 w-4" />
//                   Save Changes
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </motion.div>
//   );
// };

// export default ProfileSection;
