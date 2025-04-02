
import { useState } from "react";
import { 
  getCoupons, 
  createCoupon, 
  updateCouponValue, 
  updateCouponUsed,
  deleteCoupon
} from "@/services/couponsService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Tag,
  Check
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/lib/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Coupon {
  id?: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses: number;
  used: number;
  start_date: string;
  end_date: string;
  active: boolean;
}

const CouponsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<Coupon>({
    code: "",
    discount_type: "percentage",
    discount_value: 10,
    max_uses: 100,
    used: 0,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    active: true
  });
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: getCoupons,
  });

  const createCouponMutation = useMutation({
    mutationFn: (couponData: Coupon) => createCoupon(couponData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success("Coupon created successfully");
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create coupon");
    }
  });

  const updateCouponMutation = useMutation({
    mutationFn: (couponData: Coupon) => updateCouponValue(couponData.id!, { 
      discount_type: couponData.discount_type,
      discount_value: couponData.discount_value,
      max_uses: couponData.max_uses,
      start_date: couponData.start_date,
      end_date: couponData.end_date,
      active: couponData.active
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success("Coupon updated successfully");
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update coupon");
    }
  });

  const updateCouponUsedMutation = useMutation({
    mutationFn: (couponId: string) => updateCouponUsed(couponId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success("Coupon usage updated");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update coupon usage");
    }
  });

  const deleteCouponMutation = useMutation({
    mutationFn: (couponId: string) => deleteCoupon(couponId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success("Coupon deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete coupon");
    }
  });

  const filteredCoupons = data?.coupons?.filter((coupon: Coupon) => 
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleOpenDialog = (coupon?: Coupon) => {
    if (coupon) {
      setCurrentCoupon({
        ...coupon,
        start_date: new Date(coupon.start_date).toISOString().split('T')[0],
        end_date: new Date(coupon.end_date).toISOString().split('T')[0]
      });
      setIsEditing(true);
    } else {
      setCurrentCoupon({
        code: "",
        discount_type: "percentage",
        discount_value: 10,
        max_uses: 100,
        used: 0,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        active: true
      });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number | boolean = value;

    if (type === 'number') {
      parsedValue = value === '' ? 0 : parseFloat(value);
    }

    setCurrentCoupon({
      ...currentCoupon,
      [name]: parsedValue,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setCurrentCoupon({
      ...currentCoupon,
      active: checked,
    });
  };

  const handleSelectChange = (value: 'percentage' | 'fixed') => {
    setCurrentCoupon({
      ...currentCoupon,
      discount_type: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && currentCoupon.id) {
      updateCouponMutation.mutate(currentCoupon);
    } else {
      createCouponMutation.mutate(currentCoupon);
    }
  };

  const handleIncrementUsage = (couponId: string) => {
    updateCouponUsedMutation.mutate(couponId);
  };

  const handleDeleteCoupon = (couponId: string) => {
    if (window.confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) {
      deleteCouponMutation.mutate(couponId);
    }
  };

  const isMutating = createCouponMutation.isPending || 
                     updateCouponMutation.isPending;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
          <p className="text-muted-foreground">
            Manage discount coupons for your store
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>All Coupons</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search coupons..."
                className="pl-8 md:w-[240px] lg:w-[320px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-60">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Used / Max</TableHead>
                  <TableHead>Valid Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      No coupons found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCoupons.map((coupon: Coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-medium">{coupon.code}</TableCell>
                      <TableCell>
                        {coupon.discount_type === 'percentage' 
                          ? `${coupon.discount_value}%` 
                          : `$${coupon.discount_value.toFixed(2)}`}
                      </TableCell>
                      <TableCell>{coupon.used} / {coupon.max_uses}</TableCell>
                      <TableCell>
                        {new Date(coupon.start_date).toLocaleDateString()} - {new Date(coupon.end_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {coupon.active ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleIncrementUsage(coupon.id!)}
                          title="Increment usage count"
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Increment Usage</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenDialog(coupon)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteCoupon(coupon.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Coupon" : "Create New Coupon"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update the coupon details below" 
                : "Fill in the details to create a new coupon"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <div className="flex gap-2 items-center">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="code"
                    name="code"
                    value={currentCoupon.code}
                    onChange={handleInputChange}
                    placeholder="SUMMER2023"
                    required
                    disabled={isEditing}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount_type">Discount Type</Label>
                  <Select 
                    value={currentCoupon.discount_type}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger id="discount_type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount_value">Discount Value</Label>
                  <Input
                    id="discount_value"
                    name="discount_value"
                    type="number"
                    step={currentCoupon.discount_type === 'percentage' ? "1" : "0.01"}
                    min="0"
                    max={currentCoupon.discount_type === 'percentage' ? "100" : undefined}
                    value={currentCoupon.discount_value}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max_uses">Maximum Uses</Label>
                  <Input
                    id="max_uses"
                    name="max_uses"
                    type="number"
                    min="1"
                    value={currentCoupon.max_uses}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {isEditing && (
                  <div className="space-y-2">
                    <Label htmlFor="used">Used Count</Label>
                    <Input
                      id="used"
                      name="used"
                      type="number"
                      min="0"
                      max={currentCoupon.max_uses}
                      value={currentCoupon.used}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={currentCoupon.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={currentCoupon.end_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={currentCoupon.active}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isMutating}>
                {isMutating ? "Processing..." : isEditing ? "Update Coupon" : "Create Coupon"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CouponsPage;
