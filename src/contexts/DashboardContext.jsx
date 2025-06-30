import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// Default widget configurations
const defaultWidgets = [
  {
    id: 'stats-overview',
    title: 'Performance Overview',
    type: 'stats',
    position: { x: 0, y: 0 },
    size: { width: 2, height: 1 },
    visible: true,
    moveable: true
  },
  {
    id: 'recent-posts',
    title: 'Recent Posts',
    type: 'posts',
    position: { x: 2, y: 0 },
    size: { width: 2, height: 2 },
    visible: true,
    moveable: true
  },
  {
    id: 'quick-actions',
    title: 'Quick Actions',
    type: 'actions',
    position: { x: 0, y: 1 },
    size: { width: 1, height: 1 },
    visible: true,
    moveable: true
  },
  {
    id: 'analytics-preview',
    title: 'Analytics Preview',
    type: 'analytics',
    position: { x: 1, y: 1 },
    size: { width: 1, height: 1 },
    visible: true,
    moveable: true
  },
  {
    id: 'calendar-preview',
    title: 'Upcoming Posts',
    type: 'calendar',
    position: { x: 0, y: 2 },
    size: { width: 2, height: 1 },
    visible: true,
    moveable: true
  },
  {
    id: 'platform-status',
    title: 'Platform Status',
    type: 'platforms',
    position: { x: 2, y: 2 },
    size: { width: 2, height: 1 },
    visible: true,
    moveable: true
  }
];

export const DashboardProvider = ({ children }) => {
  const [widgets, setWidgets] = useState(defaultWidgets);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState(null);
  const [customizationMode, setCustomizationMode] = useState(false);
  const [dashboardLayout, setDashboardLayout] = useState('grid'); // 'grid', 'list', 'compact'

  useEffect(() => {
    const savedWidgets = localStorage.getItem('socialSync_dashboard_widgets');
    const savedLayout = localStorage.getItem('socialSync_dashboard_layout');
    
    if (savedWidgets) {
      try {
        setWidgets(JSON.parse(savedWidgets));
      } catch (error) {
        console.warn('Failed to parse saved widgets, using defaults');
      }
    }
    
    if (savedLayout) {
      setDashboardLayout(savedLayout);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('socialSync_dashboard_widgets', JSON.stringify(widgets));
  }, [widgets]);

  useEffect(() => {
    localStorage.setItem('socialSync_dashboard_layout', dashboardLayout);
  }, [dashboardLayout]);

  const updateWidget = (widgetId, updates) => {
    setWidgets(prevWidgets =>
      prevWidgets.map(widget =>
        widget.id === widgetId ? { ...widget, ...updates } : widget
      )
    );
  };

  const moveWidget = (widgetId, newPosition) => {
    updateWidget(widgetId, { position: newPosition });
  };

  const toggleWidgetVisibility = (widgetId) => {
    setWidgets(prevWidgets =>
      prevWidgets.map(widget =>
        widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
      )
    );
  };

  const resetDashboard = () => {
    setWidgets(defaultWidgets);
    setDashboardLayout('grid');
  };

  const startDrag = (widget) => {
    setIsDragging(true);
    setDraggedWidget(widget);
  };

  const endDrag = () => {
    setIsDragging(false);
    setDraggedWidget(null);
  };

  const toggleCustomizationMode = () => {
    setCustomizationMode(prev => !prev);
  };

  const addWidget = (widgetConfig) => {
    const newWidget = {
      ...widgetConfig,
      id: `widget-${Date.now()}`,
      position: { x: 0, y: 0 },
      visible: true,
      moveable: true
    };
    setWidgets(prevWidgets => [...prevWidgets, newWidget]);
  };

  const removeWidget = (widgetId) => {
    setWidgets(prevWidgets => prevWidgets.filter(widget => widget.id !== widgetId));
  };

  const duplicateWidget = (widgetId) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      const duplicated = {
        ...widget,
        id: `${widget.id}-copy-${Date.now()}`,
        title: `${widget.title} (Copy)`,
        position: { x: widget.position.x + 1, y: widget.position.y }
      };
      setWidgets(prevWidgets => [...prevWidgets, duplicated]);
    }
  };

  const getVisibleWidgets = () => {
    return widgets.filter(widget => widget.visible);
  };

  const value = {
    widgets,
    setWidgets,
    isDragging,
    draggedWidget,
    customizationMode,
    dashboardLayout,
    updateWidget,
    moveWidget,
    toggleWidgetVisibility,
    resetDashboard,
    startDrag,
    endDrag,
    toggleCustomizationMode,
    setCustomizationMode,
    setDashboardLayout,
    addWidget,
    removeWidget,
    duplicateWidget,
    getVisibleWidgets
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext; 