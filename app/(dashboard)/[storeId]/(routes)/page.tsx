import Heading from "@/components/ui/Heading";
import {Separator} from "@/components/ui/Separator";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CreditCard, DollarSign, Package} from "lucide-react";
import {formatter} from "@/lib/utils";
import {getTotalRevenue} from "@/actions/GetTotalRevenue";
import {getSalesCount} from "@/actions/GetSalesCount";
import {getStockCount} from "@/actions/GetStockCount";
import Overview from "@/components/Overview";
import {getGraphRevenue} from "@/actions/GetGraphRevenue";

interface DashboardPageProps {
    params: {
        storeId: string
    }
}

const DashboardPage = async ({params}: DashboardPageProps) => {

    const totalRevenueData = getTotalRevenue(params.storeId)

    const salesCountData = getSalesCount(params.storeId);

    const stockCountData = getStockCount(params.storeId);

    const graphRevenueData = getGraphRevenue(params.storeId)

    const [totalRevenue, salesCount, stockCount, graphRevenue] = await Promise.all([totalRevenueData, salesCountData, stockCountData, graphRevenueData]);

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading title="Dashboard" description="Overview of your store" />
                <Separator />
                <div className="grid gap-4 grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="w-4 h-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatter.format(totalRevenue)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Sales
                            </CardTitle>
                            <CreditCard className="w-4 h-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                +{salesCount}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Products in stock
                            </CardTitle>
                            <Package className="w-4 h-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stockCount}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview data={graphRevenue}/>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;