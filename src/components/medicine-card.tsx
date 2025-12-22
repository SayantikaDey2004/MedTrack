import React from 'react';
import { Edit2, Trash2, Pill, Calendar, Package, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  stock: number;
  notes?: string;
  addedAt: string;
}

interface MedicineCardProps {
  medicine: Medicine;
  onView: (medicine: Medicine) => void;
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: string) => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  onView,
  onEdit,
  onDelete,
}) => {
  const getStockVariant = (stock: number) => {
    if (stock <= 10) return 'destructive';
    if (stock <= 20) return 'secondary';
    return 'default';
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        {/* Medicine Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <div className="p-2 bg-blue-100 rounded-lg shrink-0">
              <Pill className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-0.5 wrap-break-word leading-tight">
                {medicine.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-1.5">{medicine.dosage}</p>
              <Badge 
                variant={getStockVariant(medicine.stock)}
                className="text-xs font-medium px-2 py-0.5"
              >
                {medicine.stock} pills
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onView(medicine)} className="text-sm">
                <Package className="w-3.5 h-3.5 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(medicine)} className="text-sm">
                <Edit2 className="w-3.5 h-3.5 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(medicine.id)}
                className="text-sm text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Notes */}
        {medicine.notes && (
          <div className="bg-muted/50 rounded-md p-2 mb-2">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {medicine.notes}
            </p>
          </div>
        )}

        {/* Footer with Date */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1.5 border-t">
          <Calendar className="w-3 h-3" />
          <span>{medicine.addedAt.split(' ')[0]}</span>
        </div>
      </CardContent>
    </Card>
  );
};
