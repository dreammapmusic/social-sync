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
    const filesData = savedFiles ? JSON.parse(savedFiles) : [
      // Recent uploads
      { id: 1, name: 'promo_video_final.mp4', type: 'video/mp4', size: 25600000, uploadedAt: '2025-01-15T10:30:00Z' },
      { id: 2, name: 'summer_sale_banner.png', type: 'image/png', size: 1200000, uploadedAt: '2025-01-15T15:45:00Z' },
      { id: 3, name: 'background_music.mp3', type: 'audio/mpeg', size: 3500000, uploadedAt: '2025-01-14T11:00:00Z' },
      
      // Product images
      { id: 4, name: 'product_showcase_2025.jpg', type: 'image/jpeg', size: 2800000, uploadedAt: '2025-01-14T09:15:00Z' },
      { id: 5, name: 'behind_the_scenes.mov', type: 'video/quicktime', size: 45200000, uploadedAt: '2025-01-13T16:20:00Z' },
      { id: 6, name: 'team_photo_hires.png', type: 'image/png', size: 8900000, uploadedAt: '2025-01-13T14:30:00Z' },
      
      // Social media templates
      { id: 7, name: 'instagram_story_template.psd', type: 'application/octet-stream', size: 15600000, uploadedAt: '2025-01-12T10:45:00Z' },
      { id: 8, name: 'quote_graphics_bundle.zip', type: 'application/zip', size: 23400000, uploadedAt: '2025-01-12T08:30:00Z' },
      { id: 9, name: 'logo_variations.svg', type: 'image/svg+xml', size: 125000, uploadedAt: '2025-01-11T17:00:00Z' },
      
      // Video content
      { id: 10, name: 'customer_testimonial_v2.mp4', type: 'video/mp4', size: 67800000, uploadedAt: '2025-01-11T12:15:00Z' },
      { id: 11, name: 'tutorial_screen_recording.mp4', type: 'video/mp4', size: 89200000, uploadedAt: '2025-01-10T14:45:00Z' },
      
      // Audio assets
      { id: 12, name: 'upbeat_intro_music.wav', type: 'audio/wav', size: 12400000, uploadedAt: '2025-01-10T09:30:00Z' },
      { id: 13, name: 'podcast_intro.mp3', type: 'audio/mpeg', size: 2100000, uploadedAt: '2025-01-09T16:00:00Z' },
      
      // Documents and resources
      { id: 14, name: 'content_calendar_Q1.pdf', type: 'application/pdf', size: 890000, uploadedAt: '2025-01-09T11:20:00Z' },
      { id: 15, name: 'brand_guidelines.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 1560000, uploadedAt: '2025-01-08T13:45:00Z' },
      
      // Additional graphics
      { id: 16, name: 'infographic_stats_2024.png', type: 'image/png', size: 3400000, uploadedAt: '2025-01-08T10:00:00Z' },
      { id: 17, name: 'event_promo_square.jpg', type: 'image/jpeg', size: 1800000, uploadedAt: '2025-01-07T15:30:00Z' },
      { id: 18, name: 'animated_logo.gif', type: 'image/gif', size: 2600000, uploadedAt: '2025-01-07T09:45:00Z' }
    ];
    setFiles(filesData);
    if (!savedFiles) {
      localStorage.setItem('socialScheduler_files', JSON.stringify(filesData));
    }
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