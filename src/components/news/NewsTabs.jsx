import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NewsTabs({ activeTab, onTabChange }) {
  return (
    <Tabs
      defaultValue="indian"
      value={activeTab}
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 bg-primary/50 dark:bg-gray-950/80 text-gray-700 dark:text-gray-300 shadow-lg border border-gray-200/80 dark:border-gray-800/80">
        <TabsTrigger
          value="indian"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-200 data-[state=active]:shadow-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-900 data-[state=active]:font-medium"
        >
          Indian News
        </TabsTrigger>
        <TabsTrigger
          value="world"
          className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-200 data-[state=active]:shadow-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-900 data-[state=active]:font-medium"
        >
          World News
          <span className="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 rounded-full border border-yellow-200 dark:border-yellow-800/50 shadow-sm">
            Premium
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
