
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BellRing, Globe, Lock, LogOut, Mail, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

const SettingsSection = () => {
  const [emailNotifications, setEmailNotifications] = useState({
    listingSold: true,
    newMessages: true,
    marketingUpdates: false,
    reviews: true,
    paymentConfirmations: true
  });
  
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showContact: false,
    showLocation: true
  });
  
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30'
  });
  
  const updateEmailSettings = (key: keyof typeof emailNotifications) => {
    setEmailNotifications({
      ...emailNotifications,
      [key]: !emailNotifications[key]
    });
    
    toast({
      title: "Settings updated",
      description: "Your email notification settings have been saved."
    });
  };
  
  const updatePrivacySettings = (key: keyof typeof privacy) => {
    setPrivacy({
      ...privacy,
      [key]: !privacy[key]
    });
    
    toast({
      title: "Privacy settings updated",
      description: "Your privacy settings have been saved."
    });
  };
  
  const updateSecuritySettings = (key: keyof typeof security, value: any) => {
    setSecurity({
      ...security,
      [key]: value
    });
  };
  
  const saveSecuritySettings = () => {
    toast({
      title: "Security settings updated",
      description: "Your security settings have been saved."
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Update your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="animaltrader" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select 
                    id="language" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="en">English</option>
                    <option value="ur">Urdu</option>
                    <option value="hi">Hindi</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Danger Zone</h3>
                <div className="rounded-lg border border-destructive/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-destructive">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
 
  Delete Acount
</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose what types of emails you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center space-x-2">
                  <BellRing className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="listing-sold">When my listing is sold</Label>
                </div>
                <Switch 
                  id="listing-sold" 
                  checked={emailNotifications.listingSold}
                  onCheckedChange={() => updateEmailSettings('listingSold')}
                />
              </div>
              <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="new-messages">New messages</Label>
                </div>
                <Switch 
                  id="new-messages" 
                  checked={emailNotifications.newMessages}
                  onCheckedChange={() => updateEmailSettings('newMessages')}
                />
              </div>
              <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="marketing">Marketing updates and newsletters</Label>
                </div>
                <Switch 
                  id="marketing" 
                  checked={emailNotifications.marketingUpdates}
                  onCheckedChange={() => updateEmailSettings('marketingUpdates')}
                />
              </div>
              <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="reviews">Reviews on my listings</Label>
                </div>
                <Switch 
                  id="reviews" 
                  checked={emailNotifications.reviews}
                  onCheckedChange={() => updateEmailSettings('reviews')}
                />
              </div>
              <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center space-x-2">
                  <BellRing className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="payments">Payment confirmations</Label>
                </div>
                <Switch 
                  id="payments" 
                  checked={emailNotifications.paymentConfirmations}
                  onCheckedChange={() => updateEmailSettings('paymentConfirmations')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your profile visibility and data sharing options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="show-profile">Public profile visibility</Label>
                </div>
                <Switch 
                  id="show-profile" 
                  checked={privacy.showProfile}
                  onCheckedChange={() => updatePrivacySettings('showProfile')}
                />
              </div>
              
              <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="show-contact">Show contact information publicly</Label>
                </div>
                <Switch 
                  id="show-contact" 
                  checked={privacy.showContact}
                  onCheckedChange={() => updatePrivacySettings('showContact')}
                />
              </div>
              
              <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="show-location">Show location on listings</Label>
                </div>
                <Switch 
                  id="show-location" 
                  checked={privacy.showLocation}
                  onCheckedChange={() => updatePrivacySettings('showLocation')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and authentication options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="two-factor">Two-factor authentication</Label>
                  </div>
                  <Switch 
                    id="two-factor" 
                    checked={security.twoFactorAuth}
                    onCheckedChange={(checked) => updateSecuritySettings('twoFactorAuth', checked)}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password">Current Password</Label>
                      <Input id="password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <select 
                      id="session-timeout" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={security.sessionTimeout}
                      onChange={(e) => updateSecuritySettings('sessionTimeout', e.target.value)}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={saveSecuritySettings}>
                      Save Security Settings
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Active Sessions</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border rounded-md">
                    <div>
                      <p className="font-medium">Current Device - Chrome</p>
                      <p className="text-xs text-muted-foreground">Last active: Just now</p>
                    </div>
                    <Button variant="outline" size="sm">This Device</Button>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded-md">
                    <div>
                      <p className="font-medium">Mobile App - iOS</p>
                      <p className="text-xs text-muted-foreground">Last active: 2 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">Log Out</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out From All Devices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default SettingsSection;
