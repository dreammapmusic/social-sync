import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Eye, EyeOff, X, Copy, Settings, Maximize2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDashboard } from '@/contexts/DashboardContext';
import { useTheme } from '@/contexts/ThemeContext';

export const DraggableWidget = ({ 
  widget, 
  children, 
  className = '',
  onEdit,
  onExpand 
}) => {
  const { 
    customizationMode, 
    isDragging, 
    startDrag, 
    endDrag, 
    moveWidget, 
    toggleWidgetVisibility,
    removeWidget,
    duplicateWidget 
  } = useDashboard();
  
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isDragHovered, setIsDragHovered] = useState(false);
  const dragRef = useRef(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = (e) => {
    if (!customizationMode || !widget.moveable) return;
    
    const rect = dragRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    startDrag(widget);
    setIsDragHovered(true);
  };

  const handleDragEnd = (e) => {
    if (!isDragging) return;
    
    endDrag();
    setIsDragHovered(false);
    
    // Calculate new position based on drop location
    const rect = e.target.getBoundingClientRect();
    const containerRect = document.querySelector('.dashboard-grid').getBoundingClientRect();
    
    const newX = Math.floor((e.clientX - containerRect.left) / 300);
    const newY = Math.floor((e.clientY - containerRect.top) / 200);
    
    moveWidget(widget.id, { x: Math.max(0, newX), y: Math.max(0, newY) });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const widgetVariants = {
    idle: { 
      scale: 1, 
      zIndex: 1,
      boxShadow: isDark 
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    hover: { 
      scale: 1.02, 
      zIndex: 2,
      boxShadow: isDark
        ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
        : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    dragging: { 
      scale: 1.05, 
      zIndex: 1000,
      rotate: 2,
      boxShadow: isDark
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    customization: {
      scale: 0.95,
      filter: 'brightness(0.8)',
      transition: { duration: 0.2 }
    }
  };

  const getWidgetState = () => {
    if (isDragHovered) return 'dragging';
    if (customizationMode) return 'customization';
    if (isHovered) return 'hover';
    return 'idle';
  };

  return (
    <motion.div
      ref={dragRef}
      className={`relative ${className}`}
      variants={widgetVariants}
      animate={getWidgetState()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      draggable={customizationMode && widget.moveable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        gridColumn: `span ${widget.size.width}`,
        gridRow: `span ${widget.size.height}`,
        cursor: customizationMode && widget.moveable ? 'grab' : 'default'
      }}
      layout
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <Card className={`h-full glass-effect border-white/10 ${
        customizationMode ? 'ring-2 ring-blue-500/50' : ''
      } ${!widget.visible ? 'opacity-50' : ''}`}>
        {/* Widget Header with Controls */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            {customizationMode && widget.moveable && (
              <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
            )}
            <CardTitle className="text-sm font-medium text-white">
              {widget.title}
            </CardTitle>
          </div>
          
          <AnimatePresence>
            {(customizationMode || isHovered) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1"
              >
                {/* Widget Type Badge */}
                {customizationMode && (
                  <Badge variant="secondary" className="text-xs bg-white/10">
                    {widget.type}
                  </Badge>
                )}
                
                {/* Widget Controls */}
                {customizationMode && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-white"
                      onClick={() => toggleWidgetVisibility(widget.id)}
                    >
                      {widget.visible ? 
                        <Eye className="h-3 w-3" /> : 
                        <EyeOff className="h-3 w-3" />
                      }
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-white"
                      onClick={() => duplicateWidget(widget.id)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-white"
                        onClick={() => onEdit(widget)}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-red-400"
                      onClick={() => removeWidget(widget.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                )}
                
                {/* Expand Button */}
                {onExpand && !customizationMode && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-white"
                    onClick={() => onExpand(widget)}
                  >
                    <Maximize2 className="h-3 w-3" />
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardHeader>
        
        {/* Widget Content */}
        <CardContent className="p-4 pt-0">
          {children}
        </CardContent>
        
        {/* Drag Overlay */}
        {customizationMode && widget.moveable && (
          <div className="absolute inset-0 bg-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg pointer-events-none">
            <div className="flex items-center justify-center h-full">
              <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                Drag to move
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export const WidgetDropZone = ({ onDrop, className = '' }) => {
  const [isOver, setIsOver] = useState(false);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };
  
  const handleDragLeave = () => {
    setIsOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    onDrop && onDrop(e);
  };
  
  return (
    <div
      className={`
        ${className}
        ${isOver ? 'bg-blue-500/20 border-blue-500' : 'bg-gray-500/10 border-gray-500/30'}
        border-2 border-dashed rounded-lg transition-all duration-200
        flex items-center justify-center min-h-[100px]
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center">
        <div className="text-gray-400 mb-1">Drop widget here</div>
        <div className="text-xs text-gray-500">Drag widgets to rearrange</div>
      </div>
    </div>
  );
};

export default DraggableWidget; 