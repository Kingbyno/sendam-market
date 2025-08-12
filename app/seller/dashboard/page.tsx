"use client";

import { useEffect, useState } from "react";
import { getAuth } from "@/lib/auth/get-auth";
import { getEscrowTransactions } from "@/lib/actions/escrow-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { Package, DollarSign, Clock, CheckCircle, AlertTriangle, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SellerTransaction {
  id: string;
  paymentReference: string; // Prisma field name
  status: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date | null;
  confirmedAt?: Date | null;
  releasedAt?: Date | null;
  item: {
    title: string;
    images?: string[];
  };
  buyer: {
    id: string;
    email: string;
    name?: string | null;
  };
  // Note: delivery_option doesn't exist in Purchase model, 
  // but we'll handle it gracefully in the UI
}

export default function SellerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<SellerTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    delivered: 0,
    completed: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
  });
  const router = useRouter();

  useEffect(() => {
    loadDashboardData();
  }, []);
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user
      const authResult = await getAuth();
      if (!authResult.user) {
        router.push("/auth/login");
        return;
      }
      setUser(authResult.user);

      // Get seller transactions
      const result = await getEscrowTransactions(authResult.user.id, false);
      if (result.success && result.transactions) {
        // Filter for seller transactions only and type cast safely
        const sellerTransactions = result.transactions
          .filter((t: any) => t.sellerId === authResult.user.id)
          .map((t: any) => ({
            id: t.id,
            paymentReference: t.paymentReference,
            status: t.status,
            amount: t.amount,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
            deliveredAt: t.deliveredAt,
            confirmedAt: t.confirmedAt,
            releasedAt: t.releasedAt,
            item: {
              title: t.item?.title || "Unknown Item",
              images: t.item?.images || []
            },
            buyer: {
              id: t.buyer?.id || "",
              email: t.buyer?.email || "Unknown Buyer",
              name: t.buyer?.name || null
            }
          })) as SellerTransaction[];
        
        setTransactions(sellerTransactions);

        // Calculate stats with proper status handling
        const stats = {
          total: sellerTransactions.length,
          pending: sellerTransactions.filter(t => t.status.toUpperCase() === "PENDING").length,
          paid: sellerTransactions.filter(t => t.status.toUpperCase() === "PAID").length,
          delivered: sellerTransactions.filter(t => t.status.toUpperCase() === "DELIVERED").length,
          completed: sellerTransactions.filter(t => 
            ["CONFIRMED", "RELEASED", "COMPLETED"].includes(t.status.toUpperCase())
          ).length,
          totalEarnings: sellerTransactions
            .filter(t => ["CONFIRMED", "RELEASED", "COMPLETED"].includes(t.status.toUpperCase()))
            .reduce((sum, t) => sum + t.amount, 0),
          pendingEarnings: sellerTransactions
            .filter(t => ["PAID", "DELIVERED"].includes(t.status.toUpperCase()))
            .reduce((sum, t) => sum + t.amount, 0),
        };
        
        setStats(stats);
      } else {
        setError(result.error || "Failed to load transactions");
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("An unexpected error occurred while loading your dashboard");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-purple-100 text-purple-800";
      case "confirmed":
      case "released":
      case "completed":
        return "bg-green-100 text-green-800";
      case "disputed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "paid":
        return <DollarSign className="h-3 w-3" />;
      case "delivered":
        return <Package className="h-3 w-3" />;
      case "confirmed":
      case "released":
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      case "disputed":
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadDashboardData}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your sales and track your earnings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold">{stats.paid + stats.delivered}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-xl font-bold">{formatCurrency(stats.totalEarnings)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Earnings</p>
                  <p className="text-xl font-bold">{formatCurrency(stats.pendingEarnings)}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No transactions yet</p>
                    <Button asChild className="mt-4">
                      <Link href="/sell">List Your First Item</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">                            <div className="relative h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                              <Image
                                src={transaction.item.images?.[0] || "/placeholder.jpg"}
                                alt={transaction.item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">{transaction.item.title}</h3>
                              <p className="text-sm text-gray-600">
                                Buyer: {transaction.buyer.name || transaction.buyer.email}
                              </p>                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={`${getStatusColor(transaction.status)} flex items-center gap-1`}>
                                  {getStatusIcon(transaction.status)}
                                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {transaction.createdAt ? 
                                    new Date(transaction.createdAt).toLocaleDateString() : 
                                    "Date not available"
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
                            <p className="text-sm text-gray-500">
                              Total amount: {formatCurrency(transaction.amount)}
                            </p>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="mt-2"
                            >
                              <Link href={`/purchase/details/${transaction.paymentReference}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationCenter userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
