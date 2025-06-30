import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { UploadCloud, Folder, MoreVertical, Edit, Trash2, FileText, FileImage as ImageIcon, VideoOff as VideoIcon, Music, FileArchive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = () => {
    const savedFiles = localStorage.getItem('socialScheduler_files');
    const filesData = savedFiles ? JSON.parse(savedFiles) : [];
    setFiles(filesData);
  };
  
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const newFile = {
        id: Date.now(),
        name: uploadedFile.name,
        type: uploadedFile.type,
        size: uploadedFile.size,
        uploadedAt: new Date().toISOString(),
      };

      const updatedFiles = [...files, newFile];
      setFiles(updatedFiles);
      localStorage.setItem('socialScheduler_files', JSON.stringify(updatedFiles));

      toast({
        title: "File uploaded!",
        description: `Successfully added ${newFile.name}.`,
      });
    }
  };

  const handleDeleteClick = (file) => {
    setFileToDelete(file);
    setShowDeleteDialog(true);
  };
  
  const confirmDelete = () => {
    if (fileToDelete) {
      const updatedFiles = files.filter(f => f.id !== fileToDelete.id);
      setFiles(updatedFiles);
      localStorage.setItem('socialScheduler_files', JSON.stringify(updatedFiles));

      toast({
        title: "File deleted",
        description: `${fileToDelete.name} has been removed.`,
        variant: "destructive"
      });
      
      setFileToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-blue-400" />;
    if (fileType.startsWith('video/')) return <VideoIcon className="h-5 w-5 text-green-400" />;
    if (fileType.startsWith('audio/')) return <Music className="h-5 w-5 text-orange-400" />;
    if (fileType.startsWith('application/zip') || fileType.startsWith('application/x-rar-compressed')) return <FileArchive className="h-5 w-5 text-yellow-400" />;
    return <FileText className="h-5 w-5 text-gray-400" />;
  };

  return (
    <>
      <Helmet>
        <title>Files - SocialSync</title>
        <meta name="description" content="Manage and store your media files for social media posts." />
      </Helmet>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">File Manager</h1>
            <p className="text-gray-400 mt-1">Organize your media assets</p>
          </div>
          <Button 
            onClick={handleUploadClick}
            className="social-gradient"
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white">All Files</CardTitle>
              <CardDescription className="text-gray-400">
                A list of all your uploaded files.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {files.length === 0 ? (
                <div className="text-center py-16">
                  <Folder className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No files yet</h3>
                  <p className="text-gray-500 mb-4">Upload your first file to get started.</p>
                  <Button 
                    onClick={handleUploadClick}
                    className="social-gradient"
                  >
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload File
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-white/10 hover:bg-transparent">
                      <TableHead className="text-white w-[50%]">Name</TableHead>
                      <TableHead className="text-white">Type</TableHead>
                      <TableHead className="text-white">Size</TableHead>
                      <TableHead className="text-white">Date Added</TableHead>
                      <TableHead className="text-right text-white"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {files.map((file) => (
                      <TableRow key={file.id} className="border-b-white/10 hover:bg-white/5">
                        <TableCell className="font-medium text-white flex items-center gap-3">
                          {getFileIcon(file.type)}
                          {file.name}
                        </TableCell>
                        <TableCell className="text-gray-400">{file.type}</TableCell>
                        <TableCell className="text-gray-400">{formatFileSize(file.size)}</TableCell>
                        <TableCell className="text-gray-400">{new Date(file.uploadedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-effect border-white/10 text-white">
                              <DropdownMenuItem onSelect={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })} className="cursor-pointer hover:!bg-white/5">
                                <Edit className="mr-2 h-4 w-4" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleDeleteClick(file)} className="cursor-pointer text-red-400 hover:!bg-red-500/10 hover:!text-red-400">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="glass-effect border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete your
              file and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Files;