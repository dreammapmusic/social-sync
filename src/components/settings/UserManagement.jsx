import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';

const UserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    password: '',
    role: user?.role || 'editor',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast({ title: "Email is required", variant: "destructive" });
      return;
    }
    if (!user && !formData.password) {
      toast({ title: "Password is required for new users", variant: "destructive" });
      return;
    }
    onSave({ ...user, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email" className="text-gray-300">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="user@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>
      <div>
        <Label htmlFor="password">{user ? "New Password (optional)" : "Password"}</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white">Cancel</Button>
        <Button type="submit" className="social-gradient">Save User</Button>
      </DialogFooter>
    </form>
  );
};


const UserManagement = ({ users, setUsers }) => {
  if (!users) {
    return (
        <Card className="glass-effect border-white/10">
            <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-gray-400">Loading users...</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-white/5 rounded-lg"></div>
                    <div className="h-10 bg-white/5 rounded-lg"></div>
                    <div className="h-10 bg-white/5 rounded-lg"></div>
                </div>
            </CardContent>
        </Card>
    );
  }

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleSaveUser = (userData) => {
    let updatedUsers;
    if (userData.id) {
      // Edit user
      updatedUsers = users.map(u => u.id === userData.id ? { ...u, ...userData, password: userData.password ? `hashed_${userData.password}` : u.password } : u);
      toast({ title: "User updated successfully!" });
    } else {
      // Add user
      const newUser = { ...userData, id: Date.now(), password: `hashed_${userData.password}` };
      updatedUsers = [...users, newUser];
      toast({ title: "User added successfully!" });
    }
    setUsers(updatedUsers);
    localStorage.setItem('socialScheduler_team_users', JSON.stringify(updatedUsers));
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('socialScheduler_team_users', JSON.stringify(updatedUsers));
    toast({ title: "User deleted successfully!" });
  };
  
  return (
    <Card className="glass-effect border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-white">User Management</CardTitle>
              <CardDescription className="text-gray-400">Add, edit, or remove users from your team.</CardDescription>
            </div>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="social-gradient" onClick={() => setEditingUser(null)}>
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-white">{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                <DialogDescription>
                  {editingUser ? 'Update the user details below.' : 'Fill in the details to add a new user.'}
                </DialogDescription>
              </DialogHeader>
              <UserForm 
                user={editingUser} 
                onSave={handleSaveUser} 
                onCancel={() => { setIsFormOpen(false); setEditingUser(null); }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className={user.role === 'admin' ? 'bg-green-500/80' : 'bg-blue-500/80'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingUser(user); setIsFormOpen(true); }}>
                    <Edit className="h-4 w-4 text-gray-400" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="ghost" size="icon" disabled={users.length <= 1 && user.role === 'admin'}>
                        <Trash2 className="h-4 w-4 text-red-500/80" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="dark border-slate-800 bg-slate-950 text-slate-50">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete the user account.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserManagement;