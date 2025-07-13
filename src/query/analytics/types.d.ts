export declare namespace Analytics {
  type LogEvent = {
    success: true;
  };

  type AnalyticsSummary = {
    totalViews: number;
    totalAddToBag: number;
    totalWhatsappClicks: number;
    overallConversionRate: number;
    viewsAndConversions: {
      date: string;
      views: number;
      conversions: number;
    }[];
    trafficSourceBreakdown: {
      referrer: string;
      views: number;
      conversionRate: number;
    }[];
  };

  type ProductPerformance = {
    id: number;
    name: string;
    slug: string;
    medias: { url: string }[];
    views: number;
    addToBag: number;
    whatsappClicks: number;
    conversionRate: number;
  };

  type TagPerformance = {
    id: number;
    name: string;
    views: number;
    addToBag: number;
    whatsappClicks: number;
    conversionRate: number;
  };
}
