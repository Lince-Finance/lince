import React, { useState } from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";

interface PortfolioChartProps {
  userName?: string;
}

export default function PortfolioChart({ userName = "user" }: PortfolioChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("1W");
  
  const currentDate = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentDateString = `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}`;
  
  const chartData = [
    { date: "Day 1", value: 450 },
    { date: "Day 2", value: 460 },
    { date: "Day 3", value: 440 },
    { date: "Day 4", value: 480 },
    { date: "Day 5", value: 490 },
    { date: "Day 6", value: 510 },
    { date: "Day 7", value: 510 },
  ];

  const periods = ["1W", "1M", "1Y", "All"];
  
  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));
  const range = maxValue - minValue;
  
  const chartWidth = 300;
  const chartHeight = 120;
  const padding = 20;
  
  const pathData = chartData
    .map((point, index) => {
      const x = padding + (index * (chartWidth - 2 * padding)) / (chartData.length - 1);
      const y = chartHeight - padding - ((point.value - minValue) / range) * (chartHeight - 2 * padding);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <Box
      bg="white"
      borderRadius="lg"
      p={6}
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.200"
    >
      <Box mb={4}>
        <Text fontSize="lg" fontWeight="600" color="gray.800">
          Welcome!
        </Text>
      </Box>

      <Box mb={4} position="relative">
        <svg
          width={chartWidth}
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          style={{ overflow: 'visible' }}
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          <path
            d={pathData}
            fill="none"
            stroke="#8B7355"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {chartData.map((point, index) => {
            const x = padding + (index * (chartWidth - 2 * padding)) / (chartData.length - 1);
            const y = chartHeight - padding - ((point.value - minValue) / range) * (chartHeight - 2 * padding);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#8B7355"
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
          
          <circle
            cx={padding + ((chartData.length - 1) * (chartWidth - 2 * padding)) / (chartData.length - 1)}
            cy={chartHeight - padding - ((chartData[chartData.length - 1].value - minValue) / range) * (chartHeight - 2 * padding)}
            r="4"
            fill="#8B7355"
            stroke="white"
            strokeWidth="3"
          />
        </svg>
        
        <Text
          position="absolute"
          right="0"
          bottom="-20px"
          fontSize="xs"
          color="gray.600"
          bg="white"
          px={2}
          py={1}
          borderRadius="md"
          border="1px solid"
          borderColor="gray.300"
        >
          {currentDateString}
        </Text>
      </Box>

      <Flex mb={4}>
        {periods.map((period) => (
          <Button
            key={period}
            size="sm"
            variant={selectedPeriod === period ? "solid" : "ghost"}
            bg={selectedPeriod === period ? "gray.800" : "transparent"}
            color={selectedPeriod === period ? "white" : "gray.600"}
            _hover={{
              bg: selectedPeriod === period ? "gray.700" : "gray.100",
            }}
            borderRadius="md"
            onClick={() => setSelectedPeriod(period)}
            minW="40px"
          >
            {period}
          </Button>
        ))}
      </Flex>

      <Flex justify="space-between" align="flex-start">
        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>
            Balance
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            $510
          </Text>
        </Box>
        
        <Box textAlign="center">
          <Text fontSize="xs" color="gray.500" mb={1}>
            ROI
          </Text>
          <Text fontSize="lg" fontWeight="semibold" color="green.500">
            1,23%
          </Text>
        </Box>
        
        <Box textAlign="right">
          <Text fontSize="xs" color="gray.500" mb={1}>
            Average APY
          </Text>
          <Text fontSize="lg" fontWeight="semibold" color="green.500">
            12,54%
          </Text>
        </Box>
      </Flex>
    </Box>
  );
} 