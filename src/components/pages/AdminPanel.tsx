import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "../layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { 
  Shield, 
  Users, 
  DollarSign, 
  TrendingUp,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings,
  Download,
  Eye,
  User,
  CreditCard,
  Activity
} from "lucide-react";
import type { Page, User as UserType, Beneficiary, Transaction } from "../AppRouter";

interface AdminPanelProps {
  navigate: (page: Page) => void;
  user: UserType;
  beneficiaries: Beneficiary[];
  transactions: Transaction[];
  onLogout: () => void;
}

export function AdminPanel({ navigate, user, transactions, onLogout }: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock additional admin data
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', joinDate: '2024-01-15', totalSent: 15000 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'active', joinDate: '2024-01-10', totalSent: 8500 },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', status: 'suspended', joinDate: '2024-01-05', totalSent: 2300 },
  ];

  const systemMetrics = {
    totalUsers: 1247,
    totalTransactions: 3891,
    totalVolume: 2847392,
    successRate: 98.7,
    averageTransactionSize: 732,
    pendingReviews: 23,
    activeUsers: 892,
    newUsersThisMonth: 127
  };

  const recentActivity = [
    { id: '1', type: 'transaction', description: 'Large transaction flagged for review', amount: 50000, user: 'John Doe', time: '2 mins ago' },
    { id: '2', type: 'user', description: 'New user registration', user: 'Alice Cooper', time: '5 mins ago' },
    { id: '3', type: 'system', description: 'Exchange rate updated', time: '10 mins ago' },
    { id: '4', type: 'transaction', description: 'Failed transaction due to insufficient funds', amount: 1200, user: 'Bob Wilson', time: '15 mins ago' },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Flag high-risk transactions (>$10,000 equivalent)
  const getTransactionRisk = (transaction: Transaction) => {
    const usdEquivalent = transaction.currency === 'INR' 
      ? transaction.amount / transaction.exchangeRate 
      : transaction.amount;
    return usdEquivalent > 10000 ? 'high' : 'normal';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'user':
        return <User className="w-4 h-4 text-green-600" />;
      case 'system':
        return <Settings className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  if (user.role !== 'admin') {
    return (
      <AppLayout user={user} currentPage="admin" navigate={navigate} onLogout={onLogout}>
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
          <Button onClick={() => navigate('dashboard')} className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} currentPage="admin" navigate={navigate} onLogout={onLogout}>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl">Admin Panel</h1>
              <p className="text-muted-foreground mt-2">
                System overview and management tools
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-semibold">{systemMetrics.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+{systemMetrics.newUsersThisMonth} this month</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="text-2xl font-semibold">${(systemMetrics.totalVolume / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-green-600">+12.5% vs last month</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-semibold">{systemMetrics.successRate}%</p>
                  <p className="text-sm text-green-600">+0.3% improvement</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                  <p className="text-2xl font-semibold">{systemMetrics.pendingReviews}</p>
                  <p className="text-sm text-yellow-600">Requires attention</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Transaction Management</CardTitle>
                      <CardDescription>
                        Monitor and manage all payment transactions
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search transactions..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reference</TableHead>
                          <TableHead>Recipient</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Risk Level</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.slice(0, 10).map((transaction) => {
                          const riskLevel = getTransactionRisk(transaction);
                          const usdEquivalent = transaction.currency === 'INR' 
                            ? transaction.amount / transaction.exchangeRate 
                            : transaction.amount;
                          
                          return (
                            <TableRow key={transaction.id}>
                              <TableCell>
                                <code className="text-sm bg-muted px-2 py-1 rounded">
                                  {transaction.reference}
                                </code>
                              </TableCell>
                              <TableCell>{transaction.beneficiaryName}</TableCell>
                              <TableCell>
                                <div>
                                  <p>${transaction.amount.toLocaleString()} {transaction.currency}</p>
                                  {transaction.currency === 'INR' && (
                                    <p className="text-sm text-muted-foreground">
                                      ≈ ${usdEquivalent.toFixed(2)} USD
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={riskLevel === 'high' ? 'destructive' : 'outline'}>
                                  {riskLevel === 'high' ? 'High Risk' : 'Normal'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  transaction.status === 'completed' ? 'default' :
                                  transaction.status === 'processing' ? 'secondary' :
                                  transaction.status === 'failed' ? 'destructive' : 'outline'
                                }>
                                  {transaction.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(transaction.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage registered users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Join Date</TableHead>
                          <TableHead>Total Sent</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(user.joinDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>${user.totalSent.toLocaleString()}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    System events and user activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-lg border">
                        <div className="p-2 bg-muted rounded-lg">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.description}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            {activity.user && <span>User: {activity.user}</span>}
                            {activity.amount && <span>Amount: ${activity.amount.toLocaleString()}</span>}
                            <span>•</span>
                            <span>{activity.time}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart visualization would go here
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Geographic Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Map visualization would go here
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AppLayout>
  );
}