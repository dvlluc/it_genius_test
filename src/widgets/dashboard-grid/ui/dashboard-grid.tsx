"use client";

import { useCallback, type ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useUiSettingsStore, type DashboardWidgetId } from "@/shared/stores/ui-settings";

function SortableWidget({
  id,
  children,
}: {
  id: DashboardWidgetId;
  children: ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative min-w-0 rounded-xl",
        isDragging && "z-50 opacity-80",
      )}
    >
      <button
        type="button"
        className="absolute top-2 right-2 z-10 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
        aria-label={`Drag to reorder widget ${id}`}
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon className="size-4" />
      </button>
      <div className="group">{children}</div>
    </div>
  );
}

type WidgetConfig = {
  id: DashboardWidgetId;
  content: ReactNode;
};

type DashboardGridProps = {
  widgets: WidgetConfig[];
};

export function DashboardGrid({ widgets }: DashboardGridProps) {
  const order = useUiSettingsStore((s) => s.dashboardWidgets);
  const setOrder = useUiSettingsStore((s) => s.setDashboardWidgets);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const orderedWidgets = order
    .map((id) => widgets.find((w) => w.id === id))
    .filter((w): w is WidgetConfig => w !== undefined);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = order.indexOf(active.id as DashboardWidgetId);
      const newIndex = order.indexOf(over.id as DashboardWidgetId);
      if (oldIndex === -1 || newIndex === -1) return;

      setOrder(arrayMove(order, oldIndex, newIndex));
    },
    [order, setOrder],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={order} strategy={rectSortingStrategy}>
        <div className="grid min-w-0 gap-4 xl:grid-cols-2">
          {orderedWidgets.map((widget) => (
            <SortableWidget key={widget.id} id={widget.id}>
              {widget.content}
            </SortableWidget>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
