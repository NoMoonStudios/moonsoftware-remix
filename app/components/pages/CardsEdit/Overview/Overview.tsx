import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
} from "recharts";
import { UserInfo } from "~/types/init";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { format } from "date-fns";
import { FaDiscord } from "react-icons/fa6";
import { Button } from "~/components/ui/button";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const chartData = months.map((month, index) => ({
  month,
  desktop: Math.floor(Math.random() * index * 50 + 100),
  mobile: Math.floor(Math.random() * index * 50 + 50),
}));

const chartData2 = months.map((month, index) => ({
  month,
  desktop: Math.floor(Math.random() * index * 50 + 100),
  mobile: Math.floor(Math.random() * index * 50 + 50),
}));

const chartData3 = months.map((month, index) => ({
  month,
  commisions: Math.floor(Math.random() * index * 3) + 1,
}));

// Chart configuration for styling
const chartConfig: ChartConfig = {
  desktop: {
    label: "Desktop",
    color: "#3d57ff",
  },
  mobile: {
    label: "Mobile",
    color: "#00aaff",
  },
};

const Overview = ({ userInfo }: { userInfo: UserInfo }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Account Overview Section */}
        <h1 className="text-xl font-semibold">Account Overview</h1>
        <div className="flex flex-row gap-4">
          {/* Portfolio Visits Chart */}
          <Card className="flex-1 bg-gray-950/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Portfolio Visits</CardTitle>
              <CardDescription>Visits in the past 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="max-h-[300px]">
                <AreaChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <defs>
                    <linearGradient
                      id="fillDesktop"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={chartConfig.desktop.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartConfig.desktop.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={chartConfig.mobile.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartConfig.mobile.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="url(#fillMobile)"
                    fillOpacity={0.4}
                    stroke={chartConfig.mobile.color}
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="url(#fillDesktop)"
                    fillOpacity={0.4}
                    stroke={chartConfig.desktop.color}
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="flex-1 bg-gray-950/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Profile Visits</CardTitle>
              <CardDescription>Visits in the past 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="max-h-[300px]">
                <AreaChart data={chartData2}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <defs>
                    <linearGradient
                      id="fillDesktop"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={chartConfig.desktop.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartConfig.desktop.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={chartConfig.mobile.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartConfig.mobile.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="url(#fillMobile)"
                    fillOpacity={0.4}
                    stroke={chartConfig.mobile.color}
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="url(#fillDesktop)"
                    fillOpacity={0.4}
                    stroke={chartConfig.desktop.color}
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="flex-1 bg-gray-950/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Commisions</CardTitle>
              <CardDescription>Commisions in the past 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="max-h-[300px]">
                <AreaChart data={chartData3}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <defs>
                    <linearGradient
                      id="fillDesktop"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={chartConfig.desktop.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartConfig.desktop.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={chartConfig.mobile.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartConfig.mobile.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="commisions"
                    type="natural"
                    fill="url(#fillMobile)"
                    fillOpacity={0.4}
                    stroke={chartConfig.mobile.color}
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

      {/* Account Statistics Section */}
        <h1 className="text-xl font-semibold">Account Statistics</h1>
        <div className="flex gap-4 h-[300px]">
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
            <Card className="flex-1 bg-gray-950/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Username</CardTitle>
                <CardDescription>Change is Available</CardDescription>
              </CardHeader>
              <CardContent className="text-2xl">
                {userInfo.username}
              </CardContent>
            </Card>
            <Card className="flex-1 bg-gray-950/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>UID</CardTitle>
                <CardDescription>
                  {"Joined at " +
                    format(new Date(userInfo.createdAt), "dd/MM/yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-2xl">{userInfo.userid}</CardContent>
            </Card>
            <Card className="flex-1 bg-gray-950/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Total Visits</CardTitle>
                <CardDescription>in the past 30 days</CardDescription>
              </CardHeader>
              <CardContent className="text-2xl">195</CardContent>
            </Card>
            <Card className="flex-1 bg-gray-950/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Most Clicked Social</CardTitle>
                <CardDescription>in the past 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-full p-2 border-1 rounded-lg items-center gap-4 px-4">
                  <FaDiscord />
                  <span>Discord</span>
                </div>

              </CardContent>
            </Card>
          </div>
          <Card className="flex flex-col flex-1 bg-gray-950/60 backdrop-blur-sm">
            <CardHeader className="pb-0">
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-2 grid-cols-2 grid-rows-2">
                <Button variant="outline">Change Display Name</Button>
                <Button variant="outline">Change Profile Avatar</Button>
                <Button variant="outline">Configure Portfolio</Button>
                <Button variant="outline">Settings</Button>
              </div>
            </CardContent>
            <CardHeader className="pt-0">
              <CardTitle className="">Connections</CardTitle>
              <CardDescription>Link your Discord account to MoonSoftware</CardDescription>
              <Button variant="outline"><FaDiscord /> Connect Discord</Button>
            </CardHeader>
          </Card>
        </div>
    </div>
  );
};

export default Overview;
