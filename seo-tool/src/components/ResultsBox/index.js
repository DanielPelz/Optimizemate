import React from "react";
import "./ResultsBox.css";

const ResultsBox = ({ data }) => {
  const pageSpeedPercentage = Math.round((data.pageSpeed / 100) * 100);
  const scorePercentage = Math.round((data.score / 100) * 100);

  const getProgressColor = (percentage) => {
    if (percentage < 50) {
      return "from-red-500 to-red-700";
    } else if (percentage < 81) {
      return "from-orange-500 to-orange-700";
    } else {
      return "from-green-500 to-green-700";
    }
  };

  const arrowStyle = {
    left: `${pageSpeedPercentage}%`,
    transform: `translate(-50%, -50%)`,
  };

  const arrowStyle2 = {
    left: `${scorePercentage}%`,
    transform: `translate(-50%, -50%)`,
  };

  return (
    <div className="results-container bg-gray-100">
      <div className=" rounded-lg p-6 container mx-auto">
        <h2 className="text-2xl font-bold mb-4">{data.title}</h2>
        <p className="text-lg mb-4">{data.description}</p>
        <p className="text-lg mb-4">Keywords: {data.keywords.join(", ")}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-lg mb-2">Fehler</p>
            <p className="text-3xl font-bold">{data.errorCount}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-lg mb-2">Warnungen</p>
            <p className="text-3xl font-bold">{data.warningCount}</p>
          </div>
        </div>
        <div className="mt-6 relative">
          <p className="text-lg mb-2">Page-Speed:</p>
          <div className="h-4 rounded-full overflow-hidden relative bg-gray-300">
            <div
              className={`absolute top-0 h-full rounded-full bg-gradient-to-r ${getProgressColor(
                pageSpeedPercentage
              )}`}
              style={{ width: `${pageSpeedPercentage}%` }}
            ></div>
            <div
              className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full border-4 border-gray-300`}
              style={arrowStyle}
            ></div>
          </div>
          <p className="text-lg mt-2">{pageSpeedPercentage}%</p>
        </div>
        <div className="mt-6 relative">
          <p className="text-lg mb-2">Score:</p>
          <div className="h-4 rounded-full overflow-hidden relative bg-gray-300">
            <div
              className={`absolute top-0 h-full rounded-full bg-gradient-to-r ${getProgressColor(
                scorePercentage
              )}`}
              style={{ width: `${scorePercentage}%` }}
            ></div>
            <div
              className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full border-4 border-gray-300`}
              style={arrowStyle2}
            ></div>
          </div>
          <p className="text-lg mt-2">{scorePercentage}%</p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Pagespeed Insights Data:</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Ungenutzte CSS:", value: data.unusedCss },
              {
                label: "Render-blocking Resources:",
                value: data.renderBlockingResources,
              },
              { label: "Unminified CSS:", value: data.unminifiedCss },
              {
                label: "Unminified JavaScript:",
                value: data.unminifiedJavascript,
              },
              { label: "Ungenutzte JavaScript:", value: data.unusedJavascript },
              {
                label: "First Contentful Paint:",
                value: data.firstContentfulPaint,
              },
              { label: "Speed Index:", value: data.speedIndex },
              {
                label: "Largest Contentful Paint:",
                value: data.largestContentfulPaint,
              },
              { label: "Interactive:", value: data.interactive },
              { label: "Total Blocking Time:", value: data.totalBlockingTime },
              {
                label: "Cumulative Layout Shift:",
                value: data.cumulativeLayoutShift,
              },
              { label: "Max Potential FID:", value: data.maxPotentialFID },
              { label: "Time to Interactive:", value: data.timeToInteractive },
              { label: "First CPU Idle:", value: data.firstCPUIdle },
              {
                label: "Estimated Input Latency:",
                value: data.estimatedInputLatency,
              },
              { label: "Total Byte Weight:", value: data.totalByteWeight },
              {
                label: "Uses Responsive Images:",
                value: data.usesResponsiveImages,
              },
              { label: "Uses WebP Images:", value: data.usesWebPImages },
              { label: "Uses Rel Preload:", value: data.usesRelPreload },
              { label: "Uses Rel Preconnect:", value: data.usesRelPreconnect },
              { label: "Time to First Byte:", value: data.timeToFirstByte },
              { label: "Redirects:", value: data.redirects },
              { label: "Main Thread Tasks:", value: data.mainThreadTasks },
              { label: "Bootup Time:", value: data.bootupTime },
              {
                label: "Uses Optimized Images:",
                value: data.usesOptimizedImages,
              },
              { label: "DOM Size:", value: data.domSize },
              {
                label: "Critical Request Chains:",
                value: data.criticalRequestChains,
              },
              { label: "Resource Summary:", value: data.resourceSummary },
              { label: "Number of Requests:", value: data.numRequests },
              { label: "Number of Scripts:", value: data.numScripts },
            ].map((item, index) => (
              <div className="bg-white rounded-lg p-4" key={index}>
                <p className="text-lg mb-2">{item.label}</p>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsBox;
